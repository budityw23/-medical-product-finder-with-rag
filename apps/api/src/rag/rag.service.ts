import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import OpenAI from 'openai';
import { RagResponseDto, SourceDto } from './dto';

/**
 * RAG Service - Handles AI-powered Q&A with vector similarity search
 *
 * This service:
 * 1. Generates embeddings for user queries
 * 2. Performs vector similarity search in pgvector
 * 3. Retrieves relevant document chunks
 * 4. Uses OpenAI chat completions to generate answers with citations
 */
@Injectable()
export class RagService {
  private readonly logger = new Logger(RagService.name);
  private readonly openai: OpenAI;

  // Configuration constants
  private readonly EMBEDDING_MODEL = 'text-embedding-3-small';
  private readonly EMBEDDING_DIMENSION = 1536;
  private readonly CHAT_MODEL = 'gpt-3.5-turbo';
  private readonly TOP_K = 5; // Number of chunks to retrieve
  private readonly SIMILARITY_THRESHOLD = 0.3; // Minimum similarity score (lowered for testing)

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    // Initialize OpenAI client (lazy initialization - will be created when needed)
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (apiKey) {
      this.openai = new OpenAI({ apiKey });
    } else {
      this.logger.warn('OPENAI_API_KEY is not configured. RAG features will not be available.');
    }
  }

  /**
   * Process a RAG query and return an AI-generated answer with citations
   *
   * @param userQuery - The user's question
   * @param filters - Optional filters (e.g., category)
   * @returns RAG response with answer and source citations
   */
  async query(
    userQuery: string,
    filters?: { category?: string },
  ): Promise<RagResponseDto> {
    this.logger.log(`Processing RAG query: "${userQuery}"`);

    // Check if OpenAI is configured
    if (!this.openai) {
      throw new Error('RAG features are not available. OPENAI_API_KEY is not configured.');
    }

    try {
      // Step 1: Generate embedding for the user's query
      const queryEmbedding = await this.generateQueryEmbedding(userQuery);

      // Step 2: Perform vector similarity search
      const retrievedChunks = await this.vectorSearch(
        queryEmbedding,
        filters?.category,
      );

      // Step 3: Check if we have relevant results
      if (retrievedChunks.length === 0) {
        return {
          answer:
            "I don't have enough information to answer that question based on the available product data.",
          sources: [],
          metadata: {
            chunksRetrieved: 0,
            embeddingModel: this.EMBEDDING_MODEL,
            completionModel: this.CHAT_MODEL,
          },
        };
      }

      // Step 4: Build context from retrieved chunks
      const context = this.buildContext(retrievedChunks);

      // Step 5: Generate answer using OpenAI chat completion
      const answer = await this.generateAnswer(userQuery, context);

      // Step 6: Format sources for response
      const sources = this.formatSources(retrievedChunks);

      return {
        answer,
        sources,
        metadata: {
          chunksRetrieved: retrievedChunks.length,
          embeddingModel: this.EMBEDDING_MODEL,
          completionModel: this.CHAT_MODEL,
        },
      };
    } catch (error) {
      this.logger.error('Error processing RAG query:', error);
      throw error;
    }
  }

  /**
   * Generate embedding for user query using OpenAI
   *
   * @param query - The user's query text
   * @returns Embedding vector as number array
   */
  private async generateQueryEmbedding(query: string): Promise<number[]> {
    this.logger.debug('Generating query embedding');

    const response = await this.openai.embeddings.create({
      model: this.EMBEDDING_MODEL,
      input: query,
    });

    const embedding = response.data[0].embedding;

    // Verify dimension
    if (embedding.length !== this.EMBEDDING_DIMENSION) {
      throw new Error(
        `Embedding dimension mismatch: expected ${this.EMBEDDING_DIMENSION}, got ${embedding.length}`,
      );
    }

    return embedding;
  }

  /**
   * Perform vector similarity search using pgvector
   *
   * Uses cosine similarity to find the most relevant document chunks
   *
   * @param queryEmbedding - The query embedding vector
   * @param category - Optional category filter
   * @returns Array of relevant chunks with metadata
   */
  private async vectorSearch(
    queryEmbedding: number[],
    category?: string,
  ): Promise<
    Array<{
      id: string;
      text: string;
      documentId: string;
      title: string;
      productId: string | null;
      distance: number;
    }>
  > {
    this.logger.debug(
      `Performing vector search (top ${this.TOP_K}${category ? `, category: ${category}` : ''})`,
    );

    // Convert embedding to pgvector format
    const vectorString = `[${queryEmbedding.join(',')}]`;

    // Perform vector similarity search using cosine distance
    // The <=> operator computes cosine distance (0 = identical, 2 = opposite)
    // We calculate similarity as 1 - distance for easier interpretation
    let results;

    if (category) {
      // Query with category filter
      results = await this.prisma.$queryRaw<
        Array<{
          id: string;
          text: string;
          documentId: string;
          title: string;
          productId: string | null;
          distance: number;
        }>
      >`
        SELECT
          c.id,
          c.text,
          c."documentId",
          d.title,
          d."productId",
          1 - (c.embedding <=> ${vectorString}::vector) AS distance
        FROM "DocumentChunk" c
        JOIN "Document" d ON d.id = c."documentId"
        LEFT JOIN "Product" p ON p.id = d."productId"
        WHERE c.embedding IS NOT NULL
          AND p.category = ${category}
        ORDER BY c.embedding <=> ${vectorString}::vector
        LIMIT ${this.TOP_K}
      `;
    } else {
      // Query without category filter
      results = await this.prisma.$queryRaw<
        Array<{
          id: string;
          text: string;
          documentId: string;
          title: string;
          productId: string | null;
          distance: number;
        }>
      >`
        SELECT
          c.id,
          c.text,
          c."documentId",
          d.title,
          d."productId",
          1 - (c.embedding <=> ${vectorString}::vector) AS distance
        FROM "DocumentChunk" c
        JOIN "Document" d ON d.id = c."documentId"
        WHERE c.embedding IS NOT NULL
        ORDER BY c.embedding <=> ${vectorString}::vector
        LIMIT ${this.TOP_K}
      `;
    }

    // Filter by similarity threshold
    const filteredResults = results.filter(
      (r) => Number(r.distance) >= this.SIMILARITY_THRESHOLD,
    );

    this.logger.debug(
      `Retrieved ${filteredResults.length} chunks above similarity threshold`,
    );

    return filteredResults;
  }

  /**
   * Build context string from retrieved chunks
   *
   * @param chunks - Retrieved document chunks
   * @returns Formatted context string
   */
  private buildContext(
    chunks: Array<{ title: string; text: string; distance: number }>,
  ): string {
    return chunks
      .map(
        (chunk, index) =>
          `[${index + 1}] ${chunk.title}: ${chunk.text}`,
      )
      .join('\n\n');
  }

  /**
   * Generate answer using OpenAI chat completion
   *
   * @param userQuery - The user's question
   * @param context - Context built from retrieved chunks
   * @returns AI-generated answer
   */
  private async generateAnswer(
    userQuery: string,
    context: string,
  ): Promise<string> {
    this.logger.debug('Generating answer with OpenAI');

    // System prompt that instructs the model how to behave
    const systemPrompt = `You are a helpful medical product expert assistant.
Answer questions based ONLY on the provided product information context.
If the answer is not in the context, say "I don't have enough information to answer that question."
Always cite your sources by mentioning the product names.
Be concise and helpful. Provide specific details like prices, categories, and features when available.`;

    // User prompt with context
    const userPromptWithContext = `Context:
${context}

Question: ${userQuery}

Answer the question based on the context above, and cite which sources you used.`;

    // Call OpenAI chat completion
    const completion = await this.openai.chat.completions.create({
      model: this.CHAT_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPromptWithContext },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const answer = completion.choices[0]?.message?.content;

    if (!answer) {
      throw new Error('No answer generated from OpenAI');
    }

    return answer.trim();
  }

  /**
   * Format retrieved chunks as source citations
   *
   * @param chunks - Retrieved document chunks
   * @returns Array of source DTOs
   */
  private formatSources(
    chunks: Array<{
      title: string;
      text: string;
      productId: string | null;
      distance: number;
    }>,
  ): SourceDto[] {
    return chunks.map((chunk) => ({
      title: chunk.title,
      snippet: chunk.text.substring(0, 200) + (chunk.text.length > 200 ? '...' : ''),
      productId: chunk.productId || undefined,
      score: Number(chunk.distance.toFixed(3)),
    }));
  }
}

/**
 * Ingest Script - Phase 9 Framework
 *
 * This script generates embeddings for document chunks and stores them in pgvector.
 * FRAMEWORK ONLY - Full implementation will be completed in Phase 9.
 *
 * Usage:
 *   npm run ingest                - Generate embeddings for all chunks without embeddings
 *   npm run ingest -- --force     - Regenerate embeddings for ALL chunks
 *   npm run ingest -- --dry-run   - Show what would be processed without making changes
 *
 * What this script will do in Phase 9:
 * 1. Fetch all DocumentChunks where embedding IS NULL (or all if --force)
 * 2. For each chunk, call OpenAI API to generate embeddings
 * 3. Update DocumentChunk records with the embedding vectors
 * 4. Provide progress tracking and error handling
 */

import { PrismaClient } from '@prisma/client';
import OpenAI from 'openai';

const prisma = new PrismaClient();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Parse command line arguments
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const isForce = args.includes('--force');

/**
 * Configuration for OpenAI embeddings
 */
const EMBEDDING_CONFIG = {
  model: 'text-embedding-3-small',
  dimension: 1536, // Must match vector(1536) in Prisma schema
  batchSize: 100, // Process chunks in batches to avoid rate limits
  retryAttempts: 3,
  retryDelay: 1000, // milliseconds
};

/**
 * Fetch chunks that need embeddings
 *
 * This function queries the database for DocumentChunks that:
 * - Have NULL embeddings (if not --force)
 * - All chunks (if --force flag is provided)
 *
 * @returns Array of chunks that need embedding generation
 */
async function fetchChunksNeedingEmbeddings() {
  console.log('\n📋 Fetching chunks that need embeddings...');

  // Query chunks based on --force flag
  // Note: We can't use prisma.documentChunk.findMany with embedding filter
  // because embedding is an Unsupported type, so we use raw SQL
  const chunks = isForce
    ? await prisma.$queryRaw<Array<{
        id: string;
        text: string;
        documentId: string;
        chunkIndex: number;
      }>>`
        SELECT id, text, "documentId", "chunkIndex"
        FROM "DocumentChunk"
        ORDER BY id ASC
      `
    : await prisma.$queryRaw<Array<{
        id: string;
        text: string;
        documentId: string;
        chunkIndex: number;
      }>>`
        SELECT id, text, "documentId", "chunkIndex"
        FROM "DocumentChunk"
        WHERE embedding IS NULL
        ORDER BY id ASC
      `;

  console.log(`   Found ${chunks.length} chunks needing embeddings`);
  return chunks;
}

/**
 * Generate embedding for a single text chunk with retry logic
 *
 * This function:
 * 1. Calls OpenAI's embeddings API with the text
 * 2. Extracts the embedding vector from the response
 * 3. Returns the vector as an array of numbers
 * 4. Implements retry logic for failed API calls
 *
 * @param text - The text to generate an embedding for
 * @param retryCount - Current retry attempt (used internally)
 * @returns The embedding vector as a number array
 */
async function generateEmbedding(text: string, retryCount = 0): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: EMBEDDING_CONFIG.model,
      input: text,
    });

    const embedding = response.data[0].embedding;

    // Verify embedding dimension matches schema
    if (embedding.length !== EMBEDDING_CONFIG.dimension) {
      throw new Error(
        `Embedding dimension mismatch: expected ${EMBEDDING_CONFIG.dimension}, got ${embedding.length}`
      );
    }

    return embedding;
  } catch (error: any) {
    // Retry logic for transient errors
    if (retryCount < EMBEDDING_CONFIG.retryAttempts) {
      console.warn(`   ⚠️  Retry ${retryCount + 1}/${EMBEDDING_CONFIG.retryAttempts} after error: ${error.message}`);
      await new Promise(resolve => setTimeout(resolve, EMBEDDING_CONFIG.retryDelay * (retryCount + 1)));
      return generateEmbedding(text, retryCount + 1);
    }

    console.error('   ✗ Error generating embedding after all retries:', error.message);
    throw error;
  }
}

/**
 * Update a chunk with its embedding vector
 *
 * This function:
 * 1. Converts the embedding array to the format pgvector expects
 * 2. Uses Prisma's $executeRaw to update the vector column
 * 3. Handles any database errors
 *
 * @param chunkId - The ID of the chunk to update
 * @param embedding - The embedding vector
 */
async function updateChunkEmbedding(chunkId: string, embedding: number[]) {
  // Convert embedding array to pgvector format
  const vectorString = `[${embedding.join(',')}]`;

  // Use raw SQL to update the vector column (Prisma doesn't support pgvector natively)
  await prisma.$executeRaw`
    UPDATE "DocumentChunk"
    SET embedding = ${vectorString}::vector
    WHERE id = ${chunkId}
  `;
}

/**
 * Process chunks in batches
 *
 * This function:
 * 1. Splits chunks into batches of size EMBEDDING_CONFIG.batchSize
 * 2. For each batch, generates embeddings sequentially (to respect rate limits)
 * 3. Updates the database with the embeddings
 * 4. Provides progress feedback
 * 5. Handles errors gracefully (continues processing other chunks if one fails)
 *
 * @param chunks - Array of chunks to process
 */
async function processBatches(chunks: any[]) {
  console.log('\n⚙️  Processing chunks in batches...\n');

  const totalBatches = Math.ceil(chunks.length / EMBEDDING_CONFIG.batchSize);
  let processedCount = 0;
  let successCount = 0;
  let errorCount = 0;

  // Process chunks in batches
  for (let i = 0; i < chunks.length; i += EMBEDDING_CONFIG.batchSize) {
    const batch = chunks.slice(i, i + EMBEDDING_CONFIG.batchSize);
    const batchNumber = Math.floor(i / EMBEDDING_CONFIG.batchSize) + 1;

    console.log(`   Processing batch ${batchNumber}/${totalBatches} (${batch.length} chunks)...`);

    // Process each chunk in the batch sequentially to avoid rate limits
    for (const chunk of batch) {
      try {
        if (!isDryRun) {
          // Generate embedding using OpenAI
          const embedding = await generateEmbedding(chunk.text);

          // Store embedding in database
          await updateChunkEmbedding(chunk.id, embedding);

          console.log(`      ✓ Chunk ${chunk.id.substring(0, 8)}... (${chunk.text.substring(0, 50)}...)`);
        } else {
          console.log(`      [DRY RUN] Would process chunk ${chunk.id.substring(0, 8)}...`);
        }
        successCount++;
      } catch (error: any) {
        console.error(`      ✗ Failed to process chunk ${chunk.id}:`, error.message);
        errorCount++;
      }
      processedCount++;
    }

    // Add delay between batches to respect rate limits
    if (i + EMBEDDING_CONFIG.batchSize < chunks.length) {
      console.log(`   Waiting 100ms before next batch...`);
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  console.log('\n================================================');
  console.log(`   Total processed: ${processedCount}`);
  console.log(`   Successful: ${successCount}`);
  console.log(`   Failed: ${errorCount}`);
  console.log('================================================\n');
}

/**
 * Verify embeddings were created correctly
 *
 * This function:
 * 1. Queries chunks with non-null embeddings
 * 2. Verifies the embedding dimensions
 * 3. Displays summary statistics
 */
async function verifyEmbeddings() {
  console.log('\n✓ Verifying embeddings...\n');

  // Query embedding statistics using raw SQL
  const stats = await prisma.$queryRaw<Array<{
    total_chunks: bigint;
    chunks_with_embeddings: bigint;
  }>>`
    SELECT
      COUNT(*) as total_chunks,
      COUNT(embedding) as chunks_with_embeddings
    FROM "DocumentChunk"
  `;

  const totalChunks = Number(stats[0].total_chunks);
  const chunksWithEmbeddings = Number(stats[0].chunks_with_embeddings);
  const coverage = totalChunks > 0 ? (chunksWithEmbeddings / totalChunks) * 100 : 0;

  console.log(`   Chunks with embeddings: ${chunksWithEmbeddings}/${totalChunks}`);
  console.log(`   Coverage: ${coverage.toFixed(1)}%`);

  if (coverage === 100) {
    console.log(`   ✓ All chunks have embeddings!`);
  } else if (coverage > 0) {
    console.log(`   ⚠️  Some chunks are missing embeddings`);
  } else {
    console.log(`   ✗ No embeddings found`);
  }
}

/**
 * Main ingestion function
 */
async function main() {
  console.log('🔄 Starting Document Ingestion Process\n');
  console.log('================================================\n');

  if (isDryRun) {
    console.log('⚠️  DRY RUN MODE - No changes will be made\n');
  }

  if (isForce) {
    console.log('⚠️  FORCE MODE - Regenerating ALL embeddings\n');
  }

  // Check for OpenAI API key
  if (!process.env.OPENAI_API_KEY) {
    console.error('❌ Error: OPENAI_API_KEY environment variable is not set');
    console.error('   Please set it in your .env file or environment');
    process.exit(1);
  }

  // Display configuration
  console.log('📝 Configuration:');
  console.log(`   Model: ${EMBEDDING_CONFIG.model}`);
  console.log(`   Dimension: ${EMBEDDING_CONFIG.dimension}`);
  console.log(`   Batch size: ${EMBEDDING_CONFIG.batchSize}`);
  console.log(`   Retry attempts: ${EMBEDDING_CONFIG.retryAttempts}\n`);

  // Fetch chunks that need embeddings
  const chunks = await fetchChunksNeedingEmbeddings();

  if (chunks.length === 0) {
    console.log('✅ No chunks need embedding generation. All done!');
    await verifyEmbeddings();
    return;
  }

  // Process chunks in batches
  await processBatches(chunks);

  // Verify results (skip if dry run)
  if (!isDryRun) {
    await verifyEmbeddings();
  }

  console.log('✅ Embedding generation complete!');
}

// Execute main function
main()
  .catch((e) => {
    console.error('❌ Ingestion failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

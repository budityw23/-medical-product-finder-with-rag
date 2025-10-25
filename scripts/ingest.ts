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
 * TODO Phase 9: Fetch chunks that need embeddings
 *
 * This function will query the database for DocumentChunks that:
 * - Have NULL embeddings (if not --force)
 * - All chunks (if --force flag is provided)
 *
 * @returns Array of chunks that need embedding generation
 */
async function fetchChunksNeedingEmbeddings() {
  console.log('\n📋 Fetching chunks that need embeddings...');

  // TODO Phase 9: Implement this query
  // const chunks = await prisma.documentChunk.findMany({
  //   where: isForce ? {} : { embedding: null },
  //   include: {
  //     document: {
  //       include: {
  //         product: true,
  //       },
  //     },
  //   },
  //   orderBy: { id: 'asc' },
  // });

  // STUB: Return empty array for now
  const chunks: any[] = [];

  console.log(`   Found ${chunks.length} chunks needing embeddings`);
  return chunks;
}

/**
 * TODO Phase 9: Generate embedding for a single text chunk
 *
 * This function will:
 * 1. Call OpenAI's embeddings API with the text
 * 2. Extract the embedding vector from the response
 * 3. Return the vector as an array of numbers
 * 4. Implement retry logic for failed API calls
 *
 * @param text - The text to generate an embedding for
 * @returns The embedding vector as a number array
 */
async function generateEmbedding(text: string): Promise<number[]> {
  // TODO Phase 9: Implement OpenAI API call
  // Example implementation:
  //
  // try {
  //   const response = await openai.embeddings.create({
  //     model: EMBEDDING_CONFIG.model,
  //     input: text,
  //   });
  //
  //   const embedding = response.data[0].embedding;
  //
  //   // Verify embedding dimension matches schema
  //   if (embedding.length !== EMBEDDING_CONFIG.dimension) {
  //     throw new Error(
  //       `Embedding dimension mismatch: expected ${EMBEDDING_CONFIG.dimension}, got ${embedding.length}`
  //     );
  //   }
  //
  //   return embedding;
  // } catch (error) {
  //   console.error('Error generating embedding:', error);
  //   throw error;
  // }

  // STUB: Return empty array for now
  return [];
}

/**
 * TODO Phase 9: Update a chunk with its embedding vector
 *
 * This function will:
 * 1. Convert the embedding array to the format pgvector expects
 * 2. Use Prisma's $executeRaw to update the vector column
 * 3. Handle any database errors
 *
 * @param chunkId - The ID of the chunk to update
 * @param embedding - The embedding vector
 */
async function updateChunkEmbedding(chunkId: string, embedding: number[]) {
  // TODO Phase 9: Implement database update
  // Example implementation:
  //
  // const vectorString = `[${embedding.join(',')}]`;
  //
  // await prisma.$executeRaw`
  //   UPDATE "DocumentChunk"
  //   SET embedding = ${vectorString}::vector
  //   WHERE id = ${chunkId}
  // `;
}

/**
 * TODO Phase 9: Process chunks in batches
 *
 * This function will:
 * 1. Split chunks into batches of size EMBEDDING_CONFIG.batchSize
 * 2. For each batch, generate embeddings concurrently
 * 3. Update the database with the embeddings
 * 4. Provide progress feedback
 * 5. Handle errors gracefully (continue processing other chunks if one fails)
 *
 * @param chunks - Array of chunks to process
 */
async function processBatches(chunks: any[]) {
  console.log('\n⚙️  Processing chunks in batches...\n');

  const totalBatches = Math.ceil(chunks.length / EMBEDDING_CONFIG.batchSize);
  let processedCount = 0;
  let successCount = 0;
  let errorCount = 0;

  // TODO Phase 9: Implement batch processing
  // for (let i = 0; i < chunks.length; i += EMBEDDING_CONFIG.batchSize) {
  //   const batch = chunks.slice(i, i + EMBEDDING_CONFIG.batchSize);
  //   const batchNumber = Math.floor(i / EMBEDDING_CONFIG.batchSize) + 1;
  //
  //   console.log(`   Processing batch ${batchNumber}/${totalBatches} (${batch.length} chunks)...`);
  //
  //   for (const chunk of batch) {
  //     try {
  //       if (!isDryRun) {
  //         const embedding = await generateEmbedding(chunk.text);
  //         await updateChunkEmbedding(chunk.id, embedding);
  //       }
  //       successCount++;
  //     } catch (error) {
  //       console.error(`   ✗ Failed to process chunk ${chunk.id}:`, error.message);
  //       errorCount++;
  //     }
  //     processedCount++;
  //   }
  //
  //   // Add delay between batches to respect rate limits
  //   if (i + EMBEDDING_CONFIG.batchSize < chunks.length) {
  //     await new Promise(resolve => setTimeout(resolve, 100));
  //   }
  // }

  console.log('\n================================================');
  console.log(`   Total processed: ${processedCount}`);
  console.log(`   Successful: ${successCount}`);
  console.log(`   Failed: ${errorCount}`);
  console.log('================================================\n');
}

/**
 * TODO Phase 9: Verify embeddings were created correctly
 *
 * This function will:
 * 1. Query chunks with non-null embeddings
 * 2. Verify the embedding dimensions
 * 3. Display summary statistics
 */
async function verifyEmbeddings() {
  console.log('\n✓ Verifying embeddings...\n');

  // TODO Phase 9: Implement verification
  // const chunksWithEmbeddings = await prisma.documentChunk.count({
  //   where: { embedding: { not: null } },
  // });
  //
  // const totalChunks = await prisma.documentChunk.count();
  //
  // console.log(`   Chunks with embeddings: ${chunksWithEmbeddings}/${totalChunks}`);
  // console.log(`   Coverage: ${((chunksWithEmbeddings / totalChunks) * 100).toFixed(1)}%`);
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

  // TODO Phase 9: Uncomment these when implementing
  // const chunks = await fetchChunksNeedingEmbeddings();
  //
  // if (chunks.length === 0) {
  //   console.log('✅ No chunks need embedding generation. All done!');
  //   return;
  // }
  //
  // await processBatches(chunks);
  //
  // if (!isDryRun) {
  //   await verifyEmbeddings();
  // }

  console.log('\n⚠️  PHASE 9 FRAMEWORK ONLY');
  console.log('   This script is currently a stub and will be fully implemented in Phase 9.');
  console.log('   At that time, it will:');
  console.log('   1. Fetch all document chunks without embeddings');
  console.log('   2. Generate embeddings using OpenAI text-embedding-3-small model');
  console.log('   3. Store the 1536-dimension vectors in pgvector');
  console.log('   4. Provide detailed progress tracking and error handling\n');

  console.log('💡 Next steps for Phase 9:');
  console.log('   1. Uncomment the TODO sections in this file');
  console.log('   2. Implement the OpenAI API integration');
  console.log('   3. Implement the pgvector database updates');
  console.log('   4. Test with a small batch first');
  console.log('   5. Run full ingestion: npm run ingest\n');
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

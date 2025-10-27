/**
 * Mock Ingest Script - For Testing Without OpenAI Credits
 *
 * This script generates mock embeddings (random vectors) for testing purposes
 * when OpenAI API quota is exhausted. This allows testing the RAG pipeline
 * without incurring API costs.
 *
 * WARNING: Mock embeddings will NOT produce meaningful semantic search results.
 * This is ONLY for testing the pipeline infrastructure.
 *
 * Usage:
 *   npm run ingest:mock
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Generate a random mock embedding vector
 * This simulates the OpenAI embedding format but with random values
 */
function generateMockEmbedding(): number[] {
  const dimension = 1536;
  const embedding: number[] = [];

  for (let i = 0; i < dimension; i++) {
    // Generate random values between -1 and 1 (similar to real embeddings)
    embedding.push((Math.random() * 2) - 1);
  }

  // Normalize the vector (real embeddings are normalized)
  const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
  return embedding.map(val => val / magnitude);
}

/**
 * Update a chunk with mock embedding
 */
async function updateChunkEmbedding(chunkId: string, embedding: number[]) {
  const vectorString = `[${embedding.join(',')}]`;

  await prisma.$executeRaw`
    UPDATE "DocumentChunk"
    SET embedding = ${vectorString}::vector
    WHERE id = ${chunkId}
  `;
}

/**
 * Main function
 */
async function main() {
  console.log('🔄 Starting Mock Document Ingestion Process\n');
  console.log('⚠️  WARNING: This script generates RANDOM embeddings for testing only!');
  console.log('   Real semantic search requires actual OpenAI embeddings.\n');
  console.log('================================================\n');

  // Fetch all chunks without embeddings
  const chunks = await prisma.$queryRaw<Array<{
    id: string;
    text: string;
  }>>`
    SELECT id, text
    FROM "DocumentChunk"
    WHERE embedding IS NULL
    ORDER BY id ASC
  `;

  console.log(`📋 Found ${chunks.length} chunks needing embeddings\n`);

  if (chunks.length === 0) {
    console.log('✅ All chunks already have embeddings!');
    return;
  }

  console.log('⚙️  Generating mock embeddings...\n');

  let successCount = 0;
  let errorCount = 0;

  for (const chunk of chunks) {
    try {
      const mockEmbedding = generateMockEmbedding();
      await updateChunkEmbedding(chunk.id, mockEmbedding);
      console.log(`   ✓ Chunk ${chunk.id.substring(0, 8)}... (${chunk.text.substring(0, 50)}...)`);
      successCount++;
    } catch (error: any) {
      console.error(`   ✗ Failed to process chunk ${chunk.id}:`, error.message);
      errorCount++;
    }
  }

  console.log('\n================================================');
  console.log(`   Total processed: ${chunks.length}`);
  console.log(`   Successful: ${successCount}`);
  console.log(`   Failed: ${errorCount}`);
  console.log('================================================\n');

  // Verify
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

  console.log('✓ Verification:\n');
  console.log(`   Chunks with embeddings: ${chunksWithEmbeddings}/${totalChunks}`);
  console.log(`   Coverage: ${coverage.toFixed(1)}%\n`);

  console.log('✅ Mock embedding generation complete!');
  console.log('\n💡 Next steps:');
  console.log('   1. Start the backend: npm run dev (from apps/api)');
  console.log('   2. Start the frontend: npm run dev (from apps/frontend)');
  console.log('   3. Navigate to /ask and test RAG queries');
  console.log('   4. Remember: Results will be random due to mock embeddings!\n');
}

// Execute
main()
  .catch((e) => {
    console.error('❌ Mock ingestion failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

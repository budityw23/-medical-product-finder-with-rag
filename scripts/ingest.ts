/**
 * Ingest Script
 *
 * This script generates embeddings for document chunks and stores them in pgvector.
 * To be implemented in Phase 9.
 *
 * Usage: npm run ingest
 */

import { PrismaClient } from '@prisma/client';
import OpenAI from 'openai';

const prisma = new PrismaClient();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function main() {
  console.log('Starting document ingestion...');

  // Phase 9: Add ingestion logic here
  // 1. Fetch documents from database
  // 2. Chunk documents (700 tokens, 150 overlap)
  // 3. Generate embeddings using OpenAI (text-embedding-3-small)
  // 4. Store embeddings in DocumentChunk table with pgvector

  console.log('Ingestion completed!');
}

main()
  .catch((e) => {
    console.error('Ingestion failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

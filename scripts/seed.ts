/**
 * Seed Script
 *
 * This script will insert sample products and documents into the database.
 * To be implemented in Phase 3.
 *
 * Usage: npm run seed
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Phase 3: Add product seeding logic here
  // - Insert 15-20 sample medical products
  // - Include categories: Cardiology, Orthopedic, etc.
  // - Add product descriptions and metadata

  console.log('Seed completed!');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

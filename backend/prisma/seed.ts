import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname, '../.env') });
import { PrismaClient } from '@prisma/client';
import { seed } from '../src/utils/bootstrap';

const prisma = new PrismaClient();

async function main() {
  await seed(prisma);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

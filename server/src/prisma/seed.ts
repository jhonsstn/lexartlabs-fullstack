import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
  await prisma.category.createMany({
    data: [
      { category: 'Categoria 1' },
      { category: 'Categoria 2' },
      { category: 'Categoria 3' },
    ],
  });
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

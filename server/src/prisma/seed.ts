import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
  const categories = [
    {
      category: 'Geladeira',
      meliCategory: 'MLB181294',
      buscapeCategory: '8',
    },
    { category: 'TV', meliCategory: 'MLB1002', buscapeCategory: '3' },
    {
      category: 'Mobile',
      meliCategory: 'MLB1055',
      buscapeCategory: '7',
    },
  ];

  const existingCategories = await prisma.category.findFirst({
    where: {
      category: 'Geladeira',
    },
  });

  if (!existingCategories) {
    await prisma.category.createMany({
      data: categories,
    });
  }
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

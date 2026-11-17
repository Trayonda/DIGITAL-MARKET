import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const updated = await prisma.storeSetting.upsert({
    where: { id: 'STORE_CONFIG' },
    update: {
      whatsappNumber: '919650624535',
      contactPhone: '+91 96506 24535',
    },
    create: {
      id: 'STORE_CONFIG',
      businessName: 'DIGITAL MARKET',
      whatsappNumber: '919650624535',
      contactPhone: '+91 96506 24535',
    },
  });

  console.log('SUCCESS: StoreSetting updated:', updated.whatsappNumber, updated.contactPhone);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

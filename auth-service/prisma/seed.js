const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');
  
  const hashedPassword1 = await bcrypt.hash('passwordhrs', 10);
  const user1 = await prisma.user.upsert({
    where: { email: 'admin.hr@example.com' },
    update: {},
    create: {
        employeeId: 'EMP001',
        fullName: 'Pauline',
        email: 'admin.hr@example.com',
        password: hashedPassword1,
        role: 'hr'
    },
  });

  const hashedPassword2 = await bcrypt.hash('passworddev', 10);
  const user2 = await prisma.user.upsert({
    where: { email: 'budi.dev@example.com' },
    update: {},
    create: {
        employeeId: 'EMP002',
        fullName: 'Budi Developer',
        email: 'budi.dev@example.com',
        password: hashedPassword2,
        role: 'employee'
    },
  });

  console.log({ user1, user2 });
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
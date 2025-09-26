const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');
  
  const employee1 = await prisma.employee.upsert({
    where: { email: 'admin.hr@example.com' },
    update: {},
    create: {
        employeeId: 'EMP001',
        identityNumber: '1234567890123456',
        fullName: 'Pauline',
        gender: 'Female',
        position: 'HR Manager',
        division: 'Human Resources Department',
        phone: '1234567890',
        dateOfBirth: new Date('1990-01-01'),
        placeOfBirth: 'City A',
        address: '123 Main St, City A',
        email: 'admin.hr@example.com',
    },
  });

  const employee2 = await prisma.employee.upsert({
    where: { email: 'budi.dev@example.com' },
    update: {},
    create: {
        employeeId: 'EMP002',
        identityNumber: '6543210987654321',
        fullName: 'Budi Developer',
        gender: 'Male',
        position: 'Software Engineer',
        division: 'IT Department',
        phone: '0987654321',
        dateOfBirth: new Date('1992-02-02'),
        placeOfBirth: 'City B',
        address: '456 Another St, City B',
        email: 'budi.dev@example.com',
    },
  });

  console.log({ employee1, employee2 });
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
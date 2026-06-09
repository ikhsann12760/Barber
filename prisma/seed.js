const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Create Admin User
  const adminEmail = 'admin@daddyscut.com';
  const hashedPassword = await bcrypt.hash('Welcome 1', 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      name: 'admin',
      password: hashedPassword,
      role: 'super_admin',
    },
    create: {
      email: adminEmail,
      name: 'admin',
      password: hashedPassword,
      role: 'super_admin',
    },
  });
  console.log(`Admin user created: ${admin.email} / Password: Welcome 1`);

  // 2. Create Branch
  const branch = await prisma.branch.upsert({
    where: { id: "cibabat" },
    update: {
      latitude: -6.875033494074873,
      longitude: 107.5584774541727,
    },
    create: {
      id: "cibabat",
      name: "Cibabat (Pusat)",
      address: "Jl. Jati Serut No. 52, Cibabat, Kec. Cimahi Utara",
      phone: "08123456789",
      latitude: -6.875033494074873,
      longitude: 107.5584774541727,
      openTime: "09:00",
      closeTime: "21:00",
      workingDays: "Mon,Tue,Wed,Thu,Fri,Sat,Sun",
    },
  });

  // 3. Create Services
  const services = [
    { id: "g1", name: "Gentleman's Hair Cuts", price: 50000, durationMinutes: 45 },
    { id: "g2", name: "Full Service Cuts", price: 55000, durationMinutes: 60 },
    { id: "o1", name: "Shaving", price: 20000, durationMinutes: 20 },
    { id: "c1", name: "Signature Coffee", price: 25000, durationMinutes: 0 },
  ];

  for (const s of services) {
    await prisma.service.upsert({
      where: { id: s.id },
      update: {},
      create: {
        ...s,
        branchId: branch.id,
      },
    });
  }

  // 4. Create Barber
  await prisma.barber.upsert({
    where: { id: "barber1" },
    update: {},
    create: {
      id: "barber1",
      name: "John Doe",
      specialization: "Haircut & Shaving",
      status: "active",
      branchId: branch.id,
      rating: 5.0,
    },
  });

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

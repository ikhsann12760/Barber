const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkDatabase() {
  console.log('--- Mengecek Database PostgreSQL ---');
  try {
    const userCount = await prisma.user.count();
    const branchCount = await prisma.branch.count();
    const serviceCount = await prisma.service.count();
    const barberCount = await prisma.barber.count();
    const bookingCount = await prisma.booking.count();
    const botOrderCount = await prisma.botOrder.count();

    console.log(`- Admin User : ${userCount}`);
    console.log(`- Cabang     : ${branchCount}`);
    console.log(`- Layanan    : ${serviceCount}`);
    console.log(`- Barber     : ${barberCount}`);
    console.log(`- Booking Web: ${bookingCount}`);
    console.log(`- Bot Order  : ${botOrderCount}`);

    if (branchCount > 0) {
      const branches = await prisma.branch.findMany({ select: { name: true } });
      console.log('Daftar Cabang:', branches.map(b => b.name).join(', '));
    }

  } catch (err) {
    console.error('Error saat mengecek database:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();

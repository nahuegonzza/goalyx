const { prisma } = require('./lib/prisma');
(async () => {
  const userId = process.env.DEFAULT_USER_ID || '00000000-0000-0000-0000-000000000000';
  const goals = await prisma.goal.findMany({ where: { userId }, take: 20 });
  const goalEntries = await prisma.goalEntry.findMany({ where: { userId }, take: 20, include: { goal: true } });
  const modules = await prisma.module.findMany({ where: { userId }, take: 20 });
  const moduleEntries = await prisma.moduleEntry.findMany({ where: { userId }, take: 20, include: { module: true } });
  console.log(JSON.stringify({ goals, goalEntries, modules, moduleEntries }, null, 2));
  await prisma.$disconnect();
})();

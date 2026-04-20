import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const DEFAULT_COLUMNS = [
  { name: 'לביצוע', position: 0, color: '#e2e8f0', status: 'TODO' as const },
  { name: 'בתהליך', position: 1, color: '#67e8f9', status: 'IN_PROGRESS' as const },
  { name: 'הושלם', position: 2, color: '#86efac', status: 'DONE' as const },
]

async function main() {
  const companies = await prisma.company.findMany({ select: { id: true } })

  for (const company of companies) {
    const existing = await prisma.taskColumn.findFirst({
      where: { companyId: company.id },
    })
    if (existing) {
      console.log(`Company ${company.id} already has columns, skipping`)
      continue
    }

    const columnMap: Record<string, string> = {}

    for (const col of DEFAULT_COLUMNS) {
      const created = await prisma.taskColumn.create({
        data: {
          companyId: company.id,
          name: col.name,
          position: col.position,
          color: col.color,
          status: col.status,
        },
      })
      columnMap[col.status] = created.id
    }

    for (const [status, columnId] of Object.entries(columnMap)) {
      await prisma.task.updateMany({
        where: { companyId: company.id, status: status as any, columnId: null },
        data: { columnId },
      })
    }

    console.log(`Migrated company ${company.id}`)
  }

  console.log('Done')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

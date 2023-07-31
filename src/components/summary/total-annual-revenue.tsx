import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import dayjs from 'dayjs'
import { prisma } from '../../lib/db'
import { BarChart } from 'lucide-react'

export const revalidate = 60 * 15 // 15 minutes

export async function TotalAnnualRevenue() {
  const [annualRevenue, annualRevenueLastYear] = await Promise.all([
    prisma.payment.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        subscription: {
          active: true,
        },
        createdAt: {
          gte: dayjs().startOf('year').toDate(),
        },
      },
    }),

    prisma.payment.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        subscription: {
          active: true,
        },
        createdAt: {
          gte: dayjs().subtract(1, 'year').startOf('year').toDate(),
          lt: dayjs().startOf('year').toDate(),
        },
      },
    }),
  ])

  const difference =
    (annualRevenue._sum.amount ?? 0) - (annualRevenueLastYear._sum.amount ?? 0)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">
          Annual Revenue (AR)
        </CardTitle>
        <BarChart className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-1">
        <span className="text-2xl font-bold">
          ${String(annualRevenue._sum.amount)}
        </span>
        {difference && (
          <p className="text-xs text-muted-foreground">
            {difference > 0 ? `+ ` : ``} ${difference} than last year
          </p>
        )}
      </CardContent>
    </Card>
  )
}

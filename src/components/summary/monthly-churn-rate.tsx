import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import dayjs from 'dayjs'
import { prisma } from '../../lib/db'
import { BarChart } from 'lucide-react'

export const revalidate = 60 * 15 // 15 minutes

export async function MonthlyChurnRate() {
  const [
    monthlyActiveSubs,
    monthlyInactiveSubs,
    monthlyActiveSubsLastMonth,
    monthlyInactiveSubsLastMonth,
  ] = await Promise.all([
    prisma.subscription.aggregate({
      _count: { _all: true },
      where: {
        active: true,
        createdAt: {
          gte: dayjs().subtract(dayjs().daysInMonth(), 'days').toDate(),
        },
      },
    }),

    prisma.subscription.aggregate({
      _count: { _all: true },
      where: {
        active: false,
        createdAt: {
          gte: dayjs().subtract(dayjs().daysInMonth(), 'days').toDate(),
        },
      },
    }),

    prisma.subscription.aggregate({
      _count: {
        _all: true,
      },
      where: {
        active: true,
        createdAt: {
          gte: dayjs()
            .subtract(dayjs().daysInMonth() * 2, 'days')
            .toDate(),
          lt: dayjs().subtract(dayjs().daysInMonth(), 'days').toDate(),
        },
      },
    }),

    prisma.subscription.aggregate({
      _count: {
        _all: true,
      },
      where: {
        active: false,
        createdAt: {
          gte: dayjs()
            .subtract(dayjs().daysInMonth() * 2, 'days')
            .toDate(),
          lt: dayjs().subtract(dayjs().daysInMonth(), 'days').toDate(),
        },
      },
    }),
  ])

  const currentChurnRate =
    (monthlyInactiveSubs._count._all /
      (monthlyActiveSubs._count._all + monthlyInactiveSubs._count._all)) *
    100
  const lastMonthChurnRate =
    (monthlyInactiveSubsLastMonth._count._all /
      (monthlyActiveSubsLastMonth._count._all +
        monthlyInactiveSubsLastMonth._count._all)) *
    100
  const difference =
    (isNaN(currentChurnRate) ? 0 : currentChurnRate) -
    (isNaN(lastMonthChurnRate) ? 0 : lastMonthChurnRate)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">
          Monthly Churn Rate (MCR)
        </CardTitle>
        <BarChart className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-1">
        <span className="text-2xl font-bold">{String(currentChurnRate)}%</span>
        {difference && (
          <p className="text-xs text-muted-foreground">
            {difference > 0 ? `+ ` : ``} {difference}% than last month
          </p>
        )}
      </CardContent>
    </Card>
  )
}

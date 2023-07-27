import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import dayjs from 'dayjs'
import { prisma } from '../../lib/db'
import { BarChart } from 'lucide-react'

export const revalidate = 60 * 15 // 15 minutes

export async function TotalMembershipCount() {
  const [totalActiveMemberships, totalActiveMembershipsAddedLastMonth] =
    await Promise.all([
      prisma.subscription.aggregate({
        _count: {
          _all: true,
        },
        where: {
          active: true,
        },
      }),

      prisma.subscription.aggregate({
        _count: {
          _all: true,
        },
        where: {
          active: true,
          createdAt: {
            gte: dayjs().subtract(30, 'days').toDate(),
          },
        },
      }),
    ])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">
          Active memberships
        </CardTitle>
        <BarChart className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-1">
        <span className="text-2xl font-bold">
          {String(totalActiveMemberships._count._all)}
        </span>
        <p className="text-xs text-muted-foreground">
          + {totalActiveMembershipsAddedLastMonth._count._all} in the last 30
        </p>
      </CardContent>
    </Card>
  )
}

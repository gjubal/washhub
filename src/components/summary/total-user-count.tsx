import { BarChart } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import dayjs from 'dayjs'
import { prisma } from '../../lib/db'

export const revalidate = 60 * 15 // 15 minutes

export async function TotalUserCount() {
  const [totalUsers, totalUsersAddedLastMonth] = await Promise.all([
    prisma.user.aggregate({
      _count: {
        _all: true,
      },
    }),

    prisma.user.aggregate({
      _count: {
        _all: true,
      },
      where: {
        createdAt: {
          gte: dayjs().subtract(30, 'days').toDate(),
        },
      },
    }),
  ])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">Users</CardTitle>
        <BarChart className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-1">
        <span className="text-2xl font-bold">
          {String(totalUsers._count._all)}
        </span>
        <p className="text-xs text-muted-foreground">
          + {totalUsersAddedLastMonth._count._all} in the last 30 days
        </p>
      </CardContent>
    </Card>
  )
}

import { Metadata } from 'next'
import { TotalUserCount } from '@/components/summary/total-user-count'
import { UsersSearch } from '@/components/search/users-search'
import { TotalActiveMembershipCount } from '@/components/summary/total-active-membership-count'
import { TotalInactiveMembershipCount } from '@/components/summary/total-inactive-membership-count'
import { TotalMonthlyRevenue } from '@/components/summary/total-monthly-revenue'
import { TotalAnnualRevenue } from '@/components/summary/total-annual-revenue'
import { MonthlyChurnRate } from '@/components/summary/monthly-churn-rate'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'WashHub Dashboard',
}

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex w-full justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>

        <UsersSearch />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <TotalUserCount />
        <TotalActiveMembershipCount />
        <TotalMonthlyRevenue />
        <TotalInactiveMembershipCount />
        <TotalAnnualRevenue />
        <MonthlyChurnRate />
      </div>
    </div>
  )
}

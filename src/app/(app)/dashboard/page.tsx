import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'WashHub Dashboard',
}

export default function DashboardPage() {
  return (
    <>
      <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
    </>
  )
}

import { Metadata } from 'next'
import { SubscriptionForm } from '../tabs/subscriptions/subscription-form'
import { prisma } from '@/lib/db'

interface CreateSubscriptionProps {
  params: { id: string }
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Add subscription`,
  }
}

export const dynamic = 'force-dynamic'

export default async function CreateSubscription({
  params,
}: CreateSubscriptionProps) {
  const userId = params.id

  const vehicles = await prisma.vehicle.findMany({
    where: {
      userId,
    },
  })

  return (
    <>
      <h2 className="truncate text-3xl font-bold tracking-tight">
        Subscription
      </h2>

      <SubscriptionForm userId={userId} vehicles={vehicles} />
    </>
  )
}

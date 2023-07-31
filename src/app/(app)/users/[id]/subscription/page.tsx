import { Metadata } from 'next'
import { SubscriptionForm } from '../tabs/subscriptions/subscription-form'
import { prisma } from '@/lib/db'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

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
      <div className="flex justify-between">
        <h2 className="truncate text-3xl font-bold tracking-tight">
          Subscription
        </h2>
        <Link href={`/users/${userId}`}>
          <Button variant="link" size="icon">
            <ArrowLeft className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <span className="sr-only">Go back</span>
          </Button>
        </Link>
      </div>

      <SubscriptionForm userId={userId} vehicles={vehicles} />
    </>
  )
}

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

interface GetUserParams {
  params: {
    id: string
  }
}

export async function GET(_: Request, { params }: GetUserParams) {
  const paymentsData = await prisma.payment.findMany({
    where: {
      subscription: {
        vehicle: {
          userId: params.id,
        },
      },
    },
    include: {
      subscription: {
        include: {
          vehicle: true,
        },
      },
    },
  })

  const sanitizedPaymentsData = paymentsData.map(
    ({ subscriptionId, subscription, ...paymentData }) => ({
      ...paymentData,
      vehicle: {
        id: subscription.vehicle.id,
        make: subscription.vehicle.make,
        model: subscription.vehicle.model,
        year: subscription.vehicle.year,
      },
    }),
  )

  const payments = [...sanitizedPaymentsData].sort(
    (a, b) => b.paymentDate.getTime() - a.paymentDate.getTime(),
  )

  return NextResponse.json({ payments })
}

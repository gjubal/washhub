import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import dayjs from 'dayjs'

interface GetUserParams {
  params: {
    id: string
  }
}

export async function GET(_: Request, { params }: GetUserParams) {
  const userId = params.id
  const subscriptionsData = await prisma.subscription.findMany({
    where: {
      vehicle: {
        user: {
          id: userId,
        },
      },
    },
    include: {
      vehicle: true,
      payments: true,
    },
    orderBy: [
      {
        active: 'desc',
      },
      {
        createdAt: 'asc',
      },
    ],
  })

  const subscriptions = subscriptionsData.map(
    ({ vehicleId, ...subscription }) => {
      const sortedPayments = subscription.payments.sort((a, b) =>
        dayjs(b.paymentDate).isAfter(a.paymentDate) ? 1 : -1,
      )

      const { userId, ...vehicle } = subscription.vehicle

      const payments = sortedPayments.map(
        ({ subscriptionId, ...payment }) => payment,
      )

      return {
        ...subscription,
        vehicle,
        payments,
      }
    },
  )

  return NextResponse.json({ subscriptions })
}

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

export async function POST(request: Request) {
  const { type, price, newVehicleId } = await request.json()

  const payment = await prisma.payment.create({
    data: {
      amount: Number(price),
      status: 'pending',
      paymentDate: new Date(),
      subscription: {
        create: {
          type,
          vehicle: {
            connect: {
              id: newVehicleId,
            },
          },
        },
      },
    },
  })

  if (!payment) {
    return NextResponse.error()
  }

  await prisma.payment.update({
    where: {
      id: payment.id,
    },
    data: {
      status: 'success',
    },
  })

  const subscription = await prisma.subscription.findUniqueOrThrow({
    where: {
      id: payment.subscriptionId,
    },
  })

  return NextResponse.json({ subscription })
}

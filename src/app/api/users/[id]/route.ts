import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

interface GetUserParams {
  params: {
    id: string
  }
}

export async function GET(_: Request, { params }: GetUserParams) {
  const { vehicles: vehiclesData, ...userData } =
    await prisma.user.findUniqueOrThrow({
      where: { id: params.id },
      include: {
        vehicles: true,
      },
    })

  const vehicles = await Promise.all(
    vehiclesData.map(async ({ userId, ...vehicle }) => {
      const subscriptions = await prisma.subscription.findMany({
        where: { vehicleId: vehicle.id },
      })

      const subscriptionsWithPayments = await Promise.all(
        subscriptions.map(async ({ vehicleId, ...subscription }) => {
          const payments = await prisma.payment.findMany({
            where: { subscriptionId: subscription.id },
          })

          const sanitizedPayments = payments.map(
            ({ subscriptionId, ...sanitizedPayment }) => sanitizedPayment,
          )

          return { ...subscription, payments: sanitizedPayments }
        }),
      )

      return { ...vehicle, subscriptions: subscriptionsWithPayments }
    }),
  )

  const purchases = await prisma.purchase.findMany({
    where: { userId: params.id },
  })

  const sanitizedPurchasesData = purchases.map(
    ({ userId, ...sanitizedPurchase }) => sanitizedPurchase,
  )

  const user = {
    ...userData,
    vehicles,
    purchases: sanitizedPurchasesData,
  }

  return NextResponse.json({ user })
}

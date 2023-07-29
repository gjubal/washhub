import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

interface UserParams {
  params: {
    id: string
  }
}

export async function GET(_: Request, { params }: UserParams) {
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

export async function PUT(request: Request, { params }: UserParams) {
  const { id } = params
  const { firstName, lastName, email, phoneNumber } = await request.json()

  const user = await prisma.user.update({
    where: { id },
    data: { email, firstName, lastName, phoneNumber },
  })

  return NextResponse.json({ user })
}

export async function DELETE(_: Request, { params }: UserParams) {
  const { id } = params

  const user = await prisma.user.delete({ where: { id } })

  if (!user) return NextResponse.error()

  return NextResponse.json({ status: 'success' })
}

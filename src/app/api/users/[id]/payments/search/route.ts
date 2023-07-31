import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { Prisma } from '@prisma/client'
import { Payment } from '../../../../../(app)/users/[id]/tabs/payments'
import dayjs from 'dayjs'

interface GetPaymentSearchParams {
  params: { id: string }
}

export async function GET(
  request: Request,
  { params }: GetPaymentSearchParams,
) {
  const { searchParams } = new URL(request.url)

  const search = searchParams.get('q')

  try {
    const userId = params.id

    let whereCondition: Prisma.PaymentWhereInput = {
      subscription: {
        vehicle: {
          userId: {
            equals: userId,
          },
        },
      },
    }

    if (search) {
      const startDate = dayjs(search, 'MM/DD/YYYY').startOf('day').toDate()
      const endDate = dayjs(search, 'MM/DD/YYYY')
        .add(1, 'day')
        .startOf('day')
        .toDate()

      whereCondition = {
        ...whereCondition,
        paymentDate: {
          gte: startDate,
          lt: endDate,
        },
      }
    }

    const payments = await prisma.payment.findMany({
      where: whereCondition,
      include: {
        subscription: {
          include: {
            vehicle: true,
          },
        },
      },
      orderBy: { paymentDate: 'desc' },
    })

    const sanitizedPayments: Payment[] = payments.map((payment) => {
      const { subscriptionId, subscription, ...paymentData } = payment
      const { userId, ...vehicle } = subscription.vehicle
      return {
        ...paymentData,
        vehicle,
      }
    })

    return NextResponse.json({ payments: sanitizedPayments })
  } catch (err) {
    console.log(err)
  }
}

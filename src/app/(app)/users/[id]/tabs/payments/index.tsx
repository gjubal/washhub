'use client'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { PaymentEntity } from '@/types/entities'
import { CheckCircledIcon, CrossCircledIcon } from '@radix-ui/react-icons'
import { Loader2 } from 'lucide-react'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table'
import { PaymentsSkeletonTable } from './payments-skeleton-table'
import { PaymentsSearch } from '@/components/search/payments-search'

dayjs.extend(relativeTime)

export interface PaymentProps {
  userId: string
}

export type Payment = PaymentEntity & {
  vehicle: {
    id: string
    year: number
    make: string
    model: string
  }
}

export function Payments({ userId }: PaymentProps) {
  const { data: payments, isLoading: isLoadingPayments } = useQuery<Payment[]>({
    queryKey: ['payments', userId],
    queryFn: async () => {
      const response = await axios.get<Record<'payments', Payment[]>>(
        `/api/users/${userId}/payments`,
      )
      return response.data.payments
    },
    refetchInterval: 15 * 1000,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
  })

  return (
    <div className="flex flex-col gap-4">
      <PaymentsSearch userId={userId} />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead style={{ width: 250 }}>
                <div className="flex items-center gap-2">
                  <span>Amount</span>
                  {isLoadingPayments && (
                    <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                  )}
                </div>
              </TableHead>
              <TableHead style={{ width: 320 }}>Vehicle</TableHead>
              <TableHead style={{ width: 300 }}>Status</TableHead>
              <TableHead style={{ width: 280 }}>Payment date</TableHead>
            </TableRow>
          </TableHeader>

          {isLoadingPayments ? (
            <PaymentsSkeletonTable />
          ) : (
            <TableBody>
              {payments?.length ? (
                payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="">${payment.amount.toFixed(2)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="">
                          {payment.vehicle?.year} {payment.vehicle?.make}{' '}
                          {payment.vehicle?.model}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      {payment.status === 'success' && (
                        <div className="flex items-center gap-2 font-medium text-emerald-500 dark:text-emerald-400">
                          <CheckCircledIcon className="h-4 w-4" />
                          <span>Successful</span>
                        </div>
                      )}
                      {payment.status === 'error' && (
                        <div className="flex items-center gap-2 font-medium text-red-500 dark:text-red-400">
                          <CrossCircledIcon className="h-4 w-4" />
                          <span>Failed</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <time
                        title={dayjs(payment.paymentDate)
                          .toDate()
                          .toLocaleString()}
                        className="text-muted-foreground"
                      >
                        {dayjs(payment.paymentDate).format('MM/DD/YYYY')}
                      </time>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          )}
        </Table>
      </div>
    </div>
  )
}

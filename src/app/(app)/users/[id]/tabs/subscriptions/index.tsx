'use client'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { SubscriptionEntity } from '@/types/entities'
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
import { SubscriptionsSkeletonTable } from './subscriptions-skeleton-table'

dayjs.extend(relativeTime)

export interface SubscriptionProps {
  userId: string
}

export type Subscription = SubscriptionEntity & {
  vehicle: {
    id: string
    year: number
    make: string
    model: string
  }
}

export function Subscriptions({ userId }: SubscriptionProps) {
  const { data: subscriptions, isLoading: isLoadingSubscriptions } = useQuery<
    Subscription[]
  >({
    queryKey: ['subscriptions', userId],
    queryFn: async () => {
      const response = await axios.get<Record<'subscriptions', Subscription[]>>(
        `/api/users/${userId}/subscriptions`,
      )
      return response.data.subscriptions
    },
    refetchInterval: 15 * 1000,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
  })

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead style={{ width: 300 }}>
                <div className="flex items-center gap-2">
                  <span>Vehicle</span>
                  {isLoadingSubscriptions && (
                    <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                  )}
                </div>
              </TableHead>
              <TableHead style={{ width: 290 }}>Type</TableHead>
              <TableHead style={{ width: 250 }}>Status</TableHead>
              <TableHead style={{ width: 250 }}>Latest payment date</TableHead>
            </TableRow>
          </TableHeader>

          {isLoadingSubscriptions ? (
            <SubscriptionsSkeletonTable />
          ) : (
            <TableBody>
              {subscriptions?.length ? (
                subscriptions.map((subscription) => (
                  <TableRow key={subscription.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="">
                          {subscription.vehicle.year}{' '}
                          {subscription.vehicle.make}{' '}
                          {subscription.vehicle.model}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="">
                          {subscription.type[0].toUpperCase()}
                          {subscription.type.slice(1)}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      {subscription.active ? (
                        <div className="flex items-center gap-2 font-medium text-emerald-500 dark:text-emerald-400">
                          <CheckCircledIcon className="h-4 w-4" />
                          <span>Active</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 font-medium text-red-500 dark:text-red-400">
                          <CrossCircledIcon className="h-4 w-4" />
                          <span>Inactive</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <time
                        title={dayjs(subscription.createdAt)
                          .toDate()
                          .toLocaleString()}
                        className="text-muted-foreground"
                      >
                        {dayjs(subscription.createdAt).format('MM/DD/YYYY')}
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

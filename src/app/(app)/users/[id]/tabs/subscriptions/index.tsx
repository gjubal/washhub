'use client'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { SubscriptionEntity, VehicleEntity } from '@/types/entities'
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
import { useCallback, useState } from 'react'
import { Button } from '@/components/ui/button'
import { VehicleForm } from './vehicle-form'

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

type VehicleRow = Record<string, Omit<VehicleEntity, 'subscriptions'>>
type SubscriptionRow = Record<string, SubscriptionEntity>

export function Subscriptions({ userId }: SubscriptionProps) {
  const [vehicleRows, setVehicleRows] = useState<VehicleRow>({})
  const [subscriptionRows, setSubscriptionRows] = useState<SubscriptionRow>({})

  const toggleVehicleRowOpen = useCallback(
    (vehicleId: string, vehicleData: Omit<VehicleEntity, 'subscriptions'>) => {
      setVehicleRows((prevRow) => {
        if (prevRow[vehicleId]) {
          const newOuterRows = { ...prevRow }
          delete newOuterRows[vehicleId]
          return newOuterRows
        } else {
          return {
            ...prevRow,
            [vehicleId]: vehicleData,
          }
        }
      })
    },
    [setVehicleRows],
  )

  const toggleSubscriptionRowOpen = useCallback(
    (subscriptionId: string, subscriptionData: SubscriptionEntity) => {
      setSubscriptionRows((prevRow) => {
        if (prevRow[subscriptionId]) {
          const newOuterRows = { ...prevRow }
          delete newOuterRows[subscriptionId]
          return newOuterRows
        } else {
          return {
            ...prevRow,
            [subscriptionId]: subscriptionData,
          }
        }
      })
    },
    [setSubscriptionRows],
  )

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
              <TableHead style={{ width: 350 }}>
                <div className="flex items-center gap-2">
                  <span>Vehicle</span>
                  {isLoadingSubscriptions && (
                    <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                  )}
                </div>
              </TableHead>
              <TableHead style={{ width: 320 }}>Type</TableHead>
              <TableHead style={{ width: 270 }}>Status</TableHead>
              <TableHead style={{ width: 180 }}>Latest payment date</TableHead>
            </TableRow>
          </TableHeader>

          {isLoadingSubscriptions ? (
            <SubscriptionsSkeletonTable />
          ) : (
            <TableBody>
              {subscriptions?.length ? (
                subscriptions.map((subscription) => (
                  <>
                    <TableRow key={subscription.id}>
                      <TableCell>
                        <Button
                          type="button"
                          className="h-2 border-none bg-transparent font-normal text-black hover:bg-transparent focus:bg-transparent active:bg-transparent"
                          onClick={() =>
                            toggleVehicleRowOpen(
                              subscription.vehicle?.id,
                              subscription.vehicle,
                            )
                          }
                        >
                          <span className="underline">
                            {subscription.vehicle?.year}{' '}
                            {subscription.vehicle?.make}{' '}
                            {subscription.vehicle?.model}
                          </span>
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button
                          type="button"
                          className="h-2 border-none bg-transparent font-normal text-black hover:bg-transparent focus:bg-transparent active:bg-transparent"
                          onClick={() =>
                            toggleSubscriptionRowOpen(
                              subscription.id,
                              subscription,
                            )
                          }
                        >
                          <span className="underline">
                            {subscription.type[0].toUpperCase()}
                            {subscription.type.slice(1)}
                          </span>
                        </Button>
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
                    {vehicleRows[subscription.vehicle?.id] &&
                      subscription.active && (
                        <TableRow>
                          <TableCell colSpan={5}>
                            <VehicleForm
                              userId={userId}
                              vehicle={vehicleRows[subscription.vehicle?.id]}
                            />
                          </TableCell>
                        </TableRow>
                      )}
                  </>
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

'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DotsHorizontalIcon,
  CheckCircledIcon,
  CrossCircledIcon,
} from '@radix-ui/react-icons'
import dayjs from 'dayjs'
import { Loader2 } from 'lucide-react'
import { VehiclesSkeletonTable } from './vehicles-skeleton-table'
import { Fragment, useCallback, useState } from 'react'
import {
  UserEntity,
  VehicleEntity,
  SubscriptionEntity,
  PaymentEntity,
} from '@/types/entities'

interface VehiclesTableProps {
  user: UserEntity | undefined
  isLoadingUser: boolean
}

type OuterRow = Record<string, SubscriptionEntity>
type InnerRow = Record<string, PaymentEntity[]>

export function VehiclesTable({ user, isLoadingUser }: VehiclesTableProps) {
  const [outerRows, setOuterRows] = useState<OuterRow>({})
  const [innerRows, setInnerRows] = useState<InnerRow>({})

  const hasSubscription = useCallback(
    (vehicle: VehicleEntity) =>
      !!vehicle.subscriptions?.length && vehicle.subscriptions?.length > 0,
    [],
  )

  const toggleOuterRowOpen = useCallback(
    (vehicleId: string, subscription: SubscriptionEntity) => {
      setOuterRows((prevOuterRows) => {
        if (prevOuterRows[vehicleId]) {
          const newOuterRows = { ...prevOuterRows }
          delete newOuterRows[vehicleId]
          return newOuterRows
        } else {
          return {
            ...prevOuterRows,
            [vehicleId]: subscription,
          }
        }
      })
    },
    [],
  )

  const toggleInnerRowOpen = useCallback(
    (subscriptionId: string, payments: PaymentEntity[]) => {
      setInnerRows((prevInnerRows) => {
        if (prevInnerRows[subscriptionId]) {
          const newInnerRows = { ...prevInnerRows }
          delete newInnerRows[subscriptionId]
          return newInnerRows
        } else {
          return {
            ...prevInnerRows,
            [subscriptionId]: payments,
          }
        }
      })
    },
    [],
  )

  const isOverdue = useCallback((vehicle: VehicleEntity) => {
    if (hasSubscription(vehicle)) {
      const subscription = vehicle.subscriptions?.[0] as SubscriptionEntity
      const lastPaymentDate = dayjs(
        subscription.payments[subscription.payments.length - 1].paymentDate,
      )
      const now = dayjs()
      const cutoutDaysAmount = subscription.type === 'monthly' ? 30 : 365

      const daysSinceLastPayment = now.diff(lastPaymentDate, 'days')
      return daysSinceLastPayment > cutoutDaysAmount
    }
  }, [])

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead style={{ width: 200 }}>
              <div className="flex items-center gap-2">
                <span>Vehicle</span>
                {isLoadingUser && (
                  <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                )}
              </div>
            </TableHead>
            <TableHead style={{ width: 120 }}>Subscription type</TableHead>
            <TableHead style={{ width: 120 }}>Subscription status</TableHead>
            <TableHead style={{ width: 90 }}>Last payment date</TableHead>
          </TableRow>
        </TableHeader>

        {isLoadingUser ? (
          <VehiclesSkeletonTable />
        ) : (
          <TableBody>
            {user?.vehicles.length ? (
              user.vehicles.map((vehicle) => (
                <Fragment key={vehicle.id}>
                  <TableRow
                    className="cursor-pointer"
                    onClick={() =>
                      vehicle.subscriptions?.length &&
                      toggleOuterRowOpen(vehicle.id, vehicle.subscriptions[0])
                    }
                  >
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-semibold">
                          {vehicle.year} {vehicle.make} {vehicle.model}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      {vehicle.subscriptions?.length &&
                      vehicle.subscriptions[0].active ? (
                        isOverdue(vehicle) ? (
                          <div className="flex items-center gap-2 font-medium text-amber-500 dark:text-amber-400">
                            <DotsHorizontalIcon className="h-4 w-4" />
                            <span>Overdue</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 font-medium text-emerald-500 dark:text-emerald-400">
                            <CheckCircledIcon className="h-4 w-4" />
                            <span>Active</span>
                          </div>
                        )
                      ) : (
                        <div className="flex items-center gap-2 font-medium text-red-500 dark:text-red-400">
                          <CrossCircledIcon className="h-4 w-4" />
                          <span>Inactive</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        <span>
                          {vehicle.subscriptions?.[0]?.type[0].toUpperCase()}
                          {vehicle.subscriptions?.[0]?.type.slice(1)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <time
                        title={dayjs(
                          vehicle.subscriptions?.[0]?.payments[
                            vehicle.subscriptions[0].payments.length - 1
                          ].paymentDate,
                        )
                          .toDate()
                          .toLocaleString()}
                        className="text-muted-foreground"
                      >
                        {dayjs(
                          vehicle.subscriptions?.[0]?.payments[
                            vehicle.subscriptions[0].payments.length - 1
                          ].paymentDate,
                        ).format('MM/DD/YYYY')}
                      </time>
                    </TableCell>
                  </TableRow>
                  {outerRows[vehicle.id] &&
                    vehicle.subscriptions?.map((subscription) => (
                      <Fragment key={subscription.id}>
                        <TableRow
                          className="cursor-pointer"
                          onClick={() =>
                            toggleInnerRowOpen(
                              subscription.id,
                              subscription.payments,
                            )
                          }
                        >
                          <TableCell style={{ paddingLeft: 50 }}>
                            <div className="flex flex-col">
                              <span className="font-semibold text-muted-foreground">
                                {dayjs(subscription.createdAt).format(
                                  'MM/DD/YYYY',
                                )}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {subscription.active ? (
                              isOverdue(vehicle) ? (
                                <div className="flex items-center gap-2 font-medium text-amber-500 dark:text-amber-400">
                                  <DotsHorizontalIcon className="h-4 w-4" />
                                  <span>Overdue</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2 font-medium text-emerald-500 dark:text-emerald-400">
                                  <CheckCircledIcon className="h-4 w-4" />
                                  <span>Active</span>
                                </div>
                              )
                            ) : (
                              <div className="flex items-center gap-2 font-medium text-red-500 dark:text-red-400">
                                <CrossCircledIcon className="h-4 w-4" />
                                <span>Inactive</span>
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">
                              <span>
                                {subscription.type[0].toUpperCase()}
                                {subscription.type.slice(1)}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <time
                              title={dayjs(
                                subscription.payments[
                                  subscription.payments.length - 1
                                ].paymentDate,
                              )
                                .toDate()
                                .toLocaleString()}
                              className="text-muted-foreground"
                            >
                              {dayjs(
                                subscription.payments[
                                  subscription.payments.length - 1
                                ].paymentDate,
                              ).format('MM/DD/YYYY')}
                            </time>
                          </TableCell>
                        </TableRow>
                        {innerRows[subscription.id] &&
                          outerRows[vehicle.id].payments.map((payment) => (
                            <TableRow key={payment.id}>
                              <TableCell style={{ paddingLeft: 70 }}>
                                <div className="font-medium text-muted-foreground">
                                  <span>
                                    {payment.amount.toLocaleString('en-US', {
                                      style: 'currency',
                                      currency: 'USD',
                                    })}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="font-medium">
                                  <span>
                                    {payment.status[0].toUpperCase()}
                                    {payment.status.slice(1)}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell></TableCell>
                              <TableCell>
                                <div className="flex flex-col">
                                  <span className="text-muted-foreground">
                                    {dayjs(payment.paymentDate).format(
                                      'MM/DD/YYYY',
                                    )}
                                  </span>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                      </Fragment>
                    ))}
                </Fragment>
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
  )
}

'use client'

import { useEffect, useState } from 'react'
import {
  CommandDialog,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../ui/command'

import { Loader2, CreditCard } from 'lucide-react'
import { Button } from '../ui/button'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import useDebounceValue from '@/hooks/useDebounceValue'
import axios from 'axios'
import { Payment } from '@/app/(app)/users/[id]/tabs/payments'

dayjs.extend(relativeTime)

interface PaymentsSearchProps {
  userId: string
}

export function PaymentsSearch({ userId }: PaymentsSearchProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  const searchTerm = useDebounceValue(search, 500)

  const { data: payments, isLoading: isLoadingPayments } = useQuery<Payment[]>({
    queryKey: ['search', searchTerm],
    queryFn: async () => {
      const response = await axios.get<Record<'payments', Payment[]>>(
        `/api/users/${userId}/payments/search`,
        {
          params: {
            q: searchTerm,
          },
        },
      )

      return response.data.payments
    },
    enabled: open,
  })

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && e.metaKey) {
        setOpen((open) => !open)
      }
    }
    document.addEventListener('keydown', down)

    return () => document.removeEventListener('keydown', down)
  }, [])

  return (
    <>
      <Button
        variant="outline"
        className="flex w-[570px] items-center justify-between text-muted-foreground"
        onClick={() => setOpen(true)}
      >
        Search payments by date...
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-sm">⌘</span>K
        </kbd>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          value={search}
          onValueChange={setSearch}
          placeholder="Search payments..."
        />
        <CommandList className="h-auto">
          <CommandGroup heading="Recently added">
            {isLoadingPayments ? (
              <div className="flex cursor-default select-none items-center justify-center gap-2 rounded-sm px-2 py-1.5 text-sm text-muted-foreground">
                <Loader2 className="h-3 w-3 animate-spin" />
                <span>Loading payments...</span>
              </div>
            ) : payments?.length === 0 ? (
              <div className="flex h-full cursor-default select-none items-center justify-center gap-2 rounded-sm px-2 py-1.5 text-sm text-muted-foreground">
                No results found.
              </div>
            ) : (
              payments?.map((payment) => {
                return (
                  <CommandItem key={payment.id} value={payment.id}>
                    <CreditCard className="mr-2 h-3 w-3" />
                    <span>
                      {payment.vehicle?.year} {payment.vehicle?.make}{' '}
                      {payment.vehicle?.model} - ${payment.amount}
                    </span>
                    <span className="ml-auto text-muted-foreground">
                      {dayjs(payment.paymentDate).format('MM/DD/YYYY')}
                    </span>
                  </CommandItem>
                )
              })
            )}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}

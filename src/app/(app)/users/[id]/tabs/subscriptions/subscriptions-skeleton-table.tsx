import { Skeleton } from '@/components/ui/skeleton'
import { TableBody, TableCell, TableRow } from '@/components/ui/table'

export interface SubscriptionsSkeletonTableProps {
  rows?: number
}

export function SubscriptionsSkeletonTable({
  rows = 5,
}: SubscriptionsSkeletonTableProps) {
  return (
    <TableBody>
      {Array.from({ length: rows }).map((_, row) => {
        return (
          <TableRow key={row}>
            <TableCell>
              <Skeleton className="h-4 w-[350px]" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-[320px]" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-[270px]" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-[180px]" />
            </TableCell>
          </TableRow>
        )
      })}
    </TableBody>
  )
}

import { Skeleton } from '@/components/ui/skeleton'
import { TableBody, TableCell, TableRow } from '@/components/ui/table'

export interface PaymentsSkeletonTableProps {
  rows?: number
}

export function PaymentsSkeletonTable({
  rows = 5,
}: PaymentsSkeletonTableProps) {
  return (
    <TableBody>
      {Array.from({ length: rows }).map((_, row) => {
        return (
          <TableRow key={row}>
            <TableCell>
              <Skeleton className="h-4 w-[250px]" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-[320px]" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-[300px]" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-[280px]" />
            </TableCell>
          </TableRow>
        )
      })}
    </TableBody>
  )
}

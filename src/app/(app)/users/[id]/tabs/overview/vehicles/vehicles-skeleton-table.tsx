import { Skeleton } from '@/components/ui/skeleton'
import { TableBody, TableCell, TableRow } from '@/components/ui/table'

export interface VehiclesSkeletonTableProps {
  rows?: number
}

export function VehiclesSkeletonTable({
  rows = 5,
}: VehiclesSkeletonTableProps) {
  return (
    <TableBody>
      {Array.from({ length: rows }).map((_, row) => {
        return (
          <TableRow key={row}>
            <TableCell>
              <Skeleton className="h-4 w-[200px]" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-[120px]" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-[120px]" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-[90px]" />
            </TableCell>
          </TableRow>
        )
      })}
    </TableBody>
  )
}

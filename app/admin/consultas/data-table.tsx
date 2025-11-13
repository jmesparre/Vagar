"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"

import { useSearchParams, useRouter } from "next/navigation"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  totalPages: number
  isLoading: boolean
}

export function DataTable<TData, TValue>({
  columns,
  data,
  totalPages,
  isLoading,
}: DataTableProps<TData, TValue>) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentPage = Number(searchParams.get('page')) || 1
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: searchParams.get('sortBy') || 'created_at', desc: searchParams.get('order') === 'desc' },
  ])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
    },
    pageCount: totalPages,
    manualPagination: true,
    manualFiltering: true,
    manualSorting: true,
  })

  const handleSearch = (value: string) => {
    const params = new URLSearchParams(searchParams)
    if (value) {
      params.set('query', value)
    } else {
      params.delete('query')
    }
    params.set('page', '1')
    router.replace(`?${params.toString()}`)
  }

  const handleStatusFilter = (value: string) => {
    const params = new URLSearchParams(searchParams)
    if (value && value !== 'all') {
      params.set('status', value)
    } else {
      params.delete('status')
    }
    params.set('page', '1')
    router.replace(`?${params.toString()}`)
  }

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', page.toString())
    router.replace(`?${params.toString()}`)
  }

  React.useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (sorting.length > 0) {
      params.set('sortBy', sorting[0].id);
      params.set('order', sorting[0].desc ? 'desc' : 'asc');
    } else {
      params.delete('sortBy');
      params.delete('order');
    }
    router.replace(`?${params.toString()}`);
  }, [sorting]);

  return (
    <div>
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Buscar por cliente, teléfono o propiedad..."
          value={searchParams.get('query') || ''}
          onChange={(event) => handleSearch(event.target.value)}
          className="max-w-sm"
        />
        <Select onValueChange={handleStatusFilter} defaultValue={searchParams.get('status') || 'all'}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="pending">Pendientes</SelectItem>
            <SelectItem value="confirmed">Confirmadas</SelectItem>
            <SelectItem value="cancelled">Canceladas</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 10 }).map((_, index) => (
                <TableRow key={index}>
                  {columns.map((column, colIndex) => (
                    <TableCell key={colIndex}>
                      <Skeleton className="h-6 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No se encontraron resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="text-sm text-muted-foreground">
          Página {currentPage} de {totalPages}
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  )
}

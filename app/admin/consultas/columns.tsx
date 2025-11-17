"use client"

import { ColumnDef, Row } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { useRouter } from "next/navigation"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"
import { Booking } from "@/lib/types"


const ActionsCell = ({ row }: { row: Row<Booking> }) => {
  const router = useRouter();
  const { toast } = useToast();
  const booking = row.original as Booking;

  const updateBookingStatus = async (id: number, status: 'confirmed' | 'cancelled') => {
    try {
      const response = await fetch(`/api/consultas/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update booking status');
      }

      toast({
        title: "Éxito",
        description: "El estado de la consulta ha sido actualizado.",
      });
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado de la consulta.",
        variant: "destructive",
      });
      console.error(error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(booking.id.toString())}>
          Copiar ID de consulta
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {booking.status === 'pending' && (
          <DropdownMenuItem onClick={() => updateBookingStatus(booking.id, 'confirmed')}>
            Marcar como confirmada
          </DropdownMenuItem>
        )}
        {booking.status !== 'cancelled' && (
          <DropdownMenuItem onClick={() => updateBookingStatus(booking.id, 'cancelled')}>
            Cancelar consulta
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};


export const columns: ColumnDef<Booking>[] = [
  {
    accessorKey: "client_name",
    header: "Cliente",
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.original.client_name}</div>
        <div className="text-sm text-muted-foreground">{row.original.client_phone}</div>
      </div>
    ),
  },
  {
    accessorKey: "property_name",
    header: "Propiedad",
  },
  {
    accessorKey: "dates",
    header: "Fechas",
    cell: ({ row }) => (
      <span>
        {new Date(row.original.check_in_date).toLocaleDateString()} - {new Date(row.original.check_out_date).toLocaleDateString()}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      const variant = status === 'pending' ? 'destructive' : status === 'confirmed' ? 'default' : 'outline'
      
      return <Badge variant={variant}>{status}</Badge>
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Fecha de Consulta
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => new Date(row.original.created_at).toLocaleString(),
  },
  {
    id: "actions",
    cell: ActionsCell,
  },
]

"use client"

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { columns } from './columns';
import { DataTable } from './data-table';
import { Booking } from '@/lib/types';

export default function ConsultasPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchBookings = async () => {
      setIsLoading(true);
      const params = new URLSearchParams(searchParams.toString());
      const response = await fetch(`/api/consultas?${params.toString()}`);
      const data = await response.json();
      
      setBookings(data.bookings || []);
      setTotalPages(data.totalPages || 0);
      setIsLoading(false);
    };

    fetchBookings();
  }, [searchParams]);

  // This is a placeholder for the full data table component which will be implemented in the next phases.
  // For now, we pass the fetched data and columns.
  // The DataTable component itself will handle the display.
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Gestión de Consultas</h1>
      <DataTable columns={columns} data={bookings} totalPages={totalPages} isLoading={isLoading} />
    </div>
  );
}

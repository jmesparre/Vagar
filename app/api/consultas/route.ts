import { NextRequest, NextResponse } from 'next/server';
import { fetchFilteredBookings } from '@/lib/data';
import db from '@/lib/db';

const ITEMS_PER_PAGE = 10;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query') || '';
    const status = searchParams.get('status') || '';
    const currentPage = Number(searchParams.get('page')) || 1;
    const sortBy = searchParams.get('sortBy') || 'created_at';
    const order = searchParams.get('order') || 'desc';

    const { bookings, totalPages } = await fetchFilteredBookings(
      query,
      status,
      currentPage,
      ITEMS_PER_PAGE,
      sortBy,
      order
    );

    return NextResponse.json({ bookings, totalPages });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      property_id,
      check_in_date,
      check_out_date,
      guests,
      client_name,
      client_phone,
    } = body;

    if (!property_id || !check_in_date || !client_name || !client_phone) {
      return NextResponse.json({ message: 'Faltan campos requeridos' }, { status: 400 });
    }

    const query = `
      INSERT INTO Bookings (
        property_id,
        check_in_date,
        check_out_date,
        guests,
        client_name,
        client_phone,
        status
      ) VALUES (?, ?, ?, ?, ?, ?, ?);
    `;

    const values = [
      property_id,
      new Date(check_in_date),
      check_out_date ? new Date(check_out_date) : null,
      guests,
      client_name,
      client_phone,
      'pending', // Default status
    ];

    await db.query(query, values);

    return NextResponse.json({ message: 'Consulta creada exitosamente' }, { status: 201 });
  } catch (error) {
    console.error('Error al crear la consulta:', error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}

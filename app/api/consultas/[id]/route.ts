import { NextRequest, NextResponse } from 'next/server';
import supabase from '@/lib/db';

export async function PATCH(
  request: NextRequest
) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();
    if (!id) {
      return NextResponse.json({ error: "ID de consulta no encontrado en la URL" }, { status: 400 });
    }
    const body = await request.json();
    const { status } = body;

    if (!status || !['pending', 'confirmed', 'cancelled'].includes(status)) {
      return NextResponse.json({ message: 'Estado no válido' }, { status: 400 });
    }

    const { error, count } = await supabase
      .from('Bookings')
      .update({ status })
      .eq('id', id)
      .select();

    if (error) {
      console.error(`Error al actualizar la consulta ${id}:`, error);
      return NextResponse.json({ message: 'Error al actualizar la consulta.', details: error.message }, { status: 500 });
    }

    if (count === 0) {
      return NextResponse.json({ message: 'Consulta no encontrada' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Estado de la consulta actualizado exitosamente' }, { status: 200 });
  } catch (error) {
    console.error(`Error inesperado al actualizar la consulta:`, error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { ResultSetHeader } from 'mysql2';

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { status } = body;

    if (!status || !['pending', 'confirmed', 'cancelled'].includes(status)) {
      return NextResponse.json({ message: 'Estado no válido' }, { status: 400 });
    }

    const query = `UPDATE Bookings SET status = ? WHERE id = ?;`;
    const values = [status, id];

    const [result] = await db.query<ResultSetHeader>(query, values);

    // Check if any row was actually updated
    if (result.affectedRows === 0) {
      return NextResponse.json({ message: 'Consulta no encontrada' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Estado de la consulta actualizado exitosamente' }, { status: 200 });
  } catch (error) {
    const awaitedParams = await context.params;
    console.error(`Error al actualizar la consulta ${awaitedParams.id}:`, error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}

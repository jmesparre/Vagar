import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import pool from '@/lib/db';
import { z } from 'zod';
import { fetchExperienceById } from '@/lib/data';

const formSchema = z.object({
  title: z.string().min(2, "El título debe tener al menos 2 caracteres."),
  category: z.string().min(1, "La categoría es obligatoria."),
  short_description: z.string().min(10, "La descripción corta debe tener al menos 10 caracteres."),
  long_description: z.string().min(20, "La descripción larga debe tener al menos 20 caracteres."),
  what_to_know: z.string(), // Se espera un string JSON
  images: z.array(z.object({ url: z.string().url("Debe ser una URL válida.") })),
});

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id;

  try {
    const experience = await fetchExperienceById(id);
    if (!experience) {
      return NextResponse.json({ error: 'Experiencia no encontrada' }, { status: 404 });
    }
    return NextResponse.json(experience);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al obtener la experiencia' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const id = params.id;
  let connection;

  try {
    const body = await request.json();
    const validatedData = formSchema.parse(body);
    
    const { title, category, short_description, long_description, what_to_know, images } = validatedData;

    connection = await pool.getConnection();
    await connection.beginTransaction();

    // 1. Actualizar la experiencia
    await connection.query(
      'UPDATE Experiences SET title = ?, category = ?, short_description = ?, long_description = ?, what_to_know = ? WHERE id = ?',
      [title, category, short_description, long_description, what_to_know, id]
    );

    // 2. Eliminar imágenes antiguas
    await connection.query('DELETE FROM Images WHERE entity_type = ? AND entity_id = ?', ['experience', id]);

    // 3. Insertar imágenes nuevas
    if (images && images.length > 0) {
      const imageValues = images.map((img, index) => [img.url, `Imagen de ${title}`, 'experience', id, index]);
      await connection.query(
        'INSERT INTO Images (url, alt_text, entity_type, entity_id, `order`) VALUES ?',
        [imageValues]
      );
    }

    await connection.commit();

    revalidatePath('/experiencias');
    revalidatePath(`/experiencias/${id}`);

    return NextResponse.json({ message: 'Experiencia actualizada correctamente' }, { status: 200 });

  } catch (error) {
    if (connection) await connection.rollback();
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ error: 'Error al actualizar la experiencia' }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const id = params.id;
  let connection;

  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    // Eliminar imágenes asociadas
    await connection.query('DELETE FROM Images WHERE entity_type = ? AND entity_id = ?', ['experience', id]);
    
    // Eliminar la experiencia
    const [result] = await connection.query('DELETE FROM Experiences WHERE id = ?', [id]);

    await connection.commit();

    revalidatePath('/experiencias');

    if ((result as any).affectedRows === 0) {
      return NextResponse.json({ error: 'Experiencia no encontrada' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Experiencia eliminada correctamente' }, { status: 200 });

  } catch (error) {
    if (connection) await connection.rollback();
    console.error(error);
    return NextResponse.json({ error: 'Error al eliminar la experiencia' }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}

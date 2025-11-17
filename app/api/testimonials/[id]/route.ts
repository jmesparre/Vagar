import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const data = await request.json();
    const { author_name, author_image_url, testimonial_text, rating, is_featured } = data;

    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'UPDATE Testimonials SET author_name = ?, author_image_url = ?, testimonial_text = ?, rating = ?, is_featured = ? WHERE id = ?',
      [author_name, author_image_url, testimonial_text, rating, is_featured ? 1 : 0, id]
    );
    connection.release();

    revalidatePath('/');
    revalidatePath('/admin/testimonials');

    return NextResponse.json({ message: 'Testimonial updated successfully', result });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error updating testimonial' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    const connection = await pool.getConnection();
    const [result] = await connection.query('DELETE FROM Testimonials WHERE id = ?', [id]);
    connection.release();

    revalidatePath('/');
    revalidatePath('/admin/testimonials');

    return NextResponse.json({ message: 'Testimonial deleted successfully', result });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error deleting testimonial' }, { status: 500 });
  }
}

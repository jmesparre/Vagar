import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function GET() {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM Testimonials ORDER BY created_at DESC');
    connection.release();
    return NextResponse.json(rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error fetching testimonials' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { author_name, author_image_url, testimonial_text, rating, is_featured } = data;

    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'INSERT INTO Testimonials (author_name, author_image_url, testimonial_text, rating, is_featured) VALUES (?, ?, ?, ?, ?)',
      [author_name, author_image_url, testimonial_text, rating, is_featured ? 1 : 0]
    );
    connection.release();

    revalidatePath('/');
    revalidatePath('/admin/testimonials');

    return NextResponse.json({ message: 'Testimonial created successfully', result });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error creating testimonial' }, { status: 500 });
  }
}

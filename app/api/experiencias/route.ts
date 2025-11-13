import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { z } from 'zod';
import { fetchExperiences } from '@/lib/data';

const experienceSchema = z.object({
  title: z.string(),
  slug: z.string(),
  category: z.string(),
  short_description: z.string(),
  long_description: z.string(),
  what_to_know: z.string(), // Se espera un string JSON
  images: z.array(z.object({ url: z.string() })), // Se espera un array de objetos de imagen
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsedData = experienceSchema.parse(body);

    const {
      title,
      slug,
      category,
      short_description,
      long_description,
      what_to_know,
      images,
    } = parsedData;

    // Convertir el string de "what_to_know" en un array de strings, asumiendo saltos de línea.
    const whatToKnowArray = what_to_know.split('\n').filter(line => line.trim() !== '');
    const whatToKnowJson = JSON.stringify(whatToKnowArray);

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Insertar la experiencia
      const [experienceResult]: any = await connection.execute(
        `INSERT INTO Experiences (title, slug, category, short_description, long_description, what_to_know) VALUES (?, ?, ?, ?, ?, ?)`,
        [title, slug, category, short_description, long_description, whatToKnowJson]
      );

      const experienceId = experienceResult.insertId;

      // Insertar las imágenes
      for (const [index, image] of images.entries()) {
        await connection.execute(
          `INSERT INTO Images (url, alt_text, entity_type, entity_id, \`order\`) VALUES (?, ?, ?, ?, ?)`,
          [image.url, `Image for ${title}`, 'experience', experienceId, index + 1]
        );
      }

      await connection.commit();
      connection.release();

      return NextResponse.json({ message: 'Experiencia creada con éxito', id: experienceId }, { status: 201 });
    } catch (error) {
      await connection.rollback();
      connection.release();
      console.error('Error during transaction:', error);
      return NextResponse.json({ message: 'Error al crear la experiencia en la base de datos' }, { status: 500 });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: 'Datos inválidos', errors: error.issues }, { status: 400 });
    }
    console.error('Error processing request:', error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const experiences = await fetchExperiences();
    return NextResponse.json(experiences);
  } catch (error) {
    console.error('Error fetching experiences:', error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}

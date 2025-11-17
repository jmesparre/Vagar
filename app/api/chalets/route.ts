import { NextResponse } from "next/server";
import { z } from "zod";
import pool from "@/lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { allAmenities as amenitiesData } from "@/lib/amenities-data";

const formSchema = z.object({
  name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres." }),
  slug: z.string().min(1, { message: "El slug no puede estar vacío." }),
  description: z.string().optional(),
  optional_services: z.string().optional(),
  latitude: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? undefined : Number(val)),
    z.number().optional()
  ),
  longitude: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? undefined : Number(val)),
    z.number().optional()
  ),
  category: z.string().optional(),
  guests: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? undefined : Number(val)),
    z.number().int().positive().optional()
  ),
  bedrooms: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? undefined : Number(val)),
    z.number().int().positive().optional()
  ),
  beds: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? undefined : Number(val)),
    z.number().int().positive().optional()
  ),
  bathrooms: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? undefined : Number(val)),
    z.number().int().positive().optional()
  ),
  rating: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? undefined : Number(val)),
    z.number().min(0).max(10).optional()
  ),
  price_high: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? undefined : Number(val)),
    z.number().positive().optional()
  ),
  price_mid: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? undefined : Number(val)),
    z.number().positive().optional()
  ),
  price_low: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? undefined : Number(val)),
    z.number().positive().optional()
  ),
  map_node_id: z.string().optional(),
  video_url: z.string().url({ message: "Por favor, introduce una URL válida." }).optional().or(z.literal('')),
  featured: z.boolean().default(false),
  gallery_images: z.array(z.string().url({ message: "Por favor, introduce una URL válida." })).optional(),
  blueprint_images: z.array(z.string().url({ message: "Por favor, introduce una URL válida." })).optional(),
  amenities: z.array(z.string()).optional(),
  rules: z.array(z.object({
    id: z.number().optional(),
    rule_text: z.string().min(1, { message: "La regla no puede estar vacía." })
  })).optional(),
});

export async function POST(request: Request) {
  let connection;
  try {
    const body = await request.json();
    const { gallery_images, blueprint_images, amenities, rules, ...chaletData } = formSchema.parse(body);

    connection = await pool.getConnection();
    await connection.beginTransaction();

    const [result] = await connection.query<ResultSetHeader>(
      "INSERT INTO Properties SET ?",
      [chaletData]
    );
    const propertyId = result.insertId;

    if (gallery_images && gallery_images.length > 0) {
      for (const imageUrl of gallery_images) {
        await connection.query("INSERT INTO Images SET ?", {
          url: imageUrl,
          entity_type: "property",
          entity_id: propertyId,
          image_category: "gallery",
        });
      }
    }

    if (blueprint_images && blueprint_images.length > 0) {
      for (const imageUrl of blueprint_images) {
        await connection.query("INSERT INTO Images SET ?", {
          url: imageUrl,
          entity_type: "property",
          entity_id: propertyId,
          image_category: "blueprint",
        });
      }
    }

    if (amenities && amenities.length > 0) {
      for (const amenityStringId of amenities) {
        const amenityDetail = amenitiesData.find(a => a.id === amenityStringId);
        if (amenityDetail) {
          const [amenityRows] = await connection.query<RowDataPacket[]>(
            "SELECT id FROM Amenities WHERE name = ?",
            [amenityDetail.name]
          );
          if (amenityRows.length > 0) {
            const amenityDbId = amenityRows[0].id;
            await connection.query("INSERT INTO PropertyAmenities SET ?", {
              property_id: propertyId,
              amenity_id: amenityDbId,
            });
          }
        }
      }
    }

    if (rules && rules.length > 0) {
      for (const rule of rules) {
        await connection.query("INSERT INTO PropertyRules SET ?", {
          property_id: propertyId,
          rule_text: rule.rule_text,
        });
      }
    }

    await connection.commit();

    return NextResponse.json({ message: "Chalet creado exitosamente", propertyId }, { status: 201 });
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

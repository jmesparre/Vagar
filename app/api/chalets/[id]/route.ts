import { NextResponse } from "next/server";
import { z } from "zod";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { allAmenities as amenitiesData } from "@/lib/amenities-data";

const formSchema = z.object({
  name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres." }),
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

export async function PUT(request: Request) {
  let connection;
  try {
    const url = new URL(request.url);
    const propertyId = url.pathname.split('/').pop();
    if (!propertyId) {
      return NextResponse.json({ error: "ID de chalet no encontrado en la URL" }, { status: 400 });
    }
    const body = await request.json();
    const { gallery_images, blueprint_images, amenities, rules, ...chaletData } = formSchema.parse(body);

    connection = await pool.getConnection();
    await connection.beginTransaction();

    // Construir la consulta de actualización dinámicamente
    const fields = Object.keys(chaletData);
    if (fields.length === 0) {
      // No hay campos para actualizar, pero continuamos para manejar las imágenes
    } else {
      const setClause = fields.map(field => `\`${field}\` = ?`).join(", ");
      const values = fields.map(field => (chaletData as any)[field]);

      await connection.query(`UPDATE Properties SET ${setClause} WHERE id = ?`, [
        ...values,
        propertyId,
      ]);
    }

    // Borrar imágenes existentes
    await connection.query("DELETE FROM Images WHERE entity_type = 'property' AND entity_id = ?", [propertyId]);

    // Insertar nuevas imágenes de la galería
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

    // Insertar nuevas imágenes de los planos
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

    // Borrar amenities existentes
    await connection.query("DELETE FROM PropertyAmenities WHERE property_id = ?", [propertyId]);

    // Insertar nuevos amenities si existen
    if (amenities && amenities.length > 0) {
      for (const amenityId of amenities) {
        const amenityDetail = amenitiesData.find(a => a.id === amenityId);
        if (amenityDetail) {
          const [amenityRows] = await connection.query<RowDataPacket[]>(
            "SELECT id FROM Amenities WHERE name = ?",
            [amenityDetail.name]
          );
          if (amenityRows.length > 0) {
            const amenityDbId = amenityRows[0].id;
            await connection.query("INSERT INTO PropertyAmenities SET ?", {
              property_id: parseInt(propertyId, 10),
              amenity_id: amenityDbId,
            });
          }
        }
      }
    }

    // Borrar reglas existentes
    await connection.query("DELETE FROM PropertyRules WHERE property_id = ?", [propertyId]);

    // Insertar nuevas reglas si existen
    if (rules && rules.length > 0) {
      for (const rule of rules) {
        await connection.query("INSERT INTO PropertyRules SET ?", {
          property_id: parseInt(propertyId, 10),
          rule_text: rule.rule_text,
        });
      }
    }

    await connection.commit();

    return NextResponse.json({ message: "Chalet actualizado exitosamente" }, { status: 200 });
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

export async function DELETE(request: Request) {
  let connection;
  try {
    const url = new URL(request.url);
    const propertyId = url.pathname.split('/').pop();
    if (!propertyId) {
      return NextResponse.json({ error: "ID de chalet no encontrado en la URL" }, { status: 400 });
    }

    connection = await pool.getConnection();
    await connection.beginTransaction();

    // Eliminar imágenes asociadas
    await connection.query("DELETE FROM Images WHERE entity_type = 'property' AND entity_id = ?", [propertyId]);

    // Eliminar amenities asociadas
    await connection.query("DELETE FROM PropertyAmenities WHERE property_id = ?", [propertyId]);
    
    // Eliminar reglas asociadas
    await connection.query("DELETE FROM PropertyRules WHERE property_id = ?", [propertyId]);

    // Eliminar la propiedad
    const [result] = await connection.query("DELETE FROM Properties WHERE id = ?", [propertyId]);

    await connection.commit();

    const deleteResult = result as any;
    if (deleteResult.affectedRows === 0) {
      return NextResponse.json({ error: "Chalet no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ message: "Chalet eliminado exitosamente" }, { status: 200 });
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.error(error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

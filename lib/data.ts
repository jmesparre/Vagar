import { Property, DashboardMetrics, LatestBooking, Booking, Experience, Testimonial } from '@/lib/types';
import pool from './db';
import { RowDataPacket } from 'mysql2';

// Defino un tipo para la fila de la base de datos
interface PropertyRow extends Omit<Property, 'gallery_images' | 'blueprint_images' | 'amenities' | 'rules'>, RowDataPacket {
  main_image_url: string;
  gallery_images: string;
  blueprint_images: string;
  amenities: string;
  rules: string;
}

interface SearchPropertyRow extends Omit<Property, 'gallery_images' | 'blueprint_images' | 'amenities' | 'rules' | 'main_image_url'>, RowDataPacket {
  main_image_url: string | null;
}

interface CountResult extends RowDataPacket {
  count: number;
}

interface TotalResult extends RowDataPacket {
  total: number;
}

interface FeaturedPropertyRow extends Omit<Property, 'gallery_images' | 'blueprint_images' | 'amenities' | 'rules'>, RowDataPacket {
  main_image_url: string;
  gallery_images: string;
  blueprint_images: string;
}

interface ExperienceRow extends Omit<Experience, 'gallery_images' | 'what_to_know' | 'main_image_url'>, RowDataPacket {
  main_image_url?: string;
  gallery_images: string;
  what_to_know: string;
}

interface FeaturedExperienceRow extends Omit<Experience, 'gallery_images' | 'what_to_know'>, RowDataPacket {
  main_image_url?: string;
}

interface BookingRow extends Booking, RowDataPacket {}

interface LatestBookingRow extends LatestBooking, RowDataPacket {}

/**
 * Fetches properties from the database, optionally filtering them.
 * @param searchParams The search parameters from the URL.
 */
export const fetchProperties = async (searchParams?: {
  startDate?: string;
  endDate?: string;
  guests?: string;
  amenities?: string;
}): Promise<Property[]> => {
  // If there are search params, delegate to the search function
  if (searchParams && (searchParams.startDate || searchParams.endDate || searchParams.guests || searchParams.amenities)) {
    const amenitiesArray = searchParams.amenities ? searchParams.amenities.split(',') : null;
    return searchProperties({
      startDate: searchParams.startDate,
      endDate: searchParams.endDate,
      guests: searchParams.guests,
      amenities: amenitiesArray,
    });
  }

  // Otherwise, fetch all properties with full details
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(`
      SELECT 
        p.*,
        (SELECT i.url FROM Images i WHERE i.entity_id = p.id AND i.entity_type = 'property' AND i.image_category = 'gallery' ORDER BY i.id LIMIT 1) as main_image_url,
        COALESCE((SELECT JSON_ARRAYAGG(JSON_OBJECT('id', i.id, 'url', i.url, 'alt_text', i.alt_text, 'image_category', i.image_category)) 
         FROM Images i WHERE i.entity_id = p.id AND i.entity_type = 'property' AND i.image_category = 'gallery'), '[]') as gallery_images,
        COALESCE((SELECT JSON_ARRAYAGG(JSON_OBJECT('id', i.id, 'url', i.url, 'alt_text', i.alt_text, 'image_category', i.image_category)) 
         FROM Images i WHERE i.entity_id = p.id AND i.entity_type = 'property' AND i.image_category = 'blueprint'), '[]') as blueprint_images,
        COALESCE((SELECT JSON_ARRAYAGG(JSON_OBJECT('id', a.id, 'name', a.name, 'category', a.category, 'icon', a.icon)) 
         FROM PropertyAmenities pa
         JOIN Amenities a ON pa.amenity_id = a.id
         WHERE pa.property_id = p.id), '[]') as amenities,
        COALESCE((SELECT JSON_ARRAYAGG(JSON_OBJECT('id', pr.id, 'rule_text', pr.rule_text))
         FROM PropertyRules pr
         WHERE pr.property_id = p.id), '[]') as rules
      FROM Properties p
    `);
    const properties = (rows as PropertyRow[]).map(p => ({
      ...p,
      featured: !!p.featured,
      gallery_images: typeof p.gallery_images === 'string' ? JSON.parse(p.gallery_images) : p.gallery_images || [],
      blueprint_images: typeof p.blueprint_images === 'string' ? JSON.parse(p.blueprint_images) : p.blueprint_images || [],
      amenities: typeof p.amenities === 'string' ? JSON.parse(p.amenities) : p.amenities || [],
      rules: typeof p.rules === 'string' ? JSON.parse(p.rules) : p.rules || [],
    }));
    return properties;
  } catch (error) {
    console.error('Failed to fetch all properties:', error);
    return [];
  } finally {
    connection.release();
  }
};

/**
 * Searches for properties based on a dynamic set of filters.
 * @param filters The search filters (guests, amenities, dates).
 */
export const searchProperties = async (filters: {
  guests?: string | null;
  amenities?: string[] | null;
  startDate?: string | null;
  endDate?: string | null;
}): Promise<Property[]> => {
  const { guests, amenities, startDate, endDate } = filters;
  const connection = await pool.getConnection();

  try {
    // Si no hay filtros, devuelve todas las propiedades de manera eficiente.
    if (!guests && (!amenities || amenities.length === 0) && !startDate && !endDate) {
      const [rows] = await connection.query(`
        SELECT 
          p.*,
          (SELECT i.url 
           FROM Images i 
           WHERE i.entity_id = p.id AND i.entity_type = 'property' AND i.image_category = 'gallery' 
           ORDER BY i.id 
           LIMIT 1) as main_image_url
        FROM Properties p
      `);
      const properties = (rows as SearchPropertyRow[]).map(p => ({
        ...p,
        main_image_url: p.main_image_url ?? undefined,
        featured: !!p.featured,
        gallery_images: [],
        blueprint_images: [],
        amenities: [],
        rules: [],
      }));
      return properties;
    }

    // Step 1: Build and execute a subquery to get the IDs of matching properties.
    let subQuery = `SELECT p.id FROM Properties p`;
    const conditions: string[] = [];
    const subQueryParams: (string | number)[] = [];

    if (guests && !isNaN(parseInt(guests, 10)) && parseInt(guests, 10) > 0) {
      conditions.push('p.guests >= ?');
      subQueryParams.push(parseInt(guests, 10));
    }

    if (amenities && amenities.length > 0) {
      const amenitiesPlaceholders = amenities.map(() => '?').join(',');
      conditions.push(`
        p.id IN (
          SELECT pa.property_id
          FROM PropertyAmenities pa
          JOIN Amenities a ON pa.amenity_id = a.id
          WHERE a.slug IN (${amenitiesPlaceholders})
          GROUP BY pa.property_id
          HAVING COUNT(DISTINCT a.slug) = ?
        )
      `);
      subQueryParams.push(...amenities, amenities.length);
    }

    if (startDate && endDate) {
      conditions.push(`
        p.id NOT IN (
          SELECT b.property_id
          FROM Bookings b
          WHERE b.status = 'confirmed'
          AND b.check_in_date <= ? 
          AND b.check_out_date > ?
        )
      `);
      // The logic is: a booking overlaps if the search starts before the booking ends,
      // and the search ends after the booking starts.
      // So we pass endDate first, then startDate.
      subQueryParams.push(endDate, startDate);
    }

    if (conditions.length > 0) {
      subQuery += ' WHERE ' + conditions.join(' AND ');
    }

    const [subRows] = await connection.execute(subQuery, subQueryParams);
    const propertyIds = (subRows as { id: number }[]).map((row) => row.id);

    if (propertyIds.length === 0) {
      return [];
    }

    // Step 2: Fetch the full data for the matching properties.
    const query = `
      SELECT 
        p.*,
        (SELECT i.url 
         FROM Images i 
         WHERE i.entity_id = p.id AND i.entity_type = 'property' AND i.image_category = 'gallery' 
         ORDER BY i.id 
         LIMIT 1) as main_image_url
      FROM Properties p
      WHERE p.id IN (?)
    `;

    const [rows] = await connection.query(query, [propertyIds]);
    
    const properties = (rows as SearchPropertyRow[]).map(p => ({
      ...p,
      main_image_url: p.main_image_url ?? undefined,
      featured: !!p.featured,
      gallery_images: [],
      blueprint_images: [],
      amenities: [],
      rules: [],
    }));

    return properties;
  } catch (error) {
    console.error('Failed to search properties:', error);
    return [];
  } finally {
    connection.release();
  }
};

/**
 * Fetches all bookings from the database.
 */
export const fetchAllBookings = async (): Promise<Booking[]> => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(`
      SELECT 
        b.*,
        p.name as property_name
      FROM Bookings b
      JOIN Properties p ON b.property_id = p.id
      ORDER BY b.created_at DESC
    `);
    return rows as BookingRow[];
  } catch (error) {
    console.error('Failed to fetch all bookings:', error);
    return [];
  } finally {
    connection.release();
  }
};

/**
 * Fetches filtered and paginated bookings from the database.
 */
export const fetchFilteredBookings = async (
  query: string,
  status: string,
  currentPage: number,
  itemsPerPage: number,
  sortBy: string,
  order: string
) => {
  const connection = await pool.getConnection();
  try {
    const offset = (currentPage - 1) * itemsPerPage;

    let countQuery = `SELECT COUNT(*) as total FROM Bookings b JOIN Properties p ON b.property_id = p.id`;
    let dataQuery = `
      SELECT 
        b.*,
        p.name as property_name
      FROM Bookings b
      JOIN Properties p ON b.property_id = p.id
    `;

    const whereClauses: string[] = [];
    const params: (string | number)[] = [];

    if (status) {
      whereClauses.push(`b.status = ?`);
      params.push(status);
    }

    if (query) {
      whereClauses.push(`(b.client_name LIKE ? OR b.client_phone LIKE ? OR p.name LIKE ?)`);
      const likeQuery = `%${query}%`;
      params.push(likeQuery, likeQuery, likeQuery);
    }

    if (whereClauses.length > 0) {
      const whereString = ` WHERE ${whereClauses.join(' AND ')}`;
      countQuery += whereString;
      dataQuery += whereString;
    }

    // Whitelist columns to prevent SQL injection
    const validSortColumns: { [key: string]: string } = {
      created_at: 'b.created_at',
      client_name: 'b.client_name',
      property_name: 'p.name',
      status: 'b.status',
    };
    const sortColumn = validSortColumns[sortBy] || 'b.created_at';
    const sortOrder = order === 'asc' ? 'ASC' : 'DESC';

    dataQuery += ` ORDER BY ${sortColumn} ${sortOrder} LIMIT ? OFFSET ?`;
    const dataParams = [...params, itemsPerPage, offset];

    const [countRows] = await connection.query<TotalResult[]>(countQuery, params);
    const totalItems = countRows[0].total;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const [bookingRows] = await connection.query<BookingRow[]>(dataQuery, dataParams);

    return {
      bookings: bookingRows,
      totalPages,
    };
  } catch (error) {
    console.error('Failed to fetch filtered bookings:', error);
    return {
      bookings: [],
      totalPages: 0,
    };
  } finally {
    connection.release();
  }
};

/**
 * Fetches dashboard metrics from the database.
 */
export const fetchDashboardMetrics = async (): Promise<DashboardMetrics> => {
  const connection = await pool.getConnection();
  try {
    const [pendingResult] = await connection.query<CountResult[]>("SELECT COUNT(*) as count FROM Bookings WHERE status = 'pending'");
    const [propertiesResult] = await connection.query<CountResult[]>("SELECT COUNT(*) as count FROM Properties");
    const [newTodayResult] = await connection.query<CountResult[]>("SELECT COUNT(*) as count FROM Bookings WHERE DATE(created_at) = CURDATE()");

    const pendingBookings = pendingResult[0].count;
    const activeProperties = propertiesResult[0].count;
    const newBookingsToday = newTodayResult[0].count;

    return { pendingBookings, activeProperties, newBookingsToday };
  } catch (error) {
    console.error('Failed to fetch dashboard metrics:', error);
    return { pendingBookings: 0, activeProperties: 0, newBookingsToday: 0 };
  } finally {
    connection.release();
  }
};

/**
 * Fetches the latest bookings from the database.
 */
export const fetchLatestBookings = async (): Promise<LatestBooking[]> => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(`
      SELECT 
        b.id,
        b.client_name,
        p.name as property_name,
        b.check_in_date,
        b.status
      FROM Bookings b
      JOIN Properties p ON b.property_id = p.id
      ORDER BY b.created_at DESC
      LIMIT 5
    `);
    return rows as LatestBookingRow[];
  } catch (error) {
    console.error('Failed to fetch latest bookings:', error);
    return [];
  } finally {
    connection.release();
  }
};

/**
 * Fetches a single property by its ID from the database.
 * @param id The ID of the property to fetch.
 */
export const fetchPropertyById = async (id: string): Promise<Property | undefined> => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(`
      SELECT 
        p.*,
        (SELECT i.url FROM Images i WHERE i.entity_id = p.id AND i.entity_type = 'property' AND i.image_category = 'gallery' ORDER BY i.id LIMIT 1) as main_image_url,
        COALESCE((SELECT JSON_ARRAYAGG(JSON_OBJECT('id', i.id, 'url', i.url, 'alt_text', i.alt_text, 'image_category', i.image_category)) 
         FROM Images i WHERE i.entity_id = p.id AND i.entity_type = 'property' AND i.image_category = 'gallery'), '[]') as gallery_images,
        COALESCE((SELECT JSON_ARRAYAGG(JSON_OBJECT('id', i.id, 'url', i.url, 'alt_text', i.alt_text, 'image_category', i.image_category)) 
         FROM Images i WHERE i.entity_id = p.id AND i.entity_type = 'property' AND i.image_category = 'blueprint'), '[]') as blueprint_images,
        COALESCE((SELECT JSON_ARRAYAGG(JSON_OBJECT('id', a.id, 'name', a.name, 'category', a.category, 'icon', a.icon)) 
         FROM PropertyAmenities pa
         JOIN Amenities a ON pa.amenity_id = a.id
         WHERE pa.property_id = p.id), '[]') as amenities,
        COALESCE((SELECT JSON_ARRAYAGG(JSON_OBJECT('id', pr.id, 'rule_text', pr.rule_text))
         FROM PropertyRules pr
         WHERE pr.property_id = p.id), '[]') as rules
      FROM Properties p
      WHERE p.id = ?
    `, [id]);
    
    const properties = rows as PropertyRow[];
    if (properties.length === 0) {
      return undefined;
    }

    const chalet = properties[0];

    // Asegurarse de que los campos JSON se parseen correctamente
    if (typeof chalet.gallery_images === 'string') {
      chalet.gallery_images = JSON.parse(chalet.gallery_images);
    }
    if (typeof chalet.blueprint_images === 'string') {
      chalet.blueprint_images = JSON.parse(chalet.blueprint_images);
    }
    if (typeof chalet.amenities === 'string') {
      chalet.amenities = JSON.parse(chalet.amenities);
    }
    if (typeof chalet.rules === 'string') {
      chalet.rules = JSON.parse(chalet.rules);
    }

    chalet.featured = !!chalet.featured;

    return chalet as unknown as Property;
  } catch (error) {
    console.error(`Failed to fetch property with id ${id}:`, error);
    return undefined;
  } finally {
    connection.release();
  }
};

/**
 * Updates the availability in the Bookings table from parsed Excel data.
 * This function performs a transaction to ensure data integrity.
 * @param availabilityData An array of objects with map_node_id, start_date, and end_date.
 */
export const updateAvailabilityFromExcel = async (
  availabilityData: { map_node_id: string; start_date: Date; end_date: Date }[]
) => {
  if (availabilityData.length === 0) {
    console.log("No availability data to update.");
    // Still need to clear old data
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Step 1: Clear all previous availability records sourced from Excel.
    await connection.query("DELETE FROM Bookings WHERE source = 'excel_upload'");

    if (availabilityData.length > 0) {
      // Step 2: Fetch all properties to create a map from map_node_id to property ID.
      const [properties] = await connection.query('SELECT id, map_node_id FROM Properties');
      const propertyMap = new Map<string, number>();
      (properties as { id: number; map_node_id: string }[]).forEach(p => {
        if (p.map_node_id) {
          propertyMap.set(p.map_node_id, p.id);
        }
      });

      // Step 3: Prepare the new availability records for batch insertion.
      const newBookings = availabilityData
        .map(item => {
          const propertyId = propertyMap.get(item.map_node_id);
          if (!propertyId) {
            console.warn(`Property with map_node_id "${item.map_node_id}" not found. Skipping.`);
            return null;
          }
          return [
            propertyId,
            item.start_date,
            item.end_date,
            'Bloqueado por Sistema', // client_name
            'N/A', // client_phone
            'N/A', // client_email
            0, // guests
            'confirmed', // status
            'excel_upload', // source
          ];
        })
        .filter(item => item !== null);

      // Step 4: Execute the batch insert if there are new bookings to add.
      if (newBookings.length > 0) {
        const sql = `
          INSERT INTO Bookings 
          (property_id, check_in_date, check_out_date, client_name, client_phone, client_email, guests, status, source) 
          VALUES ?
        `;
        await connection.query(sql, [newBookings]);
      }
    }

    // Step 5: Commit the transaction.
    await connection.commit();
    console.log('Availability updated successfully.');

  } catch (error) {
    await connection.rollback();
    console.error('Failed to update availability from Excel:', error);
    throw new Error('Error al actualizar la base de datos.');
  } finally {
    connection.release();
  }
};

/**
 * Fetches a single property by its slug from the database.
 * @param slug The slug of the property to fetch.
 */
export const fetchPropertyBySlug = async (slug: string): Promise<Property | undefined> => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(`
      SELECT 
        p.*,
        (SELECT i.url FROM Images i WHERE i.entity_id = p.id AND i.entity_type = 'property' AND i.image_category = 'gallery' ORDER BY i.id LIMIT 1) as main_image_url,
        COALESCE((SELECT JSON_ARRAYAGG(JSON_OBJECT('id', i.id, 'url', i.url, 'alt_text', i.alt_text, 'image_category', i.image_category)) 
         FROM Images i WHERE i.entity_id = p.id AND i.entity_type = 'property' AND i.image_category = 'gallery'), '[]') as gallery_images,
        COALESCE((SELECT JSON_ARRAYAGG(JSON_OBJECT('id', i.id, 'url', i.url, 'alt_text', i.alt_text, 'image_category', i.image_category)) 
         FROM Images i WHERE i.entity_id = p.id AND i.entity_type = 'property' AND i.image_category = 'blueprint'), '[]') as blueprint_images,
        COALESCE((SELECT JSON_ARRAYAGG(JSON_OBJECT('id', a.id, 'name', a.name, 'category', a.category, 'icon', a.icon)) 
         FROM PropertyAmenities pa
         JOIN Amenities a ON pa.amenity_id = a.id
         WHERE pa.property_id = p.id), '[]') as amenities,
        COALESCE((SELECT JSON_ARRAYAGG(JSON_OBJECT('id', pr.id, 'rule_text', pr.rule_text))
         FROM PropertyRules pr
         WHERE pr.property_id = p.id), '[]') as rules
      FROM Properties p
      WHERE p.slug = ?
    `, [slug]);
    
    const properties = rows as PropertyRow[];
    if (properties.length === 0) {
      return undefined;
    }

    const chalet = properties[0];

    // Asegurarse de que los campos JSON se parseen correctamente
    if (typeof chalet.gallery_images === 'string') {
      chalet.gallery_images = JSON.parse(chalet.gallery_images);
    }
    if (typeof chalet.blueprint_images === 'string') {
      chalet.blueprint_images = JSON.parse(chalet.blueprint_images);
    }
    if (typeof chalet.amenities === 'string') {
      chalet.amenities = JSON.parse(chalet.amenities);
    }
    if (typeof chalet.rules === 'string') {
      chalet.rules = JSON.parse(chalet.rules);
    }

    chalet.featured = !!chalet.featured;

    return chalet as unknown as Property;
  } catch (error) {
    console.error(`Failed to fetch property with slug ${slug}:`, error);
    return undefined;
  } finally {
    connection.release();
  }
};

/**
 * Fetches all data needed for the chalet detail page.
 * @param id The ID of the main property to fetch.
 */
export const fetchChaletPageData = async (id: string): Promise<Property | undefined> => {
  return fetchPropertyById(id);
};

/**
 * Fetches featured properties by category from the database.
 * @param category The category of the properties to return.
 * @param limit The maximum number of properties to return.
 */
export const fetchFeaturedPropertiesByCategory = async (category: string, limit: number = 6): Promise<Property[]> => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(`
      SELECT 
        p.*,
        (SELECT i.url FROM Images i WHERE i.entity_id = p.id AND i.entity_type = 'property' AND i.image_category = 'gallery' ORDER BY i.id LIMIT 1) as main_image_url,
        COALESCE((SELECT JSON_ARRAYAGG(JSON_OBJECT('id', i.id, 'url', i.url, 'alt_text', i.alt_text, 'image_category', i.image_category)) 
         FROM Images i WHERE i.entity_id = p.id AND i.entity_type = 'property' AND i.image_category = 'gallery'), '[]') as gallery_images,
        COALESCE((SELECT JSON_ARRAYAGG(JSON_OBJECT('id', i.id, 'url', i.url, 'alt_text', i.alt_text, 'image_category', i.image_category)) 
         FROM Images i WHERE i.entity_id = p.id AND i.entity_type = 'property' AND i.image_category = 'blueprint'), '[]') as blueprint_images
      FROM Properties p
      WHERE p.featured = 1 AND p.category = ?
      ORDER BY RAND()
      LIMIT ?
    `, [category, limit]);
    
    const properties = (rows as FeaturedPropertyRow[]).map(p => ({
      ...p,
      featured: !!p.featured,
      gallery_images: typeof p.gallery_images === 'string' ? JSON.parse(p.gallery_images || '[]') : [],
      blueprint_images: typeof p.blueprint_images === 'string' ? JSON.parse(p.blueprint_images || '[]') : [],
      // This query doesn't fetch amenities or rules, so we provide empty arrays to match the Property type.
      amenities: [],
      rules: [],
    }));

    return properties;
  } catch (error) {
    console.error(`Failed to fetch featured properties for category ${category}:`, error);
    return [];
  } finally {
    connection.release();
  }
};

/**
 * Fetches featured properties from the database.
 * @param limit The maximum number of properties to return.
 */
export const fetchFeaturedProperties = async (limit: number = 6): Promise<Property[]> => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(`
      SELECT 
        p.*,
        COALESCE((SELECT JSON_ARRAYAGG(JSON_OBJECT('id', i.id, 'url', i.url, 'alt_text', i.alt_text, 'image_category', i.image_category)) 
         FROM Images i WHERE i.entity_id = p.id AND i.entity_type = 'property' AND i.image_category = 'gallery'), '[]') as gallery_images,
        COALESCE((SELECT JSON_ARRAYAGG(JSON_OBJECT('id', i.id, 'url', i.url, 'alt_text', i.alt_text, 'image_category', i.image_category)) 
         FROM Images i WHERE i.entity_id = p.id AND i.entity_type = 'property' AND i.image_category = 'blueprint'), '[]') as blueprint_images
      FROM Properties p
      WHERE p.featured = 1
      ORDER BY RAND()
      LIMIT ?
    `, [limit]);
    
    const properties = (rows as FeaturedPropertyRow[]).map(p => ({
      ...p,
      featured: !!p.featured,
      gallery_images: typeof p.gallery_images === 'string' ? JSON.parse(p.gallery_images || '[]') : [],
      blueprint_images: typeof p.blueprint_images === 'string' ? JSON.parse(p.blueprint_images || '[]') : [],
      amenities: [],
      rules: [],
    }));

    return properties;
  } catch (error) {
    console.error(`Failed to fetch featured properties:`, error);
    return [];
  } finally {
    connection.release();
  }
};

/**
 * Fetches all chalets from the database for the admin panel.
 */
export const fetchAllChalets = async (): Promise<Property[]> => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(`
      SELECT 
        p.*,
        (SELECT i.url FROM Images i WHERE i.entity_id = p.id AND i.entity_type = 'property' AND i.image_category = 'gallery' ORDER BY i.id LIMIT 1) as main_image_url,
        COALESCE((SELECT JSON_ARRAYAGG(JSON_OBJECT('id', i.id, 'url', i.url, 'alt_text', i.alt_text, 'image_category', i.image_category)) 
         FROM Images i WHERE i.entity_id = p.id AND i.entity_type = 'property' AND i.image_category = 'gallery'), '[]') as gallery_images,
        COALESCE((SELECT JSON_ARRAYAGG(JSON_OBJECT('id', i.id, 'url', i.url, 'alt_text', i.alt_text, 'image_category', i.image_category)) 
         FROM Images i WHERE i.entity_id = p.id AND i.entity_type = 'property' AND i.image_category = 'blueprint'), '[]') as blueprint_images
      FROM Properties p
      ORDER BY p.id DESC
    `);
    const properties = (rows as PropertyRow[]).map(p => ({
      ...p,
      featured: !!p.featured,
      gallery_images: typeof p.gallery_images === 'string' ? JSON.parse(p.gallery_images) : p.gallery_images || [],
      blueprint_images: typeof p.blueprint_images === 'string' ? JSON.parse(p.blueprint_images) : p.blueprint_images || [],
      amenities: typeof p.amenities === 'string' ? JSON.parse(p.amenities) : p.amenities || [],
      rules: typeof p.rules === 'string' ? JSON.parse(p.rules) : p.rules || [],
    }));
    return properties;
  } catch (error) {
    console.error('Failed to fetch all chalets:', error);
    return [];
  } finally {
    connection.release();
  }
};

/**
 * Fetches all experiences from the database.
 */
export const fetchExperiences = async (): Promise<Experience[]> => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(`
      SELECT 
        e.*,
        (SELECT i.url FROM Images i WHERE i.entity_id = e.id AND i.entity_type = 'experience' ORDER BY i.id LIMIT 1) as main_image_url,
        COALESCE((SELECT JSON_ARRAYAGG(JSON_OBJECT('id', i.id, 'url', i.url, 'alt_text', i.alt_text)) 
         FROM Images i WHERE i.entity_id = e.id AND i.entity_type = 'experience'), '[]') as gallery_images
      FROM Experiences e
      ORDER BY e.id DESC
    `);
    const experiences = (rows as ExperienceRow[]).map(e => ({
      ...e,
      featured: !!e.featured,
      gallery_images: typeof e.gallery_images === 'string' ? JSON.parse(e.gallery_images || '[]') : [],
      what_to_know: typeof e.what_to_know === 'string' ? JSON.parse(e.what_to_know || '[]') : [],
    }));
    return experiences;
  } catch (error) {
    console.error('Failed to fetch all experiences:', error);
    return [];
  } finally {
    connection.release();
  }
};

/**
 * Fetches a single experience by its ID from the database.
 * @param id The ID of the experience to fetch.
 */
export const fetchExperienceById = async (id: string): Promise<Experience | undefined> => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(`
      SELECT 
        e.*,
        COALESCE((SELECT JSON_ARRAYAGG(JSON_OBJECT('id', i.id, 'url', i.url, 'alt_text', i.alt_text)) 
         FROM Images i WHERE i.entity_id = e.id AND i.entity_type = 'experience'), '[]') as gallery_images
      FROM Experiences e
      WHERE e.id = ?
    `, [id]);
    
    const experiences = rows as ExperienceRow[];
    if (experiences.length === 0) {
      return undefined;
    }
    const row = experiences[0];
    const experience: Experience = {
      ...row,
      featured: !!row.featured,
      gallery_images: typeof row.gallery_images === 'string' ? JSON.parse(row.gallery_images || '[]') : [],
      what_to_know: typeof row.what_to_know === 'string' ? JSON.parse(row.what_to_know || '[]') : [],
    };
    return experience;
  } catch (error) {
    console.error(`Failed to fetch experience with id ${id}:`, error);
    return undefined;
  } finally {
    connection.release();
  }
};

/**
 * Fetches a single experience by its slug from the database.
 * @param slug The slug of the experience to fetch.
 */
export const fetchExperienceBySlug = async (slug: string): Promise<Experience | undefined> => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(`
      SELECT 
        e.*,
        COALESCE((SELECT JSON_ARRAYAGG(JSON_OBJECT('id', i.id, 'url', i.url, 'alt_text', i.alt_text)) 
         FROM Images i WHERE i.entity_id = e.id AND i.entity_type = 'experience'), '[]') as gallery_images
      FROM Experiences e
      WHERE e.slug = ?
    `, [slug]);
    
    const experiences = rows as ExperienceRow[];
    if (experiences.length === 0) {
      return undefined;
    }
    const row = experiences[0];
    const experience: Experience = {
      ...row,
      featured: !!row.featured,
      gallery_images: typeof row.gallery_images === 'string' ? JSON.parse(row.gallery_images || '[]') : [],
      what_to_know: typeof row.what_to_know === 'string' ? JSON.parse(row.what_to_know || '[]') : [],
    };
    return experience;
  } catch (error) {
    console.error(`Failed to fetch experience with slug ${slug}:`, error);
    return undefined;
  } finally {
    connection.release();
  }
};

/**
 * Fetches featured experiences from the database.
 * @param limit The maximum number of experiences to return.
 */
export const fetchFeaturedExperiences = async (limit: number = 4): Promise<Experience[]> => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(`
      SELECT 
        e.*,
        (SELECT i.url FROM Images i WHERE i.entity_id = e.id AND i.entity_type = 'experience' ORDER BY i.id LIMIT 1) as main_image_url
      FROM Experiences e
      ORDER BY RAND()
      LIMIT ?
    `, [limit]);
    
    const experiences = (rows as FeaturedExperienceRow[]).map(e => ({
      ...e,
      featured: !!e.featured,
      gallery_images: [],
      what_to_know: [],
    }));

    return experiences;
  } catch (error) {
    console.error('Failed to fetch featured experiences:', error);
    return [];
  } finally {
    connection.release();
  }
};

/**
 * Fetches properties based on a set of filters.
 * @param filters The filters to apply to the query.
 */
export const fetchFilteredChalets = async (filters: {
  guests: string;
  bedrooms: string;
  beds: string;
  bathrooms: string;
  amenities: string[];
}): Promise<Property[]> => {
  const connection = await pool.getConnection();
  try {
    let query = `
      SELECT 
        p.*,
        (SELECT i.url FROM Images i WHERE i.entity_id = p.id AND i.entity_type = 'property' AND i.image_category = 'gallery' ORDER BY i.id LIMIT 1) as main_image_url,
        COALESCE((SELECT JSON_ARRAYAGG(JSON_OBJECT('id', i.id, 'url', i.url, 'alt_text', i.alt_text, 'image_category', i.image_category)) 
         FROM Images i WHERE i.entity_id = p.id AND i.entity_type = 'property' AND i.image_category = 'gallery'), '[]') as gallery_images,
        COALESCE((SELECT JSON_ARRAYAGG(JSON_OBJECT('id', i.id, 'url', i.url, 'alt_text', i.alt_text, 'image_category', i.image_category)) 
         FROM Images i WHERE i.entity_id = p.id AND i.entity_type = 'property' AND i.image_category = 'blueprint'), '[]') as blueprint_images,
        COALESCE((SELECT JSON_ARRAYAGG(JSON_OBJECT('id', a.id, 'name', a.name, 'category', a.category, 'icon', a.icon)) 
         FROM PropertyAmenities pa
         JOIN Amenities a ON pa.amenity_id = a.id
         WHERE pa.property_id = p.id), '[]') as amenities,
        COALESCE((SELECT JSON_ARRAYAGG(JSON_OBJECT('id', pr.id, 'rule_text', pr.rule_text))
         FROM PropertyRules pr
         WHERE pr.property_id = p.id), '[]') as rules
      FROM Properties p
    `;
    
    const params: (string | number | string[])[] = [];
    const whereClauses: string[] = [];

    if (parseInt(filters.guests, 10) > 0) {
      whereClauses.push('p.guests >= ?');
      params.push(parseInt(filters.guests, 10));
    }
    if (parseInt(filters.bedrooms, 10) > 0) {
      whereClauses.push('p.bedrooms >= ?');
      params.push(parseInt(filters.bedrooms, 10));
    }
    if (parseInt(filters.beds, 10) > 0) {
      whereClauses.push('p.beds >= ?');
      params.push(parseInt(filters.beds, 10));
    }
    if (parseInt(filters.bathrooms, 10) > 0) {
      whereClauses.push('p.bathrooms >= ?');
      params.push(parseInt(filters.bathrooms, 10));
    }

    if (filters.amenities.length > 0) {
      const amenityPlaceholders = '?,'.repeat(filters.amenities.length).slice(0, -1);
      const subQuery = `
        SELECT pa.property_id
        FROM PropertyAmenities pa
        JOIN Amenities a ON pa.amenity_id = a.id
        WHERE a.slug IN (${amenityPlaceholders})
        GROUP BY pa.property_id
        HAVING COUNT(DISTINCT a.slug) = ?
      `;
      whereClauses.push(`p.id IN (${subQuery})`);
      params.push(...filters.amenities, filters.amenities.length);
    }

    if (whereClauses.length > 0) {
      query += ` WHERE ${whereClauses.join(' AND ')}`;
    }

    const [rows] = await connection.query(query, params);
    
    const properties = (rows as PropertyRow[]).map(p => ({
      ...p,
      featured: !!p.featured,
      gallery_images: typeof p.gallery_images === 'string' ? JSON.parse(p.gallery_images || '[]') : [],
      blueprint_images: typeof p.blueprint_images === 'string' ? JSON.parse(p.blueprint_images || '[]') : [],
      amenities: typeof p.amenities === 'string' ? JSON.parse(p.amenities || '[]') : [],
      rules: typeof p.rules === 'string' ? JSON.parse(p.rules || '[]') : [],
    }));

    return properties;
  } catch (error) {
    console.error('Failed to fetch filtered chalets:', error);
    return [];
  } finally {
    connection.release();
  }
};

/**
 * Fetches all map_node_id values that are currently in use by properties.
 */
export const fetchUsedMapNodeIds = async (): Promise<string[]> => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(`
      SELECT map_node_id FROM Properties WHERE map_node_id IS NOT NULL
    `);
    const nodeIds = (rows as { map_node_id: string }[]).map(row => row.map_node_id);
    return nodeIds;
  } catch (error) {
    console.error('Failed to fetch used map node IDs:', error);
    return [];
  } finally {
    connection.release();
  }
};

/**
 * Fetches all testimonials from the database.
 */
export const fetchAllTestimonials = async (): Promise<Testimonial[]> => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query('SELECT * FROM Testimonials ORDER BY created_at DESC');
    return rows as Testimonial[];
  } catch (error) {
    console.error('Failed to fetch testimonials:', error);
    return [];
  } finally {
    connection.release();
  }
};

/**
 * Fetches featured testimonials from the database.
 */
export const fetchFeaturedTestimonials = async (): Promise<Testimonial[]> => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query('SELECT * FROM Testimonials WHERE is_featured = 1 ORDER BY created_at DESC');
    return rows as Testimonial[];
  } catch (error) {
    console.error('Failed to fetch featured testimonials:', error);
    return [];
  } finally {
    connection.release();
  }
};

/**
 * Fetches a single testimonial by its ID from the database.
 * @param id The ID of the testimonial to fetch.
 */
export const fetchTestimonialById = async (id: string): Promise<Testimonial | undefined> => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query('SELECT * FROM Testimonials WHERE id = ?', [id]);
    const testimonials = rows as Testimonial[];
    if (testimonials.length === 0) {
      return undefined;
    }
    const testimonial = testimonials[0];
    testimonial.is_featured = !!testimonial.is_featured;
    return testimonial as Testimonial;
  } catch (error) {
    console.error(`Failed to fetch testimonial with id ${id}:`, error);
    return undefined;
  } finally {
    connection.release();
  }
};

/**
 * Fetches all bookings for a specific chalet.
 * @param chaletId The ID of the chalet.
 */
export const getChaletBookings = async (chaletId: string): Promise<Booking[]> => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(
      `SELECT * FROM Bookings WHERE property_id = ? AND status = 'confirmed'`,
      [chaletId]
    );
    
    // Log para depuración de fechas
    if (rows && Array.isArray(rows)) {
      (rows as BookingRow[]).forEach(booking => {
        console.log(`[DATA_FETCH] Booking para chalet ${chaletId}: check_in_date=${booking.check_in_date}, check_out_date=${booking.check_out_date}`);
      });
    }

    return rows as BookingRow[];
  } catch (error) {
    console.error(`Failed to fetch bookings for chalet ${chaletId}:`, error);
    return [];
  } finally {
    connection.release();
  }
};

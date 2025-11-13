import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';
import type { ConnectionOptions, RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import { allAmenities as amenities } from '../lib/amenities-data';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const slugify = (text: string): string =>
  text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text

const properties = [
  {
    id: '1',
    name: 'Chalet de Montaña',
    description: 'Un hermoso chalet en la montaña con vistas espectaculares.',
    latitude: -31.9916,
    longitude: -64.7833,
    category: 'Chalets Celestes',
    images: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=2574&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=2670&auto=format&fit=crop',
    ],
    blueprint_images: [
      'https://images.unsplash.com/photo-1542882284-3a86a732813a?q=80&w=2574&auto=format&fit=crop',
    ],
    guests: 5,
    bedrooms: 3,
    beds: 2,
    bathrooms: 2,
    rating: 8.4,
    price_high: 200500,
    price_mid: 150000,
    price_low: 100500,
    map_node_id: 'node_1',
    featured: true,
    amenities: [
      "sauna", "piscina_privada", "aire_acondicionado_full", "calefaccion_central", "tv_full_hd_premium"
    ],
  },
  {
    id: '2',
    name: 'Cabaña del Bosque',
    description: 'Una acogedora cabaña rodeada de naturaleza.',
    latitude: -32.0016,
    longitude: -64.7933,
    category: 'Chalets Verdes',
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2670&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2670&auto=format&fit=crop',
    ],
    blueprint_images: [],
    guests: 4,
    bedrooms: 2,
    beds: 2,
    bathrooms: 1,
    rating: 9.1,
    price_high: 180000,
    price_mid: 130000,
    price_low: 90000,
    map_node_id: 'node_2',
    featured: true,
    amenities: [
      "piscina_privada", "gimnasio_cubierto", "starlink_100", "hidromasaje"
    ],
  },
  {
    id: '3',
    name: 'Villa del Lago',
    description: 'Lujosa villa con acceso directo al lago.',
    latitude: -31.9816,
    longitude: -64.7733,
    category: 'Chalets Azules',
    images: [
      'https://images.unsplash.com/photo-1558036117-15d82a90b9b1?q=80&w=2574&auto=format&fit=crop',
    ],
    blueprint_images: [],
    guests: 8,
    bedrooms: 4,
    beds: 4,
    bathrooms: 3,
    rating: 9.5,
    price_high: 350000,
    price_mid: 280000,
    price_low: 200000,
    map_node_id: 'node_3',
    featured: false,
    amenities: [
      "gimnasio_cubierto", "minicine_4k", "starlink_250", "piscina_interna_climatizada"
    ],
  },
];

const experiences = [
  // Zona deportiva y social
  {
    id: 'exp1',
    title: 'Cabalgata por las Sierras',
    shortDescription: 'Recorre paisajes increíbles a caballo.',
    longDescription:
      'Una experiencia única para conectar con la naturaleza. Nuestras cabalgatas guiadas te llevarán por senderos serranos, cruzando arroyos y descubriendo vistas panorámicas que te dejarán sin aliento. Apto para todos los niveles, desde principiantes hasta jinetes experimentados.',
    images: [
      'https://images.unsplash.com/photo-1555169062-013468b47731?q=80&w=2574&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1552495138-2070a5813838?q=80&w=2574&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1618511498393-0f1863a0e0e2?q=80&w=2670&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1599228245248-3c4427a65a8c?q=80&w=2614&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1598992649144-fc867b58f212?q=80&w=2670&auto=format&fit=crop',
    ],
    category: 'Zona deportiva y social',
    whatYouShouldKnow: [
      'Duración: 2 horas',
      'Incluye guía y equipo de seguridad',
      'Se recomienda llevar ropa cómoda y protección solar',
      'No se requiere experiencia previa',
    ],
  },
  {
    id: 'exp4',
    title: 'Torneo de Golf',
    shortDescription: 'Compite en un campo de nivel profesional.',
    longDescription:
      'Participa en nuestro torneo de golf semanal en un campo de 18 hoyos diseñado por expertos. Disfruta de un día de competencia amistosa en un entorno natural espectacular. El evento concluye con un almuerzo y entrega de premios en el club house.',
    images: [
      'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?q=80&w=2670&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?q=80&w=2670&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1500930287096-c377b86a1a16?q=80&w=2670&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1574015970239-9177b1973e85?q=80&w=2670&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1562246224-e448a0c13198?q=80&w=2669&auto=format&fit=crop',
    ],
    category: 'Zona deportiva y social',
    whatYouShouldKnow: [
      'Modalidad: Four-ball',
      'Inscripción previa requerida',
      'Alquiler de palos y carritos disponible',
      'Código de vestimenta: etiqueta de golf',
    ],
  },
  {
    id: 'exp7',
    title: 'Clases de Tenis',
    shortDescription: 'Mejora tu juego con instructores expertos.',
    longDescription:
      'Ofrecemos clases de tenis personalizadas para todas las edades y niveles. Nuestros instructores certificados te ayudarán a perfeccionar tu técnica en nuestras canchas de polvo de ladrillo. Las clases pueden ser individuales o en grupos reducidos.',
    images: [
      'https://images.unsplash.com/photo-1555169062-013468b47731?q=80&w=2574&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1554062309-3898222873b2?q=80&w=2670&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1540054990332-b1e0180144e5?q=80&w=2670&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1529565266759-f95257039a1a?q=80&w=2670&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1622224043585-826a0c203a0a?q=80&w=2670&auto=format&fit=crop',
    ],
    category: 'Zona deportiva y social',
    whatYouShouldKnow: [
      'Las pelotas de tenis valen 500 pesos',
      'Las Paletas se alquilan por 5000 pesos',
      'Reserva de cancha con 24hs de anticipación',
      'Otros datos',
    ],
  },
  {
    id: 'exp10',
    title: 'Ciclismo de Montaña',
    shortDescription: 'Aventura y adrenalina sobre dos ruedas.',
    longDescription:
      'Explora los senderos de montaña en una bicicleta de alta gama. Nuestros guías te llevarán por rutas desafiantes con paisajes espectaculares, adaptadas a tu nivel de experiencia. Una dosis de adrenalina en plena naturaleza.',
    images: [
      'https://images.unsplash.com/photo-1555169062-013468b47731?q=80&w=2574&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1543335868-3f3c559435a9?q=80&w=2670&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1511994298241-608e28f14fde?q=80&w=2574&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1559348349-36dfc68150d7?q=80&w=2574&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1541625602330-2277a4c46182?q=80&w=2574&auto=format&fit=crop',
    ],
    category: 'Zona deportiva y social',
    whatYouShouldKnow: [
      'Dificultad: Media a Alta',
      'Incluye bicicleta, casco y guía',
      'Se requiere buena condición física',
      'Punto de encuentro en la base del cerro',
    ],
  },

  // Turismo
  {
    id: 'exp2',
    title: 'Clases de Cocina Regional',
    shortDescription: 'Aprende a preparar platos típicos de la zona.',
    longDescription:
      'Sumérgete en los sabores locales con nuestras clases de cocina. Un chef experto te guiará en la preparación de platos tradicionales utilizando ingredientes frescos de la región. Al finalizar, disfrutarás de una degustación de todo lo preparado.',
    images: [
      'https://images.unsplash.com/photo-1556911220-bff31c812dba?q=80&w=2568&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1604382354936-07c5d9983d34?q=80&w=2670&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=2670&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1551218808-94e220e084d2?q=80&w=2574&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1484723050470-7e3b625c3873?q=80&w=2670&auto=format&fit=crop',
    ],
    category: 'Turismo',
    whatYouShouldKnow: [
      'Clase de 3 horas con degustación',
      'Grupos reducidos (máximo 8 personas)',
      'Incluye todos los ingredientes y recetario',
      'Informar sobre alergias o restricciones alimentarias',
    ],
  },
  {
    id: 'exp5',
    title: 'Visita a Bodegas',
    shortDescription: 'Degusta los mejores vinos de la región.',
    longDescription:
      'Un recorrido por las bodegas más prestigiosas de la zona. Aprenderás sobre el proceso de elaboración del vino, desde la viña hasta la botella, y participarás en una cata guiada por un sommelier profesional. Incluye transporte y picada regional.',
    images: [
      'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=2670&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1529633052478-bc65f2c07528?q=80&w=2670&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1506377243576-64b812b16b5c?q=80&w=2670&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=2670&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1563090352-393ada423953?q=80&w=2670&auto=format&fit=crop',
    ],
    category: 'Turismo',
    whatYouShouldKnow: [
      'Tour de medio día (4 horas)',
      'Visita a 3 bodegas con degustación',
      'Transporte ida y vuelta incluido',
      'Solo para mayores de 18 años',
    ],
  },
  {
    id: 'exp8',
    title: 'Tour Histórico por el Pueblo',
    shortDescription: 'Descubre los secretos y la historia local.',
    longDescription:
      'Un paseo a pie por el casco histórico del pueblo, donde un guía local te contará las historias, leyendas y anécdotas que se esconden en sus calles y edificios centenarios. Un viaje en el tiempo para entender la cultura de la región.',
    images: [
      'https://images.unsplash.com/photo-1555169062-013468b47731?q=80&w=2574&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1548345248-0275beb8219b?q=80&w=2670&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1569949381669-ecf31ae8e613?q=80&w=2574&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1552585267-8a507a15230d?q=80&w=2670&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1604035939209-55942702a6a3?q=80&w=2670&auto=format&fit=crop',
    ],
    category: 'Turismo',
    whatYouShouldKnow: [
      'Recorrido a pie de 1.5 horas',
      'Guía bilingüe (español/inglés)',
      'Se recomienda calzado cómodo',
      'Punto de encuentro: Plaza Principal',
    ],
  },
  {
    id: 'exp11',
    title: 'Feria de Artesanos',
    shortDescription: 'Encuentra piezas únicas y productos locales.',
    longDescription:
      'Visita la tradicional feria de artesanos, un espacio vibrante donde artistas y productores locales exhiben sus creaciones. Encontrarás desde tejidos y cerámica hasta dulces y licores regionales. Ideal para llevarse un recuerdo auténtico.',
    images: [
      'https://images.unsplash.com/photo-1555169062-013468b47731?q=80&w=2574&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1578845413453-53291f182ed1?q=80&w=2670&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1610011490143-a062d17973e9?q=80&w=2670&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1558818563-02b869ae3d39?q=80&w=2670&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1523431378533-2a183c1639a2?q=80&w=2670&auto=format&fit=crop',
    ],
    category: 'Turismo',
    whatYouShouldKnow: [
      'Abierta solo los fines de semana',
      'Ubicada en la plaza central del pueblo',
      'La mayoría de los puestos aceptan efectivo',
      'Ideal para comprar regalos y souvenirs',
    ],
  },

  // Zona de naturaleza
  {
    id: 'exp3',
    title: 'Senderismo al Atardecer',
    shortDescription: 'Disfruta de vistas panorámicas únicas.',
    longDescription:
      'Una caminata guiada por senderos de montaña para llegar a un mirador natural justo a tiempo para el atardecer. Serás testigo de un espectáculo de colores inolvidable mientras el sol se oculta detrás de las sierras. Incluye un brindis en la cima.',
    images: [
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=2774&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=2670&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?q=80&w=2670&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1433086966358-54859d0ed716?q=80&w=2574&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1426604966848-d7adac402bff?q=80&w=2670&auto=format&fit=crop',
    ],
    category: 'Zona de naturaleza',
    whatYouShouldKnow: [
      'Dificultad: Baja a Media',
      'Duración total: 3 horas',
      'Llevar abrigo y linterna para el descenso',
      'Incluye snack y bebida para el brindis',
    ],
  },
  {
    id: 'exp6',
    title: 'Avistaje de Aves',
    shortDescription: 'Conecta con la fauna local en su hábitat.',
    longDescription:
      'Acompañado por un guía ornitólogo, explorarás reservas naturales para identificar la gran diversidad de aves de la región. Una actividad ideal para amantes de la fotografía y la naturaleza, que te permitirá descubrir especies que no se ven en otros lugares.',
    images: [
      'https://images.unsplash.com/photo-1552728089-57bdde30beb3?q=80&w=2574&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1555169062-013468b47731?q=80&w=2574&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1474511320723-9a56873867b5?q=80&w=2672&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1534080564583-6be75777b70a?q=80&w=2670&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1563474218-16a44745a21c?q=80&w=2574&auto=format&fit=crop',
    ],
    category: 'Zona de naturaleza',
    whatYouShouldKnow: [
      'Salidas temprano por la mañana',
      'Incluye binoculares y guía de aves',
      'Se recomienda silencio para no espantar a las aves',
      'Caminata de baja intensidad',
    ],
  },
  {
    id: 'exp9',
    title: 'Paseo en Kayak por el Lago',
    shortDescription: 'Explora las aguas tranquilas y sus alrededores.',
    longDescription:
      'Navega a tu propio ritmo por las aguas cristalinas del lago, rodeado de un paisaje imponente. Podrás descubrir playas escondidas y disfrutar de la paz del entorno. Ofrecemos kayaks individuales y dobles, con todo el equipo de seguridad necesario.',
    images: [
      'https://images.unsplash.com/photo-1555169062-013468b47731?q=80&w=2574&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1559422323-b26d30972a3a?q=80&w=2670&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1572357182843-f878a7b33a10?q=80&w=2670&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2670&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1508669232494-837e4836c84c?q=80&w=2670&auto=format&fit=crop',
    ],
    category: 'Zona de naturaleza',
    whatYouShouldKnow: [
      'Alquiler por hora o por día',
      'Incluye kayak, remos y chaleco salvavidas',
      'No se necesita experiencia previa',
      'Ideal para disfrutar en familia o con amigos',
    ],
  },
  {
    id: 'exp12',
    title: 'Noche de Astroturismo',
    shortDescription: 'Observa las estrellas en un cielo despejado.',
    longDescription:
      'Lejos de la contaminación lumínica de la ciudad, nuestro cielo nocturno ofrece un espectáculo increíble. Un astrónomo aficionado te guiará en la identificación de constelaciones y planetas a simple vista y con telescopios profesionales.',
    images: [
      'https://images.unsplash.com/photo-1534237710431-e2fc698436d0?q=80&w=2574&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1506477335327-33cadd38c208?q=80&w=2669&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?q=80&w=2670&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1598192728501-a8672175a232?q=80&w=2651&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1464802686167-b939a6910659?q=80&w=2666&auto=format&fit=crop',
    ],
    category: 'Zona de naturaleza',
    whatYouShouldKnow: [
      'Actividad sujeta a condiciones climáticas',
      'Se realiza en noches de luna nueva para mejor visibilidad',
      'Llevar abrigo, incluso en verano',
      'Incluye una infusión caliente',
    ],
  },
];

async function connectWithRetry(config: ConnectionOptions, retries = 5, delay = 2000): Promise<mysql.Connection> {
  for (let i = 0; i < retries; i++) {
    try {
      const connection = await mysql.createConnection(config);
      console.log('Conexión a la base de datos establecida.');
      return connection;
    } catch (err) {
      console.log(`Intento de conexión ${i + 1} fallido. Reintentando en ${delay / 1000} segundos...`);
      if (i === retries - 1) throw err;
      await new Promise(res => setTimeout(res, delay));
    }
  }
  throw new Error('No se pudo conectar a la base de datos después de varios intentos.');
}

async function main() {
  const db = await connectWithRetry({
    host: '127.0.0.1',
    port: 3306,
    user: 'vagar_user',
    password: 'vagar_password',
    database: 'vagar_db',
  });

  // Limpiar y recrear la base de datos
  console.log('Limpiando y recreando la base de datos...');
  await db.execute('SET FOREIGN_KEY_CHECKS = 0;');
  await db.execute('DROP TABLE IF EXISTS PropertyAmenities;');
  await db.execute('DROP TABLE IF EXISTS Bookings;');
  await db.execute('DROP TABLE IF EXISTS Images;');
  await db.execute('DROP TABLE IF EXISTS PropertyRules;');
  await db.execute('DROP TABLE IF EXISTS Amenities;');
  await db.execute('DROP TABLE IF EXISTS Experiences;');
  await db.execute('DROP TABLE IF EXISTS Properties;');
  await db.execute('DROP TABLE IF EXISTS Testimonials;');
  await db.execute('DROP TABLE IF EXISTS Users;');
  await db.execute('SET FOREIGN_KEY_CHECKS = 1;');

  const initSqlPath = path.join(__dirname, '..', 'init.sql');
  const initSql = fs.readFileSync(initSqlPath, 'utf-8');
  const statements = initSql.split(/;\s*$/m);

  for (const statement of statements) {
    if (statement.trim().length > 0) {
      await db.query(statement);
    }
  }
  console.log('Esquema de la base de datos recreado exitosamente.');


  // Verificar si ya existe el usuario admin
const [rows] = await db.execute<RowDataPacket[]>(
  "SELECT * FROM Users WHERE email = ?",
  ['admin@vagar.com']
);

if (rows.length === 0) {
  const adminPasswordHash = '$2b$10$7fxnolE0gTw88FmTUpXHNO30nINqKOvdmsF21MHcOvwIse6XFrt46';
  await db.execute(
    "INSERT INTO Users (name, email, password, role) VALUES (?, ?, ?, ?)",
    ['Admin', 'admin@vagar.com', adminPasswordHash, 'admin']
  );
  console.log('Usuario administrador insertado.');
} else {
  console.log('El usuario administrador ya existe, no se insertó.');
}


  // Insertar Amenities
  for (const amenity of amenities) {
    await db.execute(
      'INSERT INTO Amenities (slug, name, category, icon) VALUES (?, ?, ?, ?)',
      [amenity.id, amenity.name, amenity.category, amenity.icon]
    );
  }
  console.log('Amenities insertados.');

  // Insertar Properties y sus relaciones
  for (const prop of properties) {
    const slug = slugify(prop.name);
    const [result] = await db.execute<ResultSetHeader>(
      `INSERT INTO Properties (name, slug, description, latitude, longitude, category, guests, bedrooms, beds, bathrooms, rating, price_high, price_mid, price_low, map_node_id, featured, video_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        prop.name,
        slug,
        prop.description,
        prop.latitude,
        prop.longitude,
        prop.category,
        prop.guests,
        prop.bedrooms,
        prop.beds,
        prop.bathrooms,
        prop.rating,
        prop.price_high,
        prop.price_mid,
        prop.price_low,
        prop.map_node_id,
        prop.featured || false,
        (prop as any).video_url || null,
      ]
    );
    const propertyId = result.insertId;

    // Insertar Imágenes de la propiedad (galería)
    for (let i = 0; i < prop.images.length; i++) {
      const imageUrl = prop.images[i];
      const [existingImageRows] = await db.execute<RowDataPacket[]>('SELECT id FROM Images WHERE url = ?', [imageUrl]);
      if (existingImageRows.length === 0) {
        await db.execute(
          'INSERT INTO Images (url, alt_text, entity_type, entity_id, `order`, image_category) VALUES (?, ?, ?, ?, ?, ?)',
          [imageUrl, prop.name, 'property', propertyId, i + 1, 'gallery']
        );
      }
    }

    // Insertar Imágenes de la propiedad (planos)
    if (prop.blueprint_images) {
      for (let i = 0; i < prop.blueprint_images.length; i++) {
        const imageUrl = prop.blueprint_images[i];
        const [existingImageRows] = await db.execute<RowDataPacket[]>('SELECT id FROM Images WHERE url = ?', [imageUrl]);
        if (existingImageRows.length === 0) {
          await db.execute(
            'INSERT INTO Images (url, alt_text, entity_type, entity_id, `order`, image_category) VALUES (?, ?, ?, ?, ?, ?)',
            [imageUrl, `${prop.name} - Plano`, 'property', propertyId, i + 1, 'blueprint']
          );
        }
      }
    }

    // Insertar Amenities de la propiedad
    if (prop.amenities) {
      for (const amenitySlug of prop.amenities) {
        const [amenityRows] = await db.execute<RowDataPacket[]>('SELECT id FROM Amenities WHERE slug = ?', [amenitySlug]);
        if (amenityRows.length > 0) {
          const amenity = amenityRows[0];
          await db.execute('INSERT INTO PropertyAmenities (property_id, amenity_id) VALUES (?, ?)', [propertyId, amenity.id]);
        } else {
          console.warn(`ADVERTENCIA: No se encontró el amenity con slug "${amenitySlug}" en la base de datos. Saltando...`);
        }
      }
    }
  }
  console.log('Propiedades y sus relaciones insertadas.');

  // Insertar Experiences y sus imágenes
  for (const exp of experiences) {
    const slug = slugify(exp.title);
    const [result] = await db.execute<ResultSetHeader>(
      'INSERT INTO Experiences (title, slug, category, short_description, long_description, what_to_know) VALUES (?, ?, ?, ?, ?, ?)',
      [
        exp.title,
        slug,
        exp.category,
        exp.shortDescription,
        exp.longDescription,
        JSON.stringify(exp.whatYouShouldKnow),
      ]
    );
    const experienceId = result.insertId;

    for (let i = 0; i < exp.images.length; i++) {
      const imageUrl = exp.images[i];
      const [existingImageRows] = await db.execute<RowDataPacket[]>('SELECT id FROM Images WHERE url = ?', [imageUrl]);
      if (existingImageRows.length === 0) {
        await db.execute(
          'INSERT INTO Images (url, alt_text, entity_type, entity_id, `order`) VALUES (?, ?, ?, ?, ?)',
          [imageUrl, exp.title, 'experience', experienceId, i + 1]
        );
      }
    }
  }
  console.log('Experiencias y sus imágenes insertadas.');

  await db.end();
  console.log('Conexión a la base de datos cerrada.');
}

main().catch((err) => {
  console.error(
    'Ocurrió un error durante el seeding de la base de datos:',
    err
  );
  process.exit(1);
});

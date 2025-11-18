import { createClient } from '@supabase/supabase-js';

// Obtener las variables de entorno de Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Validar que las variables de entorno estén definidas
if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Supabase URL and service role key must be defined in .env.local');
}

// Crear y exportar el cliente de Supabase
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default supabase;

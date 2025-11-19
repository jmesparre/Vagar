import { createClient } from '@supabase/supabase-js';

// Este cliente está destinado únicamente al uso del lado del servidor.
// No lo uses en componentes de cliente.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Validar que las variables de entorno estén definidas
if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Supabase URL and service role key must be defined in .env.local');
}

// Crear y exportar el cliente de Supabase para administración
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export default supabaseAdmin;

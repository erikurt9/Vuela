import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // eslint-disable-next-line no-console
  console.warn(
    "[vuela] Faltan VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY. Copia .env.example a .env y completa tus credenciales de Supabase."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Garantiza que exista una sesión (anónima) y devuelve el user id.
 * Supabase persiste la sesión en localStorage, así que el mismo
 * dispositivo/navegador reutiliza el mismo usuario entre visitas.
 *
 * Requiere habilitar "Anonymous sign-ins" en Authentication > Settings
 * dentro del panel de Supabase.
 */
export async function ensureAnonUser() {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.user) return session.user.id;

  const { data, error } = await supabase.auth.signInAnonymously();
  if (error) throw error;
  return data.user.id;
}

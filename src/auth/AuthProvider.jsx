import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase, ensureAnonUser } from "../supabaseClient";
import { AuthContext } from "./authContext";
import AuthModal from "../components/auth/AuthModal";
import ProfileDialog from "../components/auth/ProfileDialog";

// Evita crear dos usuarios anónimos si React monta el efecto dos veces (StrictMode).
let bootPromise = null;
function boot() {
  if (!bootPromise) bootPromise = ensureAnonUser().catch((e) => console.error("Auth:", e.message || e));
  return bootPromise;
}

function friendlyError(error) {
  const m = (error?.message || "").toLowerCase();
  if (m.includes("invalid login credentials")) return "Correo o contraseña incorrectos.";
  if (m.includes("already registered") || m.includes("already been registered")) return "Ya existe una cuenta con este correo. Inicia sesión.";
  if (m.includes("email not confirmed")) return "Debes confirmar tu correo antes de iniciar sesión. Revisa tu bandeja de entrada.";
  if (m.includes("rate limit") || m.includes("too many")) return "Demasiados intentos. Espera unos minutos e inténtalo de nuevo.";
  if (m.includes("password should be") || m.includes("weak")) return "La contraseña es demasiado débil. Usa al menos 8 caracteres.";
  if (m.includes("same password")) return "La nueva contraseña debe ser distinta a la anterior.";
  if (m.includes("provider is not enabled") || m.includes("unsupported provider")) return "El acceso con Google aún no está habilitado.";
  if (m.includes("failed to fetch") || m.includes("network")) return "No se pudo conectar. Revisa tu conexión a internet.";
  return error?.message || "Ocurrió un error inesperado. Inténtalo de nuevo.";
}

const actions = {
  async signIn({ email, password }) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error ? { error: friendlyError(error) } : { ok: true };
  },

  // Si hay una sesión anónima, la convierte en cuenta permanente para conservar el historial.
  async signUp({ name, email, password }) {
    const meta = { full_name: name };
    const { data: { session } } = await supabase.auth.getSession();

    if (session?.user?.is_anonymous) {
      const { data, error } = await supabase.auth.updateUser({ email, password, data: meta });
      if (error) return { error: friendlyError(error) };
      return { ok: true, needsConfirm: !!data.user?.is_anonymous || !!data.user?.new_email };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: meta, emailRedirectTo: window.location.origin },
    });
    if (error) return { error: friendlyError(error) };
    return { ok: true, needsConfirm: !data.session };
  },

  async signInWithGoogle() {
    const redirectTo = window.location.origin;
    const { data: { session } } = await supabase.auth.getSession();

    if (session?.user?.is_anonymous) {
      const { error } = await supabase.auth.linkIdentity({ provider: "google", options: { redirectTo } });
      if (!error) return { ok: true };
    }
    const { error } = await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo } });
    return error ? { error: friendlyError(error) } : { ok: true };
  },

  async sendResetEmail(email) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin });
    return error ? { error: friendlyError(error) } : { ok: true };
  },

  async updatePassword(password) {
    const { error } = await supabase.auth.updateUser({ password });
    return error ? { error: friendlyError(error) } : { ok: true };
  },

  async signOut() {
    await supabase.auth.signOut();
  },
};

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  const [modal, setModal] = useState({ open: false, view: "login" });
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    let alive = true;

    boot().then(async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (alive) {
        setUser(session?.user ?? null);
        setReady(true);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!alive) return;
      setUser(session?.user ?? null);
      if (event === "PASSWORD_RECOVERY") setModal({ open: true, view: "recovery" });
      if (event === "SIGNED_OUT") {
        // Deja siempre una sesión anónima lista para que la app siga guardando datos.
        bootPromise = null;
        setTimeout(() => { boot(); }, 0);
      }
    });

    return () => {
      alive = false;
      subscription.unsubscribe();
    };
  }, []);

  const openAuth = useCallback((view = "login") => setModal({ open: true, view }), []);
  const closeAuth = useCallback(() => setModal((m) => ({ ...m, open: false })), []);
  const setView = useCallback((view) => setModal({ open: true, view }), []);
  const openProfile = useCallback(() => setProfileOpen(true), []);
  const closeProfile = useCallback(() => setProfileOpen(false), []);

  const value = useMemo(() => {
    const isLoggedIn = !!user && !user.is_anonymous;
    const meta = user?.user_metadata || {};
    const email = user?.email || "";
    const displayName = isLoggedIn ? meta.full_name || meta.name || email.split("@")[0] || "Usuario" : "";
    return {
      user,
      userId: user?.id ?? null,
      ready,
      isLoggedIn,
      displayName,
      email,
      avatarUrl: isLoggedIn ? meta.avatar_url || meta.picture || null : null,
      openAuth,
      closeAuth,
      openProfile,
      ...actions,
    };
  }, [user, ready, openAuth, closeAuth, openProfile]);

  return (
    <AuthContext.Provider value={value}>
      {children}
      <AuthModal open={modal.open} view={modal.view} onViewChange={setView} onClose={closeAuth} />
      <ProfileDialog open={profileOpen} onClose={closeProfile} />
    </AuthContext.Provider>
  );
}

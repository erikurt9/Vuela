import { useEffect, useState } from "react";
import {
  X, Mail, User, LoaderCircle, History, ChartColumn, MonitorSmartphone,
  MailCheck, CircleAlert, ArrowLeft, KeyRound, ShieldCheck, Plane,
} from "lucide-react";
import { TextField, PasswordField } from "./FormField";
import { useAuth } from "../../auth/useAuth";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const COPY = {
  login: {
    title: "Inicia sesión",
    subtitle: "Inicia sesión para guardar tu progreso y estadísticas de preparación para la credencial RPAS.",
  },
  register: {
    title: "Crea tu cuenta",
    subtitle: "Regístrate para guardar tu progreso y estadísticas de preparación para la credencial RPAS.",
  },
  forgot: {
    title: "Recupera tu contraseña",
    subtitle: "Ingresa tu correo y te enviaremos un enlace para crear una contraseña nueva.",
  },
  recovery: {
    title: "Crea una nueva contraseña",
    subtitle: "Elige una contraseña segura para volver a acceder a tu cuenta.",
  },
};

const BENEFITS = [
  [History, "Historial de simulaciones", "Revisa cada examen y sesión de estudio que completes."],
  [ChartColumn, "Estadísticas por categoría", "Descubre en qué temas necesitas practicar más."],
  [MonitorSmartphone, "Retoma donde quedaste", "Continúa tu estudio desde cualquier dispositivo."],
];

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
    </svg>
  );
}

function ErrorAlert({ children }) {
  if (!children) return null;
  return (
    <div role="alert" className="flex items-start gap-2 rounded-xl border border-bad/40 bg-bad/10 p-3 text-sm text-bad">
      <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <span>{children}</span>
    </div>
  );
}

function SubmitButton({ loading, children }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white shadow-glow transition-all hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-sky disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading && <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />}
      {children}
    </button>
  );
}

function LinkButton({ onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="font-semibold text-brand-soft transition-all hover:text-ink hover:underline focus-visible:outline-2 focus-visible:outline-sky"
    >
      {children}
    </button>
  );
}

function GoogleSection() {
  const { signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handle() {
    setError("");
    setLoading(true);
    const res = await signInWithGoogle();
    if (res.error) {
      setError(res.error);
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={handle}
        disabled={loading}
        className="inline-flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold transition-all hover:border-white/25 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-sky disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? <LoaderCircle className="h-5 w-5 animate-spin" aria-hidden="true" /> : <GoogleIcon />}
        Continuar con Google
      </button>
      <ErrorAlert>{error}</ErrorAlert>
      <div className="flex items-center gap-3 text-xs uppercase tracking-wider text-ink-soft" aria-hidden="true">
        <span className="h-px flex-1 bg-white/10" />
        o con tu correo
        <span className="h-px flex-1 bg-white/10" />
      </div>
    </div>
  );
}

function Notice({ icon: Icon, title, children, onClose }) {
  return (
    <div className="py-4 text-center" role="status">
      <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-ok/15 text-ok">
        <Icon className="h-7 w-7" aria-hidden="true" />
      </span>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">{children}</p>
      <button
        type="button"
        onClick={onClose}
        className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-brand-hover"
      >
        Entendido
      </button>
    </div>
  );
}

function LoginForm({ go, onClose }) {
  const { signIn } = useAuth();
  const [f, setF] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    const next = {};
    if (!EMAIL_RE.test(f.email.trim())) next.email = "Ingresa un correo válido.";
    if (!f.password) next.password = "Ingresa tu contraseña.";
    setErrors(next);
    setFormError("");
    if (Object.keys(next).length) return;

    setLoading(true);
    const res = await signIn({ email: f.email.trim(), password: f.password });
    setLoading(false);
    if (res.error) setFormError(res.error);
    else onClose();
  }

  return (
    <>
      <GoogleSection />
      <form onSubmit={submit} noValidate className="mt-5 space-y-4">
        <TextField label="Correo electrónico" icon={Mail} type="email" name="email" autoComplete="email" placeholder="tu@correo.com" value={f.email} onChange={set("email")} error={errors.email} autoFocus />
        <PasswordField name="password" autoComplete="current-password" placeholder="Tu contraseña" value={f.password} onChange={set("password")} error={errors.password} />
        <div className="flex justify-end text-sm">
          <LinkButton onClick={() => go("forgot")}>¿Olvidaste tu contraseña?</LinkButton>
        </div>
        <ErrorAlert>{formError}</ErrorAlert>
        <SubmitButton loading={loading}>Ingresar</SubmitButton>
      </form>
      <p className="mt-6 text-center text-sm text-ink-soft">
        ¿No tienes cuenta? <LinkButton onClick={() => go("register")}>Regístrate</LinkButton>
      </p>
    </>
  );
}

function RegisterForm({ go, onClose }) {
  const { signUp } = useAuth();
  const [f, setF] = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sentTo, setSentTo] = useState("");
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    const next = {};
    if (f.name.trim().length < 2) next.name = "Ingresa tu nombre o apodo.";
    if (!EMAIL_RE.test(f.email.trim())) next.email = "Ingresa un correo válido.";
    if (f.password.length < 8) next.password = "Usa al menos 8 caracteres.";
    if (f.confirm !== f.password) next.confirm = "Las contraseñas no coinciden.";
    setErrors(next);
    setFormError("");
    if (Object.keys(next).length) return;

    setLoading(true);
    const res = await signUp({ name: f.name.trim(), email: f.email.trim(), password: f.password });
    setLoading(false);
    if (res.error) setFormError(res.error);
    else if (res.needsConfirm) setSentTo(f.email.trim());
    else onClose();
  }

  if (sentTo) {
    return (
      <Notice icon={MailCheck} title="Revisa tu correo" onClose={onClose}>
        Enviamos un enlace de confirmación a <span className="font-medium text-ink">{sentTo}</span>. Ábrelo para activar tu cuenta y luego inicia sesión.
      </Notice>
    );
  }

  return (
    <>
      <GoogleSection />
      <form onSubmit={submit} noValidate className="mt-5 space-y-4">
        <TextField label="Nombre completo o apodo" icon={User} name="name" autoComplete="name" placeholder="Ej: Camila Rojas" value={f.name} onChange={set("name")} error={errors.name} autoFocus />
        <TextField label="Correo electrónico" icon={Mail} type="email" name="email" autoComplete="email" placeholder="tu@correo.com" value={f.email} onChange={set("email")} error={errors.email} />
        <PasswordField name="password" autoComplete="new-password" placeholder="Mínimo 8 caracteres" value={f.password} onChange={set("password")} error={errors.password} />
        <PasswordField label="Confirmar contraseña" name="confirm" autoComplete="new-password" placeholder="Repite tu contraseña" value={f.confirm} onChange={set("confirm")} error={errors.confirm} />
        <ErrorAlert>{formError}</ErrorAlert>
        <SubmitButton loading={loading}>Crear cuenta</SubmitButton>
      </form>
      <p className="mt-6 text-center text-sm text-ink-soft">
        ¿Ya tienes cuenta? <LinkButton onClick={() => go("login")}>Inicia sesión</LinkButton>
      </p>
    </>
  );
}

function ForgotForm({ go, onClose }) {
  const { sendResetEmail } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setFormError("");
    if (!EMAIL_RE.test(email.trim())) {
      setError("Ingresa un correo válido.");
      return;
    }
    setError("");
    setLoading(true);
    const res = await sendResetEmail(email.trim());
    setLoading(false);
    if (res.error) setFormError(res.error);
    else setSent(true);
  }

  if (sent) {
    return (
      <Notice icon={MailCheck} title="Enlace enviado" onClose={onClose}>
        Si existe una cuenta con <span className="font-medium text-ink">{email.trim()}</span>, recibirás un correo con instrucciones para crear una contraseña nueva.
      </Notice>
    );
  }

  return (
    <>
      <form onSubmit={submit} noValidate className="space-y-4">
        <TextField label="Correo electrónico" icon={Mail} type="email" name="email" autoComplete="email" placeholder="tu@correo.com" value={email} onChange={(e) => setEmail(e.target.value)} error={error} autoFocus />
        <ErrorAlert>{formError}</ErrorAlert>
        <SubmitButton loading={loading}>Enviar enlace</SubmitButton>
      </form>
      <button
        type="button"
        onClick={() => go("login")}
        className="mx-auto mt-6 flex items-center gap-2 text-sm font-semibold text-brand-soft transition-all hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Volver a iniciar sesión
      </button>
    </>
  );
}

function RecoveryForm({ onClose }) {
  const { updatePassword } = useAuth();
  const [f, setF] = useState({ password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    const next = {};
    if (f.password.length < 8) next.password = "Usa al menos 8 caracteres.";
    if (f.confirm !== f.password) next.confirm = "Las contraseñas no coinciden.";
    setErrors(next);
    setFormError("");
    if (Object.keys(next).length) return;

    setLoading(true);
    const res = await updatePassword(f.password);
    setLoading(false);
    if (res.error) setFormError(res.error);
    else setDone(true);
  }

  if (done) {
    return (
      <Notice icon={ShieldCheck} title="Contraseña actualizada" onClose={onClose}>
        Ya puedes seguir practicando con tu cuenta.
      </Notice>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      <PasswordField label="Nueva contraseña" name="password" autoComplete="new-password" placeholder="Mínimo 8 caracteres" value={f.password} onChange={set("password")} error={errors.password} autoFocus />
      <PasswordField label="Confirmar contraseña" name="confirm" autoComplete="new-password" placeholder="Repite tu contraseña" value={f.confirm} onChange={set("confirm")} error={errors.confirm} />
      <ErrorAlert>{formError}</ErrorAlert>
      <SubmitButton loading={loading}>Guardar contraseña</SubmitButton>
    </form>
  );
}

export default function AuthModal({ open, view, onViewChange, onClose }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  const copy = COPY[view] || COPY.login;

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-end justify-center overflow-y-auto bg-black/70 backdrop-blur-sm sm:items-center sm:p-6"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-title"
        className="relative grid w-full max-w-4xl animate-rise overflow-hidden rounded-t-3xl border border-white/10 bg-surface shadow-card sm:rounded-3xl md:grid-cols-[5fr_6fr]"
      >
        <aside className="relative hidden flex-col justify-between gap-10 overflow-hidden bg-linear-to-br from-brand/30 via-surface-2 to-canvas p-10 md:flex">
          <div>
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand shadow-glow">
                <Plane className="h-5 w-5 text-white" aria-hidden="true" />
              </span>
              <span className="text-xl font-bold tracking-tight">Vuela</span>
            </div>
            <h2 className="mt-10 text-2xl font-bold leading-snug tracking-tight">
              Tu preparación RPAS, siempre contigo
            </h2>
            <ul className="mt-8 space-y-5">
              {BENEFITS.map(([Icon, title, desc]) => (
                <li key={title} className="flex gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/10 text-sky">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{title}</p>
                    <p className="text-sm leading-relaxed text-ink-soft">{desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <p className="flex items-center gap-2 text-xs text-ink-soft">
            <ShieldCheck className="h-4 w-4 shrink-0" aria-hidden="true" />
            Solo tú puedes ver tu historial y tus estadísticas.
          </p>
        </aside>

        <div className="p-6 sm:p-8 md:p-10">
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-lg text-ink-soft transition-all hover:bg-white/5 hover:text-ink focus-visible:outline-2 focus-visible:outline-sky"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>

          <div className="mb-6 pr-8">
            {view === "recovery" && (
              <span className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-brand/15 text-brand-soft">
                <KeyRound className="h-5 w-5" aria-hidden="true" />
              </span>
            )}
            <h2 id="auth-title" className="text-2xl font-bold tracking-tight">{copy.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{copy.subtitle}</p>
          </div>

          {view === "login" && <LoginForm key="login" go={onViewChange} onClose={onClose} />}
          {view === "register" && <RegisterForm key="register" go={onViewChange} onClose={onClose} />}
          {view === "forgot" && <ForgotForm key="forgot" go={onViewChange} onClose={onClose} />}
          {view === "recovery" && <RecoveryForm key="recovery" onClose={onClose} />}
        </div>
      </div>
    </div>
  );
}

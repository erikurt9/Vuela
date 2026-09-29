import { useEffect } from "react";
import { X, Mail, CalendarDays, ShieldCheck, LogOut } from "lucide-react";
import Avatar from "./Avatar";
import { useAuth } from "../../auth/useAuth";

export default function ProfileDialog({ open, onClose }) {
  const { user, displayName, email, avatarUrl, signOut } = useAuth();

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

  if (!open || !user) return null;

  const providers = (user.identities || []).map((i) => i.provider);
  const access = providers.includes("google") ? "Google" : "Correo y contraseña";
  const since = user.created_at
    ? new Date(user.created_at).toLocaleDateString("es-CL", { day: "numeric", month: "long", year: "numeric" })
    : "—";

  const rows = [
    [Mail, "Correo", email || "—"],
    [ShieldCheck, "Método de acceso", access],
    [CalendarDays, "Cuenta creada", since],
  ];

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-end justify-center overflow-y-auto bg-black/70 backdrop-blur-sm sm:items-center sm:p-6"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-title"
        className="relative w-full max-w-md animate-rise rounded-t-3xl border border-white/10 bg-surface p-6 shadow-card sm:rounded-3xl sm:p-8"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-lg text-ink-soft transition-all hover:bg-white/5 hover:text-ink focus-visible:outline-2 focus-visible:outline-sky"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>

        <div className="flex flex-col items-center text-center">
          <Avatar name={displayName} url={avatarUrl} size="h-20 w-20" text="text-2xl" />
          <h2 id="profile-title" className="mt-4 text-xl font-bold tracking-tight">{displayName}</h2>
          <p className="mt-1 text-sm text-ink-soft">Tu progreso e historial se guardan en tu cuenta.</p>
        </div>

        <ul className="mt-6 divide-y divide-white/5 rounded-2xl border border-white/10 bg-canvas/40">
          {rows.map(([Icon, label, value]) => (
            <li key={label} className="flex items-center gap-3 px-4 py-3">
              <Icon className="h-4 w-4 shrink-0 text-sky" aria-hidden="true" />
              <span className="text-sm text-ink-soft">{label}</span>
              <span className="ml-auto truncate text-sm font-medium">{value}</span>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={async () => { await signOut(); onClose(); }}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-bad transition-all hover:border-bad/50 hover:bg-bad/10"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}

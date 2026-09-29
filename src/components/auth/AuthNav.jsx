import { useEffect, useRef, useState } from "react";
import { LogIn, LogOut, UserRound, ChevronDown } from "lucide-react";
import Avatar from "./Avatar";
import { useAuth } from "../../auth/useAuth";

export default function AuthNav() {
  const { ready, isLoggedIn, displayName, email, avatarUrl, openAuth, openProfile, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!ready) return <span className="h-9 w-24" aria-hidden="true" />;

  if (!isLoggedIn) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => openAuth("login")}
          className="inline-flex items-center gap-2 rounded-lg bg-brand px-3 py-2 text-sm font-semibold text-white transition-all hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-sky sm:hidden"
        >
          <LogIn className="h-4 w-4" aria-hidden="true" />
          Ingresar
        </button>
        <button
          onClick={() => openAuth("login")}
          className="hidden rounded-lg px-3 py-2 text-sm font-medium text-ink-soft transition-all hover:bg-white/5 hover:text-ink focus-visible:outline-2 focus-visible:outline-sky sm:inline-flex"
        >
          Iniciar sesión
        </button>
        <button
          onClick={() => openAuth("register")}
          className="hidden rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white shadow-glow transition-all hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-sky sm:inline-flex"
        >
          Registrarse
        </button>
      </div>
    );
  }

  const item =
    "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-all hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-sky";

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Menú de usuario"
        className="flex items-center gap-2 rounded-full border border-white/10 py-1 pl-1 pr-2 transition-all hover:border-white/25 focus-visible:outline-2 focus-visible:outline-sky md:pr-3"
      >
        <Avatar name={displayName} url={avatarUrl} size="h-8 w-8" text="text-xs" />
        <span className="hidden max-w-32 truncate text-sm font-medium md:block">{displayName}</span>
        <ChevronDown className={"h-4 w-4 text-ink-soft transition-transform " + (open ? "rotate-180" : "")} aria-hidden="true" />
      </button>

      {open && (
        <div role="menu" className="absolute right-0 top-full z-50 mt-2 w-64 animate-rise rounded-2xl border border-white/10 bg-surface p-2 shadow-card">
          <div className="border-b border-white/10 px-3 pb-3 pt-2">
            <p className="truncate text-sm font-semibold">{displayName}</p>
            <p className="truncate text-xs text-ink-soft">{email}</p>
          </div>
          <div className="pt-2">
            <button role="menuitem" className={item} onClick={() => { setOpen(false); openProfile(); }}>
              <UserRound className="h-4 w-4 text-sky" aria-hidden="true" />
              Mi perfil
            </button>
            <button role="menuitem" className={item + " text-bad"} onClick={() => { setOpen(false); signOut(); }}>
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

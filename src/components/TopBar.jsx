import { Plane, BookOpen, History } from "lucide-react";
import AuthNav from "./auth/AuthNav";

export default function TopBar({ onHome, onTemario, onHistorial, historyCount = 0 }) {
  const btn =
    "inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-ink-soft " +
    "transition-all hover:border-brand hover:bg-white/5 hover:text-ink " +
    "focus-visible:outline-2 focus-visible:outline-sky";

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-canvas/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 sm:px-6 md:px-12">
        <button onClick={onHome} className="flex items-center gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-sky">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand shadow-glow">
            <Plane className="h-5 w-5 text-white" aria-hidden="true" />
          </span>
          <span className="text-lg font-bold tracking-tight">Vuela</span>
        </button>

        <nav className="flex items-center gap-2" aria-label="Principal">
          {onTemario && (
            <button onClick={onTemario} className={btn} aria-label="Temario">
              <BookOpen className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Temario</span>
            </button>
          )}
          <button onClick={onHistorial} className={btn} aria-label="Historial">
            <History className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Historial</span>
            {historyCount > 0 && (
              <span className="rounded-full bg-brand/20 px-2 text-xs font-semibold text-brand-soft">{historyCount}</span>
            )}
          </button>
          <AuthNav />
        </nav>
      </div>
    </header>
  );
}

import { useId, useState } from "react";
import { CircleAlert, Eye, EyeOff, Lock } from "lucide-react";

export function TextField({ label, icon: Icon, error, hint, trailing, id, className = "", ...props }) {
  const auto = useId();
  const fid = id || auto;
  const msgId = fid + "-msg";

  return (
    <div className={className}>
      <label htmlFor={fid} className="mb-1.5 block text-sm font-medium text-ink">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" aria-hidden="true" />
        )}
        <input
          id={fid}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error || hint ? msgId : undefined}
          className={
            "w-full rounded-xl border bg-canvas/60 py-3 text-[15px] text-ink outline-none transition-all " +
            "placeholder:text-ink-soft/60 " +
            (Icon ? "pl-10 " : "pl-4 ") +
            (trailing ? "pr-12 " : "pr-4 ") +
            (error
              ? "border-bad focus:ring-2 focus:ring-bad/30"
              : "border-white/10 hover:border-white/20 focus:border-brand focus:ring-2 focus:ring-brand/30")
          }
          {...props}
        />
        {trailing}
      </div>
      {error ? (
        <p id={msgId} className="mt-1.5 flex items-center gap-1.5 text-xs text-bad">
          <CircleAlert className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : hint ? (
        <p id={msgId} className="mt-1.5 text-xs text-ink-soft">{hint}</p>
      ) : null}
    </div>
  );
}

export function PasswordField({ label = "Contraseña", ...props }) {
  const [show, setShow] = useState(false);

  return (
    <TextField
      {...props}
      label={label}
      icon={Lock}
      type={show ? "text" : "password"}
      trailing={
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"}
          aria-pressed={show}
          className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-lg text-ink-soft transition-all hover:bg-white/5 hover:text-ink focus-visible:outline-2 focus-visible:outline-sky"
        >
          {show ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
        </button>
      }
    />
  );
}

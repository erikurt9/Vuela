import { Check, X, Lightbulb, ArrowRight, Flag } from "lucide-react";

// Cada estado fija el color del texto de forma explícita (sin prefijos de pantalla).
const OPTION_STYLE = {
  idle: "cursor-pointer border-white/10 bg-slate-800/60 text-slate-100 hover:border-brand/60 hover:bg-slate-700/60 hover:text-white",
  correct: "cursor-default border-emerald-500 bg-emerald-500/15 text-white",
  wrong: "cursor-default border-red-500 bg-red-500/15 text-white",
  muted: "cursor-default border-white/5 bg-slate-800/40 text-slate-100 opacity-60",
};

const BADGE_STYLE = {
  idle: "bg-slate-700 text-white group-hover:bg-brand",
  correct: "bg-emerald-600 text-white",
  wrong: "bg-red-600 text-white",
  muted: "bg-slate-700 text-white",
};

export default function QuestionCard({
  q, index, total, mode, selected, answered, showExp,
  onSelect, onShowExp, onNext, catColor, CatIcon,
}) {
  const isLast = index + 1 >= total;
  const isCorrect = selected === q.correct;

  const stateOf = (i) => {
    if (!answered) return "idle";
    if (i === q.correct) return "correct";
    if (i === selected) return "wrong";
    return "muted";
  };

  return (
    <article key={q.id} className="animate-rise rounded-2xl border border-white/10 bg-surface p-5 text-slate-100 shadow-card sm:p-8">
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider" style={{ color: catColor }}>
        <CatIcon className="h-4 w-4" aria-hidden="true" />
        Pregunta {index + 1} de {total} · {q.category}
      </p>

      <h2 className="mt-4 whitespace-pre-line font-serif text-lg leading-relaxed text-white sm:text-xl">{q.question}</h2>

      <div className="mt-6 space-y-3" role="group" aria-label="Opciones de respuesta">
        {q.options.map((opt, i) => {
          const s = stateOf(i);
          return (
            <button
              key={i}
              type="button"
              aria-disabled={answered}
              onClick={() => { if (!answered) onSelect(i); }}
              className={
                "group flex w-full appearance-none items-start gap-4 rounded-xl border-2 px-4 py-3.5 text-left " +
                "transition-all duration-150 focus-visible:outline-2 focus-visible:outline-sky " +
                OPTION_STYLE[s]
              }
            >
              <span className={"grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-bold transition-all " + BADGE_STYLE[s]}>
                {s === "correct" ? (
                  <Check className="h-4 w-4 text-white" aria-label="Correcta" />
                ) : s === "wrong" ? (
                  <X className="h-4 w-4 text-white" aria-label="Incorrecta" />
                ) : (
                  <span className="text-white">{String.fromCharCode(65 + i)}</span>
                )}
              </span>
              <span
                className={
                  "pt-1 text-[15px] leading-snug sm:text-base " +
                  (s === "correct" || s === "wrong" ? "text-white" : "text-slate-100 group-hover:text-white")
                }
              >
                {opt}
              </span>
            </button>
          );
        })}
      </div>

      {answered && (
        <div className="mt-6 space-y-4" aria-live="polite">
          <p className={"flex items-center gap-2 font-semibold " + (isCorrect ? "text-ok" : "text-bad")}>
            {isCorrect ? <Check className="h-5 w-5" aria-hidden="true" /> : <X className="h-5 w-5" aria-hidden="true" />}
            {isCorrect ? "¡Correcto!" : "Incorrecto"}
          </p>

          {mode === "exam" && !isCorrect && (
            <p className="rounded-xl border border-white/10 bg-surface-2 p-4 text-sm text-slate-300">
              Respuesta correcta: <span className="font-medium text-white">{q.options[q.correct]}</span>
            </p>
          )}

          {mode === "study" && !showExp && (
            <button
              type="button"
              onClick={onShowExp}
              className="inline-flex items-center gap-2 rounded-lg border border-insight/40 bg-insight/10 px-4 py-2 text-sm font-semibold text-insight transition-all hover:bg-insight/20"
            >
              <Lightbulb className="h-4 w-4" aria-hidden="true" />
              Ver explicación
            </button>
          )}

          {mode === "study" && showExp && (
            <section className="animate-rise rounded-r-xl border-l-4 border-insight bg-surface-2 p-5">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-insight">
                <Lightbulb className="h-4 w-4" aria-hidden="true" />
                Por qué es así
              </h3>
              <p className="mt-3 font-serif text-[17px] leading-relaxed text-slate-100">{q.explanation}</p>
              {!isCorrect && (
                <p className="mt-4 border-t border-white/10 pt-3 text-sm text-slate-300">
                  Recuerda: <span className="font-medium text-white">{q.options[q.correct]}</span>
                </p>
              )}
            </section>
          )}

          <button
            type="button"
            onClick={onNext}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3.5 font-semibold text-white shadow-glow transition-all hover:bg-brand-hover"
          >
            {isLast ? (mode === "exam" ? "Ver resultados" : "Finalizar") : "Siguiente pregunta"}
            {isLast ? <Flag className="h-4 w-4" aria-hidden="true" /> : <ArrowRight className="h-4 w-4" aria-hidden="true" />}
          </button>
        </div>
      )}
    </article>
  );
}

import { ArrowLeft, Save, Check, X } from "lucide-react";
import TopBar from "./TopBar";
import QuestionCard from "./QuestionCard";
import { CAT_ICONS, DEFAULT_CAT_ICON } from "./categoryMeta";

export default function QuizScreen({
  mode, questions, current, selected, answered, showExp, results, studyResults,
  catColor, onSelect, onShowExp, onNext, onExit, onHome, onHistorial, historyCount,
}) {
  const q = questions[current];
  const total = questions.length;
  const cc = catColor[q.category] || "#2f6fed";
  const CatIcon = CAT_ICONS[q.category] || DEFAULT_CAT_ICON;
  const isExam = mode === "exam";

  const statusOf = (i) => {
    if (isExam) return results[i] ? (results[i].correct ? "ok" : "bad") : null;
    const r = studyResults.find((x) => x.index === i);
    return r ? (r.correct ? "ok" : "bad") : null;
  };

  const dotStyle = {
    current: "border-brand bg-brand/15 text-brand-soft",
    ok: "border-ok/50 bg-ok/10 text-ok",
    bad: "border-bad/50 bg-bad/10 text-bad",
    none: "border-white/10 text-ink-soft",
  };

  const okCount = results.filter((r) => r.correct).length;
  const badCount = results.length - okCount;

  return (
    <div className="min-h-screen bg-canvas text-slate-100">
      <TopBar onHome={onHome} onHistorial={onHistorial} historyCount={historyCount} />

      <div className="border-b border-white/10 bg-surface/60">
        <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6">
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={onExit}
              className="inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-ink-soft transition-all hover:bg-white/5 hover:text-ink"
            >
              {isExam ? <ArrowLeft className="h-4 w-4" aria-hidden="true" /> : <Save className="h-4 w-4" aria-hidden="true" />}
              {isExam ? "Salir" : "Guardar y salir"}
            </button>
            <span
              className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold"
              style={{ color: cc, borderColor: cc + "55", backgroundColor: cc + "1a" }}
            >
              <CatIcon className="h-3.5 w-3.5" aria-hidden="true" />
              {q.category}
            </span>
            <span className="text-sm font-semibold tabular-nums text-ink-soft">{current + 1} / {total}</span>
          </div>
          <div
            className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={total}
            aria-valuenow={current + 1}
          >
            <div
              className={"h-full rounded-full transition-all duration-500 ease-out " + (isExam ? "bg-brand" : "bg-sky")}
              style={{ width: `${((current + 1) / total) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <main className="mx-auto grid max-w-6xl gap-6 px-4 py-6 sm:px-6 sm:py-10 lg:grid-cols-[minmax(0,1fr)_280px]">
        <QuestionCard
          q={q}
          index={current}
          total={total}
          mode={mode}
          selected={selected}
          answered={answered}
          showExp={showExp}
          onSelect={onSelect}
          onShowExp={onShowExp}
          onNext={onNext}
          catColor={cc}
          CatIcon={CatIcon}
        />

        <aside className="h-fit rounded-2xl border border-white/10 bg-surface p-5 shadow-card lg:sticky lg:top-24">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-soft">
            {isExam ? "Progreso del examen" : "Preguntas"}
          </h2>
          <div className="mt-4 grid grid-cols-5 gap-2">
            {questions.map((_, i) => {
              const st = statusOf(i);
              const s = i === current ? "current" : st || "none";
              return (
                <div
                  key={i}
                  aria-label={`Pregunta ${i + 1}${st === "ok" ? ": correcta" : st === "bad" ? ": incorrecta" : ""}`}
                  className={"grid h-9 place-items-center rounded-lg border text-xs font-semibold tabular-nums transition-all " + dotStyle[s]}
                >
                  {i !== current && st === "ok" ? <Check className="h-3.5 w-3.5" aria-hidden="true" />
                    : i !== current && st === "bad" ? <X className="h-3.5 w-3.5" aria-hidden="true" />
                    : i + 1}
                </div>
              );
            })}
          </div>

          {isExam && (
            <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4 text-sm">
              <span className="flex items-center gap-1.5 font-semibold text-ok"><Check className="h-4 w-4" aria-hidden="true" />{okCount} <span className="font-normal text-ink-soft">correctas</span></span>
              <span className="flex items-center gap-1.5 font-semibold text-bad"><X className="h-4 w-4" aria-hidden="true" />{badCount} <span className="font-normal text-ink-soft">incorrectas</span></span>
            </div>
          )}
        </aside>
      </main>
    </div>
  );
}

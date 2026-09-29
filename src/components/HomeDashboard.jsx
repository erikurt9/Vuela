import {
  FileText, Clock, CheckCircle2, GraduationCap, UserCheck,
  ChevronRight, ExternalLink, PlayCircle, ArrowRight,
  Target, BookOpen, Timer, Trophy, Lightbulb, Layers,
} from "lucide-react";
import TopBar from "./TopBar";
import { CAT_ICONS, DEFAULT_CAT_ICON } from "./categoryMeta";

const CREDENTIAL = [
  [FileText, "Normativa", "Regulada por la DAN 151 y DAN 91"],
  [Clock, "Vigencia", "La credencial dura 24 meses"],
  [CheckCircle2, "Aprobación", "Mínimo 70% en el examen escrito oficial"],
  [GraduationCap, "Temario", "DAN 151, DAN 91, meteorología, aerodinámica y operaciones"],
  [UserCheck, "Requisito", "Mayor de 18 años con instrucción teórica y práctica certificada"],
];

const card = "rounded-2xl border border-white/10 bg-surface shadow-card";
const container = "mx-auto w-full max-w-[1440px] px-4 sm:px-6 md:px-12";

export default function HomeDashboard({
  totalQuestions, examSize, passScore, categories, catColor, catCounts,
  filterCat, setFilterCat, savedProgress, onResume, onDiscard,
  onStartExam, onStartStudy, onOpenTemario, onOpenHistorial,
  historyCount, biblio, onOpenDoc,
}) {
  const realCats = categories.filter((c) => c !== "Todas");

  const modes = [
    {
      key: "exam",
      Icon: Target,
      title: "Modo Examen",
      desc: "Simula el examen oficial. Sin ayudas durante la prueba y con el resultado al final.",
      chips: [
        [Timer, `${examSize} preguntas aleatorias`],
        [Trophy, `${passScore}% para aprobar`],
      ],
      cta: "Comenzar examen",
      onClick: onStartExam,
      wrap: "hover:border-brand/70 hover:shadow-glow",
      tile: "bg-brand/15 text-brand-soft",
      btn: "bg-brand text-white group-hover:bg-brand-hover",
    },
    {
      key: "study",
      Icon: BookOpen,
      title: "Modo Estudio",
      desc: "Aprende a tu ritmo. Recibes la explicación después de cada respuesta.",
      chips: [
        [Lightbulb, "Explicación en cada pregunta"],
        [Layers, filterCat === "Todas" ? "Todas las categorías" : filterCat],
      ],
      cta: "Comenzar a estudiar",
      onClick: () => onStartStudy(filterCat),
      wrap: "hover:border-sky/70 hover:shadow-glow-sky",
      tile: "bg-sky/15 text-sky",
      btn: "bg-sky text-canvas group-hover:brightness-110",
    },
  ];

  return (
    <div className="min-h-screen bg-canvas">
      <TopBar
        onHome={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        onTemario={() => onOpenTemario("Todas")}
        onHistorial={onOpenHistorial}
        historyCount={historyCount}
      />

      <main className={container + " py-8 md:py-12"}>
        <section className="mb-8 max-w-3xl animate-rise md:mb-10">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Prepara tu credencial RPAS</h1>
          <p className="mt-3 text-base leading-relaxed text-ink-soft md:text-lg">
            Simulador con {totalQuestions} preguntas y explicaciones detalladas. Elige cómo quieres practicar hoy.
          </p>
        </section>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
          {/* Columna principal */}
          <div className="min-w-0 space-y-6 lg:col-span-2 lg:space-y-8">
            {savedProgress && (
              <div className={card + " flex flex-wrap items-center justify-between gap-4 border-ok/40 bg-ok/10 p-5 animate-rise"}>
                <div>
                  <p className="flex items-center gap-2 font-semibold">
                    <PlayCircle className="h-5 w-5 text-ok" aria-hidden="true" />
                    Tienes una sesión de estudio sin terminar
                  </p>
                  <p className="mt-1 text-sm text-ink-soft">
                    Pregunta {Math.min((savedProgress.current || 0) + 1, savedProgress.questions?.length || 0)} de{" "}
                    {savedProgress.questions?.length || 0}
                    {savedProgress.category ? ` · ${savedProgress.category}` : ""}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={onDiscard}
                    className="rounded-lg border border-white/10 px-4 py-2 text-sm text-ink-soft transition-all hover:bg-white/5 hover:text-ink"
                  >
                    Descartar
                  </button>
                  <button
                    onClick={onResume}
                    className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-brand-hover"
                  >
                    Continuar <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            )}

            {/* Tarjetas de práctica */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
              {modes.map(({ key, Icon, title, desc, chips, cta, onClick, wrap, tile, btn }) => (
                <button
                  key={key}
                  type="button"
                  onClick={onClick}
                  className={
                    "group flex h-full flex-col rounded-2xl border border-white/10 bg-surface p-6 text-left shadow-card " +
                    "transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-sky md:p-8 " +
                    wrap
                  }
                >
                  <span className="flex items-center gap-4">
                    <span className={"grid h-14 w-14 shrink-0 place-items-center rounded-2xl " + tile}>
                      <Icon className="h-7 w-7" aria-hidden="true" />
                    </span>
                    <span className="text-xl font-semibold tracking-tight md:text-2xl">{title}</span>
                  </span>

                  <span className="mt-5 block text-[15px] leading-relaxed text-ink-soft md:text-base">{desc}</span>

                  <span className="mt-5 flex flex-wrap gap-2">
                    {chips.map(([ChipIcon, text]) => (
                      <span
                        key={text}
                        className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-ink-soft"
                      >
                        <ChipIcon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        {text}
                      </span>
                    ))}
                  </span>

                  <span className="mt-auto block pt-6">
                    <span
                      className={
                        "inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all " + btn
                      }
                    >
                      {cta}
                      <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
                    </span>
                  </span>
                </button>
              ))}
            </div>

            {/* Filtro por categoría */}
            <section className={card + " p-5 md:p-6"}>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-soft">Estudiar por categoría</h2>
                <button
                  onClick={() => onStartStudy(filterCat)}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-5 py-2.5 text-sm font-semibold transition-all hover:border-sky/60 hover:bg-sky/10"
                >
                  Estudiar {filterCat === "Todas" ? "todas las categorías" : filterCat}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {categories.map((cat) => {
                  const active = filterCat === cat;
                  const c = catColor[cat] || "#2f6fed";
                  return (
                    <button
                      key={cat}
                      aria-pressed={active}
                      onClick={() => setFilterCat(cat)}
                      style={active ? { borderColor: c, color: c, backgroundColor: c + "22" } : undefined}
                      className="rounded-full border border-white/10 px-4 py-1.5 text-sm text-ink-soft transition-all hover:border-white/30 hover:text-ink"
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Temario */}
            <section className={card + " p-5 md:p-6"}>
              <h2 className="text-lg font-semibold">Temario del examen</h2>
              <p className="mt-1 text-sm text-ink-soft">Revisa todas las preguntas y respuestas por categoría.</p>
              <ul className="mt-4 grid grid-cols-1 gap-x-8 md:grid-cols-2">
                {realCats.map((cat) => {
                  const Icon = CAT_ICONS[cat] || DEFAULT_CAT_ICON;
                  const c = catColor[cat] || "#2f6fed";
                  return (
                    <li key={cat} className="border-b border-white/5">
                      <button
                        onClick={() => onOpenTemario(cat)}
                        className="group flex w-full items-center gap-3 rounded-lg px-2 py-3 text-left transition-all hover:bg-white/5"
                      >
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg" style={{ backgroundColor: c + "22", color: c }}>
                          <Icon className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <span className="flex-1 font-medium">{cat}</span>
                        <span className="text-sm text-ink-soft">{catCounts[cat]} preguntas</span>
                        <ChevronRight className="h-4 w-4 text-ink-soft transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          </div>

          {/* Panel lateral informativo */}
          <aside className="min-w-0 space-y-6 lg:col-span-1 lg:space-y-8">
            <section className={card + " p-5 md:p-6"}>
              <h2 className="text-lg font-semibold">Credencial RPAS</h2>
              <ul className="mt-4 space-y-4">
                {CREDENTIAL.map(([Icon, title, desc]) => (
                  <li key={title} className="flex gap-3">
                    <Icon className="mt-0.5 h-5 w-5 shrink-0 text-sky" aria-hidden="true" />
                    <div>
                      <p className="text-sm font-semibold">{title}</p>
                      <p className="text-sm leading-relaxed text-ink-soft">{desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <section className={card + " p-5 md:p-6"}>
              <h2 className="text-lg font-semibold">Bibliografía oficial</h2>
              <p className="mt-1 text-sm text-ink-soft">Se abre en esta misma pantalla.</p>
              <ul className="mt-3 space-y-1">
                {biblio.map((b) => (
                  <li key={b.title}>
                    <button
                      onClick={() => onOpenDoc(b)}
                      className="group flex w-full items-start gap-3 rounded-lg px-2 py-2.5 text-left transition-all hover:bg-white/5"
                    >
                      <FileText className="mt-0.5 h-4 w-4 shrink-0 text-ink-soft" aria-hidden="true" />
                      <span className="flex-1">
                        <span className="block text-sm font-medium">{b.title}</span>
                        <span className="block text-xs text-ink-soft">{b.desc}</span>
                      </span>
                      <ExternalLink className="mt-1 h-3.5 w-3.5 text-ink-soft opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          </aside>
        </div>
      </main>

      <footer className="border-t border-white/10 py-6 text-center text-sm text-ink-soft">
        Vuela — Simulador de práctica RPAS · Sin registro requerido
      </footer>
    </div>
  );
}

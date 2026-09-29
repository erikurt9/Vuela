import { Target, BookOpen, ArrowRight, Timer, Trophy, Lightbulb, Layers } from "lucide-react";

export default function ModeCards({ examSize, passScore, filterCat, onExam, onStudy }) {
  const cards = [
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
      onClick: onExam,
      wrap: "hover:border-brand/70 hover:shadow-glow",
      tile: "bg-brand/15 text-brand-soft",
      ctaCls: "text-brand-soft",
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
      onClick: onStudy,
      wrap: "hover:border-sky/70 hover:shadow-glow-sky",
      tile: "bg-sky/15 text-sky",
      ctaCls: "text-sky",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {cards.map(({ key, Icon, title, desc, chips, cta, onClick, wrap, tile, ctaCls }) => (
        <button
          key={key}
          type="button"
          onClick={onClick}
          className={
            "group flex flex-col rounded-2xl border border-white/10 bg-surface p-6 text-left shadow-card " +
            "transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-sky " +
            wrap
          }
        >
          <span className={"mb-5 grid h-12 w-12 place-items-center rounded-xl " + tile}>
            <Icon className="h-6 w-6" aria-hidden="true" />
          </span>
          <span className="block text-xl font-semibold tracking-tight">{title}</span>
          <span className="mt-2 block text-[15px] leading-relaxed text-ink-soft">{desc}</span>
          <span className="mt-5 flex flex-wrap gap-2">
            {chips.map(([ChipIcon, text]) => (
              <span key={text} className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-ink-soft">
                <ChipIcon className="h-3.5 w-3.5" aria-hidden="true" />
                {text}
              </span>
            ))}
          </span>
          <span className={"mt-6 inline-flex items-center gap-2 text-sm font-semibold " + ctaCls}>
            {cta}
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
          </span>
        </button>
      ))}
    </div>
  );
}

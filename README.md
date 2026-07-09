<h1>
  <img src="https://unpkg.com/lucide-static@latest/icons/plane.svg" width="28" height="28" />
  Vuela — RPAS Exam Simulator
</h1>

A practice simulator for obtaining an RPAS (drone) operator credential in Chile. Study and practice with real questions based on DGAC regulations (DAN 91, DAN 151, Aeronautical Code, aviation meteorology, and more).

**[Live Demo](https://vuela-pied.vercel.app/)**

## <img src="https://unpkg.com/lucide-static@latest/icons/image.svg" width="20" height="20" /> Screenshots

<!-- Replace these paths with actual images, e.g. screenshots/home.png -->
| Home | Exam Mode | History |
|---|---|---|
| ![Home](screenshots/home.png) | ![Exam](screenshots/exam.png) | ![History](screenshots/history.png) |

## <img src="https://unpkg.com/lucide-static@latest/icons/list-checks.svg" width="20" height="20" /> Features

- **Exam Mode**: timed mock exam with randomized questions, requires 75% to pass, no explanations until the end (matching the real exam format).
- **Study Mode**: practice by category with immediate explanations after each answer.
- **Progress saving**: leave a study session halfway through and resume exactly where you left off — progress saves automatically, and can also be forced with the "Save & Exit" button.
- **Persistent history**: every exam and study session gets logged (score, weakest category, date), synced to the cloud via Supabase.
- **Weak category detection**: after each session, the app identifies your weakest category and suggests reviewing it.
- **Built-in syllabus**: browse all questions and correct answers in read-only mode, without taking an exam.
- **67 official questions** across 7 categories: DAN 151, Meteorology, Aerodynamics, DAN 91, Aeronautical Code, Regulations, and Criminal Code.

## <img src="https://unpkg.com/lucide-static@latest/icons/wrench.svg" width="20" height="20" /> Tech stack

- **React 19** + **Vite** — fast, lightweight SPA.
- **Capacitor** — native Android packaging.
- **Supabase** — backend for history and progress, with anonymous authentication and Row Level Security (each user can only access their own data).

## <img src="https://unpkg.com/lucide-static@latest/icons/package.svg" width="20" height="20" /> Installation

```bash
git clone https://github.com/erikurt9/Vuela.git
cd Vuela
npm install
```

Copy `.env.example` to `.env` and fill in your Supabase credentials:

```bash
cp .env.example .env
```

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-publishable-key
```

### Supabase setup

1. Create a project at [supabase.com](https://supabase.com).
2. Enable **Authentication → Sign In / Providers → Allow anonymous sign-ins**.
3. Run the `supabase/migration.sql` script in your project's SQL Editor.

## <img src="https://unpkg.com/lucide-static@latest/icons/terminal.svg" width="20" height="20" /> Development

```bash
npm run dev       # development server
npm run build     # production build
npm run preview   # preview the build
```

### Android build (Capacitor)

```bash
npm run build
npx cap sync android
npx cap open android
```

## <img src="https://unpkg.com/lucide-static@latest/icons/file-text.svg" width="20" height="20" /> License

This project is for personal/educational use. Question content is based on publicly available DGAC Chile regulations.
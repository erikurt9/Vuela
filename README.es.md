<h1>
  <img src="https://unpkg.com/lucide-static@latest/icons/plane.svg" width="28" height="28" />
  Vuela — Simulador de Examen RPAS
</h1>

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-Bundler-646CFF?logo=vite)
![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?logo=supabase)

Simulador de práctica para obtener la licencia de operador RPAS (drone) en Chile. Estudia y practica con preguntas reales basadas en la normativa DGAC (DAN 91, DAN 151, Código Aeronáutico, meteorología aeronáutica, y más).

**[Ver Demo en vivo](https://vuela-pied.vercel.app/)**

> Este proyecto nació de mi propia experiencia sacando la licencia de operador de drones: no encontré una herramienta que simulara bien el formato real del examen, así que construí una.

## <img src="https://unpkg.com/lucide-static@latest/icons/image.svg" width="20" height="20" /> Capturas de pantalla

| Inicio | Modo Examen | Historial |
|---|---|---|
| ![Inicio](screenshots/home.png) | ![Examen](screenshots/exam.png) | ![Historial](screenshots/history.png) |

## <img src="https://unpkg.com/lucide-static@latest/icons/list-checks.svg" width="20" height="20" /> Funcionalidades

- **Modo Examen**: examen simulado cronometrado con preguntas aleatorias, requiere 75% para aprobar, sin explicaciones hasta el final (igual que el examen real).
- **Modo Estudio**: practica por categoría con explicaciones inmediatas después de cada respuesta.
- **Guardado de progreso**: si dejas una sesión de estudio a la mitad, se guarda automáticamente y puedes retomarla justo donde la dejaste, o forzar el guardado con el botón "Guardar y Salir".
- **Historial persistente**: cada examen y sesión de estudio queda registrado (puntaje, categoría más débil, fecha), sincronizado en la nube vía Supabase.
- **Detección de categoría débil**: después de cada sesión, la app identifica tu categoría más débil y sugiere repasarla.
- **Temario integrado**: navega todas las preguntas y respuestas correctas en modo solo lectura, sin necesidad de rendir un examen.
- **67 preguntas oficiales** en 7 categorías: DAN 151, Meteorología, Aerodinámica, DAN 91, Código Aeronáutico, Reglamentos y Código Penal.

## <img src="https://unpkg.com/lucide-static@latest/icons/wrench.svg" width="20" height="20" /> Stack tecnológico

- **React 19** + **Vite** — SPA liviana y rápida.
- **Capacitor** — empaquetado nativo para Android.
- **Supabase** — backend para historial y progreso, con autenticación anónima y Row Level Security (cada usuario solo accede a sus propios datos).

## <img src="https://unpkg.com/lucide-static@latest/icons/package.svg" width="20" height="20" /> Instalación

```bash
git clone https://github.com/erikurt9/Vuela.git
cd Vuela
npm install
```

Copia `.env.example` a `.env` y completa tus credenciales de Supabase:

```bash
cp .env.example .env
```

```
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-clave-publica
```

### Configuración de Supabase

1. Crea un proyecto en [supabase.com](https://supabase.com).
2. Habilita **Authentication → Sign In / Providers → Allow anonymous sign-ins**.
3. Ejecuta el script `supabase/migration.sql` en el SQL Editor de tu proyecto.

## <img src="https://unpkg.com/lucide-static@latest/icons/terminal.svg" width="20" height="20" /> Desarrollo

```bash
npm run dev       # servidor de desarrollo
npm run build     # build de producción
npm run preview   # preview del build
```

### Build de Android (Capacitor)

```bash
npm run build
npx cap sync android
npx cap open android
```

## <img src="https://unpkg.com/lucide-static@latest/icons/file-text.svg" width="20" height="20" /> Licencia

Este proyecto está bajo licencia MIT — ver [LICENSE](./LICENSE). El contenido de las preguntas está basado en normativa pública de la DGAC Chile y se ofrece con fines educativos.

---

🇬🇧 *[Read this in English](./README.md)*
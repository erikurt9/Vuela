-- Ejecutar en Supabase: SQL Editor > New query
-- Requiere: Authentication > Settings > habilitar "Allow anonymous sign-ins"

-- 1) Historial de exámenes/sesiones de estudio finalizadas
create table if not exists public.vuela_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  mode text not null check (mode in ('exam', 'study')),
  date timestamptz not null default now(),
  pct int not null default 0,
  score int not null default 0,
  total int not null default 0,
  passed boolean,
  weak_cat text,
  weak_pct int,
  study_category text,
  cat_stats jsonb,
  results jsonb,
  incomplete boolean not null default false,
  progress text,
  created_at timestamptz not null default now()
);

create index if not exists vuela_history_user_id_date_idx
  on public.vuela_history (user_id, date desc);

alter table public.vuela_history enable row level security;

create policy "vuela_history_select_own"
  on public.vuela_history for select
  using (auth.uid() = user_id);

create policy "vuela_history_insert_own"
  on public.vuela_history for insert
  with check (auth.uid() = user_id);

create policy "vuela_history_delete_own"
  on public.vuela_history for delete
  using (auth.uid() = user_id);

-- 2) Progreso de una sesión de "Modo Estudio" en curso (una fila por usuario)
create table if not exists public.vuela_study_progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  questions jsonb not null,
  current int not null default 0,
  selected int,
  answered boolean not null default false,
  study_results jsonb not null default '[]'::jsonb,
  filter_cat text,
  category text,
  updated_at timestamptz not null default now()
);

alter table public.vuela_study_progress enable row level security;

create policy "vuela_progress_select_own"
  on public.vuela_study_progress for select
  using (auth.uid() = user_id);

create policy "vuela_progress_upsert_own"
  on public.vuela_study_progress for insert
  with check (auth.uid() = user_id);

create policy "vuela_progress_update_own"
  on public.vuela_study_progress for update
  using (auth.uid() = user_id);

create policy "vuela_progress_delete_own"
  on public.vuela_study_progress for delete
  using (auth.uid() = user_id);

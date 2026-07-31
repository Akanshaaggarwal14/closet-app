-- Calendar: one planned outfit per day per user.

create table if not exists public.scheduled_outfits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  outfit_id uuid not null references public.outfits (id) on delete cascade,
  date date not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, date)
);

create index if not exists scheduled_outfits_user_id_idx on public.scheduled_outfits (user_id);
create index if not exists scheduled_outfits_date_idx on public.scheduled_outfits (date);

alter table public.scheduled_outfits enable row level security;

create policy "Scheduled outfits are viewable by owner"
  on public.scheduled_outfits for select
  using (auth.uid() = user_id);

create policy "Scheduled outfits are insertable by owner"
  on public.scheduled_outfits for insert
  with check (auth.uid() = user_id);

create policy "Scheduled outfits are editable by owner"
  on public.scheduled_outfits for update
  using (auth.uid() = user_id);

create policy "Scheduled outfits are deletable by owner"
  on public.scheduled_outfits for delete
  using (auth.uid() = user_id);

drop trigger if exists on_scheduled_outfits_updated on public.scheduled_outfits;

create trigger on_scheduled_outfits_updated
  before update on public.scheduled_outfits
  for each row execute procedure public.handle_updated_at();

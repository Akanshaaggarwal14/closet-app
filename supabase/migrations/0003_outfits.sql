-- Outfit Studio: outfits + a join table linking them to clothing_items.
-- A join table (rather than a plain array of IDs) gives real referential
-- integrity — deleting a clothing item automatically removes it from any
-- outfit it was part of, instead of leaving a dangling reference.

create table if not exists public.outfits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists outfits_user_id_idx on public.outfits (user_id);

alter table public.outfits enable row level security;

create policy "Outfits are viewable by owner"
  on public.outfits for select
  using (auth.uid() = user_id);

create policy "Outfits are insertable by owner"
  on public.outfits for insert
  with check (auth.uid() = user_id);

create policy "Outfits are editable by owner"
  on public.outfits for update
  using (auth.uid() = user_id);

create policy "Outfits are deletable by owner"
  on public.outfits for delete
  using (auth.uid() = user_id);

drop trigger if exists on_outfits_updated on public.outfits;

create trigger on_outfits_updated
  before update on public.outfits
  for each row execute procedure public.handle_updated_at();

create table if not exists public.outfit_items (
  id uuid primary key default gen_random_uuid(),
  outfit_id uuid not null references public.outfits (id) on delete cascade,
  clothing_item_id uuid not null references public.clothing_items (id) on delete cascade,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  unique (outfit_id, clothing_item_id)
);

create index if not exists outfit_items_outfit_id_idx on public.outfit_items (outfit_id);
create index if not exists outfit_items_clothing_item_id_idx on public.outfit_items (clothing_item_id);

alter table public.outfit_items enable row level security;

-- outfit_items has no user_id of its own — ownership is checked through
-- the parent outfit row.
create policy "Outfit items are viewable by outfit owner"
  on public.outfit_items for select
  using (
    exists (
      select 1 from public.outfits o
      where o.id = outfit_id and o.user_id = auth.uid()
    )
  );

create policy "Outfit items are insertable by outfit owner"
  on public.outfit_items for insert
  with check (
    exists (
      select 1 from public.outfits o
      where o.id = outfit_id and o.user_id = auth.uid()
    )
  );

create policy "Outfit items are deletable by outfit owner"
  on public.outfit_items for delete
  using (
    exists (
      select 1 from public.outfits o
      where o.id = outfit_id and o.user_id = auth.uid()
    )
  );

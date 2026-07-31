-- Digital Closet: clothing items table + image storage bucket.
-- Category and Occasion are closed sets per the product spec — enforced
-- with check constraints so bad data can't slip in from any client.

create table if not exists public.clothing_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  category text not null check (
    category in ('Tops', 'Bottoms', 'Dresses', 'Shoes', 'Accessories')
  ),
  occasion text not null check (
    occasion in ('Casual', 'Outgoing', 'Formal', 'Party', 'Sports')
  ),
  -- Stored even though the UI defaults to "All Clothes" for now (weather/
  -- season-detection integration is deferred) — future season-aware
  -- filtering and AI features read from this column.
  seasons text[] not null default '{}' check (
    seasons <@ array['Spring', 'Summer', 'Fall', 'Winter']
  ),
  image_url text not null,
  image_path text not null,
  is_favorite boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists clothing_items_user_id_idx on public.clothing_items (user_id);
create index if not exists clothing_items_category_idx on public.clothing_items (category);

alter table public.clothing_items enable row level security;

create policy "Clothing items are viewable by owner"
  on public.clothing_items for select
  using (auth.uid() = user_id);

create policy "Clothing items are insertable by owner"
  on public.clothing_items for insert
  with check (auth.uid() = user_id);

create policy "Clothing items are editable by owner"
  on public.clothing_items for update
  using (auth.uid() = user_id);

create policy "Clothing items are deletable by owner"
  on public.clothing_items for delete
  using (auth.uid() = user_id);

drop trigger if exists on_clothing_items_updated on public.clothing_items;

create trigger on_clothing_items_updated
  before update on public.clothing_items
  for each row execute procedure public.handle_updated_at();

-- Storage bucket for clothing photos. Files are stored under
-- "<user_id>/<uuid>.<ext>" so folder-scoped policies below are sufficient
-- to isolate users from each other.
insert into storage.buckets (id, name, public)
values ('clothing-images', 'clothing-images', true)
on conflict (id) do nothing;

create policy "Clothing images are publicly readable"
  on storage.objects for select
  using (bucket_id = 'clothing-images');

create policy "Users can upload to their own clothing-images folder"
  on storage.objects for insert
  with check (
    bucket_id = 'clothing-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can update their own clothing-images"
  on storage.objects for update
  using (
    bucket_id = 'clothing-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can delete their own clothing-images"
  on storage.objects for delete
  using (
    bucket_id = 'clothing-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

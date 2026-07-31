-- Laundry Management: tracks wear/wash state per clothing item, and
-- whether each scheduled (past) outfit has already been reviewed for
-- laundry. No new table — extends the existing clothing_items and
-- scheduled_outfits tables per the product spec.

alter table public.clothing_items
  add column if not exists is_in_laundry boolean not null default false,
  add column if not exists last_worn date,
  add column if not exists last_washed date,
  add column if not exists wear_count integer not null default 0,
  add column if not exists laundry_since date;

alter table public.scheduled_outfits
  add column if not exists laundry_processed boolean not null default false;

create index if not exists clothing_items_is_in_laundry_idx
  on public.clothing_items (is_in_laundry);

create index if not exists scheduled_outfits_laundry_processed_idx
  on public.scheduled_outfits (laundry_processed);

-- Atomically bumps wear_count and sets last_worn for every item in a
-- processed outfit, without a fetch-then-update round trip per item.
-- security invoker (the default) means auth.uid() resolves to the calling
-- user via their existing session, so RLS-equivalent scoping is enforced
-- with the explicit user_id check below.
create or replace function public.mark_items_worn(item_ids uuid[], worn_date date)
returns void
language sql
as $$
  update public.clothing_items
  set wear_count = wear_count + 1,
      last_worn = worn_date
  where id = any(item_ids) and user_id = auth.uid();
$$;

-- Add multi-image support for stage source references.
-- Run this in Supabase SQL Editor or your migration pipeline.

alter table if exists public.stages
  add column if not exists source_image_urls text[] null;

update public.stages
set source_image_urls = array[source_image_url]::text[]
where source_image_url is not null
  and (source_image_urls is null or array_length(source_image_urls, 1) = 0);

create index if not exists idx_stages_source_image_urls
  on public.stages using gin (source_image_urls)
  where source_image_urls is not null;

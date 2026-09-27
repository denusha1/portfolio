-- Apply in the Supabase SQL editor. Protects direct anonymous inserts too.
create or replace function public.limit_contact_messages()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
begin
  -- Serialize concurrent submissions from the same email across all workers.
  perform pg_advisory_xact_lock(hashtextextended(lower(trim(new.email)), 0));
  if exists (
    select 1 from public.contact_messages
    where lower(trim(email)) = lower(trim(new.email))
      and created_at > clock_timestamp() - interval '1 minute'
  ) then
    raise exception 'Please wait before sending another message.';
  end if;
  new.created_at := clock_timestamp();
  new.handled := false;
  return new;
end;
$$;
revoke all on function public.limit_contact_messages() from public;
drop trigger if exists contact_message_limit on public.contact_messages;
create trigger contact_message_limit
before insert on public.contact_messages
for each row execute function public.limit_contact_messages();
create index if not exists contact_messages_sender_date_idx
on public.contact_messages (lower(trim(email)), created_at desc);

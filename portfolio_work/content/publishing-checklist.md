# Remaining publishing inputs

- Apply `db/migrations/20260927_contact_limits.sql` in Supabase. The API already limits attempts per server process; this migration adds a durable per-email limit across workers and direct database inserts. Neither is a complete substitute for a production edge/WAF rate limit.
- Supply actual project screenshots and demo/repository URLs through the local project editor. Existing design studies are illustrative, not screenshots of the projects.
- Supply certificate names, issuers, dates and verification URLs before publishing certificate entries. Unspecified coursework has been removed from the credential archive.
- Contact submissions currently save to Supabase. Email notifications require a configured email provider and verified sender; none is configured in this workspace. Direct email remains available in the contact section. Do not paste provider secrets into chat or commit them.

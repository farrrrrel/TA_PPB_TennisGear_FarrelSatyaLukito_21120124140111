# Seed fixtures only — NOT the runtime database

The one-time JSON fixture `products.json` is moved here by the migration script.
The running Express API NEVER reads local JSON; all CRUD uses Supabase PostgreSQL.
The optional `npm run seed:supabase` imports fixtures into Supabase.
Do not run the seed command again on the production database without checking its effects.

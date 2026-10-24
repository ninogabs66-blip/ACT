# LocalDesk — Local-First React Native App

LocalDesk is a React Native + Expo task dashboard. It can save tasks on-device with AsyncStorage. An optional self-hosted Supabase/PostgreSQL backend is included as a development path.

## Features
- Create, complete, delete, search, and filter tasks
- Categories: Study, Work, Personal, Life
- Overview dashboard with completion statistics
- Device-local storage using AsyncStorage
- Optional Supabase integration scaffold
- JavaScript and JSX app screens

## Run the device-local app

```powershell
npm install
Copy-Item .env.example .env
npx expo start
```

Demo mode stores tasks on the current device. No account or remote database is required.

## Backend status: locked down by default

The SQL schema now **denies anonymous database access** and enables row-level security (RLS) policies that allow authenticated users to access only rows whose `user_id` matches their Supabase Auth user ID. The cleanup function is also scoped to the signed-in user's rows and is not executable by anonymous users.

**Important:** the current app UI does not yet include a sign-in/sign-up flow or pass an authenticated session. Therefore remote Supabase CRUD will not work with this secure schema until Supabase Auth is implemented in the app. The app should remain in device-local demo mode meanwhile. This is intentional: do not restore anonymous CRUD just to make the demo connect.

## Self-hosted Supabase

Use the official Docker deployment guide: https://supabase.com/docs/guides/self-hosting/docker

Keep Supabase Studio and database/admin ports private. Bind services to localhost or a trusted private network when possible, use a host firewall, and do not port-forward Supabase/Postgres/Studio to the internet. Set strong unique passwords and secrets in the Docker environment file. Do not commit that file.

Check the actual port mappings in your chosen Supabase Docker configuration; ports can vary by version.

## Configure the app

The client reads:
- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`

These are client-visible configuration values, not secrets. Never put the Supabase `service_role` key, database password, JWT secret, or other admin credentials in an Expo app or any `EXPO_PUBLIC_*` variable. A public anon/publishable key is safe to ship only when database grants and RLS policies are correctly restrictive.

Example local URLs (adjust for your actual port mappings):
- Android emulator: `http://10.0.2.2:8000`
- Physical phone on same Wi-Fi: `http://YOUR_PC_LAN_IP:8000`
- Web on the same PC: `http://localhost:8000`

Do not expose plain HTTP services over an untrusted network. For a deployed service, use HTTPS and an appropriately secured reverse proxy.

## Apply the secure schema

1. Back up any data you need before changing the database.
2. Open your local Supabase Studio SQL Editor.
3. Run `supabase/schema.sql`.
4. Verify that the `anon` role cannot select, insert, update, or delete rows.
5. Verify that a signed-in user can access only their own rows.
6. Add Supabase Auth to the app before enabling remote CRUD.

Existing rows from the old anonymous demo have no `user_id`. The migration does not assign those rows to anyone; they will be inaccessible under the new policies. Review/export any data you need before migration.

## Security checklist before any public deployment

- [ ] Implement sign-up, sign-in, sign-out, session persistence, and session expiry handling.
- [ ] Set `user_id` from the authenticated session; never trust a client-supplied owner ID.
- [ ] Keep RLS enabled and test cross-user read/update/delete attempts.
- [ ] Never ship service-role keys or database credentials in the app.
- [ ] Do not expose PostgreSQL, Studio, or admin endpoints publicly.
- [ ] Use HTTPS, firewall rules, backups, dependency updates, and monitoring.
- [ ] Validate input and enforce limits on the server/database.
- [ ] Add server-side rate limits where appropriate.
- [ ] If payments are ever added, verify payment events server-side and never trust client success messages.
- [ ] Run security tests and review logs before release.

No setup can guarantee that an app is impossible to hack. These changes reduce exposure, but the app is **not release-ready** until authentication is implemented and the checks above are tested.

## Current app tests

1. Open the dashboard.
2. Create, complete, search, filter, and delete local tasks.
3. Restart the app and confirm local tasks persist.
4. After adding Auth, test that user A cannot read, modify, or delete user B's tasks.
5. Test anonymous requests to the REST API and confirm they are denied.

# LocalDesk — Local-First React Native App

LocalDesk is a custom task dashboard built with **React Native + Expo**, with optional **self-hosted Supabase and PostgreSQL** running on your own Windows PC. It starts in demo mode, so no account or cloud project is required.

## Features
- Create, complete, delete, search, and filter tasks
- Categories: Study, Work, Personal, Life
- Overview dashboard with completion statistics
- Device-local demo storage using AsyncStorage
- Optional CRUD against a local Supabase database
- JavaScript and JSX; no TypeScript app screens

## Requirements
- Windows 10/11
- Node.js LTS (Node 20 or 22 recommended)
- Docker Desktop with WSL 2 enabled (only needed for local Supabase)
- Expo Go on Android, or Android Studio emulator

## 1. Run demo mode first

Open PowerShell in the project folder:

```powershell
npm install
Copy-Item .env.example .env
npx expo start
```

- **Android emulator:** press `a` in the Expo terminal.
- **Physical Android phone:** install Expo Go, connect phone and PC to the same Wi-Fi, then scan the QR code.
- Demo tasks are saved on that device. You do not need an account.

## 2. Start self-hosted Supabase on Windows

Use the official maintained Docker setup, which includes the API gateway, PostgreSQL, Studio, and supporting services.

In a separate PowerShell window:

```powershell
cd $HOME
git clone --depth 1 https://github.com/supabase/supabase
cd supabase/docker
Copy-Item .env.example .env
```

Start Docker Desktop. Review the generated `.env` and set strong local passwords/secrets as described by the official guide. Then:

```powershell
docker compose pull
docker compose up -d
docker compose ps
```

Official instructions and current required environment variables:
https://supabase.com/docs/guides/self-hosting/docker

**Ports vary by Supabase compose version.** Check the compose file and `.env` for the actual API and Studio port mappings rather than assuming defaults.

## 3. Create the tasks table

Open local Supabase Studio, then open **SQL Editor** and run all SQL in `supabase/schema.sql`.

This starter SQL enables anonymous demo CRUD for a trusted local development environment. Do not expose this setup to the public internet or store sensitive data in it.

## 4. Connect LocalDesk to local Supabase

Edit this project's `.env`:

- Android Studio emulator: `EXPO_PUBLIC_SUPABASE_URL=http://10.0.2.2:8000`
- Physical phone: `EXPO_PUBLIC_SUPABASE_URL=http://YOUR_PC_LAN_IP:8000`
- Expo web on the same PC: `EXPO_PUBLIC_SUPABASE_URL=http://localhost:8000`

Use the matching local `ANON_KEY` from your Supabase Docker `.env` as `EXPO_PUBLIC_SUPABASE_ANON_KEY`. **Never put `SERVICE_ROLE_KEY` in the app.**

Find your PC's local IP with:

```powershell
ipconfig
```

After changing `.env`, restart Expo:

```powershell
npx expo start --clear
```

Open the app's **Overview** tab. It should say **Local Supabase connected** when the URL, key, database table, and network access are correct. If the local backend is unavailable, the app uses device-local demo storage.

## 5. Test the app

1. Confirm the dashboard opens.
2. Add a task and select a category.
3. Mark the task complete; confirm the statistics update.
4. Search and filter tasks.
5. Delete a task.
6. Restart Expo and confirm device-local demo tasks persist.
7. Start local Supabase and configure `.env`.
8. Add a task and verify it appears in the `public.tasks` table in Studio.

## Troubleshooting

- **Phone cannot reach API:** use the PC's LAN IPv4 address, not `localhost`; both devices must be on the same Wi-Fi.
- **Android emulator cannot reach API:** use `10.0.2.2` for services hosted on the PC.
- **Connection refused:** confirm Docker is running and `docker compose ps` shows services up; verify the API port mapping.
- **Table missing:** run `supabase/schema.sql` in Studio's SQL Editor.
- **Expo uses old settings:** stop Expo and restart with `npx expo start --clear`.

## Security note

The provided SQL policy intentionally allows unauthenticated CRUD for a local demo. This is not production security. For multiple users or any network-exposed deployment, implement Supabase Auth and restrictive row-level security policies before use.

# Super Browns

An unofficial fan project — draft the best Cleveland Browns team from any era.

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Set up Supabase

In your Supabase project, go to the **SQL Editor** and run this to create the leaderboard table:

```sql
create table leaderboard (
  id bigint generated always as identity primary key,
  name text not null,
  record text not null,
  wins integer not null default 0,
  score integer not null,
  roster jsonb not null,
  created_at timestamptz default now()
);

alter table leaderboard enable row level security;

create policy "Anyone can read leaderboard"
  on leaderboard for select using (true);

create policy "Anyone can insert to leaderboard"
  on leaderboard for insert with check (true);
```

### 3. Add environment variables

Copy `.env.example` to `.env` and fill in your Supabase credentials:

```bash
cp .env.example .env
```

Find your credentials in Supabase under **Project Settings → API**:
- `VITE_SUPABASE_URL` → Project URL
- `VITE_SUPABASE_ANON_KEY` → anon / public key

### 4. Run locally
```bash
npm run dev
```

## Deploy to Vercel

1. Push this repo to GitHub
2. Import the repo in [Vercel](https://vercel.com)
3. Add the same two environment variables in Vercel under **Project Settings → Environment Variables**
4. Deploy — Vercel auto-detects Vite

Every push to `main` will auto-redeploy.

---

*Super Browns is an unofficial fan project with no affiliation to the Cleveland Browns or the NFL.*

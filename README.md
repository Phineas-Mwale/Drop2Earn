# Drop2Earn

Drop2Earn is a Zambia-focused digital platform for the recycling value chain. It connects collectors, collection points, verifiers, administrators and recyclers in one traceable workflow.

## User manual

For a full explanation of the platform, role permissions, operating procedures,
statuses, troubleshooting and deployment notes, see the
[Drop2Earn User Manual](./docs/Drop2Earn-User-Manual.pdf). The editable
[manual source](./docs/Drop2Earn-User-Manual.md) is kept alongside the PDF so
the documentation can be updated as the product evolves.

The current free public deployment is available at
[drop2earn-zambia.netlify.app](https://drop2earn-zambia.netlify.app). The
project is configured with `netlify.toml` and uses Netlify's Next.js runtime.

## Product workflow

```text
Collector records material
  -> Collection point verifies the actual weight
  -> Earnings are calculated
  -> Recycler reserves verified material
  -> Recycler requests pickup
  -> Admin confirms the physical handoff
  -> Admin marks the collector payout as paid
```

The application currently supports:

- Collector registration and collection recording
- Collection-point assignment and management
- Verifier and admin collection verification
- Database-calculated collection earnings
- Recycler supply discovery and reservations
- Reservation release and re-reservation
- Pickup requests and admin handoff completion
- Payout tracking with a completed-handoff requirement
- Professional paid receipts with print/save-as-PDF support
- Custom Excel exports for admin operations
- In-app notifications for verification, pickup, handoff and payout updates
- Role-protected pages
- Responsive desktop and mobile navigation
- Login routing is determined by the saved profile role; users cannot override a verifier, admin, collector or recycler role at sign-in

## Technology

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Supabase Auth, PostgreSQL and Row Level Security

## Requirements

- Node.js with npm
- A Supabase project
- A browser

## Local setup

Install dependencies:

```bash
npm install
```

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Use the Supabase project URL and the public anon key from **Project Settings → API**. Never place a Supabase service-role key in this application or expose it in the browser.

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Database setup

The migrations are in [`supabase/migrations`](./supabase/migrations). Run them in Supabase **SQL Editor**, one file at a time, in this order:

1. `001_collection_points.sql` — collection points and verifier assignment foundation
2. `002_admin_management.sql` — admin management policies and verifier assignment
3. `003_recycler_reservations.sql` — recycler reservations and verified supply
4. `004_recycler_reservation_management.sql` — reservation listing and release
5. `005_allow_re_reservation.sql` — allows a released collection to be reserved again
6. `006_pickup_completion.sql` — pickup requests and completed handoffs
7. `007_payout_tracking.sql` — payout status and admin payout actions
8. `008_fix_verifier_updates.sql` — corrective verifier update policy
9. `009_verify_collection_rpc.sql` — secure verification RPC
10. `010_require_completed_handoff_for_payout.sql` — requires a completed handoff before payout
11. `011_admin_user_management.sql` — secure admin role and verifier assignment management
12. `012_notifications.sql` — notification centre and workflow transition alerts

For each file:

1. Open Supabase **SQL Editor**.
2. Select **New query**.
3. Copy the entire migration file.
4. Paste it into the query editor.
5. Click **Run**.
6. Confirm that it completes without an error before continuing.

If the migrations have already been applied, do not rerun the earlier files unnecessarily. Run only a new migration that has not yet been applied.

## Initial roles and accounts

New accounts can register as collectors or recyclers. Verifier and admin accounts must be prepared by an existing administrator or directly in Supabase during MVP setup.

Before testing verification:

- Ensure the verifier profile has `role = 'verifier'`.
- Assign the verifier's `collection_point_id`.
- Ensure the admin profile has `role = 'admin'`.
- Ensure the recycler profile has `role = 'recycler'`.
- Ensure the collector profile has `role = 'collector'`.

The application routes users according to their profile role after login:

- Collector → `/dashboard`
- Recycler → `/recycler`
- Verifier → `/verification`
- Admin → `/verification`

Admins can open `/admin` to manage collection points, verifier assignments, handoffs and payouts.

## End-to-end test checklist

### Collector

1. Register or log in as a collector.
2. Open **Record Collection**.
3. Select an active collection point and material.
4. Submit an estimated weight.
5. Confirm the collection appears as pending.

### Verifier

1. Log in as a verifier assigned to the collection point.
2. Open `/verification`.
3. Open the pending collection.
4. Enter the measured weight and confirm verification.
5. Confirm that the collector sees the verified weight and earnings.

### Recycler

1. Log in as a recycler.
2. Open `/recycler`.
3. Reserve verified material.
4. Open **My reservations**.
5. Request pickup.

### Admin

1. Log in as an admin.
2. Open `/admin`.
3. Confirm the pickup request under **Material handoffs**.
4. Confirm that the reservation becomes `completed`.
5. Open **Collector payouts**.
6. Mark the eligible collection as paid.
7. Confirm that the collector dashboard displays `Paid`.

Payouts are intentionally blocked until a completed material handoff exists.

## Validation commands

Run these before deploying:

```bash
npm run lint
npm run build
```

To test the production build locally:

```bash
npm run build
npm run start
```

## Deployment

The application can be deployed to Vercel:

1. Push the repository to GitHub.
2. Import the repository into Vercel.
3. Add these environment variables in the Vercel project settings:

   ```text
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   ```

4. Deploy the project.
5. In Supabase **Authentication → URL Configuration**, set the production site URL to the deployed application URL.
6. Add the production URL to the allowed redirect URLs if Supabase Auth requires it.
7. Run the database migrations against the production Supabase project before inviting real users.
8. Test each role using non-production test accounts.

Do not commit `.env.local` or any secret key to Git. Only the public Supabase URL and anon key belong in the browser environment.

## Important operational notes

- Supabase table grants and RLS policies both affect access.
- Verifiers can only verify collections at their assigned collection point.
- Admins can view all collection points.
- A released reservation can be reserved again.
- A recycler cannot release a reservation after requesting pickup.
- Only admins can confirm handoffs and mark payouts as paid.
- Payouts require a completed handoff.
- Admin exports can include collection points, user roles, material handoffs and payouts.

## Project structure

```text
app/
  admin/                         Admin operations
  dashboard/                     Collector dashboard and collection form
  login/                         Login
  recycler/                      Recycler supply and reservations
  register/                      Account registration
  verification/                  Collection verification
components/                      Shared navigation, role and greeting components
lib/supabase.ts                  Shared browser Supabase client
supabase/migrations/             Ordered database migrations
```

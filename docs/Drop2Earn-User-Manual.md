---
title: "Drop2Earn User Manual"
subtitle: "A practical guide to the digital recycling value chain"
author: "Drop2Earn"
date: "October 2026"
geometry: margin=0.75in
fontsize: 10pt
documentclass: report
toc: true
toc-depth: 2
---

\newpage

# Welcome to Drop2Earn

Drop2Earn is a Zambia-focused digital platform for the recycling value chain. It connects people who collect recyclable materials with collection points, verifiers, administrators and recycling businesses.

The platform creates one traceable workflow:

```text
Collect material
      ↓
Submit an estimated weight
      ↓
Verify the actual weight
      ↓
Calculate earnings
      ↓
Reserve verified material
      ↓
Request pickup
      ↓
Confirm the physical handoff
      ↓
Release the collector payout
```

The purpose of Drop2Earn is to make recycling work more organised, measurable and rewarding while helping recyclers find verified material.

## What this manual covers

This manual explains:

- The four roles in Drop2Earn
- How to create an account and sign in
- How collectors record material and track earnings
- How verifiers confirm material and weight
- How recyclers reserve material and request pickup
- How administrators manage the platform
- How handoffs and payouts work
- What each status means
- Common problems and how to resolve them
- The technical setup required to operate the platform

## Important terminology

**Collection:** A record created when a collector submits recyclable material.

**Collection point:** An approved location or hub where material can be checked and weighed.

**Declared weight:** The collector's estimated weight at the time of submission.

**Verified weight:** The actual weight entered by an authorised verifier.

**Reservation:** A recycler's hold on one verified collection.

**Handoff:** The physical transfer of reserved material to a recycler.

**Payout:** The amount owed to a collector after the material has completed the required workflow.

# 1. Getting started

## Opening the application

Use the production address:

**https://drop2-earn.vercel.app**

The application works in a modern browser on a computer or phone. Use the main production address rather than temporary preview or deployment URLs.

## Creating an account

New users can create either a **Collector** or **Recycler** account.

1. Open the application.
2. Select **Get Started** or open the registration page.
3. Choose the account type:
   - **Collector** — collect material and track verified earnings.
   - **Recycler** — find and reserve verified material.
4. Enter your full name.
5. Enter your phone number using digits only.
6. Enter your location, such as Lusaka.
7. Create a password of at least six characters.
8. Submit the registration form.
9. Return to the login page and sign in.

Drop2Earn uses the phone number as the user's login identifier. Internally, the application converts the phone number into a private account identity; users still sign in with their phone number and password.

## Signing in

1. Open the login page.
2. Choose Collector or Recycler. This selection helps describe the intended workspace.
3. Enter the phone number used during registration.
4. Enter the password.
5. Select **Sign in**.

The application reads the user's saved role and sends the user to the correct workspace:

| Role | Main workspace |
|---|---|
| Collector | Collector dashboard |
| Recycler | Recycler workspace |
| Verifier | Verification Centre |
| Admin | Verification Centre and Admin workspace |

## Signing out

Use the sign-out control in the account navigation. On a phone, open the menu and select **Sign out**. Signing out safely ends the current Supabase session.

## Light and dark themes

Use the theme button in the header to switch between light and dark mode. The preference is saved in the current browser, so it remains selected the next time the user opens the application on that device.

# 2. Roles and permissions

## Collector

Collectors are the people who recover recyclable materials and submit collection records.

Collectors can:

- Register as a collector
- View their dashboard
- Record a new collection
- Choose an active collection point
- Select the material type
- Submit an estimated weight
- Add an optional collection date
- Add optional notes
- View pending and verified collections
- View verified weight and calculated earnings
- View payout status

Collectors cannot:

- Verify their own collections
- Change their own role
- Reserve material
- Complete a material handoff
- Mark a payout as paid

## Verifier

Verifiers are assigned to a collection point by an administrator.

Verifiers can:

- Open the Verification Centre
- View pending collections at their assigned collection point
- Check the material and actual weight
- Enter the verified weight
- Confirm a collection

Verifiers cannot:

- Verify collections at another collection point
- Verify a collection that is no longer pending
- Reserve material
- Complete handoffs
- Mark payouts as paid
- Change user roles

If a verifier has no assigned collection point, an administrator must assign one before verification can begin.

## Recycler

Recyclers are recycling businesses or operators looking for verified material.

Recyclers can:

- View verified material supply
- See material type, verified weight and location
- Reserve an available collection
- View their reservations
- Release a reservation while it is still reserved
- Request pickup for a reservation

Recyclers cannot:

- Reserve pending collections
- Reserve material already held by another recycler
- Release a reservation after requesting pickup
- Confirm the physical handoff
- Mark collector payouts as paid

## Administrator

Administrators operate the platform and support the other roles.

Admins can:

- Verify collections across all collection points
- Create collection points
- Activate or deactivate collection points
- View pending collection counts per point
- View users
- Change a user's role
- Assign verifiers to collection points
- View material handoffs
- Confirm pickup handoffs
- View eligible collector payouts
- Mark eligible payouts as paid
- Filter operational records
- Export operational data to Excel

Security rules prevent an administrator from changing their own role. A verifier must have a collection point assigned. When a user is changed to a non-verifier role, any verifier collection-point assignment is cleared.

# 3. Collector guide

## Recording a collection

1. Sign in as a Collector.
2. From the dashboard, select **Record collection**.
3. Select the material type:
   - PET Plastic
   - HDPE Plastic
   - Other Plastic
   - Cardboard
   - Paper
   - Aluminium
   - Glass
4. Enter the estimated weight in kilograms.
5. Select an active collection point.
6. Optionally enter the collection date.
7. Optionally add notes.
8. Review the information.
9. Submit the collection.

The record is created with the status **Pending verification**. The estimated weight is not the final payable weight.

## Understanding the collector dashboard

The dashboard shows:

- **Verified recovered:** total kilograms from verified collections
- **Total earnings:** earnings calculated from verified collections
- **Collections:** number of recorded transactions
- Collection history
- Verified or pending status
- Payout status

Only verified collections contribute to the verified-weight and earnings totals.

## What happens after submission?

After submission:

1. The selected collection point receives the pending collection.
2. An assigned verifier checks the actual material and weight.
3. The verified weight and rate are saved.
4. Earnings are calculated.
5. The verified collection becomes available to recyclers.
6. A recycler may reserve it.
7. The recycler requests pickup.
8. An administrator confirms the handoff.
9. The collection becomes eligible for payout.
10. An administrator marks the payout as paid.

## Payout rates used by the current MVP

The current demonstration rates are:

| Material | Rate per verified kilogram |
|---|---:|
| PET Plastic | K5 |
| HDPE Plastic | K4 |
| Other Plastic | K3 |
| Cardboard | K2 |
| Paper | K2 |
| Aluminium | K5 |
| Glass | K2 |

The calculation is:

```text
Verified weight × rate per kilogram = earnings
```

Example:

```text
10 kg of PET Plastic × K5 = K50
```

The verified weight, not the declared estimate, is used for the calculation.

# 4. Verifier guide

## Opening the Verification Centre

1. Sign in with a verifier account.
2. The application routes you to the Verification Centre.
3. Confirm that the page identifies your assigned collection point.
4. Review the list of pending collections.

An administrator sees collections from all collection points. A verifier sees only collections assigned to their own collection point.

## Verifying a collection

1. Select a pending collection.
2. Review the collector, material, declared weight and location.
3. Weigh or check the material using the approved process at the collection point.
4. Enter the actual verified weight in kilograms.
5. Select **Verify collection**.
6. Confirm the result.

The verified weight must be greater than zero. If the verified weight is greater than the declared weight, the application asks for confirmation before continuing.

After a successful verification:

- The collection leaves the pending list.
- The collection status becomes **Verified**.
- The verifier and verification time are recorded.
- The rate and earnings are saved.
- The collection can appear in the recycler supply list.

## Verification safeguards

The database checks that:

- The user is an admin or verifier.
- The collection is still pending.
- The verified weight is valid.
- A verifier is working within their assigned collection point.

# 5. Recycler guide

## Finding verified supply

1. Sign in as a Recycler.
2. Open the Recycler workspace.
3. Review **Verified material supply**.
4. Check the material type, weight, location and verification date.

Only verified collections that are not currently reserved are displayed as available supply.

## Reserving material

1. Find a suitable verified collection.
2. Select **Reserve**.
3. Confirm the reservation message.
4. Open **My reservations** to track it.

One collection can be reserved by only one recycler at a time.

## Releasing a reservation

If the recycler no longer wants the material:

1. Open **My reservations**.
2. Find a reservation with status **Reserved**.
3. Select **Release reservation**.
4. Confirm the action.

The material becomes available to other recyclers again. A reservation cannot be released after a pickup request has been made.

## Requesting pickup

1. Open **My reservations**.
2. Find the reservation with status **Reserved**.
3. Select **Request pickup**.
4. Coordinate the physical pickup through the platform's operating process.

The status changes to **Pickup requested**. An administrator must confirm the physical handoff.

# 6. Administrator guide

## Opening the Admin workspace

1. Sign in as an admin.
2. Open the Admin workspace from the navigation.
3. Wait for collection points, users, handoffs and payouts to load.

If the admin account is routed to the Verification Centre first, use the **Admin** link in the header.

## Managing collection points

### Add a collection point

1. Open the collection-point management area.
2. Enter the point name.
3. Enter the location.
4. Select **Add collection point**.

New points are available to collectors when active.

### Activate or deactivate a point

1. Find the collection point.
2. Select the active/inactive control.
3. Confirm the result.

Deactivating a point prevents it from being selected for new collector submissions. Existing records remain in the system.

### Search points

Use the collection-point search field to filter by name or location. Search and filters affect what is displayed; they do not delete or modify records.

## Managing users and roles

1. Open the Users area.
2. Search by name, phone or role if needed.
3. Choose the desired role.
4. If assigning **Verifier**, select a collection point.
5. Save the access change.

Available roles:

- Collector
- Recycler
- Verifier
- Admin

Important rules:

- A verifier must have a collection point.
- An administrator cannot change their own role.
- Non-verifier roles do not keep a collection-point assignment.
- Role changes affect the workspace available after the next login or access check.

## Confirming a material handoff

1. Open **Material handoffs**.
2. Find a reservation with status **Pickup requested**.
3. Confirm the physical transfer has actually taken place.
4. Select **Complete handoff**.

The reservation status becomes **Completed**. This is the event that makes the related collector collection eligible for payout.

Do not complete a handoff until the physical material transfer has been confirmed.

## Processing a payout

1. Open **Collector payouts**.
2. Review the collector, material, verified weight, earnings and status.
3. Confirm that the related handoff is completed.
4. Select **Mark as paid**.
5. Confirm the payment through the organisation's approved payment process.

Payout statuses are:

- **Pending:** not yet paid
- **Paid:** administrator has recorded the payout

The database blocks payout completion unless the collection is verified and has a completed material handoff.

## Downloading a paid receipt

After an administrator marks a payout as **Paid**:

1. The collector opens the **Dashboard**.
2. In transaction history, the collector selects **View receipt** beside the paid collection.
3. The collector reviews the receipt reference, verified material, weight, collection point, amount and payment date.
4. Select **Download / print receipt**.
5. Use the browser's print dialog and choose **Save as PDF** to keep a copy on the phone or computer.

The Drop2Earn receipt confirms the payout recorded by the platform. Once mobile-money payments are integrated, the mobile-money provider statement will remain the authoritative record of the actual funds transfer.

## Exporting operational data

The Admin workspace can export selected datasets as Excel files:

- Collection points
- User roles
- Material handoffs
- Collector payouts

1. Open the export controls.
2. Select the datasets to include.
3. Select **Export**.
4. Save the downloaded Excel workbook securely.

Search and status filters help with screen review. Confirm which datasets are selected before exporting.

# 7. Status reference

## Collection status

| Status | Meaning | Next action |
|---|---|---|
| Pending | Submitted by a collector and waiting for verification | Verifier checks the material |
| Verified | Actual weight and rate have been saved | Recycler may reserve it |

## Reservation status

| Status | Meaning | Next action |
|---|---|---|
| Reserved | Recycler has held the verified collection | Request pickup or release |
| Pickup requested | Recycler has asked for the physical handoff | Admin confirms the handoff |
| Completed | Admin confirmed the physical handoff | Collection may be paid |
| Released | Reservation was released before pickup | Material can be reserved again |

## Payout status

| Status | Meaning |
|---|---|
| Pending | Payment has not been recorded |
| Paid | Admin recorded the collector payout |

# 8. Complete operating procedure

Use this sequence when demonstrating or operating the full platform:

1. Admin creates and activates a collection point.
2. Admin assigns a verifier to that point.
3. Collector registers or signs in.
4. Collector records material, estimated weight and collection point.
5. Verifier signs in and sees the pending collection.
6. Verifier checks the material and enters the actual weight.
7. Drop2Earn calculates the collector earnings.
8. Recycler signs in and sees verified supply.
9. Recycler reserves the collection.
10. Recycler requests pickup.
11. Admin confirms the physical handoff.
12. Admin opens payouts and marks the eligible collection as paid.
13. Collector checks the dashboard and sees the updated payout status.

# 9. Troubleshooting

## I cannot sign in

- Confirm that you are using the same phone number used at registration.
- Enter digits only if the form requires digits only.
- Confirm the password.
- Check that you are using the correct role workspace.
- If the session has expired, sign in again.

## I cannot see a collection point

- The point may be inactive.
- Ask an administrator to confirm that it exists and is active.
- Refresh the page after an administrator changes the point.

## A verifier cannot see a collection

- Confirm that the collection is still pending.
- Confirm that the verifier is assigned to the same collection point.
- Ask an administrator to check the verifier assignment.

## A recycler cannot reserve material

- The collection may still be pending.
- Another recycler may already hold it.
- The collection may already be in a pickup or completed state.
- Refresh the verified supply list and try again.

## A recycler cannot release a reservation

Release is available only while the reservation status is **Reserved**. Once pickup has been requested, the administrator must handle the next step.

## A payout cannot be marked as paid

Confirm all of the following:

- The collection is verified.
- The material handoff status is **Completed**.
- The payout status is still **Pending**.
- The current user is an administrator.

## The app looks outdated after an update

Use the single production address:

**https://drop2-earn.vercel.app**

Refresh the page normally first. If a deployment was just completed, wait briefly for the production deployment to finish. Private browsing is useful only as a diagnostic check; it is not intended as a normal requirement.

# 10. Platform security and data handling

Drop2Earn uses Supabase Authentication, PostgreSQL and Row Level Security.

- Users only access the workspace allowed by their profile role.
- Collectors see their own collections.
- Verifiers are limited to their assigned collection point.
- Recyclers manage their own reservations.
- Admin operations use protected database functions.
- Role changes are protected against self-escalation.
- Payout and handoff operations are restricted to admins.
- The public browser uses only the Supabase URL and anon key.
- A Supabase service-role key must never be placed in browser code or committed to Git.

# 11. Technical setup for maintainers

## Requirements

- Node.js and npm
- A Supabase project
- A modern browser
- GitHub repository access for deployment

## Local configuration

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Install dependencies and start the application:

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Database migrations

Run the files in `supabase/migrations` once, in order:

1. Collection points
2. Admin management
3. Recycler reservations
4. Reservation management
5. Re-reservation after release
6. Pickup completion
7. Payout tracking
8. Verifier update correction
9. Secure verification function
10. Completed-handoff payout requirement
11. Admin user management

Run each migration in Supabase SQL Editor and confirm success before continuing. Do not rerun migrations unnecessarily.

## Validation before deployment

```bash
npm run lint
npm run build
```

## Production deployment

1. Push the repository to GitHub.
2. Import the repository into Vercel.
3. Add `NEXT_PUBLIC_SUPABASE_URL`.
4. Add `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
5. Deploy.
6. Set the production application URL in Supabase Authentication URL Configuration.
7. Add the production URL to the allowed redirect URLs if required.
8. Run all required migrations against the production Supabase project.
9. Test each role with non-production accounts.

# 12. Quick reference

## Collector

**Dashboard → Record Collection → Choose material → Enter estimated weight → Select collection point → Submit → Wait for verification → Track earnings and payout**

## Verifier

**Verification Centre → Select pending collection → Check actual weight → Enter verified weight → Verify**

## Recycler

**Recycler workspace → Review verified supply → Reserve → My reservations → Request pickup**

## Admin

**Admin workspace → Manage points and roles → Confirm handoff → Mark eligible payout paid → Export records**

## The central rule

**No verified collection, no recycler reservation. No completed handoff, no collector payout.**

---

Drop2Earn connects collection, verification, recycling and payment in one accountable workflow.

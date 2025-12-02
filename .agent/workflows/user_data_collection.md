---
description: Plan for collecting real user data, sending OTPs, and verifying emails using Supabase.
---

# User Data Collection & Verification Plan

This plan outlines the steps to implement real user authentication, data collection, and verification (Email & OTP) using Supabase.

## 1. Backend Setup (Supabase)

### A. Project Initialization
- Create a new Supabase project.
- Get `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

### B. Database Schema
Create a `profiles` table to store user data that extends the default `auth.users` table.

```sql
create table profiles (
  id uuid references auth.users on delete cascade,
  full_name text,
  phone_number text,
  address text,
  role text check (role in ('buyer', 'seller')),
  is_verified boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  primary key (id)
);
```

### C. Auth Configuration
- **Email Auth:** Enable Email provider. Configure "Confirm email" template.
- **Phone Auth:** Enable Phone provider. Connect a provider like Twilio or MessageBird (Supabase handles the logic, you just provide credentials).

## 2. Frontend Implementation

### A. Install Dependencies
```bash
npm install @supabase/supabase-js
```

### B. Supabase Client
Create `lib/supabase.ts` to initialize the client.

### C. Registration Flow (`app/register/page.tsx`)
1.  **Sign Up:** Call `supabase.auth.signUp({ email, password, options: { data: { full_name, role } } })`.
2.  **Email Verification:** Supabase automatically sends a verification email. Show a "Check your email" screen.
3.  **Phone Collection:** If phone verification is needed, ask for phone number after email signup.
4.  **Send OTP:** Call `supabase.auth.signInWithOtp({ phone })`.

### D. Verification Flow (`app/verify/page.tsx`)
1.  Create a page to input the 6-digit OTP.
2.  **Verify:** Call `supabase.auth.verifyOtp({ phone, token, type: 'sms' })`.
3.  **Update Profile:** On success, update `is_verified = true` in `profiles` table.

### E. Login Flow (`app/login/page.tsx`)
1.  Update to use `supabase.auth.signInWithPassword({ email, password })`.
2.  Fetch user profile from `profiles` table to get role and name.
3.  Update `AuthProvider` to store this real session data.

## 3. Data Collection Strategy

### A. Progressive Profiling
- **On Signup:** Collect minimal info (Email, Password, Role).
- **On First Checkout:** Collect Address, Phone (if not verified).
- **On Seller Dashboard:** Collect Business Name, Bank Details (for payouts).

### B. Security
- Use **Row Level Security (RLS)** in Supabase to ensure users can only read/update their own data.
- Use **HttpOnly Cookies** for session management (Supabase Auth Helpers for Next.js handles this).

## 4. Next Steps
1.  Set up Supabase project.
2.  Install dependencies.
3.  Refactor `AuthProvider` to use Supabase.
4.  Update Register/Login pages.

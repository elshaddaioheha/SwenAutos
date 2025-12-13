# Database Seeding Guide

## Prerequisites
Before running the seed script, you need:

1. ✅ Supabase project set up
2. ✅ Environment variables in `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. ✅ At least one seller account created

## Step 1: Create a Seller Account

If you don't have a seller account yet:

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000/register`

3. Register as a **Seller** with these details:
   - Email: `seller@swenautos.com` (or any email)
   - Password: Your choice
   - Role: Select **Seller**
   - Business Name: `SwenAutos Demo Shop`

4. Verify your email if required

## Step 2: Run the Seed Script

Once you have a seller account:

```bash
node scripts/seed-products.js
```

This will:
- Connect to your Supabase database
- Find the first seller account
- Insert 10 sample automotive products
- Display a summary of inserted products

## Step 3: Verify the Data

1. Check your Supabase dashboard:
   - Go to Table Editor > `products`
   - You should see 10 new products

2. Or view them in your app:
   - Navigate to `/shop`
   - Browse the product catalog

## Sample Products Included

The seed script includes:
1. Engine Oil Filter (₦3,500)
2. Brake Pads Set (₦12,500)
3. Air Filter (₦4,200)
4. LED Headlight Bulbs (₦8,900)
5. Spark Plugs (₦7,800)
6. Radiator Coolant (₦5,600)
7. Wiper Blades (₦3,200)
8. Battery 12V (₦28,500)
9. Fuel Pump (₦15,200)
10. TPMS Sensor (₦9,800)

## Troubleshooting

### Error: "No seller accounts found"
- Create a seller account first (see Step 1)

### Error: "Supabase URL or Key not found"
- Check your `.env.local` file
- Ensure variables are prefixed with `NEXT_PUBLIC_`

### Error: "Row Level Security policy violation"
- Check that RLS policies are correctly set up
- The seller_id must match an existing profile

### Want to add more products?
Edit `scripts/seed-products.js` and add to the `sampleProducts` array.

## Clean Up (Optional)

To remove all seeded products:

```sql
-- Run this in Supabase SQL Editor
DELETE FROM products WHERE part_number LIKE '%-2024-%';
```

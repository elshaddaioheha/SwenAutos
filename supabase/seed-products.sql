-- SwenAutos Product Seeding SQL Script
-- Run this in your Supabase SQL Editor
-- 
-- PREREQUISITE: You must have at least one seller account registered
-- If you don't have one, register at http://localhost:3000/register as a seller first

-- Step 1: Get the first seller ID (or show an error if none exists)
DO $$
DECLARE
  v_seller_id uuid;
  v_seller_email text;
BEGIN
  -- Find first seller
  SELECT id, email INTO v_seller_id, v_seller_email
  FROM public.profiles
  WHERE role = 'seller'
  LIMIT 1;
  
  IF v_seller_id IS NULL THEN
    RAISE EXCEPTION 'No seller account found! Please create a seller account at http://localhost:3000/register first.';
  END IF;
  
  RAISE NOTICE 'Using seller: % (ID: %)', v_seller_email, v_seller_id;
  
  -- Step 2: Insert sample products
  INSERT INTO public.products (
    seller_id, name, part_number, price_ngn, price_camp, description, 
    category, sub_category, stock, condition, images, features, specs, rating, reviews_count
  ) VALUES 
  (
    v_seller_id,
    'Engine Oil Filter - Genuine OEM',
    'EOF-2024-001',
    3500,
    0.05,
    'High-quality engine oil filter compatible with most Toyota, Honda, and Nissan models. Ensures optimal engine performance and longevity.',
    'Engine Parts',
    'Filters',
    45,
    'New',
    ARRAY['https://via.placeholder.com/400x400/4A90E2/FFFFFF?text=Oil+Filter'],
    ARRAY['OEM Quality', 'Extended service life', 'Compatible with multiple models', 'Easy installation'],
    '{"brand": "AutoPro", "weight": "0.3 kg", "compatibility": ["Toyota Camry", "Honda Accord", "Nissan Altima"], "warranty": "12 months"}'::jsonb,
    4.5,
    23
  ),
  (
    v_seller_id,
    'Brake Pads Set - Front',
    'BPS-2024-002',
    12500,
    0.18,
    'Premium ceramic brake pads designed for superior stopping power and reduced brake dust. Perfect for daily driving and light performance use.',
    'Braking System',
    'Brake Pads',
    28,
    'New',
    ARRAY['https://via.placeholder.com/400x400/50C878/FFFFFF?text=Brake+Pads'],
    ARRAY['Ceramic compound', 'Low noise operation', 'Extended wear life', 'Reduced dust generation'],
    '{"brand": "BrakeMaster", "weight": "2.5 kg", "compatibility": ["Mercedes C-Class", "BMW 3-Series", "Audi A4"], "warranty": "24 months"}'::jsonb,
    4.8,
    41
  ),
  (
    v_seller_id,
    'Air Filter - High Performance',
    'AIF-2024-003',
    4200,
    0.06,
    'Washable and reusable high-flow air filter that improves engine breathing and performance. Environmentally friendly alternative to disposable filters.',
    'Engine Parts',
    'Filters',
    60,
    'New',
    ARRAY['https://via.placeholder.com/400x400/FF6B6B/FFFFFF?text=Air+Filter'],
    ARRAY['Reusable design', 'Increased airflow', 'Improved fuel efficiency', 'Easy to clean'],
    '{"brand": "FlowMax", "weight": "0.4 kg", "compatibility": ["Universal fit for most vehicles"], "warranty": "Lifetime"}'::jsonb,
    4.6,
    18
  ),
  (
    v_seller_id,
    'LED Headlight Bulbs H7',
    'LED-2024-004',
    8900,
    0.13,
    'Ultra-bright LED headlight bulbs with 6000K color temperature. Provides superior visibility and modern appearance.',
    'Lighting',
    'Headlights',
    35,
    'New',
    ARRAY['https://via.placeholder.com/400x400/FFD93D/FFFFFF?text=LED+Headlights'],
    ARRAY['6000K cool white', '200% brighter than halogen', 'Plug and play installation', 'Built-in cooling fan'],
    '{"brand": "LightPro", "weight": "0.2 kg", "power": "30W per bulb", "compatibility": ["H7 socket vehicles"], "warranty": "18 months"}'::jsonb,
    4.7,
    56
  ),
  (
    v_seller_id,
    'Spark Plugs - Iridium (Set of 4)',
    'SPK-2024-005',
    7800,
    0.11,
    'Premium iridium spark plugs for enhanced ignition and fuel economy. Long-lasting performance up to 100,000 km.',
    'Engine Parts',
    'Ignition',
    50,
    'New',
    ARRAY['https://via.placeholder.com/400x400/9370DB/FFFFFF?text=Spark+Plugs'],
    ARRAY['Iridium center electrode', 'Improved fuel efficiency', 'Smooth engine operation', 'Extended service life'],
    '{"brand": "IgnitionMax", "weight": "0.5 kg", "gap": "1.0mm", "compatibility": ["4-cylinder engines"], "warranty": "36 months"}'::jsonb,
    4.9,
    67
  ),
  (
    v_seller_id,
    'Radiator Coolant - 5L',
    'RAD-2024-006',
    5600,
    0.08,
    'High-performance engine coolant with anti-freeze and anti-corrosion properties. Suitable for all seasons.',
    'Fluids',
    'Coolant',
    75,
    'New',
    ARRAY['https://via.placeholder.com/400x400/48C9B0/FFFFFF?text=Coolant'],
    ARRAY['All-season protection', 'Anti-freeze formula', 'Corrosion inhibitors', 'Long-life formulation'],
    '{"brand": "CoolFlow", "volume": "5 liters", "freezing_point": "-37°C", "compatibility": ["All vehicle types"], "warranty": "N/A"}'::jsonb,
    4.4,
    31
  ),
  (
    v_seller_id,
    'Wiper Blades - Universal (Pair)',
    'WIP-2024-007',
    3200,
    0.045,
    'All-season frameless wiper blades with advanced rubber compound for streak-free performance.',
    'Accessories',
    'Wipers',
    90,
    'New',
    ARRAY['https://via.placeholder.com/400x400/E67E22/FFFFFF?text=Wiper+Blades'],
    ARRAY['Frameless design', 'All-weather performance', 'Easy installation', 'Quiet operation'],
    '{"brand": "ClearView", "sizes": "18\", 20\", 22\", 24\"", "weight": "0.3 kg", "compatibility": ["Universal J-hook mount"], "warranty": "6 months"}'::jsonb,
    4.3,
    44
  ),
  (
    v_seller_id,
    'Battery - 12V 60Ah',
    'BAT-2024-008',
    28500,
    0.40,
    'Maintenance-free car battery with high cold-cranking amps. Reliable starting power in all weather conditions.',
    'Electrical',
    'Batteries',
    15,
    'New',
    ARRAY['https://via.placeholder.com/400x400/34495E/FFFFFF?text=Battery'],
    ARRAY['Maintenance-free', 'High CCA rating', 'Spill-proof design', 'Extended life cycle'],
    '{"brand": "PowerMax", "capacity": "60Ah", "voltage": "12V", "cca": "540A", "weight": "15 kg", "warranty": "24 months"}'::jsonb,
    4.6,
    38
  ),
  (
    v_seller_id,
    'Fuel Pump - Electric',
    'FUP-2024-009',
    15200,
    0.22,
    'High-pressure electric fuel pump for reliable fuel delivery. Direct replacement for factory unit.',
    'Fuel System',
    'Fuel Pumps',
    22,
    'New',
    ARRAY['https://via.placeholder.com/400x400/C0392B/FFFFFF?text=Fuel+Pump'],
    ARRAY['OEM equivalent', 'High-pressure output', 'Durable construction', 'Pre-installed strainer'],
    '{"brand": "FuelFlow", "pressure": "3.5 bar", "flow_rate": "120 L/h", "weight": "1.2 kg", "compatibility": ["In-tank installation"], "warranty": "12 months"}'::jsonb,
    4.5,
    27
  ),
  (
    v_seller_id,
    'Tire Pressure Monitoring Sensor (TPMS)',
    'TPS-2024-010',
    9800,
    0.14,
    'Wireless TPMS sensor for accurate tire pressure monitoring. Easy to program and install.',
    'Wheels & Tires',
    'TPMS',
    40,
    'New',
    ARRAY['https://via.placeholder.com/400x400/16A085/FFFFFF?text=TPMS+Sensor'],
    ARRAY['Wireless design', 'Easy programming', 'Long battery life', 'Accurate readings'],
    '{"brand": "SafeDrive", "battery_life": "5-7 years", "frequency": "433 MHz", "weight": "0.1 kg", "compatibility": ["Universal programmable"], "warranty": "12 months"}'::jsonb,
    4.4,
    19
  );
  
  RAISE NOTICE '✅ Successfully inserted 10 products for seller: %', v_seller_email;
END $$;

-- Verify the insertion
SELECT 
  COUNT(*) as total_products,
  SUM(stock) as total_stock,
  COUNT(DISTINCT category) as categories
FROM public.products;

-- Show the newly inserted products
SELECT 
  name, 
  price_ngn,
  price_camp,
  stock, 
  category,
  sub_category
FROM public.products 
ORDER BY created_at DESC 
LIMIT 10;

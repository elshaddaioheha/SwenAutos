-- SEED DATA FOR PRODUCTS
-- IMPORTANT: Replace 'YOUR_USER_ID_HERE' with your actual User ID from Supabase Authentication > Users.
-- You must be signed up as a user in your app first!

INSERT INTO public.products (
    name, 
    description, 
    price_ngn, 
    price_camp, 
    category, 
    sub_category, 
    stock, 
    condition, 
    images, 
    seller_id
) VALUES 
(
    'OEM Toyota Camry Engine Oil Filter',
    'Genuine OEM Toyota oil filter designed specifically for Toyota Camry models from 2018-2024. Provides superior filtration and engine protection.',
    45000,
    28.12,
    'Engine Parts',
    'Oil Filters',
    12,
    'New',
    ARRAY['/placeholder-part.png'],
    'YOUR_USER_ID_HERE'
),
(
    'Honda Accord Oil Filter OEM Quality',
    'High quality oil filter for Honda Accord 2016-2021. Part #: 15400-PLM-A02.',
    14200,
    8.87,
    'Engine Parts',
    'Oil Filters',
    8,
    'New',
    ARRAY['/placeholder-part.png'],
    'YOUR_USER_ID_HERE'
),
(
    'Spark Plugs Set (4pcs)',
    'Complete set of 4 high-performance spark plugs. Compatible with most Toyota and Honda 4-cylinder engines.',
    18000,
    11.25,
    'Engine Parts',
    'Ignition',
    20,
    'New',
    ARRAY['/placeholder-part.png'],
    'YOUR_USER_ID_HERE'
),
(
    'Engine Oil 5W-30 Synthetic (4L)',
    'Fully synthetic 5W-30 engine oil. Universal fit for modern engines. Part #: 08880-83389.',
    32000,
    20.00,
    'Fluids & Chemicals',
    'Engine Oil',
    15,
    'New',
    ARRAY['/placeholder-part.png'],
    'YOUR_USER_ID_HERE'
),
(
    'Lexus RX350 Engine Oil Filter',
    'Premium oil filter for Lexus RX350 2016-2022. Part #: 04152-YZZA6.',
    16500,
    10.31,
    'Engine Parts',
    'Oil Filters',
    5,
    'New',
    ARRAY['/placeholder-part.png'],
    'YOUR_USER_ID_HERE'
),
(
    'Air Filter - Toyota Corolla',
    'High flow air filter for Toyota Corolla 2019-2023. Improves engine breathability and efficiency.',
    9800,
    6.12,
    'Engine Parts',
    'Air Filters',
    10,
    'New',
    ARRAY['/placeholder-part.png'],
    'YOUR_USER_ID_HERE'
);

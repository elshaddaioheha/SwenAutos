// Script to seed Supabase with sample automotive products
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Error: Supabase URL or Key not found in environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const sampleProducts = [
    {
        name: 'Engine Oil Filter - Genuine OEM',
        part_number: 'EOF-2024-001',
        price_ngn: 3500,
        price_camp: 0.05,
        description: 'High-quality engine oil filter compatible with most Toyota, Honda, and Nissan models. Ensures optimal engine performance and longevity.',
        category: 'Engine Parts',
        sub_category: 'Filters',
        stock: 45,
        condition: 'New',
        images: ['https://via.placeholder.com/400x400/4A90E2/FFFFFF?text=Oil+Filter'],
        features: [
            'OEM Quality',
            'Extended service life',
            'Compatible with multiple models',
            'Easy installation'
        ],
        specs: {
            brand: 'AutoPro',
            weight: '0.3 kg',
            compatibility: ['Toyota Camry', 'Honda Accord', 'Nissan Altima'],
            warranty: '12 months'
        },
        rating: 4.5,
        reviews_count: 23
    },
    {
        name: 'Brake Pads Set - Front',
        part_number: 'BPS-2024-002',
        price_ngn: 12500,
        price_camp: 0.18,
        description: 'Premium ceramic brake pads designed for superior stopping power and reduced brake dust. Perfect for daily driving and light performance use.',
        category: 'Braking System',
        sub_category: 'Brake Pads',
        stock: 28,
        condition: 'New',
        images: ['https://via.placeholder.com/400x400/50C878/FFFFFF?text=Brake+Pads'],
        features: [
            'Ceramic compound',
            'Low noise operation',
            'Extended wear life',
            'Reduced dust generation'
        ],
        specs: {
            brand: 'BrakeMaster',
            weight: '2.5 kg',
            compatibility: ['Mercedes C-Class', 'BMW 3-Series', 'Audi A4'],
            warranty: '24 months'
        },
        rating: 4.8,
        reviews_count: 41
    },
    {
        name: 'Air Filter - High Performance',
        part_number: 'AIF-2024-003',
        price_ngn: 4200,
        price_camp: 0.06,
        description: 'Washable and reusable high-flow air filter that improves engine breathing and performance. Environmentally friendly alternative to disposable filters.',
        category: 'Engine Parts',
        sub_category: 'Filters',
        stock: 60,
        condition: 'New',
        images: ['https://via.placeholder.com/400x400/FF6B6B/FFFFFF?text=Air+Filter'],
        features: [
            'Reusable design',
            'Increased airflow',
            'Improved fuel efficiency',
            'Easy to clean'
        ],
        specs: {
            brand: 'FlowMax',
            weight: '0.4 kg',
            compatibility: ['Universal fit for most vehicles'],
            warranty: 'Lifetime'
        },
        rating: 4.6,
        reviews_count: 18
    },
    {
        name: 'LED Headlight Bulbs H7',
        part_number: 'LED-2024-004',
        price_ngn: 8900,
        price_camp: 0.13,
        description: 'Ultra-bright LED headlight bulbs with 6000K color temperature. Provides superior visibility and modern appearance.',
        category: 'Lighting',
        sub_category: 'Headlights',
        stock: 35,
        condition: 'New',
        images: ['https://via.placeholder.com/400x400/FFD93D/FFFFFF?text=LED+Headlights'],
        features: [
            '6000K cool white',
            '200% brighter than halogen',
            'Plug and play installation',
            'Built-in cooling fan'
        ],
        specs: {
            brand: 'LightPro',
            weight: '0.2 kg',
            power: '30W per bulb',
            compatibility: ['H7 socket vehicles'],
            warranty: '18 months'
        },
        rating: 4.7,
        reviews_count: 56
    },
    {
        name: 'Spark Plugs - Iridium (Set of 4)',
        part_number: 'SPK-2024-005',
        price_ngn: 7800,
        price_camp: 0.11,
        description: 'Premium iridium spark plugs for enhanced ignition and fuel economy. Long-lasting performance up to 100,000 km.',
        category: 'Engine Parts',
        sub_category: 'Ignition',
        stock: 50,
        condition: 'New',
        images: ['https://via.placeholder.com/400x400/9370DB/FFFFFF?text=Spark+Plugs'],
        features: [
            'Iridium center electrode',
            'Improved fuel efficiency',
            'Smooth engine operation',
            'Extended service life'
        ],
        specs: {
            brand: 'IgnitionMax',
            weight: '0.5 kg',
            gap: '1.0mm',
            compatibility: ['4-cylinder engines'],
            warranty: '36 months'
        },
        rating: 4.9,
        reviews_count: 67
    },
    {
        name: 'Radiator Coolant - 5L',
        part_number: 'RAD-2024-006',
        price_ngn: 5600,
        price_camp: 0.08,
        description: 'High-performance engine coolant with anti-freeze and anti-corrosion properties. Suitable for all seasons.',
        category: 'Fluids',
        sub_category: 'Coolant',
        stock: 75,
        condition: 'New',
        images: ['https://via.placeholder.com/400x400/48C9B0/FFFFFF?text=Coolant'],
        features: [
            'All-season protection',
            'Anti-freeze formula',
            'Corrosion inhibitors',
            'Long-life formulation'
        ],
        specs: {
            brand: 'CoolFlow',
            volume: '5 liters',
            freezing_point: '-37°C',
            compatibility: ['All vehicle types'],
            warranty: 'N/A'
        },
        rating: 4.4,
        reviews_count: 31
    },
    {
        name: 'Wiper Blades - Universal (Pair)',
        part_number: 'WIP-2024-007',
        price_ngn: 3200,
        price_camp: 0.045,
        description: 'All-season frameless wiper blades with advanced rubber compound for streak-free performance.',
        category: 'Accessories',
        sub_category: 'Wipers',
        stock: 90,
        condition: 'New',
        images: ['https://via.placeholder.com/400x400/E67E22/FFFFFF?text=Wiper+Blades'],
        features: [
            'Frameless design',
            'All-weather performance',
            'Easy installation',
            'Quiet operation'
        ],
        specs: {
            brand: 'ClearView',
            sizes: '18", 20", 22", 24"',
            weight: '0.3 kg',
            compatibility: ['Universal J-hook mount'],
            warranty: '6 months'
        },
        rating: 4.3,
        reviews_count: 44
    },
    {
        name: 'Battery - 12V 60Ah',
        part_number: 'BAT-2024-008',
        price_ngn: 28500,
        price_camp: 0.40,
        description: 'Maintenance-free car battery with high cold-cranking amps. Reliable starting power in all weather conditions.',
        category: 'Electrical',
        sub_category: 'Batteries',
        stock: 15,
        condition: 'New',
        images: ['https://via.placeholder.com/400x400/34495E/FFFFFF?text=Battery'],
        features: [
            'Maintenance-free',
            'High CCA rating',
            'Spill-proof design',
            'Extended life cycle'
        ],
        specs: {
            brand: 'PowerMax',
            capacity: '60Ah',
            voltage: '12V',
            cca: '540A',
            weight: '15 kg',
            warranty: '24 months'
        },
        rating: 4.6,
        reviews_count: 38
    },
    {
        name: 'Fuel Pump - Electric',
        part_number: 'FUP-2024-009',
        price_ngn: 15200,
        price_camp: 0.22,
        description: 'High-pressure electric fuel pump for reliable fuel delivery. Direct replacement for factory unit.',
        category: 'Fuel System',
        sub_category: 'Fuel Pumps',
        stock: 22,
        condition: 'New',
        images: ['https://via.placeholder.com/400x400/C0392B/FFFFFF?text=Fuel+Pump'],
        features: [
            'OEM equivalent',
            'High-pressure output',
            'Durable construction',
            'Pre-installed strainer'
        ],
        specs: {
            brand: 'FuelFlow',
            pressure: '3.5 bar',
            flow_rate: '120 L/h',
            weight: '1.2 kg',
            compatibility: ['In-tank installation'],
            warranty: '12 months'
        },
        rating: 4.5,
        reviews_count: 27
    },
    {
        name: 'Tire Pressure Monitoring Sensor (TPMS)',
        part_number: 'TPS-2024-010',
        price_ngn: 9800,
        price_camp: 0.14,
        description: 'Wireless TPMS sensor for accurate tire pressure monitoring. Easy to program and install.',
        category: 'Wheels & Tires',
        sub_category: 'TPMS',
        stock: 40,
        condition: 'New',
        images: ['https://via.placeholder.com/400x400/16A085/FFFFFF?text=TPMS+Sensor'],
        features: [
            'Wireless design',
            'Easy programming',
            'Long battery life',
            'Accurate readings'
        ],
        specs: {
            brand: 'SafeDrive',
            battery_life: '5-7 years',
            frequency: '433 MHz',
            weight: '0.1 kg',
            compatibility: ['Universal programmable'],
            warranty: '12 months'
        },
        rating: 4.4,
        reviews_count: 19
    }
];

async function seedProducts() {
    console.log('🚀 Starting product seeding...\n');

    try {
        // First, check if we need a seller account
        console.log('📋 Step 1: Checking for seller account...');

        // Get or create a test seller
        const { data: { user } } = await supabase.auth.getUser();

        let sellerId;

        if (user) {
            console.log(`✅ Found authenticated user: ${user.email}`);
            sellerId = user.id;
        } else {
            console.log('⚠️  No authenticated user. Looking for existing sellers...');

            // Try to find any seller in the profiles table
            const { data: sellers, error: sellersError } = await supabase
                .from('profiles')
                .select('id')
                .eq('role', 'seller')
                .limit(1);

            if (sellersError) {
                console.error('❌ Error fetching sellers:', sellersError.message);
                throw sellersError;
            }

            if (sellers && sellers.length > 0) {
                sellerId = sellers[0].id;
                console.log(`✅ Using existing seller ID: ${sellerId}`);
            } else {
                console.log('❌ No seller accounts found!');
                console.log('\n📝 Please create a seller account first by:');
                console.log('   1. Running the app (npm run dev)');
                console.log('   2. Registering as a seller');
                console.log('   3. Then run this script again\n');
                process.exit(1);
            }
        }

        // Add seller_id to all products
        const productsWithSeller = sampleProducts.map(product => ({
            ...product,
            seller_id: sellerId
        }));

        console.log(`\n📦 Step 2: Inserting ${productsWithSeller.length} products...`);

        const { data, error } = await supabase
            .from('products')
            .insert(productsWithSeller)
            .select();

        if (error) {
            console.error('❌ Error inserting products:', error.message);
            throw error;
        }

        console.log(`\n✅ Successfully inserted ${data.length} products!\n`);

        // Display summary
        console.log('📊 Product Summary:');
        console.log('─'.repeat(50));
        data.forEach((product, index) => {
            console.log(`${index + 1}. ${product.name}`);
            console.log(`   Price: ₦${product.price_ngn.toLocaleString()} / ${product.price_camp} CAMP`);
            console.log(`   Stock: ${product.stock} units`);
            console.log(`   Category: ${product.category} > ${product.sub_category}`);
            console.log('');
        });

        console.log('✨ Seeding completed successfully!');

    } catch (error) {
        console.error('\n💥 Seeding failed:', error);
        process.exit(1);
    }
}

// Run the seeding function
seedProducts();

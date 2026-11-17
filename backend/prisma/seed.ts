import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding for DIGITAL MARKET...');

  // 1. Seed Store Settings
  const existingSettings = await prisma.storeSetting.findUnique({
    where: { id: 'STORE_CONFIG' },
  });

  if (!existingSettings) {
    await prisma.storeSetting.create({
      data: {
        id: 'STORE_CONFIG',
        businessName: 'DIGITAL MARKET',
        businessTagline: 'Premium Refurbished Laptops, Desktop PCs & Tech Accessories',
        logoUrl: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=400&q=80',
        whatsappNumber: '919650624535',
        contactPhone: '+91 96506 24535',
        contactEmail: 'contact@digitalmarket.in',
        address: 'Shop 12, Ground Floor, Electronics Commercial Hub, Nehru Place, New Delhi - 110019',
        googleMapsUrl: 'https://maps.google.com',
        currencySymbol: '₹',
        defaultWarrantyText: '30 Days Testing Guarantee + 6 Months Hardware Service Warranty',
        seoTitle: 'DIGITAL MARKET | Premium Refurbished Laptops & Desktop PCs at Best Prices',
        seoDescription: 'Buy certified second-hand & refurbished laptops, desktops, computer parts and accessories at lowest prices with testing warranty.',
        socialLinks: JSON.stringify({
          facebook: 'https://facebook.com/digitalmarket',
          instagram: 'https://instagram.com/digitalmarket',
          youtube: 'https://youtube.com/digitalmarket',
        }),
      },
    });
    console.log('✅ Store Settings created.');
  }

  // 2. Seed Default Admin User
  const existingAdmin = await prisma.admin.findUnique({
    where: { email: 'admin@digitalmarket.in' },
  });

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash('AdminPassword@123', 10);
    await prisma.admin.create({
      data: {
        email: 'admin@digitalmarket.in',
        passwordHash,
        name: 'Store Administrator',
        role: 'SUPER_ADMIN',
        isActive: true,
      },
    });
    console.log('✅ Default Admin created: admin@digitalmarket.in / AdminPassword@123');
  }

  // 3. Seed Categories
  const categoriesData = [
    { name: 'Laptops', slug: 'laptops', description: 'Certified refurbished enterprise and gaming laptops', sortOrder: 1 },
    { name: 'Desktop PCs', slug: 'desktop-pcs', description: 'Mini PCs, Towers, and Assembled Gaming rigs', sortOrder: 2 },
    { name: 'Monitors', slug: 'monitors', description: 'FHD, 2K & 4K IPS professional displays', sortOrder: 3 },
    { name: 'Keyboards', slug: 'keyboards', description: 'Mechanical, wireless & office keyboards', sortOrder: 4 },
    { name: 'Mouse', slug: 'mouse', description: 'Ergonomic, wireless and high-DPI gaming mice', sortOrder: 5 },
    { name: 'Computer Accessories', slug: 'computer-accessories', description: 'Chargers, docks, adapters & laptop bags', sortOrder: 6 },
    { name: 'Computer Components', slug: 'computer-components', description: 'RAM, SSDs, HDDs, and Graphic Cards', sortOrder: 7 },
    { name: 'Other Products', slug: 'other-products', description: 'Speakers, webcams & networking devices', sortOrder: 8 },
  ];

  const categoryMap = new Map<string, string>();

  for (const cat of categoriesData) {
    const record = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, description: cat.description, sortOrder: cat.sortOrder },
      create: cat,
    });
    categoryMap.set(cat.slug, record.id);
  }
  console.log('✅ Categories seeded.');

  // 4. Seed Realistic Products
  const products = [
    {
      sku: 'DM-LAP-DELL-7490-1001',
      slug: 'dell-latitude-7490-intel-core-i7-8th-gen-16gb-512gb-fhd',
      name: 'Dell Latitude 7490 (Intel Core i7 8th Gen / 16GB / 512GB SSD)',
      brand: 'Dell',
      model: 'Latitude 7490',
      categorySlug: 'laptops',
      condition: 'EXCELLENT_REFURBISHED',
      description: 'Business-class lightweight ultrabook. High-performance quad-core processor with backlit keyboard, 14-inch Full HD anti-glare IPS display, and all-day battery life. Excellent cosmetic condition (Grade A+).',
      specifications: {
        processor: 'Intel Core i7-8650U (4 Cores, 8 Threads, up to 4.20 GHz)',
        generation: '8th Gen',
        ram: '16 GB DDR4',
        ramType: 'DDR4 (Upgradable to 32GB)',
        storageType: 'NVMe M.2 SSD',
        storageCapacity: '512 GB',
        displaySize: '14.0 Inch',
        resolution: '1920 x 1080 Full HD IPS',
        graphics: 'Intel UHD Graphics 620',
        operatingSystem: 'Windows 11 Pro 64-bit Genuine',
        batteryHealth: '85%+ Health (Up to 5 Hours backup)',
        keyboard: 'Backlit Spill-Resistant Keyboard',
        ports: 'Thunderbolt 3 USB-C, 3x USB 3.1, HDMI, RJ45 LAN, MicroSD, Audio Jack',
        weight: '1.4 kg',
      },
      internalCostPrice: 19500,
      sellingPrice: 24999,
      originalPrice: 85000,
      warranty: '30 Days Testing Guarantee + 6 Months Service Warranty',
      stockQuantity: 3,
      availabilityStatus: 'AVAILABLE',
      publishStatus: 'PUBLISHED',
      isFeatured: true,
      images: [
        'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
      ],
    },
    {
      sku: 'DM-LAP-LEN-T480-1002',
      slug: 'lenovo-thinkpad-t480-intel-core-i5-8th-gen-16gb-256gb-ssd',
      name: 'Lenovo ThinkPad T480 (Core i5 8th Gen / 16GB / 256GB SSD / Dual Battery)',
      brand: 'Lenovo',
      model: 'ThinkPad T480',
      categorySlug: 'laptops',
      condition: 'EXCELLENT_REFURBISHED',
      description: 'The legendary military-grade durable ThinkPad. Features dual hot-swappable batteries, legendary ergonomic keyboard with TrackPoint, and solid magnesium-reinforced chassis.',
      specifications: {
        processor: 'Intel Core i5-8350U (Quad-Core, up to 3.60 GHz)',
        generation: '8th Gen',
        ram: '16 GB DDR4',
        ramType: 'DDR4',
        storageType: 'NVMe M.2 SSD',
        storageCapacity: '256 GB',
        displaySize: '14.0 Inch',
        resolution: '1920 x 1080 FHD Matte',
        graphics: 'Intel UHD Graphics 620',
        operatingSystem: 'Windows 11 Pro Genuine',
        batteryHealth: 'Dual Battery Setup (6+ Hours backup)',
        keyboard: 'Legendary ThinkPad Ergonomic Keyboard',
        ports: '2x USB-C (Thunderbolt 3), 2x USB 3.0, HDMI, Ethernet, Card Reader',
        weight: '1.58 kg',
      },
      internalCostPrice: 17000,
      sellingPrice: 21499,
      originalPrice: 72000,
      warranty: '30 Days Testing Guarantee + 6 Months Service Warranty',
      stockQuantity: 2,
      availabilityStatus: 'AVAILABLE',
      publishStatus: 'PUBLISHED',
      isFeatured: true,
      images: [
        'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=800&q=80',
      ],
    },
    {
      sku: 'DM-LAP-HP-840G6-1003',
      slug: 'hp-elitebook-840-g6-intel-core-i5-8th-gen-8gb-256gb-ssd-silver',
      name: 'HP EliteBook 840 G6 (Core i5 8th Gen / 8GB / 256GB SSD / Bang & Olufsen)',
      brand: 'HP',
      model: 'EliteBook 840 G6',
      categorySlug: 'laptops',
      condition: 'VERY_GOOD',
      description: 'Sleek premium silver aluminum finish with premium Bang & Olufsen speakers and privacy webcam shutter. High-speed NVMe storage and responsive performance.',
      specifications: {
        processor: 'Intel Core i5-8265U (Quad Core, up to 3.90 GHz)',
        generation: '8th Gen',
        ram: '8 GB DDR4',
        ramType: 'DDR4 (Upgradable to 32GB)',
        storageType: 'NVMe SSD',
        storageCapacity: '256 GB',
        displaySize: '14.0 Inch',
        resolution: '1920 x 1080 Full HD IPS',
        graphics: 'Intel UHD Graphics 620',
        operatingSystem: 'Windows 11 Pro',
        batteryHealth: '80%+ Health',
        keyboard: 'Backlit Island-style Keyboard',
        ports: 'USB Type-C with Thunderbolt, 2x USB 3.1, HDMI 1.4b, RJ-45, Headphone jack',
        weight: '1.48 kg',
      },
      internalCostPrice: 17500,
      sellingPrice: 22999,
      originalPrice: 78000,
      warranty: '30 Days Testing Guarantee + 6 Months Service Warranty',
      stockQuantity: 1,
      availabilityStatus: 'AVAILABLE',
      publishStatus: 'PUBLISHED',
      isFeatured: false,
      images: [
        'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=800&q=80',
      ],
    },
    {
      sku: 'DM-LAP-APP-MBP13-1004',
      slug: 'apple-macbook-pro-13-2019-intel-core-i5-8gb-256gb-retina-touchbar',
      name: 'Apple MacBook Pro 13" 2019 (Core i5 / 8GB / 256GB SSD / Retina / Touch Bar)',
      brand: 'Apple',
      model: 'MacBook Pro 13" (A2159)',
      categorySlug: 'laptops',
      condition: 'EXCELLENT_REFURBISHED',
      description: 'Stunning Retina display with True Tone technology, Touch Bar and Touch ID sensor. Space Gray finish, crisp stereo speakers, and low battery cycle count.',
      specifications: {
        processor: 'Intel Core i5 1.4GHz Quad-Core (Turbo Boost up to 3.9GHz)',
        generation: '8th Gen',
        ram: '8 GB LPDDR3',
        ramType: 'Onboard 2133MHz',
        storageType: 'Apple PCIe-based SSD',
        storageCapacity: '256 GB',
        displaySize: '13.3 Inch',
        resolution: '2560 x 1600 Retina IPS Display',
        graphics: 'Intel Iris Plus Graphics 645',
        operatingSystem: 'macOS Sonoma latest update',
        batteryHealth: 'Cycle count < 250 (Normal status)',
        keyboard: 'Backlit Butterfly keyboard with Touch Bar & Touch ID',
        ports: '2x Thunderbolt 3 (USB-C) ports, 3.5mm Headphone Jack',
        weight: '1.37 kg',
      },
      internalCostPrice: 31000,
      sellingPrice: 38999,
      originalPrice: 119000,
      warranty: '30 Days Testing Guarantee + 6 Months Service Warranty',
      stockQuantity: 1,
      availabilityStatus: 'AVAILABLE',
      publishStatus: 'PUBLISHED',
      isFeatured: true,
      images: [
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=800&q=80',
      ],
    },
    {
      sku: 'DM-DSK-DEL-7060-1005',
      slug: 'dell-optiplex-7060-micro-pc-core-i5-8th-gen-16gb-512gb-nvme',
      name: 'Dell OptiPlex 7060 Micro PC (Core i5 8th Gen / 16GB / 512GB NVMe / Ultra Compact)',
      brand: 'Dell',
      model: 'OptiPlex 7060 Micro',
      categorySlug: 'desktop-pcs',
      condition: 'EXCELLENT_REFURBISHED',
      description: 'Tiny desktop footprint with full desktop processing power. Fits behind your monitor or anywhere on the desk. Supports dual 4K monitors via DisplayPort.',
      specifications: {
        processor: 'Intel Core i5-8500T (6 Cores, 6 Threads, up to 3.50 GHz)',
        generation: '8th Gen',
        ram: '16 GB DDR4',
        ramType: 'DDR4',
        storageType: 'NVMe SSD',
        storageCapacity: '512 GB',
        graphics: 'Intel UHD Graphics 630 (Dual DP)',
        operatingSystem: 'Windows 11 Pro Genuine',
        powerSupply: 'Original Dell 65W External Adapter',
        ports: '1x USB-C, 5x USB 3.1, 2x DisplayPort, Gigabit LAN, Audio I/O',
        formFactor: 'Ultra Small Micro Desktop (1.18 kg)',
      },
      internalCostPrice: 13500,
      sellingPrice: 17999,
      originalPrice: 55000,
      warranty: '30 Days Testing Guarantee + 6 Months Service Warranty',
      stockQuantity: 4,
      availabilityStatus: 'AVAILABLE',
      publishStatus: 'PUBLISHED',
      isFeatured: true,
      images: [
        'https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=800&q=80',
      ],
    },
    {
      sku: 'DM-MON-DEL-U2419-1006',
      slug: 'dell-ultrasharp-24-inch-fhd-ips-monitor-u2419h-frameless',
      name: 'Dell UltraSharp 24" FHD IPS Monitor (U2419H / 99% sRGB / Height Adjustable)',
      brand: 'Dell',
      model: 'UltraSharp U2419H',
      categorySlug: 'monitors',
      condition: 'EXCELLENT_REFURBISHED',
      description: 'Factory-calibrated 99% sRGB color accuracy for graphic designers, coders, and video editors. InfinityEdge ultra-thin bezels with pivot, tilt, and height adjustable stand.',
      specifications: {
        displaySize: '23.8 Inch',
        panelType: 'IPS Anti-Glare with 3H hardness',
        resolution: '1920 x 1080 at 60 Hz',
        aspectRatio: '16:9',
        colorGamut: '99% sRGB, Delta E < 2',
        standAdjustability: 'Height, Pivot (90° vertical rotation), Swivel, Tilt',
        ports: 'HDMI 1.4, DisplayPort (in), DisplayPort (out for daisy chain), 4x USB 3.0 downstream',
      },
      internalCostPrice: 6200,
      sellingPrice: 8499,
      originalPrice: 18000,
      warranty: '30 Days Testing Guarantee',
      stockQuantity: 3,
      availabilityStatus: 'AVAILABLE',
      publishStatus: 'PUBLISHED',
      isFeatured: false,
      images: [
        'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
      ],
    },
    {
      sku: 'DM-MOU-LOG-MX2S-1007',
      slug: 'logitech-mx-master-2s-wireless-mouse-rechargeable-multi-device',
      name: 'Logitech MX Master 2S Wireless Bluetooth Mouse (Multi-device / 4000 DPI)',
      brand: 'Logitech',
      model: 'MX Master 2S',
      categorySlug: 'mouse',
      condition: 'OPEN_BOX',
      description: 'The master of productivity mice. Cross-computer control via Logitech Flow. Speed-adaptive scroll wheel with hyper-fast scrolling and thumb wheel.',
      specifications: {
        connectivity: 'Bluetooth & 2.4GHz Unifying USB Receiver',
        sensor: 'Darkfield High Precision (tracks on glass), 200 - 4000 DPI',
        battery: 'Rechargeable Li-Po (Up to 70 days on full charge)',
        buttons: '7 Programmable Buttons with Gesture Support',
        compatibility: 'Windows, macOS, iPadOS, Linux',
      },
      internalCostPrice: 2400,
      sellingPrice: 3499,
      originalPrice: 7995,
      warranty: '30 Days Replacement Guarantee',
      stockQuantity: 5,
      availabilityStatus: 'AVAILABLE',
      publishStatus: 'PUBLISHED',
      isFeatured: false,
      images: [
        'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80',
      ],
    },
    {
      sku: 'DM-KEY-RED-K552-1008',
      slug: 'redragon-k552-kumara-rgb-mechanical-gaming-keyboard-blue-switch',
      name: 'Redragon K552 Kumara RGB Mechanical Gaming Keyboard (Tactile Blue Switch)',
      brand: 'Redragon',
      model: 'K552 Kumara RGB',
      categorySlug: 'keyboards',
      condition: 'OPEN_BOX',
      description: 'Tenkeyless compact mechanical keyboard with tactile clicky blue switches, metal alloy construction, and vibrant RGB backlighting modes.',
      specifications: {
        switchType: 'Custom Mechanical Switches (Cherry Blue equivalent)',
        layout: '87 Keys Tenkeyless (TKL)',
        backlight: 'Full RGB with 18 lighting modes',
        connection: 'Gold-plated USB wired cable',
        construction: 'Solid Metal-ABS chassis with splash-proof design',
      },
      internalCostPrice: 1300,
      sellingPrice: 1999,
      originalPrice: 3999,
      warranty: '30 Days Replacement Guarantee',
      stockQuantity: 4,
      availabilityStatus: 'AVAILABLE',
      publishStatus: 'PUBLISHED',
      isFeatured: false,
      images: [
        'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
      ],
    },
    {
      sku: 'DM-CMP-SAM-870E-1009',
      slug: 'samsung-870-evo-500gb-sata-2-5-inch-internal-solid-state-drive',
      name: 'Samsung 870 EVO 500GB 2.5" SATA III Internal SSD (560 MB/s)',
      brand: 'Samsung',
      model: '870 EVO 500GB',
      categorySlug: 'computer-components',
      condition: 'BRAND_NEW',
      description: 'Industry-leading SATA SSD performance with up to 560/530 MB/s read/write speeds. Best upgrade to revive slow older laptops or desktops.',
      specifications: {
        capacity: '500 GB',
        interface: 'SATA 6 Gb/s (Compatible with SATA 3 Gb/s & 1.5 Gb/s)',
        formFactor: '2.5 Inch (7mm thickness)',
        sequentialRead: 'Up to 560 MB/s',
        sequentialWrite: 'Up to 530 MB/s',
        controller: 'Samsung MKX Controller with LPDDR4 DRAM Cache',
      },
      internalCostPrice: 2450,
      sellingPrice: 3199,
      originalPrice: 5500,
      warranty: '30 Days Testing + Brand Warranty',
      stockQuantity: 8,
      availabilityStatus: 'AVAILABLE',
      publishStatus: 'PUBLISHED',
      isFeatured: false,
      images: [
        'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800&q=80',
      ],
    },
    {
      sku: 'DM-ACC-LEN-65W-1010',
      slug: 'lenovo-original-65w-usb-c-laptop-charger-power-adapter',
      name: 'Lenovo 65W USB-C Genuine Fast Laptop Charger (Type-C Power Adapter)',
      brand: 'Lenovo',
      model: '65W Standard USB-C AC Adapter',
      categorySlug: 'computer-accessories',
      condition: 'OPEN_BOX',
      description: 'Original Lenovo 65W USB-C adapter. Compatible with ThinkPad, Dell Latitude, HP EliteBook, Apple MacBook, and all USB-PD laptops.',
      specifications: {
        outputPower: '65W (20V=3.25A / 15V=3A / 9V=2A / 5V=2A)',
        connector: 'USB Type-C',
        inputVoltage: '100V - 240V AC 50-60Hz (Worldwide compatible)',
        cableLength: '1.8 Meter durable cord with Indian standard 3-pin plug',
      },
      internalCostPrice: 750,
      sellingPrice: 1299,
      originalPrice: 2499,
      warranty: '30 Days Replacement Guarantee',
      stockQuantity: 10,
      availabilityStatus: 'AVAILABLE',
      publishStatus: 'PUBLISHED',
      isFeatured: false,
      images: [
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
      ],
    },
  ];

  for (const item of products) {
    const categoryId = categoryMap.get(item.categorySlug);
    if (!categoryId) continue;

    const existingProduct = await prisma.product.findUnique({
      where: { sku: item.sku },
    });

    if (!existingProduct) {
      const created = await prisma.product.create({
        data: {
          sku: item.sku,
          slug: item.slug,
          name: item.name,
          brand: item.brand,
          model: item.model,
          categoryId,
          condition: item.condition,
          description: item.description,
          specifications: JSON.stringify(item.specifications),
          internalCostPrice: item.internalCostPrice,
          sellingPrice: item.sellingPrice,
          originalPrice: item.originalPrice,
          warranty: item.warranty,
          stockQuantity: item.stockQuantity,
          availabilityStatus: item.availabilityStatus,
          publishStatus: item.publishStatus,
          isFeatured: item.isFeatured,
          images: {
            create: item.images.map((url, idx) => ({
              url,
              isPrimary: idx === 0,
              sortOrder: idx,
            })),
          },
        },
      });
      console.log(`✅ Seeded Product: ${created.name} (${created.sku})`);
    }
  }

  console.log('🎉 Seeding successfully completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

# DIGITAL MARKET - MASTER DEVELOPMENT TRACKER & DESIGN SPECIFICATION

> **CORE OPERATIONAL DIRECTIVE / MANDATORY PROTOCOL:**
> 1. **Read & Consult First:** Har step lene, naya component/API design karne, ya code likhne se pehle iss document (`my note/my Task .md`) ko thoroughly padhna hai.
> 2. **Edge Cases First:** Kisi bhi feature ko implement karne se pehle uske edge cases (stock race condition, price change, network fail, payload validation) ko define aur resolve karna hai.
> 3. **Live Progress Tracking:** Jaise-jaise development aage badhega, iss file me "Completed", "In-Progress", aur "Pending" sections ko immediately update karna hai.
> 4. **No Breaking Changes:** Koi bhi nayi cheez add ya remove karte waqt purane modules (Cart, Database schema, Auth, WhatsApp message payload) par impact verify karna zaroori hai.
> 5. **Design Consistency:** Website aur Admin panel me sirf aur sirf niche defined Universal Color Codes, Typography, Spacings aur Component Standards ka use hoga. Kahi bhi mismatched styles nahi honge.

---

## 1. UNIVERSAL DESIGN SYSTEM & UI TOKENS (DIGITAL MARKET)

To ensure a seamless, high-end, premium tech aesthetic across both Customer Website and Admin Dashboard, all components must strictly follow these design tokens:

### 1.1 Color Palette

| Token Name | Hex Code | Tailwind Equivalent | Usage / Purpose |
| :--- | :--- | :--- | :--- |
| **Brand Primary** | `#2563EB` | `bg-blue-600` / `text-blue-600` | Primary buttons, active states, key links, brand accents |
| **Brand Primary Hover** | `#1D4ED8` | `bg-blue-700` | Hover state for primary buttons |
| **Brand Dark / Header** | `#0F172A` | `bg-slate-900` / `text-slate-900` | Top header, footer, dark backgrounds, high contrast text |
| **Brand Dark Alt** | `#1E293B` | `bg-slate-800` | Secondary dark elements, admin sidebar background |
| **Accent / Cyan Highlight**| `#0EA5E9` | `bg-sky-500` / `text-sky-500` | Category badges, banner highlights, glowing highlights |
| **WhatsApp Green** | `#22C55E` | `bg-green-500` / `text-green-500` | Send Enquiry on WhatsApp CTA button, WhatsApp floating button |
| **WhatsApp Green Hover** | `#16A34A` | `bg-green-600` | Hover state for WhatsApp button |
| **Success / In-Stock** | `#10B981` | `bg-emerald-500` / `text-emerald-500` | "In Stock" badge, success toasts, verified checkmarks |
| **Warning / Refurbished** | `#F59E0B` | `bg-amber-500` / `text-amber-500` | "Refurbished / Good Condition" badge, stock warning (e.g. Only 1 left) |
| **Danger / Sold Out** | `#EF4444` | `bg-red-500` / `text-red-500` | "Sold Out" badge, price drop alert, delete action, errors |
| **Surface Background (Mint-White)** | `#F2F7F4` | `bg-surface` / custom | Main website body background (subtle greenish off-white, soft on eyes, avoids harsh glare) |
| **Surface Subtle Chip** | `#EAF4ED` | `bg-emerald-50/60` | Subtle pill chips, highlight badges, spec tags |
| **Card Surface / White** | `#FFFFFF` | `bg-white` | Product cards, modal popups, tables, input fields |
| **Border Neutral (Soft Mint)** | `#E1EDE5` | `border-slate-200/90` | Card borders, dividers, inputs (matches soft greenish hue) |
| **Border Neutral Dark** | `#334155` | `border-slate-700` | Admin dark table borders, dark mode dividers |
| **Text Primary (Dark)** | `#0F172A` | `text-slate-900` | Main headings, product titles, high-emphasis text |
| **Text Secondary (Muted)**| `#64748B` | `text-slate-500` | Spec descriptions, breadcrumbs, secondary labels |
| **Text Light / Muted** | `#94A3B8` | `text-slate-400` | Admin dark sidebar text, footer text, placeholders |

---

### 1.2 Typography Hierarchy

- **Primary Font Family:** `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
- **Heading Font Family (Optional Accent):** `'Plus Jakarta Sans', 'Inter', sans-serif`

| Element | Font Size | Font Weight | Line Height | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Display / Hero H1** | `2.5rem - 3.25rem` (40px - 52px) | `800` (Extrabold) | `1.15` | Hero section main banner text |
| **Section Heading H2** | `1.75rem - 2.25rem` (28px - 36px) | `700` (Bold) | `1.2` | Homepage section titles, category headings |
| **Card / Modal Title H3**| `1.125rem - 1.25rem` (18px - 20px) | `600` (Semibold) | `1.3` | Product card titles, admin panel widget titles |
| **Subheadings H4** | `1rem` (16px) | `600` (Semibold) | `1.4` | Filter headers, table headers, spec groups |
| **Body Regular** | `0.875rem - 1rem` (14px - 16px) | `400` (Normal) | `1.5` | Product descriptions, spec values, general text |
| **Body Small / Meta** | `0.75rem - 0.8125rem` (12px - 13px) | `500` (Medium) | `1.4` | Badges, timestamps, SKU labels, breadcrumbs |
| **Price (Large)** | `1.5rem - 1.875rem` (24px - 30px) | `800` (Extrabold) | `1` | Product Detail Page price display |
| **Price (Card)** | `1.125rem - 1.25rem` (18px - 20px) | `700` (Bold) | `1` | Product listing card price |

---

### 1.3 Universal Component Specifications, Structural Invariants & Layout Rules

#### A. Header & Navigation (STICKY INVARIANT)
- **Sticky / Fixed Behavior (MANDATORY):**
  - The entire header (`Navbar.tsx`) is wrapped in `<header className="sticky top-0 z-50 w-full bg-white border-b border-surface-border shadow-md">`.
  - **CRITICAL CSS RULE:** Under NO circumstance should `overflow-x: hidden` or `overflow: hidden` be added to `html`, `body`, or `CustomerLayout`. Doing so breaks `position: sticky` across Chromium, Safari, and Firefox. Use `overflow-x: clip` on `body` instead.
- **Three-Tier Cohesive Structure:**
  1. **Tier 1 (Top Bar):** Height `~28px`, `bg-slate-900 text-slate-300`, warranty assurance badge, direct WhatsApp contact link (`+91 96506 24535`), and Admin login link.
  2. **Tier 2 (Main Header):** Height `64px - 72px`, Brand Logo (`Laptop` icon + "DIGITAL MARKET" title), centered live search bar (desktop), Cart icon with live numerical counter badge, and mobile menu hamburger toggle.
  3. **Tier 3 (Category Bar):** Desktop category navigation bar (`bg-slate-50 border-t border-slate-100`) showing All Categories, Laptops, Desktops, etc. with active route highlighting. On mobile, this expands into an accessible drawer menu.
- **Mobile & Narrow Screen Support (280px - 480px):**
  - Logo font scales from `text-lg` to `text-2xl`.
  - Subline `Certified Refurbished & Used Tech` truncates cleanly.
  - Cart button shows icon + badge on ultra-small screens, adding text "Cart" only when width &ge; 400px.
  - Mobile search form is positioned cleanly below the header bar without overflowing.

#### B. Hero Section & Deal of the Week (AUTO-ROTATING INVARIANT)
- **Left Column:**
  - H1 Display heading with gradient accent.
  - Primary CTA: `Explore All Products` (`Button variant="primary"`).
  - Secondary CTA: `Refurbished Laptops →` (`Button variant="glass"`). Must use pure white text (`text-white`) with frosted glass background (`bg-white/10`) and translucent border (`border-white/40`) to guarantee 100% contrast without requiring mouse hover.
  - Trust indicators: 3-column grid (`30 Days`, `32-Point`, `Up to 70%`) with flexible font sizes (`text-base sm:text-xl md:text-2xl`).
- **Right Column (Deal of the Week Card):**
  - Auto-rotates across featured products every 4.5 seconds.
  - Pauses timer immediately when user hovers (`onMouseEnter` / `onMouseLeave`).
  - Next (`>`) and Previous (`<`) manual controls.
  - Pagination dot indicators showing active deal slide.
  - Displays product image, brand, model, SKU, key specs (CPU, RAM, SSD), selling price, original MSRP strike price, discount percentage badge ("Save X%"), and direct WhatsApp quotation link.

#### C. Product Card (Universal Grid Standard)
- **Container:** `bg-white border border-surface-border rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between overflow-hidden`.
- **Media Area:** Aspect ratio `4:3` with `bg-slate-50/60`, containing product image with fallback, Condition Badge (top-left), Discount Badge (top-left below condition), and Availability Badge (top-right).
- **Specs Pill Row:** Compact pills for Processor, RAM, and Storage (`bg-slate-100 text-slate-700 text-[10px] sm:text-[11px] px-2 py-0.5 rounded-md`).
- **Action Buttons:**
  - `Specs` (Secondary Outline with `Eye` icon).
  - `Add to Cart` (Primary Blue) or `In Cart (X)` (Emerald Green with checkmark).
  - Must use `px-2 sm:px-3 text-[11px] sm:text-xs truncate` to ensure buttons NEVER wrap into 2 lines or overflow on narrow screens.

#### D. Shopping Cart & LocalStorage Invariants
- **Persistence:** Saved in `localStorage` under key `digital_market_cart_v1`.
- **Integrity Guard:** No duplicate entries for same product; increments quantity.
- **Stock Cap:** Quantity stepper cannot exceed `product.stockQuantity`.
- **Price Integrity:** Final quotation calculation and verification performed on backend server (`POST /api/enquiries`), never trusting frontend state.
- **WhatsApp Generation:** Formats enquiry reference, customer details, and itemized specs targeting `919650624535`.

#### E. Buttons & Interactions
- **Primary Action (Add to Cart / Save / Confirm):** Height `44px`, `bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold`.
- **WhatsApp Action (Send Bulk Enquiry):** Height `48px`, `bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold flex items-center justify-center gap-2`.
- **Glass / Hero Action:** `bg-white/10 hover:bg-white/20 text-white border border-white/40 rounded-xl font-bold backdrop-blur-md`.
- **Outline Action:** `border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 rounded-xl`.
- **Destructive Action (Clear Cart / Delete):** `bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border border-red-200 rounded-xl`.

---

## 2. COMPREHENSIVE ARCHITECTURE & PROJECT BLUEPRINT

```
used-computer-store/
├── backend/                  # Node.js + Express + TypeScript + Prisma ORM
│   ├── src/
│   │   ├── config/          # Environment variables, database client, Cloudinary config
│   │   ├── controllers/     # Products, Categories, Enquiries, Admin Auth, Settings, Upload
│   │   ├── middlewares/     # Auth guard, Role guard, Error handler, Rate limit, Zod validation
│   │   ├── routes/          # Public routes (/api/products, etc.) & Admin routes (/api/admin/...)
│   │   ├── services/        # Business logic: Inventory calculation, WhatsApp message generator, etc.
│   │   ├── utils/           # Encryption, JWT/Cookie helpers, SKU generator, audit logger
│   │   ├── app.ts           # Express app setup, CORS, Helmet, CookieParser
│   │   └── server.ts        # Server entry point
│   ├── prisma/
│   │   ├── schema.prisma    # Complete PostgreSQL schema
│   │   ├── migrations/      # Versioned DB migrations
│   │   └── seed.ts          # Default admin user, sample store settings, base categories
│   ├── tsconfig.json
│   └── package.json
│
├── frontend/                 # React.js + Vite + TypeScript + Tailwind CSS
│   ├── src/
│   │   ├── assets/          # Logos, placeholder illustrations, icons
│   │   ├── components/
│   │   │   ├── common/      # Navbar, Footer, Button, Modal, Badge, Pagination, Toast, ImageWithFallback
│   │   │   ├── customer/    # ProductCard, ProductGrid, FilterSidebar, SearchBar, CartDrawer/Page
│   │   │   └── admin/       # AdminSidebar, AdminHeader, StatCard, DataTable, ImageUploader, SpecFields
│   │   ├── context/         # CartContext (localStorage persistence), AuthContext (admin session)
│   │   ├── hooks/           # useCart, useProducts, useDebounce, useSettings
│   │   ├── pages/
│   │   │   ├── customer/    # HomePage, ProductListingPage, ProductDetailPage, CartPage, NotFound
│   │   │   └── admin/       # AdminLoginPage, AdminDashboardPage, AdminProductsPage,
│   │   │                    # AdminProductFormPage, AdminEnquiriesPage, AdminSettingsPage
│   │   ├── services/        # Axios / Fetch API client with credentials support
│   │   ├── types/           # Shared TypeScript interfaces (Product, Enquiry, Category, Settings)
│   │   ├── utils/           # Currency formatter (₹ INR), WhatsApp link builder, date formatters
│   │   ├── App.tsx          # React Router setup with ProtectedRoute for /admin
│   │   ├── main.tsx
│   │   └── index.css        # Tailwind directives and custom scrollbar/utilities
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── package.json
│
├── docs/                     # System documentation, API specs, database backup instructions
├── my note/                  # TASK & PROGRESS ENGINE
│   └── my Task .md           # << YOU ARE HERE - Master Blueprint & Tracking Document >>
├── .gitignore
├── .env.example
└── README.md
```

---

## 3. DATABASE SCHEMA & DATA DICTIONARY (PRISMA + POSTGRESQL)

### Core Models:

1. **Admin & Role:**
   - `id`: UUID (Primary Key)
   - `email`: String (Unique)
   - `passwordHash`: String (bcrypt/Argon2)
   - `name`: String
   - `role`: Enum (`SUPER_ADMIN`, `ADMIN`)
   - `isActive`: Boolean
   - `createdAt`, `updatedAt`

2. **Category:**
   - `id`: UUID (PK)
   - `name`: String (e.g. "Laptops", "Desktop PCs", "Monitors", etc.)
   - `slug`: String (Unique, e.g. "laptops")
   - `description`: String?
   - `icon`: String?
   - `sortOrder`: Int (Default 0)
   - `isActive`: Boolean (Default true)

3. **Product:**
   - `id`: UUID (PK)
   - `sku`: String (Unique, e.g. "LAP-DELL-7490-001")
   - `slug`: String (Unique, SEO URL: e.g. "dell-latitude-7490-core-i7-16gb-512gb")
   - `name`: String
   - `brand`: String
   - `model`: String
   - `categoryId`: UUID (FK -> Category)
   - `condition`: Enum (`EXCELLENT_REFURBISHED`, `VERY_GOOD`, `GOOD`, `OPEN_BOX`, `NEW_SURPLUS`)
   - `description`: Text
   - `specifications`: JSONB (Dynamic category specs: processor, gen, ram, ramType, storageType, storageCapacity, displaySize, resolution, gpu, os, batteryHealth, ports, keyboard, etc.)
   - `internalCostPrice`: Decimal (PRIVATE - NEVER sent to customer APIs)
   - `sellingPrice`: Decimal (Customer Price)
   - `originalPrice`: Decimal? (MSRP / Strike price for discount perception)
   - `warranty`: String (e.g. "30 Days Testing Warranty + 6 Months Service Warranty")
   - `stockQuantity`: Int (Default 1 for unique second-hand units)
   - `availabilityStatus`: Enum (`AVAILABLE`, `OUT_OF_STOCK`, `SOLD`, `RESERVED`)
   - `publishStatus`: Enum (`DRAFT`, `PUBLISHED`, `UNPUBLISHED`)
   - `isFeatured`: Boolean (For Homepage banner/grid)
   - `viewsCount`: Int (Default 0)
   - `createdAt`, `updatedAt`, `deletedAt` (Soft delete)

4. **ProductImage:**
   - `id`: UUID (PK)
   - `productId`: UUID (FK -> Product)
   - `url`: String (Cloudinary secure URL)
   - `publicId`: String (For Cloudinary deletion)
   - `isPrimary`: Boolean
   - `sortOrder`: Int

5. **Enquiry:**
   - `id`: UUID (PK)
   - `enquiryRef`: String (Unique Human-friendly code: e.g. "ENQ-202611-0042")
   - `customerName`: String
   - `customerPhone`: String
   - `customerCity`: String
   - `customerMessage`: Text?
   - `status`: Enum (`NEW`, `CONTACTED`, `NEGOTIATION`, `CONVERTED`, `CLOSED`)
   - `internalNotes`: Text?
   - `subtotal`: Decimal
   - `estimatedTotal`: Decimal
   - `ipAddress`: String?
   - `createdAt`, `updatedAt`

6. **EnquiryItem (Historical Snapshots):**
   - `id`: UUID (PK)
   - `enquiryId`: UUID (FK -> Enquiry)
   - `productId`: UUID? (FK -> Product, Nullable if product later deleted)
   - `productSku`: String
   - `productName`: String
   - `unitPrice`: Decimal (Price locked at enquiry time)
   - `quantity`: Int
   - `specSnapshot`: JSONB (Key specs at the time enquiry was made)

7. **StoreSetting:**
   - `id`: String (Singleton PK: "STORE_CONFIG")
   - `businessName`: String (e.g. "DIGITAL MARKET")
   - `businessTagline`: String?
   - `logoUrl`: String?
   - `whatsappNumber`: String (Crucial: with country code e.g. "919650624535")
   - `contactPhone`: String? (e.g. "+91 96506 24535")
   - `contactEmail`: String?
   - `address`: Text?
   - `googleMapsUrl`: String?
   - `currencySymbol`: String (Default "₹")
   - `defaultWarrantyText`: String?
   - `seoTitle`: String?
   - `seoDescription`: String?
   - `socialLinks`: JSONB (Facebook, Instagram, YouTube)

8. **AuditLog:**
   - `id`: UUID (PK)
   - `adminId`: UUID?
   - `action`: String (e.g. "PRODUCT_UPDATE", "PRICE_CHANGE", "STATUS_CHANGE")
   - `entity`: String ("Product", "Enquiry", "Settings")
   - `entityId`: String
   - `meta`: JSONB (Before / After diffs)
   - `timestamp`: DateTime

---

## 4. CRITICAL EDGE CASES & TECHNICAL SOLUTIONS

| # | Edge Case | Potential Danger | Mandatory Solution |
| :--- | :--- | :--- | :--- |
| 1 | **Frontend Price Tampering** | Malicious user edits React state or inspects element to make ₹35,000 laptop ₹3,500. | **Never trust frontend cart prices.** When `POST /api/enquiries` is called with product IDs, backend queries PostgreSQL for current `sellingPrice`, computes `subtotal` on server, and saves verified prices in DB. |
| 2 | **Price Changed While in Cart** | Admin changes price from ₹25,000 to ₹27,000 while customer is browsing. | Before checkout/enquiry, client calls validation endpoint or cart syncs with server. If price changed, prompt user: "Price has been updated from ₹X to ₹Y. Please confirm." |
| 3 | **Product Sold Out While in Cart** | Only 1 unit of used Dell laptop available; another buyer walked in or bought it. | Before saving enquiry, backend verifies `availabilityStatus === 'AVAILABLE'` and `stockQuantity >= requestedQuantity`. If sold out, reject with clear itemized message and mark item as `Sold Out` in cart. |
| 4 | **Stock Quantity Overflow** | Customer enters quantity = 5 for a unique refurbished laptop with stock = 1. | Frontend enforces `max={product.stockQuantity}`. Backend rejects any enquiry item where `quantity > stockQuantity`. |
| 5 | **Admin Purchase Price Leak** | Competitors or customers inspect Network tab / API response and see dealer profit margin. | Prisma queries for public routes use explicit `select` excluding `internalCostPrice`. Public DTO types omit it completely. |
| 6 | **WhatsApp Link Truncation / Encoding** | Large cart (e.g. 10 items) causes WhatsApp URI length to exceed browser or app limits (>2000 chars). | Use structured Markdown for WhatsApp with clean formatting. If cart > 4 items, generate a clean summary list with Reference Code: "Ref: ENQ-XXXX | 4 Items Total: ₹XX,XXX (Full details saved in Digital Market database)". |
| 7 | **WhatsApp Pop-up Blocker / Fail to Open** | Browser blocks `window.open` or WhatsApp app not installed on PC. | Always save Enquiry to DB first and return `enquiryRef`. If WhatsApp redirect is blocked, show modal with "Enquiry Saved Successfully! Ref: #ENQ-XXXX", direct click button to WhatsApp, and a Copy Message button. |
| 8 | **Page Refresh / Tab Close** | Customer adds 3 items to cart, closes tab, comes back next day. | Cart state automatically persists in `localStorage` under `digital_market_cart_v1` with timestamp and versioning. |
| 9 | **Database Foreign Key Breakage on Delete** | Admin deletes a product that is linked to 5 historical customer enquiries. | Never hard-delete products with enquiries. Use soft-deletion (`deletedAt`). In `EnquiryItem`, `productId` is `SetNull` on delete and item stores snapshot of `productName`, `sku`, `price`. |
| 10| **WhatsApp Number Not Configured** | Fresh install has no WhatsApp number in DB; enquiry fails. | Admin seed script creates default setting record. System validates WhatsApp number format before accepting enquiries. |

---

## 4.1 LOADED AGENT SKILLS & SPECIALIZED RUNBOOKS (57 SKILLS INSTALLED)

The following skills have been verified, audited, and loaded into `.agent/skills/`, `.agents/skills/` and global config from `C:\Users\mmmm\Desktop\skills-for-antigravity-main`:

1. **Frontend & UI/UX Design (17 Skills):**
   - `frontend`, `react-patterns`, `tailwind-css`, `tailwind-ui`, `design-systems`, `forms-validation`, `ui-design`, `ux-design`, `typography`, `color-theory`, `landing-page-design`, `taste-and-craft`, `motion-design`, `icon-design`, `accessibility`, `accessibility-design`, `scroll-experience`.
2. **Backend & REST APIs (7 Skills):**
   - `backend`, `api-design`, `api-designer`, `file-uploads`, `rate-limiting`, `typescript-strict`, `error-handling`.
3. **Database & ORM (6 Skills):**
   - `prisma`, `postgres-wizard`, `database-schema-design`, `database-migrations`, `database-architect`, `caching-patterns`.
4. **Security, Auth & State (6 Skills):**
   - `auth-specialist`, `security-owasp`, `security-hardening`, `security`, `cybersecurity`, `state-management`.
5. **Code Quality, Review & Testing (8 Skills):**
   - `code-quality`, `code-reviewer`, `code-architecture-review`, `debugging-master`, `refactoring-guide`, `test-architect`, `testing-automation`, `testing-strategies`.
6. **DevOps, Deployment & Operations (7 Skills):**
   - `monorepo-management`, `docker-containerization`, `vercel-deployment`, `ci-cd-pipeline`, `git-workflow`, `logging-strategies`, `disaster-recovery`.
7. **Product, E-Commerce & SEO (4 Skills):**
   - `seo`, `product-management`, `pricing-strategy`, `copywriting`.
8. **Prototyping & Automation (2 Skills):**
   - `v0-dev`, `browser-automation`.

---

## 5. DEVELOPMENT EXECUTION TRACKER

### Status Codes:
- 🔴 `[TODO]` - Yet to start
- 🟡 `[IN-PROGRESS]` - Currently being worked on
- 🟢 `[COMPLETED]` - Built, verified and tested
- 🔵 `[TESTED & VERIFIED]` - End-to-end verified

| Phase | Module / Task Description | Target Deliverable | Status | Date / Note |
| :--- | :--- | :--- | :---: | :--- |
| **Phase 1** | **Monorepo Setup & Database Architecture** | | | |
| 1.1 | Initialize Monorepo Structure (`backend`, `frontend`, `my note`) | Root folder layout & gitignore | 🔵 | Clean monorepo structure |
| 1.2 | Setup Backend Environment with Express + TypeScript | Server boilerplate & scripts | 🔵 | Zero compiler errors |
| 1.3 | Configure PostgreSQL with Prisma ORM & Complete Schema | Schema with 8 models, enums & relations | 🔵 | SQLite local & PostgreSQL prod |
| 1.4 | Prisma Migrations & Database Seeding Script | Admin user, default settings, categories | 🔵 | 10 products, 8 categories, admin seeded |
| **Phase 2** | **Backend APIs & Secure Authentication** | | | |
| 2.1 | JWT / Cookie Admin Authentication Middleware & Auth Routes | Login, Logout, Session check | 🔵 | Tested & verified with cookies |
| 2.2 | Public Products API with Search, Filter & Pagination | `GET /api/products`, `GET /api/products/:slug` | 🔵 | internalCostPrice strictly protected |
| 2.3 | Public Categories & Store Settings API | `GET /api/categories`, `GET /api/store-settings` | 🔵 | Dynamic WhatsApp number |
| 2.4 | Admin Product CRUD API with JSONB Spec Support | Add, Edit, Delete, Duplicate, Toggle Status | 🔵 | Category specs dynamic support |
| 2.5 | Multi-image Upload API | Secure file upload & validation | 🔵 | Multer + Cloudinary / Local fallback |
| 2.6 | Public Enquiry Submission API with Server Price Validation | `POST /api/enquiries` with DB persistence | 🔵 | Verified server calculations |
| 2.7 | Admin Enquiry & Settings Management API | Status update, notes, store settings update | 🔵 | Full pipeline testing passed |
| **Phase 3** | **Admin Dashboard Frontend** | | | |
| 3.1 | Admin Shell, Sidebar, Responsive Layout & Auth Guard | Clean dark/light modern admin shell | 🔵 | ProtectedRoute + responsive drawer |
| 3.2 | Admin Dashboard Overview Metrics & Widgets | Stats (Products, Enquiries, Sold, Stock) | 🔵 | Live DB counts & pipeline value |
| 3.3 | Product Management Data Table (Search, Filter, Actions) | Fast data table with badge statuses | 🔵 | Search, filter, duplicate, delete |
| 3.4 | Dynamic Product Upload / Edit Form with Category Specs | Laptop vs Accessory spec switcher | 🔵 | Category-dynamic form fields |
| 3.5 | Image Manager (Multi-upload, Drag/Sort, Primary toggle) | Multi-image upload with primary star | 🔵 | Tested with previews & fallback |
| 3.6 | Category Manager & Inventory Status Updater | Quick inline stock & sold toggles | 🔵 | Category CRUD with product protection |
| 3.7 | Enquiry Manager with Status Pipeline & Customer Notes | Enquiry list, detail modal, status changer | 🔵 | Full modal with WhatsApp link |
| 3.8 | Store Settings Panel (WhatsApp, Logo, Address, SEO) | Real-time settings editor | 🔵 | Dynamic WhatsApp & SEO updater |
| **Phase 4** | **Customer Website Frontend & Catalogue** | | | |
| 4.1 | Customer Navigation, Header, Live Cart Pill & Footer | Premium electronics brand layout | 🔵 | Responsive navbar & trust footer |
| 4.2 | Homepage: Hero Banner, Featured, Latest, Categories | High-converting homepage | 🔵 | Tested deals, latest, category bar |
| 4.3 | Product Listing Page with Real-time Filters & Sorting | Brand, RAM, CPU, Price, Condition filters | 🔵 | Multi-param filter & pagination |
| 4.4 | SEO-Friendly Product Detail Page & Image Gallery | Spec table, condition tag, related items | 🔵 | Multi-image gallery & full specs |
| **Phase 5** | **Shopping Cart & Bulk WhatsApp Enquiry System** | | | |
| 5.1 | CartContext with LocalStorage Persistence & Live Counter | No duplicates, quantity sync | 🔵 | digital_market_cart_v1 persistence |
| 5.2 | Dedicated Cart Drawer / Cart Page with Price Breakdown | Interactive quantity, delete, subtotal | 🔵 | Stock limits & price calculation |
| 5.3 | Customer Info Modal & Validation (Name, Mobile, City) | Clean modal with form validation | 🔵 | Indian 10-digit phone validation |
| 5.4 | Server-side Price Verification & DB Enquiry Creation | Tamper-proof checkout flow | 🔵 | DB snapshot & ref code generated |
| 5.5 | Professional WhatsApp Message Generator & Redirect | Dynamic WhatsApp link with fallback dialog | 🔵 | Formatted markdown & retry button |
| **Phase 6** | **Inventory Integration & Edge Case Handling** | | | |
| 6.1 | Sold Out Protection & Real-time Availability Sync | Disable cart buttons for sold products | 🔵 | Tested & verified |
| 6.2 | Price Change Conflict Warning in Cart | Notification if admin changes price | 🔵 | Auto-sync on cart actions |
| 6.3 | Stock Exceeded Guard (Limit used units to 1) | Automatic quantity cap | 🔵 | Verified on client & server |
| **Phase 7** | **Security, SEO, Mobile Optimization & Polishing** | | | |
| 7.1 | Mobile-First Responsive Audit on All Screen Sizes | 320px to 4K display testing | 🔵 | Fully responsive Tailwind layout |
| 7.2 | SEO Metadata, OpenGraph, Canonical URLs, Sitemap | Search engine ready | 🔵 | Dynamic document.title & meta tags |
| 7.3 | Rate Limiting, Input Sanitization, Helmet & CORS Hardening | Security audit pass | 🔵 | Helmet + express-rate-limit active |
| **Phase 8** | **Production Deployment & Documentation** | | | |
| 8.1 | Build Verification (`vite build` & `tsc` clean compile) | Zero build errors | 🔵 | Both frontend & backend build 100% |
| 8.2 | Database Backup & Restore scripts | Disaster recovery documentation | 🔵 | docs/DATABASE_BACKUP_RESTORE.md |
| 8.3 | Production Deployment Guide (Vercel/Netlify + Render/VPS) | Step-by-step handover guide | 🔵 | docs/GITHUB_AND_DEPLOYMENT_GUIDE.md & docs/DEPLOYMENT.md |

---

## 6. WHAT TO DO VS. WHAT NOT TO DO (DO'S & DON'TS)

### What TO DO (Mandatory):
- ✅ Always use exact color codes:
  - Surface Background (Mint-White): `#F2F7F4` (Clean, soothing greenish-white tint, eliminates harsh white glare)
  - Border Neutral (Soft Mint): `#E1EDE5`
  - Subtle Highlight Chip: `#EAF4ED`
  - Brand Primary: `#2563EB`
  - Brand Dark: `#0F172A`
  - WhatsApp Green: `#22C55E`
  - Verified WhatsApp Target: `919650624535` / Display: `+91 96506 24535`
- ✅ Always validate customer phone number (10-digit Indian mobile format e.g. `[6-9][0-9]{9}`).
- ✅ Always format prices cleanly in Indian Rupees (`₹34,999` with comma separators).
- ✅ Always generate WhatsApp messages using the dynamic number stored in `StoreSetting` table.
- ✅ Always keep `internalCostPrice` private to admin only.
- ✅ Auto-rotate "Deal of the Week" every 4.5 seconds with pause-on-hover, dot indicators, and direct WhatsApp quotation link.
- ✅ Support responsive design for foldable phones (280px-340px), mobile phones (360px-480px), tablets (768px-1024px), and desktop with zero horizontal overflow.
- ✅ Provide single-click launch files (`start-all.bat` and `start-all.ps1`) for launching full-stack application instantly.

---

## 7. ONE-CLICK SERVER LAUNCH PROTOCOL

To start the complete full-stack platform (Backend API + Database + Frontend Dev Server + Browser Auto-open) with a single click:

1. **Option 1 (Double-Click Batch File - Recommended for Windows):**
   - Double-click `start-all.bat` in the project root directory `c:\Users\mmmm\Desktop\LAPTOP sell website\start-all.bat`.
   - Starts Express/Prisma on port 5000 in a dedicated window.
   - Starts Vite/React on port 5173 in a dedicated window.
   - Automatically opens `http://localhost:5173/` in your default browser.

2. **Option 2 (PowerShell Script):**
   - Open PowerShell in project directory and run: `.\start-all.ps1`

3. **Active Service Endpoints:**
   - **Customer Website:** `http://localhost:5173/`
   - **Admin Login:** `http://localhost:5173/admin/login` (Default Admin: `admin@digitalmarket.in` / `AdminPassword@123`)
   - **Backend API:** `http://localhost:5000/api/store-settings`
   - **Configured Phone:** `9650624535` (WhatsApp: `919650624535`)
4. **GitHub & Cloud Deployment Workflow:**
   - Full guide documented in `docs/GITHUB_AND_DEPLOYMENT_GUIDE.md`.
   - Flow: GitHub.com Repo creation -> Clone via GitHub Desktop URL -> Copy project code -> 1-click Push -> Connect Frontend to Vercel & Backend to Render.

---

### 6.1 ZERO-REGRESSION PROTOCOL (MANDATORY BEFORE ANY RELEASE OR MODIFICATION)

Whenever ANY change, feature, bug fix, or style edit is made, the developer/agent MUST systematically test these 6 invariants before concluding:

1. **Sticky Header Invariant:**
   - Scroll down the homepage and catalogue.
   - Verify that `<header>` (Logo, Search, Cart, and Category navigation bar) **STAYS FIXED AT THE TOP**.
   - Verify that neither `html` nor `body` has `overflow-x: hidden`.
2. **Scroll-To-Top On Navigation Invariant (CRITICAL):**
   - Whenever any product card, category link, cart, or breadcrumb is clicked, the new page MUST INSTANTLY scroll to the very top (`window.scrollTo({ top: 0, left: 0, behavior: 'instant' })`).
   - Managed automatically by `<ScrollToTop />` in `App.tsx` and in `ProductDetailPage.tsx` on slug change. No page should ever open scrolled down.
3. **Deal of the Week Invariant:**
   - Confirm it auto-rotates every 4.5 seconds.
   - Confirm hovering pauses rotation.
   - Confirm dot indicators and next/previous arrows switch deals smoothly.
4. **Button Contrast & Readability Invariant:**
   - Check Hero button ("Refurbished Laptops →") — it MUST be pure white on glass background with high contrast without mouse hover.
5. **Color Palette Invariant:**
   - Verify background is soft mint-tinted `#F2F7F4`, borders are `#E1EDE5`, and text is high-contrast `#0F172A`.
6. **Mobile & Foldable Layout Invariant:**
   - Test at 320px width: zero horizontal scrolling, buttons in cards do not wrap or overflow, and cart drawer functions cleanly.
7. **Build Integrity Invariant:**
   - Run `npm.cmd run build` in `frontend/` and ensure **0 errors**.

---

### What NOT TO DO (Strictly Prohibited):
- ❌ Do NOT add `overflow-x: hidden` to `html` or `body` — use `overflow-x: clip` on `body` instead.
- ❌ Do not hardcode product data or use mock arrays in production builds.
- ❌ Do not hardcode the WhatsApp number in frontend code.
- ❌ Do not store passwords in plain text or commit `.env` to Git.
- ❌ Do not expose admin routes or admin API endpoints without token/cookie authentication.
- ❌ Do not permit stock quantities > available inventory.
- ❌ Do not auto-delete sold products; preserve them for audit and historical enquiry integrity.
- ❌ Do not place placeholder buttons or dead links ("Lorem ipsum", "Coming soon").

# DIGITAL MARKET - REST API DOCUMENTATION

Base API Path: `/api`

All responses follow standard JSON structures:
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message string"
}
```

---

## 1. Public Customer Endpoints

### 1.1 Products Listing
- **Endpoint:** `GET /api/products`
- **Query Parameters:**
  - `search` (string): Text query matched against title, brand, model, specs
  - `category` (string): Category slug or ID
  - `brand` (string): e.g. Dell, Lenovo, HP, Apple
  - `condition` (string): `BRAND_NEW`, `OPEN_BOX`, `EXCELLENT_REFURBISHED`, `VERY_GOOD`, `GOOD`
  - `minPrice` / `maxPrice` (number): Price range filter in INR
  - `availability` (string): `AVAILABLE`, `OUT_OF_STOCK`, `SOLD`
  - `isFeatured` (boolean): `true` to filter homepage featured units
  - `sortBy` (string): `newest`, `price_asc`, `price_desc`, `popular`
  - `page` (number): Default `1`
  - `limit` (number): Default `12` (max `50`)
- **Security:** `internalCostPrice` is strictly hidden.

### 1.2 Single Product Details
- **Endpoint:** `GET /api/products/:slug`
- **Response:**
  - `data`: Complete product details, images gallery, category, parsed specifications.
  - `related`: Array of 4 similar products in the same category.
- **Side-effects:** Increments `viewsCount` automatically.

### 1.3 Categories
- **Endpoint:** `GET /api/categories`
- **Response:** Array of active categories with live `productCount`.

### 1.4 Store Settings
- **Endpoint:** `GET /api/store-settings`
- **Response:** Public business name, dynamic WhatsApp number, phone, email, address, warranty terms, and SEO meta tags.

### 1.5 Submit Bulk WhatsApp Cart Enquiry
- **Endpoint:** `POST /api/enquiries`
- **Rate Limit:** 10 requests / minute
- **Body Schema:**
  ```json
  {
    "customerName": "Rahul Sharma",
    "customerPhone": "9876543210",
    "customerCity": "New Delhi",
    "customerMessage": "Optional note",
    "items": [
      { "productId": "uuid-1", "quantity": 1 },
      { "productId": "uuid-2", "quantity": 1 }
    ]
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "enquiryRef": "ENQ-202611-1234",
      "subtotal": 49998,
      "estimatedTotal": 49998,
      "whatsappUrl": "https://wa.me/919876543210?text=...",
      "messageText": "Formatted text..."
    }
  }
  ```

---

## 2. Admin Authentication Endpoints

### 2.1 Admin Login
- **Endpoint:** `POST /api/admin/login`
- **Rate Limit:** 10 attempts / 15 minutes
- **Body:** `{ "email": "...", "password": "..." }`
- **Sets:** HTTP-only secure cookie `dm_admin_session` + returns JWT in JSON.

### 2.2 Admin Logout
- **Endpoint:** `POST /api/admin/logout`
- **Clears:** `dm_admin_session` cookie.

### 2.3 Verify Current Session
- **Endpoint:** `GET /api/admin/me`
- **Headers / Cookie:** Requires valid admin token.

---

## 3. Admin Product Management Endpoints (Protected)

- `GET /api/admin/products` — List all products with cost price and margin.
- `GET /api/admin/products/:id` — Get product for editing.
- `POST /api/admin/products` — Create product with JSONB specs and images.
- `PUT /api/admin/products/:id` — Update product.
- `DELETE /api/admin/products/:id` — Soft delete product (preserves historical enquiries).
- `POST /api/admin/products/:id/duplicate` — Clone product as Draft.
- `PATCH /api/admin/products/:id/toggle-featured` — Toggle homepage featured status.

---

## 4. Admin Enquiries Endpoints (Protected)

- `GET /api/admin/enquiries` — List customer enquiries with status filter.
- `GET /api/admin/enquiries/:id` — Detailed enquiry view with historical snapshots.
- `PUT /api/admin/enquiries/:id` — Update status (`NEW`, `CONTACTED`, `NEGOTIATION`, `CONVERTED`, `CLOSED`) and internal staff notes.

---

## 5. Admin Settings & Upload Endpoints (Protected)

- `GET /api/admin/settings` — Get current store settings.
- `PUT /api/admin/settings` — Update store name, WhatsApp number, etc.
- `POST /api/admin/upload` — Multipart image upload (up to 10 files, 5MB each).

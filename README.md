# Nexus — Everything, Refined. 🛒✨

A complete, production-quality consumer e-commerce web application engineered with **React 19**, **Vite**, **Tailwind CSS v4**, and **Firebase**. Built with an ultra-sleek, premium dark navy interface inspired by enterprise-grade hardware consoles, tailored specifically for general multi-category consumer retail.

---

## 🌟 Key Features

### 1. 🎨 Premium Dark Navy Design System
- **Tailored Palette**: Dark background (`#0B1220`), elevated surface cards (`#111A2C`), border strokes (`#223049`), high-contrast text (`#F1F5F9`), and vibrant accent blue (`#3B82F6`).
- **Typography & Elevation**: Crisp Inter font styling, 12px rounded cards, glassmorphic blurred navigation, and micro-interactions powered by Framer Motion.
- **Indian Standards**: All pricing formatted in Indian Rupees (**₹ INR**) with statutory **18% GST** calculations clearly itemized across cards, details, and checkout invoices.
- **Brand Consistency**: Brand name and motto dynamically sourced exclusively from `src/data/brand.js`.

### 2. 🔐 Authentication & Role-Based Access Control
- **Firebase Auth**: Secure Email & Password signup and login.
- **User Profiling**: Stores user documents in Firestore `users` collection defaulting to the `customer` role.
- **Admin Access**: Role `admin` securely unlocks `/admin` (Merchant Command Center).
- **Instant Demo Switcher**: Fast-fill demo credentials for Customer and Admin, plus an in-app developer toggle in the account dropdown menu for instant role switching during testing.

### 3. 📦 Multi-Category Product Catalog
- **6 Core Lifestyle Verticals**:
  1. **Electronics** (Laptops, Noise-Cancelling Headphones, 4K Monitors, Custom Keyboards)
  2. **Fashion** (Italian Blazers, Selvedge Denim, Cashmere Sweaters, Handcrafted Boots)
  3. **Home & Kitchen** (Espresso Machines, Dyson Cordless Vacuums, Cast Iron Dutch Ovens)
  4. **Books** (Hardcover Bestsellers, Systems Design Masterworks, Behavioral Psychology)
  5. **Beauty** (Advanced Night Repair Serums, Hair Dryers, Squalane Creams)
  6. **Sports** (Solar GPS Multisport Watches, Adjustable Dumbbells, Pro Tennis Rackets)
- **40-Product Firestore Seeder**: One-click "Seed 40 Products" button in `/admin` that populates Firestore with realistic items, SKU codes, pricing, stock levels, specs, and high-res Unsplash photography.

### 4. 🔍 Discovery, Search & Filtering
- **Real-Time Keyword Search**: Instant query filtering by product name, description, category, or SKU.
- **Granular Multi-Facet Filters**:
  - Category selector with SKU counts
  - Min/Max Price boundary filters with quick brackets (Under ₹1k, ₹1k–₹10k, ₹10k–₹50k, ₹50k+)
  - Customer rating threshold (4.5★, 4.0★, 3.5★, All)
  - In-stock inventory filter
- **Sorting Options**: Featured / Best Match, Price: Low to High, Price: High to Low, Highest Rated, and Alphabetical (A-Z).
- **Pagination & Active Filter Chips**: Removable filter chips with a "Clear All" action and multi-page indexing.

### 5. 🏷️ Product Detail Page
- High-resolution gallery preview with stock status badges.
- Detailed tax breakdown (inclusive 18% GST and base net price).
- Interactive Pincode Delivery Checker with simulated transit times (e.g., *Express Delivery by Tomorrow 2:00 PM*).
- Tabbed technical specifications, included accessories, and verified customer reviews.
- Related products recommendations within the same category vertical.

### 6. 🛍️ Cart & Wishlist
- **CartContext**: Persistent across sessions via `localStorage`, quantity increment/decrement controls, item deletion, and clear cart functionality.
- **Promo Code Engine**: Supports coupon vouchers (e.g. `NEXUS10` for 10% discount, `NEXUS18` for 18% tax offset).
- **WishlistContext**: Heart icon bookmarking accessible directly from cards or product details, with bulk "Add All to Cart" feature.

### 7. 💳 Multi-Step Checkout & Simulated Settlement
- **Step 1: Consignee Address**: Form validation ensuring valid email, 10-digit phone number, street address, and 6-digit postal PIN code.
- **Step 2: Logistics SLA**: Choose between Standard Surface Freight (Free over ₹999) or Expedited Air Cargo (₹149).
- **Step 3: Payment Gateway**:
  - **UPI 2.0**: Interactive QR Code simulation and VPA input field with instant verification.
  - **Credit / Debit Cards**: Secure sandbox card form with encrypted TLS simulation.
  - **Cash on Delivery**: Cash or UPI on delivery option.
- Order placement saves the complete order into Firestore `orders` with an auto-generated tracking ID (e.g. `NX-IND-99412`).

### 8. 🚚 Orders & Consignment Tracking
- Comprehensive order ledger filtered by authenticated user.
- **4-Step Chain of Custody Timeline**:
  - `Placed` (Order confirmed & payment verified)
  - `Packed` (Quality inspected at regional depot)
  - `Shipped` (In transit with priority air courier)
  - `Delivered` (Delivered safely to destination)
- Dispatched items manifest with item thumbnails, SKU tags, quantities, line totals, and "Buy Again" quick reordering.
- Simulated statutory GST tax invoice PDF download.

### 9. 🛡️ Merchant Admin Command Center (`/admin`)
- **Dashboard Overview**:
  - Total Gross Revenue / GMV in INR (₹)
  - Total Orders count
  - Registered User profiles count
  - Active SKU Inventory count
  - Revenue & Fulfillment monthly progression chart
  - Category volume distribution breakdown
  - Critical low-stock inventory alerts (< 15 units remaining)
- **Product Inventory CRUD**:
  - Add new product modal (name, category, price, MRP, stock, rating, SKU, description, specs, Unsplash image)
  - Edit existing product details
  - Delete product with confirmation
  - One-click Firestore catalog seeding
- **Order Fulfillment Controls**:
  - Real-time status dropdown updater (`Placed`, `Packed`, `Shipped`, `Delivered`) syncing directly to Firestore and updating customer timelines.

---

## 🛠️ Technology Stack

| Layer | Technology | Details |
|---|---|---|
| **Frontend Framework** | React 19 (`^19.3.1`) | Functional components, hooks, Context API |
| **Bundler & Tooling** | Vite 8 (`^8.3.4`) | High-speed ESM dev server & production builder |
| **Routing** | React Router v7 (`^7.18.4`) | Dynamic client-side routing, protected routes |
| **Styling & CSS** | Tailwind CSS v4 (`^4.3.3`) | Modern CSS token themes (`--color-bg`, `--color-surface`, etc.) |
| **Backend & Database** | Firebase 13 (`^13.1.0`) | Firebase Authentication & Cloud Firestore |
| **Icons & Micro-UI** | Lucide React (`^1.61.0`) | Feather-derived iconography |
| **Animations** | Framer Motion (`^14.6.0`) | Animated toast notifications and layout transitions |
| **Linting** | Oxlint (`^1.88.0`) | Rust-based high-performance JavaScript/React linter |

---

## 📁 Folder Structure

```
ecom-portal/
├── design/
│   └── screens/                # Reference design mockups
├── public/
│   ├── favicon.svg             # Application favicon
│   └── icons.svg
├── src/
│   ├── assets/                 # Static SVG/PNG assets
│   ├── components/
│   │   ├── common/
│   │   │   ├── AdminRoute.jsx      # Guard for role="admin"
│   │   │   └── ProtectedRoute.jsx  # Guard for authenticated users
│   │   ├── layout/
│   │   │   ├── Footer.jsx          # Dark navy footer with payment rails
│   │   │   └── Navbar.jsx          # Top banner, search, location, profile menu
│   │   └── product/
│   │       ├── ProductCard.jsx     # Card with badges, rating, specs, stepper
│   │       └── ProductSkeleton.jsx # Pulse skeleton loading placeholder
│   ├── context/
│   │   ├── AuthContext.jsx         # Firebase Auth, user profile, role switcher
│   │   ├── CartContext.jsx         # Cart items, quantities, promo code logic
│   │   ├── ToastContext.jsx        # Notification provider & animator
│   │   └── WishlistContext.jsx     # Saved items with localStorage persistence
│   ├── data/
│   │   ├── brand.js                # Single source of truth for brand name/tagline
│   │   └── seedProducts.js         # 40 realistic products across 6 categories
│   ├── pages/
│   │   ├── AdminPage.jsx           # Merchant command center & inventory CRUD
│   │   ├── AuthPage.jsx            # Sign in / sign up with demo autofill
│   │   ├── CatalogPage.jsx         # Search, multi-facet filters, sorting
│   │   ├── CheckoutPage.jsx        # Stepper address, transit SLA, payment gateway
│   │   ├── HomePage.jsx            # Hero, categories, flash deals, registry tabs
│   │   ├── NotFoundPage.jsx        # Styled 404 page
│   │   ├── OrdersPage.jsx          # Historic ledger & 4-step consignment tracking
│   │   ├── OrderSuccessPage.jsx    # Confirmation badge & tax summary
│   │   ├── ProductDetailPage.jsx   # Image gallery, GST pricing, pincode checker
│   │   └── WishlistPage.jsx        # Saved products & bulk cart addition
│   ├── services/
│   │   ├── firebase.js             # Firebase initialization from .env
│   │   ├── orderService.js         # Orders collection CRUD & local fallback
│   │   └── productService.js       # Products collection CRUD & seed loader
│   ├── utils/
│   │   └── formatters.js           # Currency (INR) and date formatters
│   ├── App.css                     # Custom scrollbars and glassmorphic utilities
│   ├── App.jsx                     # Router, layout wrapper, route definitions
│   ├── index.css                   # Tailwind v4 theme definitions
│   └── main.jsx                    # Application entry point
├── .env.example                # Example environment variables template
├── index.html                  # HTML entry point with Inter font & meta tags
├── package.json                # Project dependencies and npm scripts
├── vite.config.js              # Vite configuration
└── README.md                   # Project documentation
```

---

## ⚙️ Environment Configuration

Firebase configuration is loaded through environment variables prefixed with `VITE_`.
Create a `.env` file in the root directory (never commit this file to version control):

```env
VITE_FIREBASE_API_KEY="your-api-key"
VITE_FIREBASE_AUTH_DOMAIN="your-app.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="your-project-id"
VITE_FIREBASE_STORAGE_BUCKET="your-app.firebasestorage.app"
VITE_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
VITE_FIREBASE_APP_ID="your-app-id"
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Locally in Development Mode
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Build for Production
```bash
npm run build
```

### 4. Run Linter
```bash
npm run lint
```

---

## 📸 Design Screenshots & Visual References

The user interface follows the high-precision specifications in `design/screens/`:
- **Catalog & Browse**: Filter sidebar, active chips, SKU badges, price in ₹ (`design/screens/screen.png`)
- **Home Page**: Hero showcase banner, category pills, flash procurement window with timer (`design/screens/screen copy.png`)
- **Authentication**: Split layout with value highlights and tabbed sign-in/up card (`design/screens/screen copy 2.png`)
- **Merchant Admin**: Dashboard GMV metrics, inventory table, and fulfillment status updater (`design/screens/screen copy 3.png`)
- **Checkout**: Address form, delivery speed selection, UPI/card payment rails (`design/screens/screen copy 4.png`)
- **Orders & Tracking**: 4-step consignment timeline and dispatched items manifest (`design/screens/screen copy 5.png`)
- **Product Details**: Product showcase, 18% GST breakdown, pincode checker, and technical specifications (`design/screens/screen copy 6.png`)

---

## 🛡️ License

This project is built for the **Nexus** e-commerce portal and released under the MIT License.

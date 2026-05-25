# NewFeel PadCare — Project Context for Claude Code

## What is this project?

**NewFeel PadCare** is a mobile-first e-commerce web app for sanitary pads (Indian market). It's a full-stack MERN app with a React frontend and Express/MongoDB backend, deployed on AWS EC2.

- **Brand**: NewFeel
- **Product**: Sanitary pads (various sizes, absorbency levels, materials)
- **Currency**: INR (₹)
- **Pricing**: Two offers — ₹499 premium pad + free gift, and 6 small packs for ₹480 + free gift

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, Vite, Redux Toolkit, React Router 6, CSS Modules |
| Backend | Express 5, Mongoose/MongoDB, JWT auth (access + refresh tokens) |
| Payments | Razorpay (with COD fallback) |
| Image Uploads | Cloudinary |
| Auth | Email/password + Google OAuth (google-auth-library) |
| Deployment | AWS EC2 (Ubuntu), PM2, Nginx (reverse proxy) |

---

## Repo & Deployment

- **GitHub**: `https://github.com/DHANUSH59-CPU/Personal-Project.git` (branch: `main`)
- **EC2 Host**: `ubuntu@ip-172-31-37-115` (private IP)
- **EC2 Path**: `~/Personal-Project`
- **Process Manager**: PM2 (runs `server/src/server.js`)
- **EC2 deploy commands**:
  ```bash
  cd ~/Personal-Project
  git pull origin main
  cd server && npm install
  cd ../client && npm run build
  pm2 restart all
  ```

---

## Project Structure

```
Personal-Project/
├── client/                     # React frontend (Vite)
│   ├── public/uploads/         # Static product images (1st.jpeg–17th.jpeg, hero-product.jpeg)
│   ├── src/
│   │   ├── App.jsx             # Route definitions (lazy loaded)
│   │   ├── pages/              # Home, Shop, ProductDetail, Cart, Checkout, Profile, Orders, Login, Register
│   │   ├── pages/admin/        # Dashboard, ManageProducts, ManageOrders, ManageUsers
│   │   ├── components/
│   │   │   ├── layout/         # MainLayout, AdminLayout, Navbar, Footer
│   │   │   ├── auth/           # ProtectedRoute, AdminRoute
│   │   │   └── product/        # ProductCard (React.memo)
│   │   ├── store/
│   │   │   ├── store.js        # Redux store config
│   │   │   └── slices/         # authSlice, cartSlice, uiSlice
│   │   └── styles/
│   │       ├── index.css       # Global styles + CSS variables
│   │       ├── components/     # Navbar.module.css, Footer.module.css, ProductCard.module.css, AdminLayout.module.css
│   │       └── pages/          # Home.module.css, Shop.module.css, Cart.module.css, etc.
│   └── vite.config.js          # Dev proxy (/api → :5000), manualChunks for vendor splitting
│
├── server/                     # Express backend
│   ├── src/
│   │   ├── app.js              # Express app setup (compression, CORS, rate limiters, static serving)
│   │   ├── server.js           # Server startup + graceful shutdown
│   │   ├── config/
│   │   │   ├── env.js          # Environment variables
│   │   │   ├── db.js           # MongoDB connection
│   │   │   └── cloudinary.js   # Cloudinary config
│   │   ├── models/             # User, Product, Order, Cart, Category, Coupon, Review
│   │   ├── services/           # Business logic (auth, cart, order, payment, product, user)
│   │   ├── controllers/        # Route handlers (thin — delegate to services)
│   │   ├── routes/             # Express routers (auth, cart, order, product, category, coupon, review, upload, admin, user)
│   │   ├── middlewares/        # auth, error, role, upload, validate
│   │   ├── validators/         # Joi schemas (auth, order, product)
│   │   ├── utils/              # ApiError, ApiResponse, asyncHandler, helpers
│   │   └── seeders/seed.js     # DB seeder
│   └── package.json
│
└── .gitignore                  # Note: `!client/public/uploads/` exception for static images
```

---

## Key Architecture Decisions

### Frontend
- **Mobile-first design** — all CSS written for small screens first, media queries scale up
- **CSS Modules** — scoped styles per component/page (no global class conflicts)
- **Lazy loading** — all pages except Home are `React.lazy()` loaded
- **React.memo** — ProductCard and Footer wrapped for memoization
- **Vendor chunking** — Vite splits react, redux, and libs into separate cached bundles
- **Sticky navbar** — `position: sticky` (in document flow, NOT fixed). MainLayout `<main>` has NO paddingTop

### Backend
- **Service layer pattern** — controllers are thin, services contain business logic
- **Atomic operations** — `bulkWrite` for stock deduction, `findOneAndUpdate` with `$expr` for coupon usage
- **`.lean()`** — on all read-only Mongoose queries (returns plain JS objects, ~5x faster)
- **Singletons** — Razorpay client and Google OAuth2Client are cached, not recreated per request
- **Security** — regex escaping for search (prevents ReDoS/NoSQL injection), rate limiters on auth + payments
- **Compression** — gzip via `compression` middleware
- **Static caching** — Vite-built assets served with `maxAge: 1y, immutable: true`
- **Graceful shutdown** — handles SIGTERM/SIGINT, closes MongoDB connection cleanly

### Database Indexes
- `Order`: `{ user: 1, createdAt: -1 }`, `{ razorpayOrderId: 1 }`, `{ createdAt: -1 }`
- `Product`: `{ price: 1, avgRating: -1 }`, `{ category: 1, isActive: 1 }`, `{ name: 'text', description: 'text' }`

---

## Environment Variables (server/.env)

```
PORT=5000
NODE_ENV=production
MONGODB_URI=<MongoDB Atlas connection string>
JWT_ACCESS_SECRET=<secret>
JWT_REFRESH_SECRET=<secret>
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
CLOUDINARY_CLOUD_NAME=<name>
CLOUDINARY_API_KEY=<key>
CLOUDINARY_API_SECRET=<secret>
RAZORPAY_KEY_ID=<key>
RAZORPAY_KEY_SECRET=<secret>
GOOGLE_CLIENT_ID=<google-oauth-client-id>
CLIENT_URL=<production-url>
```

---

## API Routes Overview

| Prefix | Purpose |
|--------|---------|
| `/api/auth` | Register, login, logout, refresh token, Google OAuth |
| `/api/products` | List (with filters/search/sort/pagination), get by slug |
| `/api/cart` | Get, add item, update quantity, remove item, clear |
| `/api/orders` | Create (from cart), list user orders, cancel |
| `/api/orders/pay` | Create Razorpay order, verify payment |
| `/api/categories` | List, get by slug |
| `/api/reviews` | Get product reviews (paginated), create review |
| `/api/users` | Get profile, update profile, change password |
| `/api/upload` | Cloudinary image upload |
| `/api/admin` | Dashboard stats, manage products/orders/users/categories/coupons |

---

## Recent Commit History (latest first)

```
a287a40 perf: comprehensive backend optimization for production
34086e0 perf: lazy loading, memoization, and bundle optimization
5407c56 fix: remove 60px paddingTop causing white gap below navbar
38f065b feat: complete mobile-first UI redesign with NewFeel design language
4744cd8 fix: remove @capacitor/core import to fix AWS build
230803d feat: add Capacitor Android app support with CORS update
176c111 fix: lazy init Razorpay to prevent server crash when keys missing
9983f67 feat: add user order cancellation with stock restore
a8ea255 feat: prepare for production deployment
f643ef7 feat: complete ecommerce checkout, user, and admin flows
```

---

## Known Issues / Dead Code

- `server/src/models/Address.js` exists but is unused (was never deleted)
- Joi validation is missing on cart routes and user routes (updateProfile, changePassword)
- No unit/integration tests exist yet
- Capacitor Android support was added (commit `230803d`) but the mobile app build hasn't been tested recently

---

## Dev Commands

```bash
# Frontend dev server (port 5173, proxies /api to :5000)
cd client && npm run dev

# Backend dev server (port 5000)
cd server && npm run dev

# Production build
cd client && npm run build

# Start production server (serves built frontend + API)
cd server && NODE_ENV=production node src/server.js
```

# PadCare — E-Commerce Platform for Sanitary Pads

A full-stack MERN e-commerce platform for premium sanitary pads built with scalability in mind.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, Redux Toolkit, RTK Query, React Router v7 |
| Styling | CSS Modules with CSS Variables |
| Backend | Express.js 5, Mongoose, JWT Auth |
| Database | MongoDB Atlas |
| Payment | Razorpay |
| Upload | Multer + Cloudinary |

## Quick Start

```bash
# Install all dependencies (root + server + client)
npm run install-all

# Copy env sample and add your credentials
cp server/.env.example server/.env

# Start both server and client
npm run dev
```

## Project Structure

```
├── server/          # Express API (port 5000)
│   └── src/
│       ├── config/       # DB, env, cloudinary
│       ├── models/       # Mongoose schemas (8 models)
│       ├── routes/       # API routes
│       ├── controllers/  # Request handlers
│       ├── services/     # Business logic
│       ├── middlewares/   # Auth, error, validation, upload
│       ├── validators/   # Joi schemas
│       └── utils/        # Helpers, ApiError, ApiResponse
│
├── client/          # React app (port 5173)
│   └── src/
│       ├── api/          # RTK Query API slices
│       ├── store/        # Redux store + slices
│       ├── components/   # Reusable components
│       ├── pages/        # Page components
│       ├── hooks/        # Custom hooks
│       ├── utils/        # Constants, formatters
│       └── styles/       # CSS Modules + global
```

## Environment Variables

Copy `server/.env.example` to `server/.env` and fill in:
- `MONGODB_URI` — MongoDB Atlas connection string
- `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` — Random secret strings
- `CLOUDINARY_*` — Cloudinary credentials
- `RAZORPAY_*` — Razorpay API keys

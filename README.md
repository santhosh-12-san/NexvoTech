# Nexvo Technology | Full-Stack Dynamic AI Platform

> **"Blending Human and Artificial Intelligence"**  
> A production-ready, full-stack enterprise web application built with **Django REST Framework (DRF)**, **PostgreSQL**, **SimpleJWT Authentication**, **React.js**, **Tailwind CSS**, and **Three.js / React Three Fiber**.

---

## 🌟 Key Features

1. **Futuristic 3D Hero Canvas**:
   - Built with **Three.js** and **React Three Fiber (@react-three/fiber)**.
   - Interactive rotating faceted Quantum Core, orbiting glowing cubes, dynamic particle constellation, and cursor tracking illumination.
2. **Dynamic PostgreSQL & Django Backend**:
   - Dynamic **Features/Services** model & endpoints (`/api/features/`).
   - Dynamic **Pricing Plans** model & endpoints with JSON feature specifications (`/api/pricing/`).
   - Public **Contact Inquiry** ingestion (`/api/contact/`) with real-time validation and submission.
3. **Protected Admin Command Matrix (`/admin-dashboard`)**:
   - Secure SimpleJWT token authentication (`POST /api/token/`).
   - Inquiries Inbox: View, search, update status (`new`, `in_review`, `contacted`, `resolved`), or delete inquiries.
   - Live Feature Management: Add, edit, reorder, toggle visibility, and delete features dynamically.
   - Live Pricing Management: Add, edit, toggle popular badge, customize bullet points, and delete plans.
4. **Dynamic Multi-Color Theme & Background Engine**:
   - Built-in **Chromatic Matrix Engine** allowing users to select and preview **6 curated futuristic palettes**:
     - 🌐 **Cyber Cyan** (Deep Navy `#030712`, Electric Cyan `#38bdf8`, Indigo `#6366f1`)
     - 🟢 **Matrix Emerald** (Cyber Obsidian `#02140d`, Neon Mint `#34d399`, Emerald `#10b981`)
     - 🟣 **Synthwave Violet** (Cosmic Nebula `#0b0416`, Neon Magenta `#ec4899`, Violet `#c084fc`)
     - 🟡 **Solar Amber** (Quantum Bronze `#140902`, Molten Gold `#fbbf24`, Amber `#f59e0b`)
     - 🔴 **Crimson Apex** (Nether Ruby `#140206`, Cyber Red `#ef4444`, Rose `#f43f5e`)
     - ⚪ **Titanium Pure** (Deep Monolith `#050811`, Platinum Silver `#cbd5e1`, Slate `#94a3b8`)
   - **Full Synchronous Reactivity**: Instantly updates the **body background**, **3D Hero Three.js materials, lights, and floating particles**, **feature cards**, **pricing badges**, **form borders**, and **Admin Dashboard**.
   - Accessible via both the **Top Navigation Bar dropdown** and the **Floating Theme Dock widget** (bottom right).
   - Selection is saved automatically in `localStorage`.
5. **Resilient Database Architecture**:
   - Configured for **PostgreSQL** (`psycopg2-binary`) with an automatic SQLite fallback option for zero-friction setup.
6. **Modern Glassmorphic AI Theme**:
   - Deep dark space backgrounds (`#030712`), cyan/indigo/purple neon glows, responsive mobile navigation, and telemetry badges.

---

## 🏗️ Tech Stack

| Layer | Technologies |
|---|---|
| **Backend** | Python 3.11+, Django 5, Django REST Framework, SimpleJWT, CORS Headers |
| **Database** | PostgreSQL (Production) / SQLite (Development Fallback) |
| **Frontend** | React 18, Vite, React Router DOM v6, Axios |
| **Styling** | Tailwind CSS 3, Custom Glassmorphic Utilities, Custom Cyber Animations |
| **Icons & 3D** | Lucide React, Three.js, React Three Fiber |

---

## 📁 Repository Structure

```
projrct_nexvotechnology/
├── backend/
│   ├── api/
│   │   ├── management/commands/seed_data.py   # Database seeder (Admin, Features, Plans, Inquiries)
│   │   ├── migrations/                        # Database migration records
│   │   ├── admin.py                           # Django Admin model registration
│   │   ├── apps.py                            # Application configuration
│   │   ├── models.py                          # Feature, PricingPlan, ContactInquiry models
│   │   ├── permissions.py                     # Public read vs Admin write permissions
│   │   ├── serializers.py                     # Model serializers & JWT serializer
│   │   ├── urls.py                            # API routing (/api/features/, /api/pricing/, etc.)
│   │   └── views.py                           # DRF ModelViewSets & Admin Stats
│   ├── nexvo_backend/
│   │   ├── settings.py                        # Django configuration (CORS, JWT, DB)
│   │   ├── urls.py                            # Root URL routing
│   │   ├── wsgi.py
│   │   └── asgi.py
│   ├── manage.py                              # Django management script
│   ├── requirements.txt                       # Backend Python dependencies
│   ├── .env.example                           # Environment template
│   └── venv/                                  # Virtual environment
├── frontend/
│   ├── src/
│   │   ├── api/ or services/api.js            # Axios client with JWT interceptor
│   │   ├── context/AuthContext.jsx            # Authentication state & session manager
│   │   ├── components/
│   │   │   ├── Navbar.jsx                     # Glassmorphic top navigation & mobile menu
│   │   │   ├── Hero3D.jsx                     # Three.js 3D Canvas with quantum core & particles
│   │   │   ├── About.jsx                      # About us, architectural paradigm & metrics
│   │   │   ├── Features.jsx                   # Dynamic features grid from backend
│   │   │   ├── Pricing.jsx                    # Dynamic pricing cards with plan selection
│   │   │   ├── Testimonials.jsx               # Enterprise reviews & compliance badges
│   │   │   ├── Contact.jsx                    # Contact form submitting to /api/contact/
│   │   │   ├── Footer.jsx                     # Footer with system status
│   │   │   ├── ProtectedRoute.jsx             # Admin route guard
│   │   │   ├── FeatureModal.jsx               # Modal for adding/editing features
│   │   │   └── PricingModal.jsx               # Modal for adding/editing pricing plans
│   │   ├── pages/
│   │   │   ├── HomePage.jsx                   # Public portal
│   │   │   ├── AdminLoginPage.jsx             # Admin JWT login
│   │   │   └── AdminDashboardPage.jsx         # Admin command center
│   │   ├── App.jsx                            # Route definitions
│   │   ├── main.jsx                           # React root
│   │   └── index.css                          # Tailwind & glassmorphic styling
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
└── README.md
```

---

## ⚡ Quick Start Guide

### 1. Backend Setup (Django + PostgreSQL / SQLite)

1. Open a terminal in the project directory:
   ```powershell
   cd c:\Users\Lenovo\Desktop\projrct_nexvotechnology\backend
   ```

2. Activate the virtual environment:
   ```powershell
   # Windows PowerShell
   .\venv\Scripts\Activate.ps1
   # Or Command Prompt
   .\venv\Scripts\activate.bat
   ```

3. Configure Environment Variables:
   Copy `.env.example` to `.env`:
   ```powershell
   copy .env.example .env
   ```
   *To use PostgreSQL, set `USE_POSTGRES=True` in `.env` along with your database credentials (`DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`). If `USE_POSTGRES=False`, the application runs immediately on SQLite without requiring any database setup.*

4. Run Database Migrations:
   ```powershell
   python manage.py migrate
   ```

5. Seed Initial Data (Admin Superuser, Features, Pricing Plans, Inquiries):
   ```powershell
   python manage.py seed_data
   ```

6. Start the Backend Server:
   ```powershell
   python manage.py runserver 8000
   ```
   Backend will be running at `http://127.0.0.1:8000/`.

---

### 2. Frontend Setup (React + Tailwind + Three.js)

1. Open a new terminal in the frontend directory:
   ```powershell
   cd c:\Users\Lenovo\Desktop\projrct_nexvotechnology\frontend
   ```

2. Start the Vite Development Server:
   ```powershell
   npm run dev
   ```
   Frontend will be running at `http://localhost:5173/`.

---

## 🔑 Administrative Access

Pre-seeded administrator credentials created by `python manage.py seed_data`:

| Portal | URL | Username | Password |
|---|---|---|---|
| **Nexvo Admin Dashboard** | `http://localhost:5173/admin-login` | `admin` | `admin123` |
| **Django Admin Panel** | `http://127.0.0.1:8000/admin/` | `admin` | `admin123` |

### In the Admin Dashboard (`/admin-dashboard`), you can:
- **Review Inquiries**: Filter and view messages submitted from the public contact form, update statuses (`New`, `In Review`, `Contacted`, `Resolved`), or delete inquiries.
- **Manage Core Features**: Add new features, change titles/icons/badges/order, toggle public visibility, or delete them.
- **Manage Pricing Plans**: Dynamically edit subscription tiers, prices, billing frequency, feature bullet points, and highlight the popular plan.

---

## 📡 API Reference Endpoints

| Endpoint | Method | Permission | Description |
|---|---|---|---|
| `/api/features/` | `GET` | Public | List active features for public website |
| `/api/features/` | `POST` | Admin Only | Create a new feature (Requires JWT) |
| `/api/features/<id>/` | `PUT / PATCH` | Admin Only | Update an existing feature |
| `/api/features/<id>/` | `DELETE` | Admin Only | Delete a feature |
| `/api/pricing/` | `GET` | Public | List active pricing tiers |
| `/api/pricing/` | `POST` | Admin Only | Create a pricing tier (Requires JWT) |
| `/api/pricing/<id>/` | `PUT / PATCH` | Admin Only | Update a pricing tier |
| `/api/pricing/<id>/` | `DELETE` | Admin Only | Delete a pricing tier |
| `/api/contact/` | `POST` | Public | Submit an inquiry payload |
| `/api/contact/` | `GET` | Admin Only | List all contact inquiries |
| `/api/contact/<id>/` | `PATCH` | Admin Only | Update inquiry status |
| `/api/contact/<id>/` | `DELETE` | Admin Only | Delete an inquiry |
| `/api/token/` | `POST` | Public | Obtain JWT Access & Refresh tokens |
| `/api/token/refresh/` | `POST` | Public | Refresh expired JWT access token |
| `/api/admin/stats/` | `GET` | Admin Only | Fetch aggregate dashboard metrics |
#   N e x v o T e c h  
 
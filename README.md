# Ifte Samul — Full Stack Engineering Portfolio & SaaS Platform

A production-grade, high-performance portfolio and digital SaaS e-commerce platform built to replicate the design, functionality, and user experience of **https://iftesamulohy.com/**, powered by **Hono**, **Cloudflare Workers**, and **Cloudflare D1 (Serverless SQLite)**.

- **Live URL**: [https://saas.notabeneinc.workers.dev](https://saas.notabeneinc.workers.dev)
- **Cloudflare D1 Database UUID**: `5b2e6ecd-b1af-464e-8da5-1e5f3e58c4f8` (`saas`)
- **GitHub Repository**: `https://github.com/kaalikolom-ux/saas.git`

---

## 🌟 Key Features & Functionality

### 1. Complete Design & Interactivity
- **Identical Look & Feel**: Replicates the exact typography, space grotesque & Hind Siliguri fonts, dark/light themes, hero animations, interactive terminal widget, and layout of `iftesamulohy.com`.
- **Theme Toggle**: Real-time dark/light theme switching persisted in `localStorage` with system preference sync.
- **Floating Stack**:
  - Direct WhatsApp chat link (`+8801797418758`)
  - Messenger direct chat
  - Smooth scroll-to-top button
  - Floating 24-hour countdown offer pill & discount spinner

### 2. Interactive Offer Spinner Wheel
- **SVG Discount Wheel**: Interactive spinning wheel with physics, tick sound effects, canvas confetti celebration, and customizable winning probability segments (5% to 100%).
- **Server-Driven Spin API**: Validated via `/offers/spin/` and recorded into Cloudflare D1 `spins` table.
- **Dynamic Bundle Checkout**: Selecting winning discount calculates instant bundle cart savings on multiple products.

### 3. Digital Products E-Commerce Store (`/products/`)
- Complete catalog of 12 real Bengali digital books, guides, and cheat sheets:
  - *Git ও GitHub: আদি থেকে অন্ত* (৳93)
  - *জাদুর শহর JS* (৳98)
  - *C এর Sea* (৳99)
  - *ডেটাবেজ গোছানো* (৳111)
  - *নিজের AI Agent হাতে-কলমে* (৳480)
  - *লিনাক্স পোষ মানানো* (৳94)
  - *Journey by Python* (৳99)
  - *AI & ML Engineer গাইডলাইন* (Free)
  - *কন্টেক্সট ইঞ্জিনিয়ারিং হাতে-কলমে* (৳599)
  - *AI Debugging Prompt Pack* (Free)
  - *Git ও GitHub চিট শিট* (Free)
  - *ডাকঘরে Algorithm* (৳29)
- **Multi-Product Bundle Cart**: Corner checkbox badge on product cards, sticky cart footer bar with live total calculation and instant checkout redirect.
- **Product Landing Pages**: Individual product overview, preview, highlights, author note, and direct buy actions.

### 4. Masterclass Training Platform (`/courses/`)
- *Modern AI Powered Fullstack Development*: 4-month intensive training program (3 months hands-on curriculum + 1 month live client delivery with Strike Team).
- Curriculum breakdown, weekly syllabus, tech tool stack, and enrollment checkout.

### 5. Projects Portfolio (`/projects/`)
- Interactive project showcase (BD Mouza, Kretaa, HRMaster, ErpCons, Vroom, Vitadoc, CrossFitAssemble, etc.) with category filters (Django, AI & Automation, Management Systems, SaaS).
- Detailed project case studies with architectural highlights and live links.

### 6. Services & Transparent Pricing (`/services/` & `/services/pricing/`)
- Detailed service breakdown: Django Web Development, AI & Automation Systems, Meta Ads & CAPI, REST APIs & Serverless, DevOps & Cloudflare D1.
- Flexible packages: Hourly Support (৳1,500/hr), Full Stack Project (৳50,000), AI Automation System (৳80,000).

### 7. Technical Blog (`/blog/`)
- Category-filtered articles on Django, AI Automation, DevOps, and Freelancing with live search input.

### 8. Full Checkout & Payment Flow (`/payments/checkout/...`)
- Multi-item bundle checkout and single product/course checkout.
- Support for **bKash**, **Nagad**, **Rocket**, and Card / Bank payments.
- Order submission with customer details, TrxID validation, and order confirmation receipt (`/payments/checkout/success/:orderId`).

### 9. Customer Portal & Admin Dashboard (`/dashboard/`)
- **Customer Order Lookup**: Track purchases and access instant PDF downloads by email or phone.
- **Admin Analytics**: Real-time stats from Cloudflare D1:
  - Total Orders & Revenue in ৳
  - Client inquiries (CRM leads)
  - Spin conversions
  - Recent orders and leads tables

---

## 🗄️ Cloudflare D1 Database Schema

Configured with Cloudflare D1 database `5b2e6ecd-b1af-464e-8da5-1e5f3e58c4f8`:

```sql
-- Tables
contacts       -- CRM leads & inquiries
products       -- E-books, prompts & digital tools
courses        -- Masterclasses & training cohorts
projects       -- Case studies & portfolio builds
orders         -- Checkout records & payment verification
spins          -- Offer wheel engagement events
blog_posts     -- Tech articles & tutorials
```

---

## 🚀 Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Initialize Local D1 Database**:
   ```bash
   npm run db:init:local
   ```

3. **Start local development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:8787` in your browser.

---

## ☁️ Deployment to Cloudflare

1. **Deploy D1 Database Schema & Seed (Remote)**:
   ```bash
   npm run db:init:remote
   ```

2. **Deploy Worker & Static Assets**:
   ```bash
   npm run deploy
   ```

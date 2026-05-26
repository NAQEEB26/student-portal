# 🚀 CampusFlow - Setup Guide

## Prerequisites

- Node.js >= 16.0.0
- npm >= 8.0.0
- A [Supabase](https://supabase.com) account (free tier works)

---

## 🔧 SETUP STEPS

### **STEP 1: Clone and Install**

```bash
git clone https://github.com/NAQEEB26/student-portal.git
cd student-portal
npm install
```

### **STEP 2: Configure Environment**

```bash
cp .env.example .env
```

Edit `.env` and fill in your Supabase credentials:
- `SUPABASE_URL` — Your project URL (from Supabase dashboard > Settings > API)
- `SUPABASE_ANON_KEY` — Your anon/public key
- `SUPABASE_SERVICE_ROLE_KEY` — Your service role key (keep secret!)

### **STEP 3: Deploy Database Schema**

1. **Open Supabase Dashboard:**
   - Go to your project's **SQL Editor**

2. **Execute Schema:**
   - Open file: `supabase/schema.sql`
   - Copy the ENTIRE contents
   - Paste into Supabase SQL Editor
   - Click **"Run"**

3. **Deploy RLS Policies:**
   - Open file: `supabase/rls-policies.sql`
   - Copy and run in SQL Editor

4. **Add Seed Data (Optional):**
   - Open file: `supabase/seed.sql`
   - Copy and run in SQL Editor

---

## 🎯 VERIFICATION

After schema deployment, verify everything works:

```bash
# Run the test suite
npm test

# Validate production readiness
npm run validate-production

# Run simple tests
npm run test-simple
```

---

## 📋 PROJECT STRUCTURE

```
frontend/
├── index.html          # Landing page
├── pages/              # Application pages (login, dashboard, etc.)
├── assets/
│   ├── css/            # Stylesheets
│   └── js/             # JavaScript modules
scripts/                # Backend/deployment scripts
supabase/
├── schema.sql          # Database schema
├── rls-policies.sql    # Row Level Security policies
├── seed.sql            # Sample data
└── functions/          # Edge functions
```

---

## 🚀 RUNNING LOCALLY

```bash
# Serve the frontend with any static file server
npx live-server frontend/
```

---

## 📞 TROUBLESHOOTING

If you encounter issues:
1. Verify your `.env` file has correct credentials
2. Check Supabase dashboard for error messages
3. Ensure schema deployment was successful
4. Run connectivity tests: `node scripts/connectivity-test.cjs`

---

**🎯 READY FOR USE AFTER SCHEMA DEPLOYMENT!**
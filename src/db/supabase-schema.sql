-- =========================================================================
-- JAGOPORTO — SUPABASE CLOUD DATABASE SCHEMA
-- Jalankan SQL ini di Supabase Dashboard → SQL Editor → New Query → Run
-- Version: 2.0 (September 2026)
-- =========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =========================================================================
-- 1. OWNER PROFILE (Data profil Admin Master)
-- =========================================================================
CREATE TABLE IF NOT EXISTS owner_data (
    id VARCHAR(50) PRIMARY KEY DEFAULT 'OWNER-001',
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =========================================================================
-- 2. CUSTOMERS TABLE (Data semua pelanggan)
-- =========================================================================
CREATE TABLE IF NOT EXISTS customers (
    id VARCHAR(50) PRIMARY KEY,
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =========================================================================
-- 3. TEMPLATES TABLE (Katalog template)
-- =========================================================================
CREATE TABLE IF NOT EXISTS templates (
    id VARCHAR(50) PRIMARY KEY,
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =========================================================================
-- 4. TRANSACTIONS TABLE (Order & pembayaran)
-- =========================================================================
CREATE TABLE IF NOT EXISTS transactions (
    id VARCHAR(100) PRIMARY KEY,
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =========================================================================
-- 5. PAYMENT SETTINGS (Konfigurasi pembayaran)
-- =========================================================================
CREATE TABLE IF NOT EXISTS payment_settings (
    id VARCHAR(50) PRIMARY KEY DEFAULT 'default',
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =========================================================================
-- 6. PRICING PACKAGES (Paket harga)
-- =========================================================================
CREATE TABLE IF NOT EXISTS pricing_packages (
    id VARCHAR(50) PRIMARY KEY,
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =========================================================================
-- 7. PRICING FAQS (FAQ halaman pricing)
-- =========================================================================
CREATE TABLE IF NOT EXISTS pricing_faqs (
    id VARCHAR(50) PRIMARY KEY,
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) — Allow public read, authenticated write
-- =========================================================================

-- Enable RLS on all tables
ALTER TABLE owner_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_faqs ENABLE ROW LEVEL SECURITY;

-- Public read access for all tables (so visitors can see portfolio data)
CREATE POLICY "Public read owner_data" ON owner_data FOR SELECT USING (true);
CREATE POLICY "Public read customers" ON customers FOR SELECT USING (true);
CREATE POLICY "Public read templates" ON templates FOR SELECT USING (true);
CREATE POLICY "Public read transactions" ON transactions FOR SELECT USING (true);
CREATE POLICY "Public read payment_settings" ON payment_settings FOR SELECT USING (true);
CREATE POLICY "Public read pricing_packages" ON pricing_packages FOR SELECT USING (true);
CREATE POLICY "Public read pricing_faqs" ON pricing_faqs FOR SELECT USING (true);

-- Public write access (using anon key, secured by app-level PIN auth)
CREATE POLICY "Public write owner_data" ON owner_data FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public write customers" ON customers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public write templates" ON templates FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public write transactions" ON transactions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public write payment_settings" ON payment_settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public write pricing_packages" ON pricing_packages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public write pricing_faqs" ON pricing_faqs FOR ALL USING (true) WITH CHECK (true);

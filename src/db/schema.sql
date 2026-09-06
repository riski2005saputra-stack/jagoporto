-- =========================================================================
-- RISKI PROJEK — MULTI-TENANT MASTER PORTFOLIO DATABASE SCHEMA
-- Target Engine: PostgreSQL / Supabase / Neon / Cloud SQL
-- Version: 1.0 (March 2026)
-- Author: Riski Saputra (OWNER-001)
-- =========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE (Admin Master & Customers)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY, -- 'OWNER-001', 'CUST-001', etc.
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('master', 'customer', 'admin')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. PROFILES TABLE (ID Card, Bio, and Hero Data)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    job_title VARCHAR(255) NOT NULL,
    bio TEXT,
    email VARCHAR(255),
    whatsapp VARCHAR(50),
    avatar_url TEXT,
    education VARCHAR(255),
    experience_years VARCHAR(50) DEFAULT '3+',
    cert_count VARCHAR(50) DEFAULT '6+',
    is_published BOOLEAN DEFAULT TRUE,
    slug VARCHAR(255) UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. TECHNICAL SKILLS TABLE
CREATE TABLE IF NOT EXISTS skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) DEFAULT 'Engineering',
    level VARCHAR(50) DEFAULT 'Expert',
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. PROJECTS SHOWCASE CATALOG TABLE (3 Pillars of Engineering)
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
    project_code VARCHAR(100),
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    sub_category VARCHAR(255),
    type VARCHAR(50) DEFAULT 'mechanical',
    live_url TEXT,
    cover_image TEXT,
    short_desc TEXT,
    planning TEXT,
    analysis TEXT,
    fabrication TEXT,
    tools JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. CERTIFICATES & CREDENTIALS TABLE
CREATE TABLE IF NOT EXISTS certificates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    issuer VARCHAR(255) NOT NULL,
    year VARCHAR(20),
    credential_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. CV FILES TABLE
CREATE TABLE IF NOT EXISTS cv_files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_size_kb INT,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. MASTER TEMPLATES CATALOG TABLE
CREATE TABLE IF NOT EXISTS templates (
    id VARCHAR(50) PRIMARY KEY, -- 'TMPL-001', 'TMPL-002', etc.
    name VARCHAR(255) NOT NULL,
    version VARCHAR(50) NOT NULL,
    edition VARCHAR(255),
    category VARCHAR(100),
    theme_accent VARCHAR(255),
    badge_color VARCHAR(255),
    description TEXT,
    is_default BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'active',
    features JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. CUSTOMER PORTFOLIOS MULTI-TENANT TABLE
CREATE TABLE IF NOT EXISTS customer_portfolios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
    template_id VARCHAR(50) REFERENCES templates(id),
    slug VARCHAR(255) UNIQUE NOT NULL,
    custom_domain VARCHAR(255),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'draft')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expired_at TIMESTAMP WITH TIME ZONE
);

-- 9. ORDERS & PAYMENTS TABLE
CREATE TABLE IF NOT EXISTS orders_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
    template_id VARCHAR(50) REFERENCES templates(id),
    order_number VARCHAR(100) UNIQUE NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled', 'refunded')),
    payment_method VARCHAR(50),
    proof_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    paid_at TIMESTAMP WITH TIME ZONE
);

-- =========================================================================
-- INITIAL SEED DATA: MASTER OWNER (OWNER-001)
-- =========================================================================

-- Insert Master Owner User
INSERT INTO users (id, email, role, status)
VALUES ('OWNER-001', 'riski2005saputra@gmail.com', 'master', 'active')
ON CONFLICT (id) DO NOTHING;

-- Insert Master Owner Profile
INSERT INTO profiles (user_id, full_name, job_title, bio, email, whatsapp, education, experience_years, cert_count, slug)
VALUES (
    'OWNER-001',
    'Riski Saputra',
    'Mechanical Engineer | Product Designer',
    'Spesialis perancangan sistem mekanikal, 3D CAD modeling, dan analisis simulasi teknik.',
    'riski2005saputra@gmail.com',
    'https://wa.me/6282283084803',
    'D3 Teknik Mesin UNRI',
    '3+',
    '6+',
    'riski-saputra'
)
ON CONFLICT DO NOTHING;

-- Insert Initial Master Template
INSERT INTO templates (id, name, version, edition, category, theme_accent, description, is_default, status)
VALUES (
    'TMPL-001',
    'Industrial Dark Red Master',
    'V1.0',
    'Master Industrial Edition',
    'Engineering & Industrial',
    'Dark Red / Burgundy & Gold',
    'Template utama dengan background metal merah gelap SVG, kanvas 192-frame cinematic refinery, dan ID Card 3D gantung interaktif.',
    TRUE,
    'active'
)
ON CONFLICT (id) DO NOTHING;

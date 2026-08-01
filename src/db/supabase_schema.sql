-- ====================================================================
-- GROCERY MANAGEMENT SYSTEM - SUPABASE DATABASE SCHEMA
-- Copy and paste this script into your Supabase SQL Editor (https://supabase.com)
-- ====================================================================

-- 1. PROFILES / USERS TABLE
CREATE TABLE IF NOT EXISTS profiles (
  id VARCHAR(50) PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  other_names VARCHAR(100),
  email VARCHAR(150) UNIQUE NOT NULL,
  phone_number VARCHAR(30),
  ghana_card_id VARCHAR(50),
  location VARCHAR(150),
  date_of_employment DATE,
  notes TEXT,
  avatar_url TEXT,
  role VARCHAR(20) NOT NULL DEFAULT 'worker', -- 'admin' or 'worker'
  password VARCHAR(255) NOT NULL,
  last_active TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS categories (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE
);

-- 3. STORE LOCATIONS TABLE
CREATE TABLE IF NOT EXISTS store_locations (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE
);

-- 4. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  variant VARCHAR(100),
  description TEXT,
  supplier_info TEXT,
  expiration_date DATE,
  category_id VARCHAR(50) REFERENCES categories(id) ON DELETE SET NULL,
  location_id VARCHAR(50) REFERENCES store_locations(id) ON DELETE SET NULL,
  cost_price NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  selling_price NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  quantity_in_stock INT NOT NULL DEFAULT 0,
  initial_quantity INT NOT NULL DEFAULT 0,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR(50) PRIMARY KEY, -- e.g. AB785420
  customer_name VARCHAR(150),
  customer_phone VARCHAR(30),
  total_amount NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  order_date VARCHAR(20) NOT NULL, -- DD-MM-YYYY
  order_time VARCHAR(20) NOT NULL, -- 1:49AM
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  worker_id VARCHAR(50) REFERENCES profiles(id) ON DELETE SET NULL,
  worker_name VARCHAR(150),
  pdf_file_name VARCHAR(255)
);

-- 6. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id VARCHAR(50) REFERENCES orders(id) ON DELETE CASCADE,
  product_id VARCHAR(50) REFERENCES products(id) ON DELETE SET NULL,
  product_name VARCHAR(150) NOT NULL,
  variant VARCHAR(100),
  unit_price NUMERIC(10,2) NOT NULL,
  quantity INT NOT NULL,
  total_price NUMERIC(10,2) NOT NULL
);

-- 7. ANNOUNCEMENTS TABLE
CREATE TABLE IF NOT EXISTS announcements (
  id VARCHAR(50) PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  target_user_ids TEXT[], -- Array of worker IDs
  scheduled_for TIMESTAMP WITH TIME ZONE
);

-- 8. NOTES TABLE
CREATE TABLE IF NOT EXISTS notes (
  id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(50) REFERENCES profiles(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  body TEXT,
  last_edited_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. FEEDBACK MESSAGES TABLE
CREATE TABLE IF NOT EXISTS feedback_messages (
  id VARCHAR(50) PRIMARY KEY,
  worker_id VARCHAR(50) REFERENCES profiles(id) ON DELETE CASCADE,
  worker_name VARCHAR(150),
  sender_role VARCHAR(20) NOT NULL, -- 'admin' or 'worker'
  message TEXT NOT NULL,
  attachment_url TEXT,
  attachment_type VARCHAR(20),
  read_by_admin BOOLEAN DEFAULT FALSE,
  read_by_worker BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. ACTIVITY LOGS TABLE
CREATE TABLE IF NOT EXISTS activity_logs (
  id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(50),
  user_name VARCHAR(150),
  role VARCHAR(20),
  action VARCHAR(50),
  details TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  log_date DATE NOT NULL DEFAULT CURRENT_DATE
);

-- 11. SYSTEM SETTINGS TABLE
CREATE TABLE IF NOT EXISTS system_settings (
  id INT PRIMARY KEY DEFAULT 1,
  shop_name VARCHAR(150) DEFAULT 'Beauty Salon',
  company_logo_url TEXT,
  phone VARCHAR(50) DEFAULT '054 285 9612',
  email VARCHAR(100) DEFAULT 'info@grocery.com',
  address VARCHAR(200) DEFAULT 'Accra, Ghana',
  currency VARCHAR(10) DEFAULT 'GH₵',
  currency_code VARCHAR(10) DEFAULT 'GHS',
  admin_email VARCHAR(100) DEFAULT 'admin@grocery.com'
);

-- INSERT INITIAL ADMIN USER
INSERT INTO profiles (id, first_name, last_name, other_names, email, phone_number, ghana_card_id, location, date_of_employment, notes, avatar_url, role, password)
VALUES (
  'ADMIN001',
  'System',
  'Admin',
  'Manager',
  'admin@grocery.com',
  '0542859612',
  'GHA-000000000-1',
  'Head Office',
  '2026-01-01',
  'System Primary Administrator',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  'admin',
  'AdminPassword123'
) ON CONFLICT (id) DO NOTHING;

-- INSERT DEFAULT SYSTEM SETTINGS
INSERT INTO system_settings (id, shop_name, phone, email, address, currency, currency_code)
VALUES (1, 'Beauty Salon', '054 285 9612', 'info@beautysalon.com', 'Accra, Ghana', 'GH₵', 'GHS')
ON CONFLICT (id) DO NOTHING;

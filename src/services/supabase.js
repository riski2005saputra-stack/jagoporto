/**
 * JAGOPORTO — SUPABASE CLIENT CONFIGURATION
 * Connects to Supabase PostgreSQL cloud database
 * Version: 1.0 (September 2026)
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_PROJECT_URL = 'https://oghqtplsggvygjzyawao.supabase.co';
const SUPABASE_DEFAULT_ANON_KEY = 'sb_publishable_5fTrABYH8vGVucYLG7gb4w_ZVoOGYuA';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || SUPABASE_PROJECT_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || SUPABASE_DEFAULT_ANON_KEY;

// Create client with URL and publishable anon key
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const isSupabaseConnected = () => Boolean(supabase);


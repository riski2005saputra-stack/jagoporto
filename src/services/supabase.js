/**
 * JAGOPORTO — SUPABASE CLIENT CONFIGURATION
 * Connects to Supabase PostgreSQL cloud database
 * Version: 1.0 (September 2026)
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Only create client if credentials are provided
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const isSupabaseConnected = () => Boolean(supabase);

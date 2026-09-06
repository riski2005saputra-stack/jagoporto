/**
 * JAGOPORTO — UNIVERSAL DATABASE & BACKEND SERVICE LAYER
 * Supports:
 * 1. Cloud Supabase / PostgreSQL Client (when VITE_SUPABASE_URL is provided)
 * 2. Fallback to Local Transactional Engine (Offline-First / Zero-Config)
 * Version: 2.0 (September 2026)
 */

import { supabase, isSupabaseConnected } from './supabase';

// =========================================================================
// LOCAL STORAGE FALLBACK (used when Supabase is not configured)
// =========================================================================
const LOCAL_KEYS = {
  OWNER: 'riski_owner_portfolio_v1',
  CUSTOMERS: 'riski_customers_list_v1',
  TEMPLATES: 'riski_templates_list_v1',
  TRANSACTIONS: 'riski_transactions_list_v1',
  PAYMENT_SETTINGS: 'riski_payment_settings_v1',
  PRICING_PACKAGES: 'riski_pricing_packages_v1',
  PRICING_FAQS: 'riski_pricing_faqs_v1',
};

function readLocal(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function writeLocal(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn(`[DB Local] Failed writing ${key}:`, e);
  }
}

// =========================================================================
// DATABASE SERVICE — Auto-detects Supabase or falls back to localStorage
// =========================================================================
export const db = {
  isCloudConnected: isSupabaseConnected,

  getEngineName: () => {
    return isSupabaseConnected()
      ? 'Supabase Cloud PostgreSQL Engine'
      : 'Local Transactional Database Engine (Offline-First)';
  },

  // =======================================================================
  // 1. OWNER DATA (Admin Master profile, skills, projects, etc.)
  // =======================================================================
  ownerData: {
    get: async () => {
      if (isSupabaseConnected()) {
        const { data, error } = await supabase
          .from('owner_data')
          .select('data')
          .eq('id', 'OWNER-001')
          .single();
        if (error || !data) return null;
        return data.data;
      }
      return readLocal(LOCAL_KEYS.OWNER, null);
    },

    save: async (ownerObj) => {
      if (isSupabaseConnected()) {
        const { error } = await supabase
          .from('owner_data')
          .upsert({
            id: 'OWNER-001',
            data: ownerObj,
            updated_at: new Date().toISOString(),
          });
        if (error) console.error('[DB Cloud] ownerData.save error:', error);
        return !error;
      }
      writeLocal(LOCAL_KEYS.OWNER, ownerObj);
      return true;
    },
  },

  // =======================================================================
  // 2. CUSTOMERS
  // =======================================================================
  customers: {
    list: async () => {
      if (isSupabaseConnected()) {
        const { data, error } = await supabase
          .from('customers')
          .select('id, data, created_at')
          .order('created_at', { ascending: false });
        if (error) {
          console.error('[DB Cloud] customers.list error:', error);
          return [];
        }
        return (data || []).map((row) => ({ ...row.data, id: row.id }));
      }
      return readLocal(LOCAL_KEYS.CUSTOMERS, []);
    },

    create: async (customerObj) => {
      if (isSupabaseConnected()) {
        const { error } = await supabase
          .from('customers')
          .insert({
            id: customerObj.id,
            data: customerObj,
          });
        if (error) console.error('[DB Cloud] customers.create error:', error);
        return !error;
      }
      const list = readLocal(LOCAL_KEYS.CUSTOMERS, []);
      list.unshift(customerObj);
      writeLocal(LOCAL_KEYS.CUSTOMERS, list);
      return true;
    },

    update: async (id, updatedData) => {
      if (isSupabaseConnected()) {
        // Fetch current, merge, save
        const { data: existing } = await supabase
          .from('customers')
          .select('data')
          .eq('id', id)
          .single();
        const merged = { ...(existing?.data || {}), ...updatedData, id };
        const { error } = await supabase
          .from('customers')
          .upsert({
            id,
            data: merged,
            updated_at: new Date().toISOString(),
          });
        if (error) console.error('[DB Cloud] customers.update error:', error);
        return !error;
      }
      const list = readLocal(LOCAL_KEYS.CUSTOMERS, []);
      const updated = list.map((c) => (c.id === id ? { ...c, ...updatedData } : c));
      writeLocal(LOCAL_KEYS.CUSTOMERS, updated);
      return true;
    },

    delete: async (id) => {
      if (isSupabaseConnected()) {
        const { error } = await supabase
          .from('customers')
          .delete()
          .eq('id', id);
        if (error) console.error('[DB Cloud] customers.delete error:', error);
        return !error;
      }
      const list = readLocal(LOCAL_KEYS.CUSTOMERS, []);
      writeLocal(LOCAL_KEYS.CUSTOMERS, list.filter((c) => c.id !== id));
      return true;
    },

    saveAll: async (customersArray) => {
      if (isSupabaseConnected()) {
        // Upsert all customers at once
        const rows = customersArray.map((c) => ({
          id: c.id,
          data: c,
          updated_at: new Date().toISOString(),
        }));
        const { error } = await supabase
          .from('customers')
          .upsert(rows);
        if (error) console.error('[DB Cloud] customers.saveAll error:', error);
        return !error;
      }
      writeLocal(LOCAL_KEYS.CUSTOMERS, customersArray);
      return true;
    },
  },

  // =======================================================================
  // 3. TEMPLATES
  // =======================================================================
  templates: {
    list: async () => {
      if (isSupabaseConnected()) {
        const { data, error } = await supabase
          .from('templates')
          .select('id, data, created_at')
          .order('created_at', { ascending: true });
        if (error) {
          console.error('[DB Cloud] templates.list error:', error);
          return [];
        }
        return (data || []).map((row) => ({ ...row.data, id: row.id }));
      }
      return readLocal(LOCAL_KEYS.TEMPLATES, []);
    },

    create: async (templateObj) => {
      if (isSupabaseConnected()) {
        const { error } = await supabase
          .from('templates')
          .insert({
            id: templateObj.id,
            data: templateObj,
          });
        if (error) console.error('[DB Cloud] templates.create error:', error);
        return !error;
      }
      const list = readLocal(LOCAL_KEYS.TEMPLATES, []);
      list.push(templateObj);
      writeLocal(LOCAL_KEYS.TEMPLATES, list);
      return true;
    },

    add: async (templateObj) => {
      // Alias for create (backward compat)
      return db.templates.create(templateObj);
    },

    update: async (id, updatedData) => {
      if (isSupabaseConnected()) {
        const { data: existing } = await supabase
          .from('templates')
          .select('data')
          .eq('id', id)
          .single();
        const merged = { ...(existing?.data || {}), ...updatedData, id };
        const { error } = await supabase
          .from('templates')
          .upsert({
            id,
            data: merged,
            updated_at: new Date().toISOString(),
          });
        if (error) console.error('[DB Cloud] templates.update error:', error);
        return !error;
      }
      const list = readLocal(LOCAL_KEYS.TEMPLATES, []);
      const updated = list.map((t) => (t.id === id ? { ...t, ...updatedData } : t));
      writeLocal(LOCAL_KEYS.TEMPLATES, updated);
      return true;
    },

    delete: async (id) => {
      if (isSupabaseConnected()) {
        const { error } = await supabase
          .from('templates')
          .delete()
          .eq('id', id);
        if (error) console.error('[DB Cloud] templates.delete error:', error);
        return !error;
      }
      const list = readLocal(LOCAL_KEYS.TEMPLATES, []);
      writeLocal(LOCAL_KEYS.TEMPLATES, list.filter((t) => t.id !== id));
      return true;
    },

    saveAll: async (templatesArray) => {
      if (isSupabaseConnected()) {
        const rows = templatesArray.map((t) => ({
          id: t.id,
          data: t,
          updated_at: new Date().toISOString(),
        }));
        const { error } = await supabase
          .from('templates')
          .upsert(rows);
        if (error) console.error('[DB Cloud] templates.saveAll error:', error);
        return !error;
      }
      writeLocal(LOCAL_KEYS.TEMPLATES, templatesArray);
      return true;
    },
  },

  // =======================================================================
  // 4. TRANSACTIONS / ORDERS
  // =======================================================================
  transactions: {
    list: async () => {
      if (isSupabaseConnected()) {
        const { data, error } = await supabase
          .from('transactions')
          .select('id, data, created_at')
          .order('created_at', { ascending: false });
        if (error) {
          console.error('[DB Cloud] transactions.list error:', error);
          return [];
        }
        return (data || []).map((row) => ({ ...row.data, id: row.id }));
      }
      return readLocal(LOCAL_KEYS.TRANSACTIONS, []);
    },

    create: async (txObj) => {
      if (isSupabaseConnected()) {
        const { error } = await supabase
          .from('transactions')
          .insert({
            id: txObj.id,
            data: txObj,
          });
        if (error) console.error('[DB Cloud] transactions.create error:', error);
        return !error;
      }
      const list = readLocal(LOCAL_KEYS.TRANSACTIONS, []);
      list.unshift(txObj);
      writeLocal(LOCAL_KEYS.TRANSACTIONS, list);
      return true;
    },

    update: async (id, updatedData) => {
      if (isSupabaseConnected()) {
        const { data: existing } = await supabase
          .from('transactions')
          .select('data')
          .eq('id', id)
          .single();
        const merged = { ...(existing?.data || {}), ...updatedData, id };
        const { error } = await supabase
          .from('transactions')
          .upsert({
            id,
            data: merged,
            updated_at: new Date().toISOString(),
          });
        if (error) console.error('[DB Cloud] transactions.update error:', error);
        return !error;
      }
      const list = readLocal(LOCAL_KEYS.TRANSACTIONS, []);
      const updated = list.map((t) => (t.id === id ? { ...t, ...updatedData } : t));
      writeLocal(LOCAL_KEYS.TRANSACTIONS, updated);
      return true;
    },

    delete: async (id) => {
      if (isSupabaseConnected()) {
        const { error } = await supabase
          .from('transactions')
          .delete()
          .eq('id', id);
        if (error) console.error('[DB Cloud] transactions.delete error:', error);
        return !error;
      }
      const list = readLocal(LOCAL_KEYS.TRANSACTIONS, []);
      writeLocal(LOCAL_KEYS.TRANSACTIONS, list.filter((t) => t.id !== id));
      return true;
    },

    saveAll: async (txArray) => {
      if (isSupabaseConnected()) {
        const rows = txArray.map((t) => ({
          id: t.id,
          data: t,
          updated_at: new Date().toISOString(),
        }));
        const { error } = await supabase
          .from('transactions')
          .upsert(rows);
        if (error) console.error('[DB Cloud] transactions.saveAll error:', error);
        return !error;
      }
      writeLocal(LOCAL_KEYS.TRANSACTIONS, txArray);
      return true;
    },
  },

  // =======================================================================
  // 5. PAYMENT SETTINGS
  // =======================================================================
  paymentSettings: {
    get: async () => {
      if (isSupabaseConnected()) {
        const { data, error } = await supabase
          .from('payment_settings')
          .select('data')
          .eq('id', 'default')
          .single();
        if (error || !data) return null;
        return data.data;
      }
      return readLocal(LOCAL_KEYS.PAYMENT_SETTINGS, null);
    },

    save: async (settingsObj) => {
      if (isSupabaseConnected()) {
        const { error } = await supabase
          .from('payment_settings')
          .upsert({
            id: 'default',
            data: settingsObj,
            updated_at: new Date().toISOString(),
          });
        if (error) console.error('[DB Cloud] paymentSettings.save error:', error);
        return !error;
      }
      writeLocal(LOCAL_KEYS.PAYMENT_SETTINGS, settingsObj);
      return true;
    },
  },

  // =======================================================================
  // 6. PRICING PACKAGES
  // =======================================================================
  pricingPackages: {
    list: async () => {
      if (isSupabaseConnected()) {
        const { data, error } = await supabase
          .from('pricing_packages')
          .select('id, data, sort_order')
          .order('sort_order', { ascending: true });
        if (error) {
          console.error('[DB Cloud] pricingPackages.list error:', error);
          return [];
        }
        return (data || []).map((row) => ({ ...row.data, id: row.id }));
      }
      return readLocal(LOCAL_KEYS.PRICING_PACKAGES, []);
    },

    saveAll: async (pkgArray) => {
      if (isSupabaseConnected()) {
        // Delete old and insert all
        await supabase.from('pricing_packages').delete().neq('id', '');
        const rows = pkgArray.map((p, i) => ({
          id: p.id,
          data: p,
          sort_order: i,
        }));
        if (rows.length > 0) {
          const { error } = await supabase
            .from('pricing_packages')
            .insert(rows);
          if (error) console.error('[DB Cloud] pricingPackages.saveAll error:', error);
        }
        return true;
      }
      writeLocal(LOCAL_KEYS.PRICING_PACKAGES, pkgArray);
      return true;
    },
  },

  // =======================================================================
  // 7. PRICING FAQS
  // =======================================================================
  pricingFaqs: {
    list: async () => {
      if (isSupabaseConnected()) {
        const { data, error } = await supabase
          .from('pricing_faqs')
          .select('id, data, sort_order')
          .order('sort_order', { ascending: true });
        if (error) {
          console.error('[DB Cloud] pricingFaqs.list error:', error);
          return [];
        }
        return (data || []).map((row) => ({ ...row.data, id: row.id }));
      }
      return readLocal(LOCAL_KEYS.PRICING_FAQS, []);
    },

    saveAll: async (faqArray) => {
      if (isSupabaseConnected()) {
        await supabase.from('pricing_faqs').delete().neq('id', '');
        const rows = faqArray.map((f, i) => ({
          id: f.id,
          data: f,
          sort_order: i,
        }));
        if (rows.length > 0) {
          const { error } = await supabase
            .from('pricing_faqs')
            .insert(rows);
          if (error) console.error('[DB Cloud] pricingFaqs.saveAll error:', error);
        }
        return true;
      }
      writeLocal(LOCAL_KEYS.PRICING_FAQS, faqArray);
      return true;
    },
  },

  // =======================================================================
  // 8. BACKWARD COMPAT — profiles/projects (used by old code paths)
  // =======================================================================
  profiles: {
    get: async (userId) => {
      // Delegated to ownerData for OWNER-001
      if (userId === 'OWNER-001') {
        const owner = await db.ownerData.get();
        return owner?.profile || null;
      }
      return null;
    },
    update: async (userId, profileData) => {
      // No-op for cloud — handled via ownerData.save or customers.update
      return true;
    },
  },

  projects: {
    list: async () => [],
    create: async () => true,
    update: async () => true,
    delete: async () => true,
  },

  // =======================================================================
  // 9. HEALTH CHECK
  // =======================================================================
  healthCheck: async () => {
    const startTime = performance.now();
    try {
      if (isSupabaseConnected()) {
        const { data, error } = await supabase
          .from('owner_data')
          .select('id')
          .limit(1);
        const endTime = performance.now();
        return {
          status: error ? 'ERROR' : 'HEALTHY',
          engine: db.getEngineName(),
          isCloud: true,
          latencyMs: Math.round(endTime - startTime),
          error: error?.message,
          timestamp: new Date().toISOString(),
        };
      }

      // Local fallback health check
      const testKey = 'riski_db_health_ping';
      localStorage.setItem(testKey, JSON.stringify({ ping: 'pong', timestamp: Date.now() }));
      const readPing = JSON.parse(localStorage.getItem(testKey));
      localStorage.removeItem(testKey);
      const endTime = performance.now();

      return {
        status: 'HEALTHY',
        engine: db.getEngineName(),
        isCloud: false,
        latencyMs: Math.round(endTime - startTime),
        pingVerified: readPing?.ping === 'pong',
        timestamp: new Date().toISOString(),
      };
    } catch (err) {
      return {
        status: 'ERROR',
        engine: db.getEngineName(),
        error: err.message,
        latencyMs: 0,
      };
    }
  },
};

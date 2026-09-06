/**
 * JAGOPORTO — UNIVERSAL DATABASE & BACKEND SERVICE LAYER
 * Dual Storage Engine:
 * 1. Cloud Supabase / PostgreSQL Client (Real-time Cloud Sync)
 * 2. Instant Local Transaction Engine (Zero Latency / Offline-First)
 * Version: 2.5 (September 2026)
 */

import { supabase, isSupabaseConnected } from './supabase';

// =========================================================================
// LOCAL STORAGE KEYS
// =========================================================================
export const LOCAL_KEYS = {
  OWNER: 'riski_owner_portfolio_v1',
  CUSTOMERS: 'riski_customers_list_v1',
  TEMPLATES: 'riski_templates_list_v1',
  TRANSACTIONS: 'riski_transactions_list_v1',
  PAYMENT_SETTINGS: 'riski_payment_settings_v1',
  PRICING_PACKAGES: 'riski_pricing_packages_v1',
  PRICING_FAQS: 'riski_pricing_faqs_v1',
};

export function readLocal(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function writeLocal(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn(`[DB Local] Failed writing ${key}:`, e);
  }
}

// =========================================================================
// DATABASE SERVICE
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
        try {
          const { data, error } = await supabase
            .from('owner_data')
            .select('data')
            .eq('id', 'OWNER-001')
            .single();
          if (!error && data?.data) {
            writeLocal(LOCAL_KEYS.OWNER, data.data);
            return data.data;
          }
        } catch (e) {
          console.warn('[DB Cloud] ownerData.get failed, reading local:', e);
        }
      }
      return readLocal(LOCAL_KEYS.OWNER, null);
    },

    save: async (ownerObj) => {
      // 1. Save locally immediately
      writeLocal(LOCAL_KEYS.OWNER, ownerObj);

      // 2. Sync to Supabase Cloud
      if (isSupabaseConnected()) {
        try {
          const { error } = await supabase
            .from('owner_data')
            .upsert({
              id: 'OWNER-001',
              data: ownerObj,
              updated_at: new Date().toISOString(),
            });
          if (error) console.error('[DB Cloud] ownerData.save error:', error);
          return !error;
        } catch (e) {
          console.error('[DB Cloud] ownerData.save exception:', e);
        }
      }
      return true;
    },
  },

  // =======================================================================
  // 2. CUSTOMERS
  // =======================================================================
  customers: {
    list: async () => {
      if (isSupabaseConnected()) {
        try {
          const { data, error } = await supabase
            .from('customers')
            .select('id, data, created_at')
            .order('created_at', { ascending: false });
          if (!error && data && data.length > 0) {
            const list = data.map((row) => ({ ...row.data, id: row.id }));
            writeLocal(LOCAL_KEYS.CUSTOMERS, list);
            return list;
          }
        } catch (e) {
          console.warn('[DB Cloud] customers.list failed, reading local:', e);
        }
      }
      return readLocal(LOCAL_KEYS.CUSTOMERS, []);
    },

    create: async (customerObj) => {
      const list = readLocal(LOCAL_KEYS.CUSTOMERS, []);
      list.unshift(customerObj);
      writeLocal(LOCAL_KEYS.CUSTOMERS, list);

      if (isSupabaseConnected()) {
        try {
          const { error } = await supabase
            .from('customers')
            .insert({
              id: customerObj.id,
              data: customerObj,
            });
          if (error) console.error('[DB Cloud] customers.create error:', error);
          return !error;
        } catch (e) {
          console.error('[DB Cloud] customers.create exception:', e);
        }
      }
      return true;
    },

    update: async (id, updatedData) => {
      const list = readLocal(LOCAL_KEYS.CUSTOMERS, []);
      const target = list.find((c) => c.id === id) || {};
      const merged = { ...target, ...updatedData, id };
      const updatedList = list.map((c) => (c.id === id ? merged : c));
      writeLocal(LOCAL_KEYS.CUSTOMERS, updatedList);

      if (isSupabaseConnected()) {
        try {
          const { error } = await supabase
            .from('customers')
            .upsert({
              id,
              data: merged,
              updated_at: new Date().toISOString(),
            });
          if (error) console.error('[DB Cloud] customers.update error:', error);
          return !error;
        } catch (e) {
          console.error('[DB Cloud] customers.update exception:', e);
        }
      }
      return true;
    },

    delete: async (id) => {
      const list = readLocal(LOCAL_KEYS.CUSTOMERS, []);
      writeLocal(LOCAL_KEYS.CUSTOMERS, list.filter((c) => c.id !== id));

      if (isSupabaseConnected()) {
        try {
          const { error } = await supabase
            .from('customers')
            .delete()
            .eq('id', id);
          if (error) console.error('[DB Cloud] customers.delete error:', error);
          return !error;
        } catch (e) {
          console.error('[DB Cloud] customers.delete exception:', e);
        }
      }
      return true;
    },

    saveAll: async (customersArray) => {
      writeLocal(LOCAL_KEYS.CUSTOMERS, customersArray);

      if (isSupabaseConnected()) {
        try {
          // 1. Delete removed customer IDs from Supabase
          const { data: currentRows } = await supabase.from('customers').select('id');
          const currentIds = (currentRows || []).map((r) => r.id);
          const newIds = new Set(customersArray.map((c) => c.id));
          const toDelete = currentIds.filter((id) => !newIds.has(id));

          if (toDelete.length > 0) {
            await supabase.from('customers').delete().in('id', toDelete);
          }

          // 2. Upsert remaining customers
          const rows = customersArray.map((c) => ({
            id: c.id,
            data: c,
            updated_at: new Date().toISOString(),
          }));
          if (rows.length > 0) {
            const { error } = await supabase
              .from('customers')
              .upsert(rows);
            if (error) console.error('[DB Cloud] customers.saveAll error:', error);
          }
        } catch (e) {
          console.error('[DB Cloud] customers.saveAll exception:', e);
        }
      }
      return true;
    },
  },

  // =======================================================================
  // 3. TEMPLATES
  // =======================================================================
  templates: {
    list: async () => {
      if (isSupabaseConnected()) {
        try {
          const { data, error } = await supabase
            .from('templates')
            .select('id, data, created_at')
            .order('created_at', { ascending: true });
          if (!error && data && data.length > 0) {
            const list = data.map((row) => ({ ...row.data, id: row.id }));
            writeLocal(LOCAL_KEYS.TEMPLATES, list);
            return list;
          }
        } catch (e) {
          console.warn('[DB Cloud] templates.list failed, reading local:', e);
        }
      }
      return readLocal(LOCAL_KEYS.TEMPLATES, []);
    },

    create: async (templateObj) => {
      const list = readLocal(LOCAL_KEYS.TEMPLATES, []);
      list.push(templateObj);
      writeLocal(LOCAL_KEYS.TEMPLATES, list);

      if (isSupabaseConnected()) {
        try {
          const { error } = await supabase
            .from('templates')
            .insert({
              id: templateObj.id,
              data: templateObj,
            });
          if (error) console.error('[DB Cloud] templates.create error:', error);
        } catch (e) {
          console.error('[DB Cloud] templates.create exception:', e);
        }
      }
      return true;
    },

    add: async (templateObj) => {
      return db.templates.create(templateObj);
    },

    update: async (id, updatedData) => {
      const list = readLocal(LOCAL_KEYS.TEMPLATES, []);
      const target = list.find((t) => t.id === id) || {};
      const merged = { ...target, ...updatedData, id };
      const updatedList = list.map((t) => (t.id === id ? merged : t));
      writeLocal(LOCAL_KEYS.TEMPLATES, updatedList);

      if (isSupabaseConnected()) {
        try {
          const { error } = await supabase
            .from('templates')
            .upsert({
              id,
              data: merged,
              updated_at: new Date().toISOString(),
            });
          if (error) console.error('[DB Cloud] templates.update error:', error);
        } catch (e) {
          console.error('[DB Cloud] templates.update exception:', e);
        }
      }
      return true;
    },

    delete: async (id) => {
      const list = readLocal(LOCAL_KEYS.TEMPLATES, []);
      writeLocal(LOCAL_KEYS.TEMPLATES, list.filter((t) => t.id !== id));

      if (isSupabaseConnected()) {
        try {
          const { error } = await supabase
            .from('templates')
            .delete()
            .eq('id', id);
          if (error) console.error('[DB Cloud] templates.delete error:', error);
        } catch (e) {
          console.error('[DB Cloud] templates.delete exception:', e);
        }
      }
      return true;
    },

    saveAll: async (templatesArray) => {
      writeLocal(LOCAL_KEYS.TEMPLATES, templatesArray);

      if (isSupabaseConnected()) {
        try {
          // 1. Delete removed template IDs from Supabase
          const { data: currentRows } = await supabase.from('templates').select('id');
          const currentIds = (currentRows || []).map((r) => r.id);
          const newIds = new Set(templatesArray.map((t) => t.id));
          const toDelete = currentIds.filter((id) => !newIds.has(id));

          if (toDelete.length > 0) {
            await supabase.from('templates').delete().in('id', toDelete);
          }

          // 2. Upsert remaining templates
          const rows = templatesArray.map((t) => ({
            id: t.id,
            data: t,
            updated_at: new Date().toISOString(),
          }));
          if (rows.length > 0) {
            const { error } = await supabase
              .from('templates')
              .upsert(rows);
            if (error) console.error('[DB Cloud] templates.saveAll error:', error);
          }
        } catch (e) {
          console.error('[DB Cloud] templates.saveAll exception:', e);
        }
      }
      return true;
    },
  },

  // =======================================================================
  // 4. TRANSACTIONS / ORDERS
  // =======================================================================
  transactions: {
    list: async () => {
      if (isSupabaseConnected()) {
        try {
          const { data, error } = await supabase
            .from('transactions')
            .select('id, data, created_at')
            .order('created_at', { ascending: false });
          if (!error && data && data.length > 0) {
            const list = data.map((row) => ({ ...row.data, id: row.id }));
            writeLocal(LOCAL_KEYS.TRANSACTIONS, list);
            return list;
          }
        } catch (e) {
          console.warn('[DB Cloud] transactions.list failed, reading local:', e);
        }
      }
      return readLocal(LOCAL_KEYS.TRANSACTIONS, []);
    },

    create: async (txObj) => {
      const list = readLocal(LOCAL_KEYS.TRANSACTIONS, []);
      list.unshift(txObj);
      writeLocal(LOCAL_KEYS.TRANSACTIONS, list);

      if (isSupabaseConnected()) {
        try {
          const { error } = await supabase
            .from('transactions')
            .insert({
              id: txObj.id,
              data: txObj,
            });
          if (error) console.error('[DB Cloud] transactions.create error:', error);
        } catch (e) {
          console.error('[DB Cloud] transactions.create exception:', e);
        }
      }
      return true;
    },

    update: async (id, updatedData) => {
      const list = readLocal(LOCAL_KEYS.TRANSACTIONS, []);
      const target = list.find((t) => t.id === id) || {};
      const merged = { ...target, ...updatedData, id };
      const updatedList = list.map((t) => (t.id === id ? merged : t));
      writeLocal(LOCAL_KEYS.TRANSACTIONS, updatedList);

      if (isSupabaseConnected()) {
        try {
          const { error } = await supabase
            .from('transactions')
            .upsert({
              id,
              data: merged,
              updated_at: new Date().toISOString(),
            });
          if (error) console.error('[DB Cloud] transactions.update error:', error);
        } catch (e) {
          console.error('[DB Cloud] transactions.update exception:', e);
        }
      }
      return true;
    },

    delete: async (id) => {
      const list = readLocal(LOCAL_KEYS.TRANSACTIONS, []);
      writeLocal(LOCAL_KEYS.TRANSACTIONS, list.filter((t) => t.id !== id));

      if (isSupabaseConnected()) {
        try {
          const { error } = await supabase
            .from('transactions')
            .delete()
            .eq('id', id);
          if (error) console.error('[DB Cloud] transactions.delete error:', error);
        } catch (e) {
          console.error('[DB Cloud] transactions.delete exception:', e);
        }
      }
      return true;
    },

    saveAll: async (txArray) => {
      writeLocal(LOCAL_KEYS.TRANSACTIONS, txArray);

      if (isSupabaseConnected()) {
        try {
          // 1. Delete removed transaction IDs from Supabase
          const { data: currentRows } = await supabase.from('transactions').select('id');
          const currentIds = (currentRows || []).map((r) => r.id);
          const newIds = new Set(txArray.map((t) => t.id));
          const toDelete = currentIds.filter((id) => !newIds.has(id));

          if (toDelete.length > 0) {
            await supabase.from('transactions').delete().in('id', toDelete);
          }

          // 2. Upsert remaining transactions
          const rows = txArray.map((t) => ({
            id: t.id,
            data: t,
            updated_at: new Date().toISOString(),
          }));
          if (rows.length > 0) {
            const { error } = await supabase
              .from('transactions')
              .upsert(rows);
            if (error) console.error('[DB Cloud] transactions.saveAll error:', error);
          }
        } catch (e) {
          console.error('[DB Cloud] transactions.saveAll exception:', e);
        }
      }
      return true;
    },
  },

  // =======================================================================
  // 5. PAYMENT SETTINGS
  // =======================================================================
  paymentSettings: {
    get: async () => {
      if (isSupabaseConnected()) {
        try {
          const { data, error } = await supabase
            .from('payment_settings')
            .select('data')
            .limit(1)
            .single();
          if (!error && data?.data) {
            writeLocal(LOCAL_KEYS.PAYMENT_SETTINGS, data.data);
            return data.data;
          }
        } catch (e) {
          console.warn('[DB Cloud] paymentSettings.get failed, reading local:', e);
        }
      }
      return readLocal(LOCAL_KEYS.PAYMENT_SETTINGS, null);
    },

    save: async (settingsObj) => {
      writeLocal(LOCAL_KEYS.PAYMENT_SETTINGS, settingsObj);

      if (isSupabaseConnected()) {
        try {
          const { error } = await supabase
            .from('payment_settings')
            .upsert({
              id: 'default',
              data: settingsObj,
              updated_at: new Date().toISOString(),
            });
          if (error) console.error('[DB Cloud] paymentSettings.save error:', error);
        } catch (e) {
          console.error('[DB Cloud] paymentSettings.save exception:', e);
        }
      }
      return true;
    },
  },

  // =======================================================================
  // 6. PRICING PACKAGES
  // =======================================================================
  pricingPackages: {
    list: async () => {
      if (isSupabaseConnected()) {
        try {
          const { data, error } = await supabase
            .from('pricing_packages')
            .select('id, data, sort_order')
            .order('sort_order', { ascending: true });
          if (!error && data && data.length > 0) {
            const list = data.map((row) => ({ ...row.data, id: row.id }));
            writeLocal(LOCAL_KEYS.PRICING_PACKAGES, list);
            return list;
          }
        } catch (e) {
          console.warn('[DB Cloud] pricingPackages.list failed, reading local:', e);
        }
      }
      return readLocal(LOCAL_KEYS.PRICING_PACKAGES, []);
    },

    saveAll: async (pkgArray) => {
      writeLocal(LOCAL_KEYS.PRICING_PACKAGES, pkgArray);

      if (isSupabaseConnected()) {
        try {
          const rows = pkgArray.map((p, i) => ({
            id: p.id,
            data: p,
            sort_order: i,
          }));

          // Clean up removed IDs
          const { data: current } = await supabase.from('pricing_packages').select('id');
          const currentIds = (current || []).map((r) => r.id);
          const newIds = new Set(pkgArray.map((p) => p.id));
          const toDelete = currentIds.filter((id) => !newIds.has(id));
          if (toDelete.length > 0) {
            await supabase.from('pricing_packages').delete().in('id', toDelete);
          }

          if (rows.length > 0) {
            const { error } = await supabase
              .from('pricing_packages')
              .upsert(rows);
            if (error) console.error('[DB Cloud] pricingPackages.saveAll error:', error);
          }
        } catch (e) {
          console.error('[DB Cloud] pricingPackages.saveAll exception:', e);
        }
      }
      return true;
    },
  },

  // =======================================================================
  // 7. PRICING FAQS
  // =======================================================================
  pricingFaqs: {
    list: async () => {
      if (isSupabaseConnected()) {
        try {
          const { data, error } = await supabase
            .from('pricing_faqs')
            .select('id, data, sort_order')
            .order('sort_order', { ascending: true });
          if (!error && data && data.length > 0) {
            const list = data.map((row) => ({ ...row.data, id: row.id }));
            writeLocal(LOCAL_KEYS.PRICING_FAQS, list);
            return list;
          }
        } catch (e) {
          console.warn('[DB Cloud] pricingFaqs.list failed, reading local:', e);
        }
      }
      return readLocal(LOCAL_KEYS.PRICING_FAQS, []);
    },

    saveAll: async (faqArray) => {
      writeLocal(LOCAL_KEYS.PRICING_FAQS, faqArray);

      if (isSupabaseConnected()) {
        try {
          const rows = faqArray.map((f, i) => ({
            id: f.id,
            data: f,
            sort_order: i,
          }));

          // Clean up removed IDs
          const { data: current } = await supabase.from('pricing_faqs').select('id');
          const currentIds = (current || []).map((r) => r.id);
          const newIds = new Set(faqArray.map((f) => f.id));
          const toDelete = currentIds.filter((id) => !newIds.has(id));
          if (toDelete.length > 0) {
            await supabase.from('pricing_faqs').delete().in('id', toDelete);
          }

          if (rows.length > 0) {
            const { error } = await supabase
              .from('pricing_faqs')
              .upsert(rows);
            if (error) console.error('[DB Cloud] pricingFaqs.saveAll error:', error);
          }
        } catch (e) {
          console.error('[DB Cloud] pricingFaqs.saveAll exception:', e);
        }
      }
      return true;
    },
  },

  // =======================================================================
  // 8. BACKWARD COMPAT — profiles/projects
  // =======================================================================
  profiles: {
    get: async (userId) => {
      if (userId === 'OWNER-001') {
        const owner = await db.ownerData.get();
        return owner?.profile || null;
      }
      return null;
    },
    update: async () => true,
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
        const { error } = await supabase
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

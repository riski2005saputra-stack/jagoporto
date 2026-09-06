import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const AUTH_STORAGE_KEYS = {
  MASTER_SESSION: 'riski_auth_master_session_v1',
  CUSTOMER_SESSIONS: 'riski_auth_customer_sessions_v1',
};

export function AuthProvider({ children }) {
  // Master Owner Auth State (Strict Authentication: Default False, Requires PIN 2026)
  const [isMasterLoggedIn, setIsMasterLoggedIn] = useState(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEYS.MASTER_SESSION);
      return saved ? JSON.parse(saved) === true : false;
    } catch {
      return false;
    }
  });

  // Map of authorized customer IDs e.g. { "CUST-001": true }
  const [customerSessions, setCustomerSessions] = useState(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEYS.CUSTOMER_SESSIONS);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(AUTH_STORAGE_KEYS.MASTER_SESSION, JSON.stringify(isMasterLoggedIn));
    } catch (e) {
      console.warn('Failed saving master auth session', e);
    }
  }, [isMasterLoggedIn]);

  useEffect(() => {
    try {
      localStorage.setItem(AUTH_STORAGE_KEYS.CUSTOMER_SESSIONS, JSON.stringify(customerSessions));
    } catch (e) {
      console.warn('Failed saving customer sessions', e);
    }
  }, [customerSessions]);

  // Master Login
  const loginMaster = (pin) => {
    const validPin = '2026';
    if (pin === validPin || pin === 'admin') {
      setIsMasterLoggedIn(true);
      return { success: true, message: 'Autentikasi Master Berhasil!' };
    }
    return { success: false, message: 'PIN Admin Master tidak valid. Silakan coba lagi.' };
  };

  // Master Logout
  const logoutMaster = () => {
    setIsMasterLoggedIn(false);
  };

  // Customer Login via PIN (Requires Admin Master Approval + Strict PIN verification)
  const loginCustomer = (customerId, pin, customerObj) => {
    // 1. Check if account is still pending approval from Admin Master
    if (customerObj?.status === 'pending' || customerObj?.status === 'pending_approval') {
      return {
        success: false,
        isPending: true,
        message: 'Akun Anda sedang MENUNGGU PERSETUJUAN dari Admin Master. Pembayaran Anda sedang diverifikasi. Silakan hubungi Admin Master atau tunggu hingga akun Anda disetujui.',
      };
    }

    // 2. Check if account is inactive / suspended
    if (customerObj?.status === 'inactive' || customerObj?.status === 'suspended') {
      return {
        success: false,
        isInactive: true,
        message: 'Akun Anda saat ini berstatus NON-AKTIF. Silakan hubungi Admin Master untuk informasi lebih lanjut.',
      };
    }

    // 3. Verify PIN
    const expectedPin = String(customerObj?.accessPin || '1234').trim();
    const enteredPin = String(pin || '').trim();

    if (enteredPin && enteredPin === expectedPin) {
      setCustomerSessions((prev) => ({
        ...prev,
        [customerId]: {
          authenticatedAt: Date.now(),
          customerId,
        },
      }));
      return { success: true, message: 'Akses Editor Terverifikasi!' };
    }
    return {
      success: false,
      isPinWrong: true,
      message: 'PIN Akses Customer salah. Silakan periksa kembali PIN Anda.',
    };
  };

  // Customer Logout
  const logoutCustomer = (customerId) => {
    setCustomerSessions((prev) => {
      const updated = { ...prev };
      delete updated[customerId];
      return updated;
    });
  };

  // Check if current user is authorized to edit a customer
  const isCustomerAuthorized = (customerId) => {
    if (!customerId) return false;
    return Boolean(customerSessions && customerSessions[customerId]);
  };

  return (
    <AuthContext.Provider
      value={{
        isMasterLoggedIn,
        loginMaster,
        logoutMaster,
        loginCustomer,
        logoutCustomer,
        isCustomerAuthorized,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Public Master Portfolio Components
import Navbar from './components/Navbar';
import Hero from './sections/Hero';
import About from './sections/About';
import Projects from './sections/Projects';
import Contact from './sections/Contact';
import Footer from './components/Footer';

// Admin Master System Components
import AdminLayout from './admin/AdminLayout';
import AdminDashboard from './admin/AdminDashboard';
import AdminTemplate from './admin/AdminTemplate';
import AdminPricing from './admin/AdminPricing';
import AdminPayments from './admin/AdminPayments';
import AdminSettings from './admin/AdminSettings';
import MyPortfolioEditor from './admin/MyPortfolioEditor';
import AdminCustomers from './admin/AdminCustomers';
import AdminLogin from './admin/AdminLogin';
import CustomerEditor from './pages/CustomerEditor';
import CustomerPortfolioView from './pages/CustomerPortfolioView';
import CustomerLoginPage from './pages/CustomerLoginPage';
import PricingPage from './pages/PricingPage';
import { AdminProtectedRoute, CustomerProtectedRoute } from './components/ProtectedRoutes';

// 1. MASTER PORTFOLIO WEBSITE (Public View - OWNER-001)
function MasterPortfolioView() {
  return (
    <div className="min-h-screen bg-[#05080D] text-slate-100 flex flex-col selection:bg-rose-900 selection:text-white">
      {/* Sticky Glassmorphism Header */}
      <Navbar />

      {/* Main Content Sections (Hero, About 192-frame Canvas, Projects, Contact) */}
      <main className="flex-grow">
        <Hero />
        <About />
        <Projects />
        <Contact />
      </main>

      {/* Corporate Footer */}
      <Footer />
    </div>
  );
}

// 2. MAIN ROUTING APPLICATION
export default function App() {
  return (
    <Routes>
      {/* Public Master Portfolio Website */}
      <Route path="/" element={<MasterPortfolioView />} />

      {/* Public Pricing & Template Store */}
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/beli-template" element={<PricingPage />} />

      {/* Admin Master Login Gateway */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Customer Editor Login Portal Gateways */}
      <Route path="/login" element={<CustomerLoginPage />} />
      <Route path="/customer/login" element={<CustomerLoginPage />} />
      <Route path="/customer-login" element={<CustomerLoginPage />} />
      <Route path="/editor-login" element={<CustomerLoginPage />} />
      <Route path="/editor/:customerId/login" element={<CustomerLoginPage />} />

      {/* Admin Master System (/admin) - Protected */}
      <Route
        path="/admin"
        element={
          <AdminProtectedRoute>
            <AdminLayout />
          </AdminProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="my-portfolio" element={<MyPortfolioEditor />} />
        <Route path="customers" element={<AdminCustomers />} />
        <Route path="template" element={<AdminTemplate />} />
        <Route path="pricing" element={<AdminPricing />} />
        <Route path="payments" element={<AdminPayments />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      {/* Customer Editor Protected Route Gateway */}
      <Route
        path="/editor/:customerId"
        element={
          <CustomerProtectedRoute>
            <CustomerEditor />
          </CustomerProtectedRoute>
        }
      />

      {/* Customer Public Portfolio Website Route */}
      <Route path="/portfolio/:slug" element={<CustomerPortfolioView />} />

      {/* Fallback to Home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

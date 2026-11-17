import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.js';
import { CartProvider } from './context/CartContext.js';

// Common Components
import { Navbar } from './components/common/Navbar.js';
import { Footer } from './components/common/Footer.js';
import { ScrollToTop } from './components/common/ScrollToTop.js';

// Customer Pages
import { HomePage } from './pages/customer/HomePage.js';
import { ProductListingPage } from './pages/customer/ProductListingPage.js';
import { ProductDetailPage } from './pages/customer/ProductDetailPage.js';
import { CartPage } from './pages/customer/CartPage.js';

// Admin Components & Pages
import { AdminLayout } from './components/admin/AdminLayout.js';
import { AdminLoginPage } from './pages/admin/AdminLoginPage.js';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage.js';
import { AdminProductsPage } from './pages/admin/AdminProductsPage.js';
import { AdminEnquiriesPage } from './pages/admin/AdminEnquiriesPage.js';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage.js';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage.js';

// Customer Layout Wrapper
const CustomerLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

// Protected Admin Route Guard
const ProtectedAdminRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold text-slate-400">Verifying Admin Session...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <AdminLayout />;
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* Customer Website Routes */}
            <Route element={<CustomerLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductListingPage />} />
              <Route path="/products/:slug" element={<ProductDetailPage />} />
              <Route path="/cart" element={<CartPage />} />
            </Route>

            {/* Admin Authentication */}
            <Route path="/admin/login" element={<AdminLoginPage />} />

            {/* Protected Admin Portal */}
            <Route path="/admin" element={<ProtectedAdminRoute />}>
              <Route index element={<AdminDashboardPage />} />
              <Route path="products" element={<AdminProductsPage />} />
              <Route path="enquiries" element={<AdminEnquiriesPage />} />
              <Route path="categories" element={<AdminCategoriesPage />} />
              <Route path="settings" element={<AdminSettingsPage />} />
            </Route>

            {/* 404 Fallback */}
            <Route
              path="*"
              element={
                <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-center px-4">
                  <h1 className="text-6xl font-black text-blue-600 font-heading">404</h1>
                  <h2 className="text-xl font-bold text-slate-900 mt-2">Page Not Found</h2>
                  <p className="text-xs text-slate-500 mt-1 mb-6">
                    The link you followed may be broken or the page has been moved.
                  </p>
                  <a
                    href="/"
                    className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 transition-colors"
                  >
                    Return to Digital Market
                  </a>
                </div>
              }
            />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;

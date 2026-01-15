import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from './store';
import { Layout } from './components/layout';
import ProtectedRoute from './components/layout/ProtectedRoute';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import MenuPage from './pages/MenuPage';
import ProfilePage from './pages/ProfilePage';
import DashboardPage from './pages/DashboardPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import OrdersPage from './pages/OrdersPage';
import AdminLayout from './components/layout/AdminLayout';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import UsersPage from './pages/admin/UsersPage';
import AdminMenuPage from './pages/admin/MenuPage';
import RestaurantsPage from './pages/admin/RestaurantsPage';
import CategoriesPage from './pages/admin/CategoriesPage';
import AdminOrdersPage from './pages/admin/OrdersPage';
import SettingsPage from './pages/admin/SettingsPage';
import AuthInitializer from './components/auth/AuthInitializer';
import RestaurantLayout from './components/layout/RestaurantLayout';
import RestaurantDashboardPage from './pages/restaurant/RestaurantDashboardPage';
import RestaurantOrdersPage from './pages/restaurant/RestaurantOrdersPage';
import RestaurantMenuPage from './pages/restaurant/RestaurantMenuPage';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1e1e2e',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.1)',
            },
            success: {
              iconTheme: {
                primary: '#f97316',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
        <AuthInitializer />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="menu" element={<MenuPage />} />
            <Route path="login" element={<AuthPage mode="login" />} />
            <Route path="register" element={<AuthPage mode="register" />} />
            <Route path="profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />
            <Route path="dashboard" element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } />
            <Route path="checkout" element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            } />
            <Route path="order-success" element={
              <ProtectedRoute>
                <OrderSuccessPage />
              </ProtectedRoute>
            } />
            <Route path="orders" element={
              <ProtectedRoute>
                <OrdersPage />
              </ProtectedRoute>
            } />
          </Route>

          {/* Restaurant Dashboard Routes */}
          <Route path="/restaurant-dashboard" element={
            <ProtectedRoute>
              <RestaurantLayout />
            </ProtectedRoute>
          }>
            <Route index element={<RestaurantDashboardPage />} />
            <Route path="orders" element={<RestaurantOrdersPage />} />
            <Route path="menu" element={<RestaurantMenuPage />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboardPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="menu" element={<AdminMenuPage />} />
            <Route path="restaurants" element={<RestaurantsPage />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
};

export default App;

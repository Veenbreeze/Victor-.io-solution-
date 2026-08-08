import { Route, Routes } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout.jsx';
import AuthLayout from '../layouts/AuthLayout.jsx';
import AdminLayout from '../layouts/AdminLayout.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import Home from '../pages/Home.jsx';
import About from '../pages/About.jsx';
import Services from '../pages/Services.jsx';
import Portfolio from '../pages/Portfolio.jsx';
import Pricing from '../pages/Pricing.jsx';
import Contact from '../pages/Contact.jsx';
import Login from '../pages/Login.jsx';
import Register from '../pages/Register.jsx';
import ForgotPassword from '../pages/ForgotPassword.jsx';
import AuthCallback from '../pages/AuthCallback.jsx';
import Dashboard from '../pages/Dashboard.jsx';
import AdminOverview from '../pages/admin/Overview.jsx';
import AdminUsers from '../pages/admin/Users.jsx';
import AdminServices from '../pages/admin/Services.jsx';
import AdminPortfolio from '../pages/admin/Portfolio.jsx';
import AdminEvents from '../pages/admin/Events.jsx';
import AdminMessages from '../pages/admin/Messages.jsx';
import AdminAuditLog from '../pages/admin/AuditLog.jsx';
import NotFound from '../pages/NotFound.jsx';

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="services" element={<Services />} />
        <Route path="portfolio" element={<Portfolio />} />
        <Route path="pricing" element={<Pricing />} />
        <Route path="contact" element={<Contact />} />
        <Route element={<ProtectedRoute />}>
          <Route path="dashboard" element={<Dashboard />} />
        </Route>
      </Route>
      <Route element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="auth-callback" element={<AuthCallback />} />
      </Route>
      <Route element={<ProtectedRoute staffOnly />}>
        <Route path="admin" element={<AdminLayout />}>
          <Route index element={<AdminOverview />} />
          <Route path="services" element={<AdminServices />} />
          <Route path="portfolio" element={<AdminPortfolio />} />
          <Route path="events" element={<AdminEvents />} />
          <Route path="messages" element={<AdminMessages />} />
          <Route element={<ProtectedRoute adminOnly />}>
            <Route path="users" element={<AdminUsers />} />
            <Route path="audit-log" element={<AdminAuditLog />} />
          </Route>
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

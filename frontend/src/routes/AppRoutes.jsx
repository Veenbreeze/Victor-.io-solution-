import { Route, Routes } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout.jsx';
import AuthLayout from '../layouts/AuthLayout.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import Home from '../pages/Home.jsx';
import About from '../pages/About.jsx';
import Services from '../pages/Services.jsx';
import Portfolio from '../pages/Portfolio.jsx';
import Pricing from '../pages/Pricing.jsx';
import Contact from '../pages/Contact.jsx';
import Login from '../pages/Login.jsx';
import Register from '../pages/Register.jsx';
import Dashboard from '../pages/Dashboard.jsx';
import AdminDashboard from '../pages/AdminDashboard.jsx';
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
        <Route element={<ProtectedRoute adminOnly />}>
          <Route path="admin" element={<AdminDashboard />} />
        </Route>
      </Route>
      <Route element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

import { BrowserRouter as Router, Navigate, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Tickets from './pages/Tickets';
import Policies from './pages/Policies';
import Login from './pages/Login';
import AnimalDetail from './pages/AnimalDetail';
import ChatBot from './components/ChatBot';

// Admin Pages
import AdminLayout from './pages/admin/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminTickets from './pages/admin/AdminTickets';
import AdminBanners from './pages/admin/AdminBanners';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tickets" element={<Tickets />} />
            <Route path="/policies" element={<Policies />} />
            <Route path="/login" element={<Login />} />
            <Route path="/animals/:id" element={<AnimalDetail />} />
          </Routes>
        </main>
        {/* Chỉ hiển thị Footer nếu không phải là trang admin */}
        <Routes>
          <Route path="/admin/*" element={null} />
          <Route path="*" element={<Footer />} />
        </Routes>
      </div>
      
      {/* ChatBot - hiển thị trên tất cả các trang public */}
      <ChatBot />

      {/* Admin Routes */}
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="tickets" element={<AdminTickets />} />
          <Route path="banners" element={<AdminBanners />} />
          <Route path="settings" element={<div style={{padding:'2rem'}}>Cài đặt hệ thống</div>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

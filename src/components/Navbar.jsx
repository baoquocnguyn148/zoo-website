import { Link, useLocation } from 'react-router-dom';
import { Leaf, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import './Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const user = localStorage.getItem('zoo_user');
  
  const getLastName = (fullName) => {
    if (!fullName) return '';
    const parts = fullName.trim().split(' ');
    return parts[parts.length - 1];
  };
  const displayName = getLastName(user);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHomePage = location.pathname === '/';
  const isAdminPage = location.pathname.startsWith('/admin');
  const headerClass = `navbar ${isScrolled || !isHomePage ? 'scrolled' : ''}`;

  if (isAdminPage) return null;

  const handleLogout = () => {
    localStorage.removeItem('zoo_user');
    window.location.reload();
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className={headerClass}>
      <div className="container nav-container">
        <Link to="/" className="logo">
          <Leaf className="logo-icon" />
          <span>Sở Thú<br/><small>Thiên Nhiên Kỳ Thú</small></span>
        </Link>
        
        <nav className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
          <Link to="/" onClick={closeMobileMenu} className={location.pathname === '/' ? 'active' : ''}>Trang chủ</Link>
          <Link to="/tickets" onClick={closeMobileMenu} className={location.pathname === '/tickets' ? 'active' : ''}>Mua vé</Link>
          <Link to="/policies" onClick={closeMobileMenu} className={location.pathname === '/policies' ? 'active' : ''}>Chính sách</Link>
          <Link to="/tickets" onClick={closeMobileMenu} className="btn btn-primary d-mobile">Đặt vé ngay</Link>
        </nav>

        <div className="nav-actions">
          {user ? (
            <div className="user-menu d-desktop">
              <span className="welcome-text">👋 Xin chào, {displayName}</span>
              <button onClick={handleLogout} className="btn btn-outline logout-btn">Đăng xuất</button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary d-desktop login-btn">Đăng nhập</Link>
          )}
          <button className="mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

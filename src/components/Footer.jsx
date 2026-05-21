import { Link } from 'react-router-dom';
import { Leaf, MapPin, Phone, Mail, Globe } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer dark-section">
      <div className="container footer-container">
        <div className="footer-col">
          <Link to="/" className="footer-logo">
            <Leaf className="logo-icon" />
            <span>MixiZoo</span>
          </Link>
          <p className="text-light mt-3">
            Hòa mình vào thiên nhiên hoang dã. Cùng chung tay bảo vệ sự đa dạng sinh học và các loài động vật quý hiếm.
          </p>
          <div className="social-links mt-4">
            <a href="#"><Globe size={20} /></a>
          </div>
        </div>

        <div className="footer-col">
          <h3>Liên kết nhanh</h3>
          <ul>
            <li><Link to="/">Trang chủ</Link></li>
            <li><Link to="/tickets">Mua vé tham quan</Link></li>
            <li><Link to="/policies">Chính sách & Nội quy</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h3>Thông tin liên hệ</h3>
          <ul className="contact-info">
            <li><MapPin size={18} /> 120 Yên Lãng, quận Đống Đa, Hà Nội</li>
            <li><Phone size={18} /> (028) 3829 1466</li>
            <li><Mail size={18} /> mixizoo.org</li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
      </div>
    </footer>
  );
};

export default Footer;

import { ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import AnimalCard from '../components/AnimalCard';
import { animals } from '../data/animals';
import { getBanners } from '../utils/storage';
import './Home.css';

const Home = () => {
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  const fallbackBanners = [
    {
      id: 1,
      image: '/hero.png',
      subtitle: 'Nâng Cao Trải Nghiệm Du Khách',
      title: 'Hành Trình Khám Phá Muôn Loài Tại Sở Thú Hà Nội',
      description: '',
      buttonText: 'Mua Vé Ngay',
      link: '/tickets',
      showDesc: true
    },
    {
      id: 2,
      image: '/panda.png',
      subtitle: 'Mới Mở Cửa',
      title: 'Gấu Trúc Khổng Lồ',
      description: '',
      buttonText: 'TÌM HIỂU THÊM ▸',
      link: '/tickets',
      showDesc: false
    }
  ];
  const savedBanners = getBanners();
  const banners = savedBanners.length > 0 ? savedBanners : fallbackBanners;

  const nextBanner = () => {
    setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
  };

  const prevBanner = () => {
    setCurrentBannerIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const currentBanner = banners[currentBannerIndex];
  return (
    <div className="home">
      {/* Hero Section (Campaign Slider) */}
      <section className="hero">
        <div className="hero-background">
          <img src={currentBanner.image} alt={currentBanner.title} />
          <div className="hero-overlay" style={{background: currentBanner.showDesc === false ? 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.3) 100%)' : 'linear-gradient(to right, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.4) 100%)'}}></div>
        </div>
        
        {/* Slider Controls */}
        <button className="slider-btn prev" onClick={prevBanner}>‹</button>
        <button className="slider-btn next" onClick={nextBanner}>›</button>

        {currentBanner.showDesc !== false ? (
          <div className="container animate-fade-in" style={{zIndex: 10, width: '100%', position: 'relative'}} key={currentBanner.id}>
            <div style={{maxWidth: '850px', textAlign: 'left', paddingBottom: '2rem'}}>
              <h1 style={{
                fontSize: 'clamp(2.5rem, 4.5vw, 4rem)', 
                marginBottom: '1.5rem', 
                textShadow: '0 4px 15px rgba(0,0,0,0.7)',
                lineHeight: '1.2',
                fontWeight: '800',
                color: 'white',
                letterSpacing: '-0.5px'
              }}>
                {currentBanner.title}
              </h1>
              {currentBanner.subtitle && (
                <p style={{
                  fontSize: 'clamp(1.1rem, 1.6vw, 1.35rem)', 
                  marginBottom: '2.5rem', 
                  maxWidth: '650px', 
                  color: 'rgba(255, 255, 255, 0.95)',
                  lineHeight: '1.6',
                  textShadow: '0 2px 5px rgba(0,0,0,0.5)'
                }}>
                  {currentBanner.subtitle}
                </p>
              )}
              <div className="hero-actions" style={{ marginTop: currentBanner.subtitle ? '0' : '1.5rem' }}>
                <Link to="/tickets" className="btn btn-glass-primary btn-lg">
                  {currentBanner.buttonText || 'Mua Vé Ngay'}
                </Link>
                <Link to="/policies" className="btn btn-glass-secondary btn-lg">
                  Tìm hiểu nội quy
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="container hero-content text-center animate-fade-in" style={{marginTop: 'auto', marginBottom: '8rem'}} key={currentBanner.id}>
            <h4 style={{color: 'var(--secondary)', fontSize: '1.5rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '2px'}}>{currentBanner.subtitle}</h4>
            <h1 style={{fontSize: '4.5rem', textShadow: '2px 4px 10px rgba(0,0,0,0.5)', marginBottom: '1.5rem'}}>{currentBanner.title}</h1>
            <Link to={currentBanner.link} className="btn btn-primary" style={{backgroundColor: '#7cb342', color: 'white', borderRadius: '30px', padding: '0.8rem 2.5rem', fontSize: '1.1rem'}}>
              {currentBanner.buttonText}
            </Link>
          </div>
        )}

        {/* Hero Footer Info - ONLY FOR PANDA BANNER */}
        {currentBanner.showDesc === false && (
          <div className="hero-footer-info">
            <div className="container" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingBottom: '2rem'}}>
              <div className="info-block" style={{display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '2px solid white', paddingLeft: '1rem'}}>
                <div style={{fontSize: '2rem'}}>⌚</div>
                <div>
                  <div style={{fontSize: '0.8rem', letterSpacing: '1px', textTransform: 'uppercase'}}>Giờ mở cửa hôm nay:</div>
                  <div style={{fontSize: '1.2rem', fontWeight: 'bold'}}>9 am — 6 pm</div>
                </div>
              </div>
              
              <div className="info-block text-center">
                <div style={{fontSize: '0.9rem'}}>Hành trình của những nụ cười</div>
                <Link to="/tickets" style={{fontSize: '1.2rem', fontWeight: 'bold', textDecoration: 'underline'}}>Lên Kế Hoạch Tham Quan</Link>
              </div>
              
              <div className="info-block text-right">
                <div style={{fontSize: '0.9rem'}}>Sở Thú</div>
                <div style={{fontSize: '1.2rem', fontWeight: 'bold'}}>Thiên Nhiên Kỳ Thú</div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Intro Section */}
      <section className="intro-section">
        <div className="container">
          <div className="intro-grid">
            <div className="intro-text">
              <h2 className="section-title">Hơn Cả Một Sở Thú</h2>
              <p>
                Tại Sở Thú, chúng tôi không chỉ mang đến cho bạn những khoảnh khắc tuyệt vời khi ngắm nhìn các loài động vật hoang dã, mà còn là hành trình giáo dục về bảo tồn thiên nhiên.
              </p>
              <p>
                Hãy đến và cảm nhận sự kết nối sâu sắc giữa con người và thế giới tự nhiên. Bởi vì khi động vật hoang dã phát triển, mọi sự sống đều phát triển.
              </p>
            </div>
            <div className="intro-stats">
              <div className="stat-item">
                <h3>3,000+</h3>
                <p>Cá thể động vật</p>
              </div>
              <div className="stat-item">
                <h3>700+</h3>
                <p>Loài thực vật quý hiếm</p>
              </div>
              <div className="stat-item">
                <h3>100+</h3>
                <p>Chương trình bảo tồn</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Animals */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header text-center">
            <h2 className="section-title">Gương Mặt Tiêu Biểu</h2>
            <p className="section-subtitle">Gặp gỡ những "cư dân" nổi bật nhất tại Sở Thú</p>
          </div>
          
          <div className="animal-grid">
            {animals.map(animal => (
              <AnimalCard key={animal.id} {...animal} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

import { useState, useEffect } from 'react';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > window.innerHeight * 0.8;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        padding: '24px 16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: scrolled ? 'rgba(0, 0, 0, 0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
        transition: 'background-color 0.3s ease, backdrop-filter 0.3s ease',
      }}
    >
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <img 
          src="/logomain.png" 
          alt="Formless Logo" 
          style={{
            height: '30px',
            width: 'auto',
          }}
        />
        
        {/* FORMLESS text - only show when scrolled */}
        <span
          style={{
            color: 'white',
            fontSize: '18px',
            fontWeight: '600',
            letterSpacing: '0.5px',
            opacity: scrolled ? 1 : 0,
            width: scrolled ? 'auto' : 0,
            overflow: 'hidden',
            transition: 'opacity 0.3s ease, width 0.3s ease',
            whiteSpace: 'nowrap',
            fontFamily: '"Inter", sans-serif',
          }}
        >
          FORMLESS<sup style={{ fontSize: '8px', marginLeft: '2px' }}>™</sup>
        </span>
      </div>

      {/* Navigation Links */}
      <nav style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
        <a
          href="#api-docs"
          style={{
            color: 'white',
            textDecoration: 'none',
            fontSize: '18px',
            fontWeight: '400',
            opacity: 0.9,
            transition: 'opacity 0.2s ease',
            fontFamily: '"Inter", sans-serif',
          }}
          onMouseEnter={(e) => (e.target.style.opacity = 1)}
          onMouseLeave={(e) => (e.target.style.opacity = 0.9)}
        >
          API Docs
        </a>
        <a
          href="#case-studies"
          style={{
            color: 'white',
            textDecoration: 'none',
            fontSize: '18px',
            fontWeight: '400',
            opacity: 0.9,
            transition: 'opacity 0.2s ease',
            fontFamily: '"Inter", sans-serif',
          }}
          onMouseEnter={(e) => (e.target.style.opacity = 1)}
          onMouseLeave={(e) => (e.target.style.opacity = 0.9)}
        >
          Case Studies
        </a>
        <a
          href="#about"
          style={{
            color: 'white',
            textDecoration: 'none',
            fontSize: '18px',
            fontWeight: '400',
            opacity: 0.9,
            transition: 'opacity 0.2s ease',
            fontFamily: '"Inter", sans-serif',
          }}
          onMouseEnter={(e) => (e.target.style.opacity = 1)}
          onMouseLeave={(e) => (e.target.style.opacity = 0.9)}
        >
          About
        </a>
        <a
          href="#contact"
          style={{
            color: 'white',
            textDecoration: 'none',
            fontSize: '18px',
            fontWeight: '400',
            opacity: 0.9,
            transition: 'opacity 0.2s ease',
            fontFamily: '"Inter", sans-serif',
          }}
          onMouseEnter={(e) => (e.target.style.opacity = 1)}
          onMouseLeave={(e) => (e.target.style.opacity = 0.9)}
        >
          Contact Us
        </a>
      </nav>
    </header>
  );
};

export default Header;
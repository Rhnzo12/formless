import { useState, useEffect } from 'react';

const Header = ({ activePage }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > window.innerHeight * 0.8;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuOpen && !e.target.closest('.mobile-menu') && !e.target.closest('.menu-toggle')) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [menuOpen]);

  const navLinks = [
    { href: '/api-docs', label: 'API Docs', id: 'api-docs' },
    { href: '/case-studies', label: 'Case Studies', id: 'case-studies' },
    { href: '/about', label: 'About', id: 'about' },
    { href: '/contact', label: 'Contact Us', id: 'contact' },
  ];

  return (
    <>
      <style>
        {`
          @media (max-width: 768px) {
            .desktop-nav {
              display: none !important;
            }
            .menu-toggle {
              display: flex !important;
            }
          }
          @media (min-width: 769px) {
            .mobile-menu {
              display: none !important;
            }
          }
        `}
      </style>
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          padding: 'clamp(20px, 3vw, 28px) 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: scrolled || menuOpen ? 'rgba(0, 0, 0, 0.95)' : 'transparent',
          backdropFilter: scrolled || menuOpen ? 'blur(10px)' : 'none',
          transition: 'background-color 0.3s ease, backdrop-filter 0.3s ease',
        }}
      >
        {/* Logo - Link to Home */}
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <img
            src="/logomain.png"
            alt="Formless Logo"
            style={{
              height: 'clamp(24px, 4vw, 30px)',
              width: 'auto',
            }}
          />

          {/* FORMLESS text - always visible */}
          <span
            style={{
              color: 'white',
              fontSize: 'clamp(14px, 2vw, 18px)',
              fontWeight: '600',
              letterSpacing: '0.5px',
              whiteSpace: 'nowrap',
              fontFamily: '"Inter", sans-serif',
            }}
          >
            FORMLESS<sup style={{ fontSize: '8px', marginLeft: '2px' }}>™</sup>
          </span>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav" style={{ display: 'flex', gap: 'clamp(20px, 4vw, 40px)', alignItems: 'center' }}>
          {navLinks.map((link) => {
            const isActive = activePage === link.id;
            return (
              <a
                key={link.href}
                href={link.href}
                style={{
                  color: 'white',
                  textDecoration: 'none',
                  fontSize: 'clamp(14px, 2vw, 18px)',
                  fontWeight: '400',
                  opacity: 0.9,
                  transition: 'opacity 0.2s ease, border-color 0.3s ease',
                  fontFamily: '"Inter", sans-serif',
                  paddingBottom: '6px',
                  borderBottom: isActive ? '2px solid white' : '2px solid transparent',
                }}
                onMouseEnter={(e) => {
                  e.target.style.opacity = 1;
                  if (!isActive) e.target.style.borderBottomColor = 'white';
                }}
                onMouseLeave={(e) => {
                  e.target.style.opacity = 0.9;
                  if (!isActive) e.target.style.borderBottomColor = 'transparent';
                }}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: 'none',
            flexDirection: 'column',
            gap: '5px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
          }}
          aria-label="Toggle menu"
        >
          <span style={{
            width: '24px',
            height: '2px',
            backgroundColor: 'white',
            transition: 'all 0.3s ease',
            transform: menuOpen ? 'rotate(45deg) translateY(7px)' : 'none',
          }} />
          <span style={{
            width: '24px',
            height: '2px',
            backgroundColor: 'white',
            transition: 'all 0.3s ease',
            opacity: menuOpen ? 0 : 1,
          }} />
          <span style={{
            width: '24px',
            height: '2px',
            backgroundColor: 'white',
            transition: 'all 0.3s ease',
            transform: menuOpen ? 'rotate(-45deg) translateY(-7px)' : 'none',
          }} />
        </button>
      </header>

      {/* Mobile Menu */}
      <nav
        className="mobile-menu"
        style={{
          position: 'fixed',
          top: menuOpen ? '60px' : '-100%',
          left: 0,
          right: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.98)',
          backdropFilter: 'blur(10px)',
          padding: '20px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          zIndex: 999,
          transition: 'top 0.3s ease',
        }}
      >
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={() => setMenuOpen(false)}
            style={{
              color: 'white',
              textDecoration: 'none',
              fontSize: '18px',
              fontWeight: '400',
              opacity: 0.9,
              transition: 'opacity 0.2s ease',
              fontFamily: '"Inter", sans-serif',
              padding: '8px 0',
            }}
          >
            {link.label}
          </a>
        ))}
      </nav>
    </>
  );
};

export default Header;
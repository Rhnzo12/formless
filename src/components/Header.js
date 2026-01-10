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

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const navLinks = [
    { href: '/api-docs', label: 'API Docs', id: 'api-docs', newTab: true },
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
            .mobile-menu-fullscreen {
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
          backgroundColor: scrolled ? 'rgba(0, 0, 0, 0.95)' : 'transparent',
          backdropFilter: scrolled ? 'blur(10px)' : 'none',
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
                target={link.newTab ? '_blank' : undefined}
                rel={link.newTab ? 'noopener noreferrer' : undefined}
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

        {/* Mobile Menu Toggle - White Circle with Hamburger */}
        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(true)}
          style={{
            display: 'none',
            alignItems: 'center',
            justifyContent: 'center',
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: 'white',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
          }}
          aria-label="Open menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2">
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="18" x2="20" y2="18" />
          </svg>
        </button>
      </header>

      {/* Full-screen Mobile Menu */}
      <div
        className="mobile-menu-fullscreen"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: '#000',
          zIndex: 2000,
          display: 'flex',
          flexDirection: 'column',
          opacity: menuOpen ? 1 : 0,
          visibility: menuOpen ? 'visible' : 'hidden',
          transition: 'opacity 0.3s ease, visibility 0.3s ease',
        }}
      >
        {/* Menu Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 'clamp(20px, 3vw, 28px) 20px',
          }}
        >
          {/* Logo in menu */}
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <img
              src="/logomain.png"
              alt="Formless Logo"
              style={{
                height: 'clamp(24px, 4vw, 30px)',
                width: 'auto',
              }}
            />
          </a>

          {/* Close Button - White Circle with X */}
          <button
            onClick={() => setMenuOpen(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: 'white',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
            aria-label="Close menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2">
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="6" y1="18" x2="18" y2="6" />
            </svg>
          </button>
        </div>

        {/* Navigation Links */}
        <nav
          style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '40px 20px',
            gap: '24px',
          }}
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target={link.newTab ? '_blank' : undefined}
              rel={link.newTab ? 'noopener noreferrer' : undefined}
              onClick={() => setMenuOpen(false)}
              style={{
                color: 'white',
                textDecoration: 'none',
                fontSize: 'clamp(32px, 8vw, 48px)',
                fontWeight: '400',
                fontFamily: '"Inter", sans-serif',
                lineHeight: '1.3',
              }}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Header;

import { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import FluidBackground from './components/FluidBackground';
import FormlessLogoSection from './components/FormlessLogo';
import ServicesSection from './components/Servicessection';

const App = () => {
  const [founderVisible, setFounderVisible] = useState(false);
  const [joinVisible, setJoinVisible] = useState(false);
  const founderRef = useRef(null);
  const joinRef = useRef(null);

  useEffect(() => {
    document.title = 'Home';
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === founderRef.current) {
              setFounderVisible(true);
            }
            if (entry.target === joinRef.current) {
              setJoinVisible(true);
            }
          }
        });
      },
      { threshold: 0.2 }
    );

    if (founderRef.current) {
      observer.observe(founderRef.current);
    }
    if (joinRef.current) {
      observer.observe(joinRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#000',
      color: 'white',
      fontFamily: '"Inter", sans-serif',
    }}>
      {/* Fluid Background Animation */}
      <FluidBackground />
      
      {/* Header/Navigation */}
      <Header />
      
      {/* Hero Section */}
      <section
        className="hero-section"
        style={{
          position: 'relative',
          zIndex: 2,
          paddingTop: '140px',
          paddingBottom: '200px',
          paddingLeft: '16px',
          paddingRight: '16px',
        }}
      >
        <div className="hero-flex" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          width: '100%',
          gap: '80px',
        }}>
          {/* Left Column */}
          <div style={{ flex: '0 0 auto' }}>
            <h1 style={{
              fontSize: '58px',
              fontWeight: '300',
              lineHeight: '1.1',
              margin: '0 0 48px 0',
              fontFamily: 'sans-serif',
            }}>
              Welcome to the future<br />of the internet
            </h1>

            <div className="hero-buttons" style={{ display: 'flex', gap: '20px' }}>
              <button
                style={{
                  padding: '16px 32px',
                  fontSize: '16px',
                  fontWeight: '500',
                  backgroundColor: 'transparent',
                  color: 'white',
                  border: '1px solid white',
                  borderRadius: '50px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontFamily: '"Inter", sans-serif',
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'white';
                  e.target.style.color = 'black';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = 'white';
                }}
                onClick={() => window.open('/api-docs', '_blank')}
              >
                View API Documentation
              </button>
              <button
                style={{
                  padding: '16px 32px',
                  fontSize: '16px',
                  fontWeight: '500',
                  backgroundColor: 'white',
                  color: 'black',
                  border: '1px solid white',
                  borderRadius: '50px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontFamily: '"Inter", sans-serif',
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'white';
                  e.target.style.color = 'black';
                }}
              >
                Visit share.stream
              </button>
            </div>
          </div>

          {/* Right Column */}
          <div style={{
            maxWidth: '480px',
            paddingTop: '8px',
            marginLeft: 'auto',
          }}>
            <p style={{
              fontSize: '20px',
              lineHeight: '1.4',
              fontWeight: '400',
              margin: 0,
              fontFamily: '"Inter", sans-serif',
            }}>
              From cutting edge smart contracts to stablecoin payments and revenue sharing technology, our services help you reimagine monetization and community ownership in the new digital economy.
            </p>
          </div>
        </div>
      </section>

      {/* Big FORMLESS Logo Section */}
      <FormlessLogoSection />

      {/* Services Section with 3D Glass Logos */}
      <ServicesSection />

      {/* Tagline + Cards Overlapping Section */}
      <section
        style={{
          position: 'relative',
          zIndex: 2,
        }}
      >
        {/* Sticky Tagline - centered */}
        <div
          style={{
            height: '180vh', // Taller to create scroll space before cards
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'sticky',
              top: 0,
              height: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1,
            }}
          >
            <div style={{ textAlign: 'center', maxWidth: '1000px', padding: '0 40px' }}>
              <h2 style={{
                fontSize: 'clamp(36px, 5vw, 56px)',
                fontWeight: '400',
                lineHeight: '1.35',
                fontFamily: '"Inter", sans-serif',
                margin: 0,
                letterSpacing: '-0.5px',
              }}>
                Be your own platform.<br />
                Share freely and fairly.<br />
                Participate, and own a piece.
              </h2>
            </div>
          </div>
        </div>

        {/* Feature Cards - all align at top, middle is taller so appears first */}
        <div
          className="feature-cards-wrapper"
          style={{
            position: 'relative',
            zIndex: 2,
            marginTop: '-100vh',
            paddingBottom: '100px',
          }}
        >
          <div className="feature-cards-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '20px',
            maxWidth: '1300px',
            margin: '0 auto',
            padding: '0 40px',
            alignItems: 'end',
          }}>
            {/* Card 1 - Code/API */}
            <div className="feature-card" style={{ marginTop: '200px' }}>
              {/* Code Image */}
              <div style={{
                borderRadius: '2px',
                overflow: 'hidden',
                marginBottom: '20px',
                height: '350px',
              }}>
                <img 
                  src="/card1.png" 
                  alt="SHARE Protocol and API"
                  className="card1-img"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.5s ease',
                  }}
                />
              </div>
              
              <h3 style={{
                fontSize: '17px',
                fontWeight: '600',
                marginBottom: '10px',
              }}>
                SHARE Protocol and API
              </h3>
              <p style={{
                fontSize: '13px',
                lineHeight: '1.6',
                color: 'white',
                marginBottom: '14px',
              }}>
                Increase customer engagement and lifetime value with revenue sharing technology.
              </p>
              <a 
                href="#" 
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: 'white',
                  textDecoration: 'none',
                  fontSize: '13px',
                  paddingBottom: '8px',
                  borderBottom: '1px solid transparent',
                  transition: 'border-color 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderBottom = '1px solid white';
                  const img = document.querySelector('.card1-img');
                  if (img) img.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderBottom = '1px solid transparent';
                  const img = document.querySelector('.card1-img');
                  if (img) img.style.transform = 'scale(1)';
                }}
              >
                View Documentation
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginLeft: '4px' }}>
                  <path d="M7 17L17 7M17 7H10M17 7V14"/>
                </svg>
              </a>
            </div>

            {/* Card 2 - share.stream - appears FIRST */}
            <div className="feature-card" style={{ marginTop: '0px' }}>
              {/* Portrait Image */}
              <div style={{
                height: '400px',
                borderRadius: '2px',
                overflow: 'hidden',
                marginBottom: '20px',
              }}>
                <img 
                  src="/card2.png" 
                  alt="share.stream"
                  className="card2-img"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.5s ease',
                  }}
                />
              </div>
              
              <h3 style={{
                fontSize: '17px',
                fontWeight: '600',
                marginBottom: '10px',
              }}>
                share.stream
              </h3>
              <p style={{
                fontSize: '13px',
                lineHeight: '1.6',
                color: 'white',
                marginBottom: '14px',
              }}>
                A direct-to-fan streaming platform where fans support creators and earn when they succeed. See SHARE Protocol in action.
              </p>
              <a 
                href="#" 
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: 'white',
                  textDecoration: 'none',
                  fontSize: '13px',
                  paddingBottom: '8px',
                  borderBottom: '1px solid transparent',
                  transition: 'border-color 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderBottom = '1px solid white';
                  const img = document.querySelector('.card2-img');
                  if (img) img.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderBottom = '1px solid transparent';
                  const img = document.querySelector('.card2-img');
                  if (img) img.style.transform = 'scale(1)';
                }}
              >
                Visit share.stream
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginLeft: '4px' }}>
                  <path d="M7 17L17 7M17 7H10M17 7V14"/>
                </svg>
              </a>
            </div>

            {/* Card 3 - Consulting - appears SECOND */}
            <div className="feature-card" style={{ marginTop: '120px' }}>
              {/* Office Image */}
              <div style={{
                height: '300px',
                borderRadius: '2px',
                overflow: 'hidden',
                marginBottom: '20px',
              }}>
                <img 
                  src="/card3.png" 
                  alt="Consulting Services"
                  className="card3-img"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.5s ease',
                  }}
                />
              </div>
              
              <h3 style={{
                fontSize: '17px',
                fontWeight: '600',
                marginBottom: '10px',
              }}>
                Consulting Services
              </h3>
              <p style={{
                fontSize: '13px',
                lineHeight: '1.6',
                color: 'white',
                marginBottom: '14px',
              }}>
                Take your product experience to the next level with our expert guidance on integrating crypto technologies.
              </p>
              <a 
                href="#" 
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: 'white',
                  textDecoration: 'none',
                  fontSize: '13px',
                  paddingBottom: '8px',
                  borderBottom: '1px solid transparent',
                  transition: 'border-color 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderBottom = '1px solid white';
                  const img = document.querySelector('.card3-img');
                  if (img) img.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderBottom = '1px solid transparent';
                  const img = document.querySelector('.card3-img');
                  if (img) img.style.transform = 'scale(1)';
                }}
              >
                Schedule a Meeting
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginLeft: '4px' }}>
                  <path d="M7 17L17 7M17 7H10M17 7V14"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Gradient Fade to Black */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          height: '300px',
          background: 'linear-gradient(to bottom, transparent 0%, #000 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Illuminating Section - Black background */}
      <section
        className="illuminating-section"
        style={{
          position: 'relative',
          zIndex: 3,
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          padding: '100px 60px',
          backgroundColor: '#000',
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '24px',
          maxWidth: '800px',
        }}>
          {/* Hexagon Shape (like logo) */}
          <svg 
            width="30" 
            height="30" 
            viewBox="0 0 16 18" 
            fill="white"
            
            style={{
              flexShrink: 0,
              marginTop: '16px',
            }}
          >
            <polygon points="8,0 16,4.5 16,13.5 8,18 0,13.5 0,4.5"/>
          </svg>
          
          {/* Text */}
          <h2 style={{
            fontSize: 'clamp(36px, 5vw,56px)',
            fontWeight: '400',
            lineHeight: '1.1',
            fontFamily: '"Inter", sans-serif',
            margin: 0,
            letterSpacing: '-1px',
          }}>
            Illuminating true<br />
            human purpose<br />
            through technology
          </h2>
        </div>
      </section>

      {/* Founder Quote Section */}
      <section
        ref={founderRef}
        className="founder-section"
        style={{
          position: 'relative',
          zIndex: 3,
          padding: '100px 60px',
          backgroundColor: '#000',
        }}
      >
        <div className="founder-content" style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '200px',
          maxWidth: '1200px',
          margin: '0 auto',
        }}>
          {/* Left Column - Photo and Name */}
          <div style={{
            flex: '0 0 auto',
            opacity: founderVisible ? 1 : 0,
            transform: founderVisible ? 'translateY(0)' : 'translateY(40px)',
            transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
          }}>
            {/* Photo */}
            <div style={{
              width: '280px',
              height: '350px',
              overflow: 'hidden',
              marginBottom: '30px',
            }}>
              <img 
                src="/card4.png" 
                alt="Brandon Thorpe"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: 'grayscale(100%)',
                }}
              />
            </div>
            
            {/* Name */}
            <h3 style={{
              fontSize: '42px',
              fontWeight: '300',
              lineHeight: '1.1',
              margin: '0 0 8px 0',
              fontFamily: '"Inter", sans-serif',
              letterSpacing: '-1px',
            }}>
              Brandon<br />Thorpe
            </h3>
            
            {/* Title */}
            <p style={{
              fontSize: '14px',
              fontWeight: '400',
              color: 'white',
              margin: '16px 0 0 0',
              fontFamily: '"Inter", sans-serif',
            }}>
              Founder, FORMLESS
            </p>
          </div>
          
          {/* Right Column - Quote */}
          <div style={{
            flex: '1',
            paddingTop: '60px',
            opacity: founderVisible ? 1 : 0,
            transform: founderVisible ? 'translateY(0)' : 'translateY(40px)',
            transition: 'opacity 0.8s ease-out 0.3s, transform 0.8s ease-out 0.3s',
          }}>
            <blockquote style={{
              fontSize: 'clamp(25px, 3vw, 35px)',
              fontWeight: '300',
              lineHeight: '1.2',
              fontFamily: '"Inter", sans-serif',
              margin: 0,
              letterSpacing: '-0.5px',
            }}>
              "The future of commerce and culture is participation with purpose, not simply consumption."
            </blockquote>
          </div>
        </div>
      </section>

      {/* Gradient Transition to show FluidBackground */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          height: '300px',
          background: 'linear-gradient(to bottom, #000 0%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Join the Network Section with Gradient */}
      <section
        ref={joinRef}
        className="join-section"
        style={{
          position: 'relative',
          zIndex: 2,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '100px 60px',
          overflow: 'hidden',
          background: 'transparent',
          marginTop: '-150px',
        }}
      >
        {/* Content */}
        <div style={{ 
          position: 'relative', 
          zIndex: 1, 
          textAlign: 'center',
          opacity: joinVisible ? 1 : 0,
          transform: joinVisible ? 'translateY(0)' : 'translateY(40px)',
          transition: 'opacity 0.8s ease-out 0.3s, transform 0.8s ease-out 0.3s',
        }}>
          <h2 style={{
            fontSize: 'clamp(48px, 8vw, 100px)',
            fontWeight: '300',
            lineHeight: '1.1',
            fontFamily: '"Inter", sans-serif',
            margin: '0 0 60px 0',
            letterSpacing: '-2px',
          }}>
            Join the network today.
          </h2>
          
          <a 
            href="#" 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              color: 'white',
              textDecoration: 'none',
              fontSize: '18px',
              fontWeight: '400',
              fontFamily: '"Inter", sans-serif',
              paddingBottom: '8px',
              borderBottom: '1px solid transparent',
              transition: 'border-color 0.4s ease-in',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'transparent';
            }}
          >
            Schedule a Meeting
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M7 17L17 7M17 7H10M17 7V14"/>
            </svg>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="footer"
        style={{
          position: 'relative',
          zIndex: 2,
          padding: '60px 60px 40px 60px',
          background: 'transparent',
        }}
      >
        {/* Social Media Icons */}
        <div className="social-icons" style={{
          display: 'flex',
          gap: '40px',
          marginBottom: '60px',
        }}>
          {/* X (Twitter) */}
          <a href="#" style={{ color: 'white', transition: 'opacity 0.3s ease' }} 
             onMouseEnter={(e) => e.currentTarget.style.opacity = '0.6'}
             onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
          
          {/* LinkedIn */}
          <a href="#" style={{ color: 'white', transition: 'opacity 0.3s ease' }}
             onMouseEnter={(e) => e.currentTarget.style.opacity = '0.6'}
             onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>
          
          {/* Instagram */}
          <a href="#" style={{ color: 'white', transition: 'opacity 0.3s ease' }}
             onMouseEnter={(e) => e.currentTarget.style.opacity = '0.6'}
             onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>
          
          {/* Discord */}
          <a href="#" style={{ color: 'white', transition: 'opacity 0.3s ease' }}
             onMouseEnter={(e) => e.currentTarget.style.opacity = '0.6'}
             onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z"/>
            </svg>
          </a>
        </div>
        
        {/* Large FORMLESS Logo */}
        <div className="footer-logo" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '40px',
          marginBottom: '60px',
        }}>
          {/* Logo PNG */}
          <img
            src="/logomain.png"
            alt="Formless Logo"
            style={{
              height: 'clamp(120px, 18vw, 200px)',
              width: 'auto',
            }}
          />

          {/* Big FORMLESS Text */}
          <h2 style={{
            fontSize: 'clamp(80px, 15vw, 200px)',
            fontWeight: '500',
            letterSpacing: '-4px',
            margin: 0,
            color: 'white',
            fontFamily: '"Inter", sans-serif',
            lineHeight: 1,
            textTransform: 'uppercase',
          }}>
            FORMLESS<sup style={{
              fontSize: '14%',
              verticalAlign: 'super',
              fontWeight: '400',
              marginLeft: '8px',
              position: 'relative',
              top: '-0.2em',
            }}>™</sup>
          </h2>
        </div>
        
        {/* Footer Links */}
        <div className="footer-links" style={{
          display: 'flex',
          justifyContent: 'flex-start',
          gap: '0',
          fontSize: '14px',
          fontFamily: '"Inter", sans-serif',
          paddingBottom: '20px',
          color: 'rgba(255,255,255,0.7)',
        }}>
          <span style={{ marginRight: '200px' }}>© FORMLESS</span>
          <a href="#" style={{ 
            color: 'rgba(255,255,255,0.7)', 
            textDecoration: 'none',
            transition: 'color 0.3s ease',
            marginRight: '200px',
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}>
            Privacy Policy
          </a>
          <a href="#" style={{ 
            color: 'rgba(255,255,255,0.7)', 
            textDecoration: 'none',
            transition: 'color 0.3s ease',
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}>
            Terms of Service
          </a>
        </div>
      </footer>
    </div>
  );
};

export default App;
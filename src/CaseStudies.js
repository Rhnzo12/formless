import { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import FluidBackground from './components/FluidBackground';

const CaseStudies = () => {
  const [heroVisible, setHeroVisible] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [joinVisible, setJoinVisible] = useState(false);
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const detailsRef = useRef(null);
  const joinRef = useRef(null);

  useEffect(() => {
    document.title = 'Case Studies';
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === heroRef.current) {
              setHeroVisible(true);
            }
            if (entry.target === statsRef.current) {
              setStatsVisible(true);
            }
            if (entry.target === detailsRef.current) {
              setDetailsVisible(true);
            }
            if (entry.target === joinRef.current) {
              setJoinVisible(true);
            }
          }
        });
      },
      { threshold: 0.2 }
    );

    if (heroRef.current) observer.observe(heroRef.current);
    if (statsRef.current) observer.observe(statsRef.current);
    if (detailsRef.current) observer.observe(detailsRef.current);
    if (joinRef.current) observer.observe(joinRef.current);

    return () => observer.disconnect();
  }, []);

  const stats = [
    { value: '500X', label: 'Revenue-per-stream' },
    { value: '200X', label: 'Faster time-to-revenue' },
    { value: '$1.60', label: 'Per stream earned' },
    { value: '5000%', label: 'Increase in link clicks' },
  ];

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
      <Header activePage="case-studies" />

      {/* Hero Section */}
      <section
        ref={heroRef}
        style={{
          position: 'relative',
          zIndex: 2,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          paddingTop: '120px',
          paddingBottom: '100px',
          paddingLeft: 'clamp(16px, 3vw, 40px)',
          paddingRight: 'clamp(16px, 3vw, 40px)',
        }}
      >
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          maxWidth: '1500px',
          margin: '0 auto',
          gap: 'clamp(80px, 12vw, 150px)',
          flexWrap: 'wrap',
          opacity: heroVisible ? 1 : 0,
          transform: heroVisible ? 'translateY(0)' : 'translateY(40px)',
          transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
        }}>
          {/* Left Column - Title */}
          <div style={{ flex: '1 1 400px', maxWidth: '700px' }}>
            <p style={{
              fontSize: 'clamp(12px, 1.5vw, 16px)',
              fontWeight: '500',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              marginBottom: '24px',
              opacity: 0.7,
            }}>
              Case Studies
            </p>
            <h1 style={{
              fontSize: 'clamp(36px, 6vw, 72px)',
              fontWeight: '400',
              lineHeight: '1.05',
              margin: 0,
              fontFamily: '"Inter", sans-serif',
              letterSpacing: '-2px',
            }}>
              Real results.<br />Real impact.
            </h1>
          </div>

          {/* Right Column - Description */}
          <div style={{
            flex: '1 1 400px',
            maxWidth: '500px',
            paddingTop: '60px',
          }}>
            <p style={{
              fontSize: 'clamp(14px, 1.8vw, 20px)',
              lineHeight: '1.6',
              fontWeight: '400',
              margin: 0,
              fontFamily: '"Inter", sans-serif',
            }}>
              Discover how leading companies are leveraging FORMLESS technology to transform their revenue models and create meaningful connections with their communities.
            </p>
          </div>
        </div>
      </section>

      {/* Gradient Fade to Black */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          height: '200px',
          background: 'linear-gradient(to bottom, transparent 0%, #000 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Featured Case Study - Symphonic Distribution */}
      <section
        style={{
          position: 'relative',
          zIndex: 3,
          padding: '80px clamp(16px, 3vw, 40px)',
          backgroundColor: '#000',
        }}
      >
        <div style={{
          maxWidth: '1500px',
          margin: '0 auto',
        }}>
          {/* Case Study Header */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '24px',
            marginBottom: '80px',
          }}>
            {/* Hexagon Shape */}
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

            <h2 style={{
              fontSize: 'clamp(36px, 5vw, 56px)',
              fontWeight: '400',
              lineHeight: '1.1',
              fontFamily: '"Inter", sans-serif',
              margin: 0,
              letterSpacing: '-1px',
            }}>
              Symphonic Distribution
            </h2>
          </div>

          {/* Partner Info */}
          <div style={{
            display: 'flex',
            gap: 'clamp(40px, 8vw, 120px)',
            marginBottom: '100px',
            flexWrap: 'wrap',
          }}>
            <div>
              <p style={{
                fontSize: '14px',
                opacity: 0.6,
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}>
                Industry
              </p>
              <p style={{
                fontSize: 'clamp(18px, 2vw, 24px)',
                fontWeight: '400',
              }}>
                Music Distribution & Royalties
              </p>
            </div>
            <div>
              <p style={{
                fontSize: '14px',
                opacity: 0.6,
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}>
                Location
              </p>
              <p style={{
                fontSize: 'clamp(18px, 2vw, 24px)',
                fontWeight: '400',
              }}>
                United States
              </p>
            </div>
            <div>
              <p style={{
                fontSize: '14px',
                opacity: 0.6,
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}>
                Partnership
              </p>
              <p style={{
                fontSize: 'clamp(18px, 2vw, 24px)',
                fontWeight: '400',
              }}>
                SHARE Protocol Integration
              </p>
            </div>
          </div>

          {/* Stats Section */}
          <div
            ref={statsRef}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 'clamp(30px, 4vw, 60px)',
              marginBottom: '120px',
              padding: '60px 0',
              borderTop: '1px solid rgba(255,255,255,0.1)',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            {stats.map((stat, index) => (
              <div
                key={index}
                style={{
                  textAlign: 'center',
                  opacity: statsVisible ? 1 : 0,
                  transform: statsVisible ? 'translateY(0)' : 'translateY(30px)',
                  transition: `opacity 0.6s ease-out ${index * 0.1}s, transform 0.6s ease-out ${index * 0.1}s`,
                }}
              >
                <p style={{
                  fontSize: 'clamp(48px, 8vw, 80px)',
                  fontWeight: '300',
                  margin: '0 0 16px 0',
                  letterSpacing: '-2px',
                  background: 'linear-gradient(135deg, #fff 0%, #888 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                  {stat.value}
                </p>
                <p style={{
                  fontSize: 'clamp(14px, 1.5vw, 18px)',
                  opacity: 0.7,
                  margin: 0,
                }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          {/* Case Study Details */}
          <div
            ref={detailsRef}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
              gap: 'clamp(40px, 6vw, 100px)',
              marginBottom: '100px',
            }}
          >
            {/* Challenge */}
            <div style={{
              opacity: detailsVisible ? 1 : 0,
              transform: detailsVisible ? 'translateY(0)' : 'translateY(30px)',
              transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
            }}>
              <h3 style={{
                fontSize: 'clamp(24px, 3vw, 32px)',
                fontWeight: '400',
                marginBottom: '24px',
                letterSpacing: '-0.5px',
              }}>
                The Challenge
              </h3>
              <p style={{
                fontSize: 'clamp(16px, 1.5vw, 18px)',
                lineHeight: '1.7',
                opacity: 0.85,
              }}>
                Symphonic Distribution, an industry leader in music distribution and royalty payments,
                faced the challenge of slow payment cycles and limited fan engagement. Traditional
                royalty systems meant artists waited months for payments, and there was no mechanism
                for fans to participate in an artist's success.
              </p>
            </div>

            {/* Solution */}
            <div style={{
              opacity: detailsVisible ? 1 : 0,
              transform: detailsVisible ? 'translateY(0)' : 'translateY(30px)',
              transition: 'opacity 0.8s ease-out 0.2s, transform 0.8s ease-out 0.2s',
            }}>
              <h3 style={{
                fontSize: 'clamp(24px, 3vw, 32px)',
                fontWeight: '400',
                marginBottom: '24px',
                letterSpacing: '-0.5px',
              }}>
                The Solution
              </h3>
              <p style={{
                fontSize: 'clamp(16px, 1.5vw, 18px)',
                lineHeight: '1.7',
                opacity: 0.85,
              }}>
                By integrating the SHARE Protocol, Symphonic enabled instant stablecoin payments
                and community revenue sharing. Artists could now receive payments in real-time,
                while fans could participate in royalty splits, creating a new paradigm for
                creator-fan relationships in the music industry.
              </p>
            </div>
          </div>

          {/* Results Section */}
          <div style={{
            backgroundColor: 'rgba(255,255,255,0.03)',
            borderRadius: '16px',
            padding: 'clamp(40px, 5vw, 80px)',
            marginBottom: '80px',
            opacity: detailsVisible ? 1 : 0,
            transform: detailsVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.8s ease-out 0.4s, transform 0.8s ease-out 0.4s',
          }}>
            <h3 style={{
              fontSize: 'clamp(24px, 3vw, 32px)',
              fontWeight: '400',
              marginBottom: '40px',
              letterSpacing: '-0.5px',
            }}>
              The Results
            </h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '32px',
            }}>
              {[
                {
                  title: 'Instant Payments',
                  description: '200X faster time-to-revenue with instant stablecoin payments, eliminating months-long payment cycles.',
                },
                {
                  title: 'Revenue Per Stream',
                  description: '$160 generated on only 100 streams in 24 hours, achieving $1.60 per stream compared to fractions of a cent traditionally.',
                },
                {
                  title: 'Community Engagement',
                  description: '5000% increase in link clicks and 177% increase in impressions through community-driven revenue sharing.',
                },
                {
                  title: 'Fan Participation',
                  description: 'Enabled businesses and consumers to participate in royalty splits, creating true community ownership.',
                },
              ].map((result, index) => (
                <div key={index}>
                  <h4 style={{
                    fontSize: '18px',
                    fontWeight: '500',
                    marginBottom: '12px',
                  }}>
                    {result.title}
                  </h4>
                  <p style={{
                    fontSize: '15px',
                    lineHeight: '1.6',
                    opacity: 0.75,
                    margin: 0,
                  }}>
                    {result.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Quote Section */}
          <div style={{
            maxWidth: '900px',
            margin: '0 auto 100px',
            textAlign: 'center',
            opacity: detailsVisible ? 1 : 0,
            transform: detailsVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.8s ease-out 0.6s, transform 0.8s ease-out 0.6s',
          }}>
            <blockquote style={{
              fontSize: 'clamp(24px, 3.5vw, 36px)',
              fontWeight: '300',
              lineHeight: '1.4',
              fontStyle: 'italic',
              margin: '0 0 32px 0',
            }}>
              "The integration of SHARE Protocol has fundamentally changed how we think about
              artist payments and fan engagement. This is the future of the creator economy."
            </blockquote>
            <p style={{
              fontSize: '16px',
              opacity: 0.7,
            }}>
              — Symphonic Distribution Team
            </p>
          </div>
        </div>
      </section>

      {/* Gradient Transition */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          height: '300px',
          background: 'linear-gradient(to bottom, #000 0%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Join the Network Section */}
      <section
        ref={joinRef}
        style={{
          position: 'relative',
          zIndex: 2,
          minHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '100px 40px',
          marginTop: '-150px',
        }}
      >
        <div style={{
          textAlign: 'center',
          opacity: joinVisible ? 1 : 0,
          transform: joinVisible ? 'translateY(0)' : 'translateY(40px)',
          transition: 'opacity 0.8s ease-out 0.3s, transform 0.8s ease-out 0.3s',
        }}>
          <h2 style={{
            fontSize: 'clamp(36px, 6vw, 72px)',
            fontWeight: '300',
            lineHeight: '1.1',
            fontFamily: '"Inter", sans-serif',
            margin: '0 0 24px 0',
            letterSpacing: '-2px',
          }}>
            Ready to transform your<br />revenue model?
          </h2>
          <p style={{
            fontSize: 'clamp(16px, 2vw, 20px)',
            opacity: 0.7,
            marginBottom: '48px',
            maxWidth: '600px',
          }}>
            Join industry leaders who are already leveraging FORMLESS technology.
          </p>

          <a
            href="/contact"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              color: 'white',
              textDecoration: 'none',
              fontSize: '18px',
              fontWeight: '400',
              fontFamily: '"Inter", sans-serif',
              padding: '16px 32px',
              border: '1px solid white',
              borderRadius: '50px',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
              e.currentTarget.style.color = 'black';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'white';
            }}
          >
            Get Started
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M7 17L17 7M17 7H10M17 7V14"/>
            </svg>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          position: 'relative',
          zIndex: 2,
          padding: '20px 20px 5px 20px',
          background: 'transparent',
        }}
      >
        {/* Social Media Icons */}
        <div style={{
          display: 'flex',
          gap: '80px',
          marginBottom: '30px',
        }}>
          {/* X (Twitter) */}
          <a href="https://x.com/formless_xyz" target="_blank" rel="noopener noreferrer" style={{ color: 'white', transition: 'opacity 0.3s ease' }}
             onMouseEnter={(e) => e.currentTarget.style.opacity = '0.6'}
             onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>

          {/* LinkedIn */}
          <a href="https://www.linkedin.com/company/formlessxyz" target="_blank" rel="noopener noreferrer" style={{ color: 'white', transition: 'opacity 0.3s ease' }}
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
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '32px',
          marginBottom: '40px',
        }}>
          {/* Big Logo Image */}
          <img
            src="/logomain.png"
            alt="Formless Logo"
            style={{
              height: 'clamp(100px, 18vw, 180px)',
              width: 'auto',
            }}
          />

          {/* Big FORMLESS Text */}
          <h2 style={{
            fontSize: 'clamp(60px, 14vw, 180px)',
            fontWeight: '600',
            letterSpacing: '0px',
            margin: 0,
            color: 'white',
            fontFamily: '"Inter", sans-serif',
          }}>
            FORMLESS<sup style={{
              fontSize: '25%',
              verticalAlign: 'super',
              fontWeight: '400',
            }}>™</sup>
          </h2>
        </div>

        {/* Footer Links */}
        <div style={{
          display: 'flex',
          gap: '130px',
          fontSize: '12px',
          fontFamily: '"Inter", sans-serif',
          marginBottom: '30px',
          color: 'white',
        }}>
          <span>© FORMLESS</span>
          <a href="#" style={{
            color: 'rgba(255,255,255,0.7)',
            textDecoration: 'none',
            transition: 'color 0.3s ease',
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

      {/* Responsive Styles */}
      <style>
        {`
          @media (max-width: 768px) {
            .footer-logo {
              flex-direction: column;
              align-items: flex-start;
              gap: 16px !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default CaseStudies;

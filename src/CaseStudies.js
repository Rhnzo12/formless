import { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import FluidBackground from './components/FluidBackground';

const CaseStudies = () => {
  const [heroVisible, setHeroVisible] = useState(false);
  const [articlesVisible, setArticlesVisible] = useState(false);
  const heroRef = useRef(null);
  const articlesRef = useRef(null);

  useEffect(() => {
    document.title = 'Case Studies | FORMLESS';
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === heroRef.current) {
              setHeroVisible(true);
            }
            if (entry.target === articlesRef.current) {
              setArticlesVisible(true);
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    if (heroRef.current) observer.observe(heroRef.current);
    if (articlesRef.current) observer.observe(articlesRef.current);

    return () => observer.disconnect();
  }, []);

  // Featured article
  const featuredArticle = {
    category: 'Case Study',
    title: 'Skyton Academy: Turning Live-Recorded Content into Revenue',
    date: '18 Jul 2025',
    readTime: '3 Min Read',
    image: 'skyton',
  };

  // All articles
  const articles = [
    {
      id: 1,
      category: 'Business',
      title: 'The Future is Formless: 2025 and Beyond',
      description: 'Shattering boundaries of traditional networks',
      date: '07 Feb 2025',
      readTime: '2 Min Read',
      image: 'formless',
    },
    {
      id: 2,
      category: 'Case Study',
      title: 'Artist Crokomoko shares revenue from streams on Spotify and Apple Music',
      description: '2900% increase in daily streams',
      date: '29 Jan 2025',
      readTime: '2 Min Read',
      image: 'crokomoko',
    },
    {
      id: 3,
      category: 'Business',
      title: 'FORMLESS Announces Leadership Transitions as it Enters New Phase',
      description: 'Jason Martin has been named CEO',
      date: '23 Jan 2025',
      readTime: '2 Min Read',
      image: 'formless',
    },
    {
      id: 4,
      category: 'Case Study',
      title: 'Community Splits Drives a 500% Increase in Engagement',
      description: 'Sharing earnings amplifies awareness and connections',
      date: '08 Oct 2024',
      readTime: '4 Min Read',
      image: 'share',
    },
    {
      id: 5,
      category: 'Case Study',
      title: 'TRIBE Achieves a New Milestone: 10,000 Community Splits',
      description: 'Participants received $1500 in shared earnings.',
      date: '03 Oct 2024',
      readTime: '2 Min Read',
      image: 'tribe',
    },
    {
      id: 6,
      category: 'Case Study',
      title: 'HAZ uses revenue sharing to drive beat sales',
      description: 'Participants receive 50% of revenues',
      date: '17 Sep 2024',
      readTime: '3 Min Read',
      image: 'haz',
    },
    {
      id: 7,
      category: 'Product',
      title: 'SHARE 2.0: Unlocking the Power of Revenue Sharing',
      description: 'Monetize digital assets and share revenue',
      date: '17 Jul 2024',
      readTime: '2 Min Read',
      image: 'share',
    },
    {
      id: 8,
      category: 'Case Study',
      title: 'TK uses revenue sharing to promote live performances',
      description: 'Participants received $2195 in shared revenue',
      date: '16 Jul 2024',
      readTime: '3 Min Read',
      image: 'tk',
    },
    {
      id: 9,
      category: 'Case Study',
      title: "Latashá's company TOPIA uses revenue sharing to grow",
      description: 'Participants received $694 in shared revenue',
      date: '10 Jul 2024',
      readTime: '3 Min Read',
      image: 'latasha',
    },
  ];

  // Render image placeholder based on type
  const renderCardImage = (imageType) => {
    const baseStyle = {
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#0a0a0a',
    };

    switch (imageType) {
      case 'formless':
        return (
          <div style={baseStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <svg width="40" height="40" viewBox="0 0 16 18" fill="white">
                <polygon points="8,0 16,4.5 16,13.5 8,18 0,13.5 0,4.5"/>
              </svg>
              <span style={{
                fontSize: '24px',
                fontWeight: '600',
                color: 'white',
                letterSpacing: '2px',
              }}>
                FORMLESS<sup style={{ fontSize: '10px' }}>™</sup>
              </span>
            </div>
          </div>
        );
      case 'crokomoko':
        return (
          <div style={baseStyle}>
            <span style={{
              fontSize: '28px',
              fontWeight: '700',
              color: 'white',
              fontFamily: 'serif',
              fontStyle: 'italic',
              letterSpacing: '4px',
            }}>
              CROKOMOKO
            </span>
          </div>
        );
      case 'share':
        return (
          <div style={baseStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <svg width="32" height="32" viewBox="0 0 16 18" fill="white">
                <polygon points="8,0 16,4.5 16,13.5 8,18 0,13.5 0,4.5"/>
              </svg>
              <span style={{
                fontSize: '28px',
                fontWeight: '600',
                color: 'white',
                letterSpacing: '3px',
              }}>
                SHARE
              </span>
            </div>
          </div>
        );
      case 'skyton':
        return (
          <div style={{...baseStyle, backgroundColor: '#111'}}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '120px',
                height: '120px',
                border: '3px solid white',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 8px',
              }}>
                <span style={{ fontSize: '32px', fontWeight: '600', color: 'white' }}>$</span>
              </div>
              <span style={{ fontSize: '14px', fontWeight: '600', color: 'white', letterSpacing: '2px' }}>
                SKYTON ACADEMY
              </span>
            </div>
          </div>
        );
      case 'haz':
        return (
          <div style={{...baseStyle, background: 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)'}}>
            <span style={{
              fontSize: '48px',
              fontWeight: '700',
              color: 'white',
              letterSpacing: '4px',
            }}>
              HAZ
            </span>
          </div>
        );
      case 'tribe':
        return (
          <div style={{...baseStyle, background: 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)'}}>
            <span style={{
              fontSize: '32px',
              fontWeight: '600',
              color: 'white',
              letterSpacing: '6px',
            }}>
              TRIBE
            </span>
          </div>
        );
      case 'tk':
        return (
          <div style={{...baseStyle, background: 'linear-gradient(135deg, #2a2a2a 0%, #0a0a0a 100%)'}}>
            <span style={{
              fontSize: '42px',
              fontWeight: '300',
              color: '#888',
              fontFamily: 'serif',
              fontStyle: 'italic',
            }}>
              ℰ
            </span>
          </div>
        );
      case 'latasha':
        return (
          <div style={{...baseStyle, background: 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)'}}>
            <span style={{
              fontSize: '32px',
              fontWeight: '400',
              color: 'white',
              fontStyle: 'italic',
              letterSpacing: '2px',
            }}>
              LATASHÁ
            </span>
          </div>
        );
      default:
        return (
          <div style={baseStyle}>
            <svg width="40" height="40" viewBox="0 0 16 18" fill="white" opacity="0.3">
              <polygon points="8,0 16,4.5 16,13.5 8,18 0,13.5 0,4.5"/>
            </svg>
          </div>
        );
    }
  };

  const getCategoryStyle = (category) => {
    return {
      fontSize: '11px',
      fontWeight: '500',
      padding: '6px 14px',
      backgroundColor: 'rgba(255,255,255,0.1)',
      borderRadius: '4px',
      color: 'white',
      display: 'inline-block',
    };
  };

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

      {/* Featured Hero Article */}
      <section
        ref={heroRef}
        style={{
          position: 'relative',
          zIndex: 2,
          paddingTop: '140px',
          paddingBottom: '80px',
          paddingLeft: 'clamp(16px, 5vw, 60px)',
          paddingRight: 'clamp(16px, 5vw, 60px)',
        }}
      >
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '60px',
          alignItems: 'center',
          opacity: heroVisible ? 1 : 0,
          transform: heroVisible ? 'translateY(0)' : 'translateY(40px)',
          transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
        }}>
          {/* Left - Content */}
          <div>
            <span style={getCategoryStyle(featuredArticle.category)}>
              {featuredArticle.category}
            </span>

            <h1 style={{
              fontSize: 'clamp(36px, 5vw, 56px)',
              fontWeight: '400',
              lineHeight: '1.1',
              margin: '24px 0',
              letterSpacing: '-1px',
            }}>
              {featuredArticle.title}
            </h1>

            <p style={{
              fontSize: '16px',
              color: 'rgba(255,255,255,0.5)',
            }}>
              {featuredArticle.date} - {featuredArticle.readTime}
            </p>
          </div>

          {/* Right - Featured Image */}
          <div style={{
            height: '350px',
            borderRadius: '8px',
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.1)',
          }}>
            {renderCardImage(featuredArticle.image)}
          </div>
        </div>
      </section>

      {/* Latest Articles Section */}
      <section
        ref={articlesRef}
        style={{
          position: 'relative',
          zIndex: 3,
          padding: '60px clamp(16px, 5vw, 60px) 120px',
          backgroundColor: 'transparent',
        }}
      >
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
        }}>
          {/* Section Title */}
          <h2 style={{
            fontSize: 'clamp(32px, 4vw, 48px)',
            fontWeight: '400',
            marginBottom: '60px',
            letterSpacing: '-1px',
            opacity: articlesVisible ? 1 : 0,
            transform: articlesVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
          }}>
            Latest articles
          </h2>

          {/* Articles Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '32px',
          }}>
            {articles.map((article, index) => (
              <article
                key={article.id}
                style={{
                  cursor: 'pointer',
                  opacity: articlesVisible ? 1 : 0,
                  transform: articlesVisible ? 'translateY(0)' : 'translateY(30px)',
                  transition: `opacity 0.6s ease-out ${index * 0.05}s, transform 0.6s ease-out ${index * 0.05}s`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.querySelector('.card-image').style.transform = 'scale(1.02)';
                  e.currentTarget.querySelector('.card-title').style.color = 'rgba(255,255,255,0.8)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.querySelector('.card-image').style.transform = 'scale(1)';
                  e.currentTarget.querySelector('.card-title').style.color = 'white';
                }}
              >
                {/* Image Container */}
                <div style={{
                  height: '220px',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  marginBottom: '20px',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}>
                  <div
                    className="card-image"
                    style={{
                      width: '100%',
                      height: '100%',
                      transition: 'transform 0.4s ease',
                    }}
                  >
                    {renderCardImage(article.image)}
                  </div>
                </div>

                {/* Category Badge */}
                <span style={getCategoryStyle(article.category)}>
                  {article.category}
                </span>

                {/* Title */}
                <h3
                  className="card-title"
                  style={{
                    fontSize: 'clamp(20px, 2.5vw, 26px)',
                    fontWeight: '400',
                    lineHeight: '1.25',
                    margin: '16px 0 12px',
                    letterSpacing: '-0.5px',
                    transition: 'color 0.3s ease',
                  }}
                >
                  {article.title}
                </h3>

                {/* Description */}
                <p style={{
                  fontSize: '15px',
                  lineHeight: '1.5',
                  color: 'rgba(255,255,255,0.6)',
                  margin: '0 0 16px',
                }}>
                  {article.description}
                </p>

                {/* Date & Read Time */}
                <p style={{
                  fontSize: '14px',
                  color: 'rgba(255,255,255,0.4)',
                  margin: 0,
                }}>
                  {article.date} - {article.readTime}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          position: 'relative',
          zIndex: 2,
          padding: '60px 20px 20px',
          background: 'transparent',
        }}
      >
        {/* Social Media Icons */}
        <div style={{
          display: 'flex',
          gap: '60px',
          marginBottom: '40px',
          flexWrap: 'wrap',
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
          <a href="https://instagram.com/formless_xyz" target="_blank" rel="noopener noreferrer" style={{ color: 'white', transition: 'opacity 0.3s ease' }}
             onMouseEnter={(e) => e.currentTarget.style.opacity = '0.6'}
             onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>

          {/* Discord */}
          <a href="https://discord.gg/formless" target="_blank" rel="noopener noreferrer" style={{ color: 'white', transition: 'opacity 0.3s ease' }}
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
          gap: '24px',
          marginBottom: '40px',
          flexWrap: 'wrap',
        }}>
          <img
            src="/logomain.png"
            alt="Formless Logo"
            style={{
              height: 'clamp(80px, 15vw, 160px)',
              width: 'auto',
            }}
          />
          <h2 style={{
            fontSize: 'clamp(50px, 12vw, 160px)',
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
          gap: '80px',
          fontSize: '12px',
          fontFamily: '"Inter", sans-serif',
          marginBottom: '20px',
          color: 'white',
          flexWrap: 'wrap',
        }}>
          <span>© FORMLESS</span>
          <a href="/privacy" style={{
            color: 'rgba(255,255,255,0.6)',
            textDecoration: 'none',
            transition: 'color 0.3s ease',
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}>
            Privacy Policy
          </a>
          <a href="/terms" style={{
            color: 'rgba(255,255,255,0.6)',
            textDecoration: 'none',
            transition: 'color 0.3s ease',
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}>
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
            }
          }
        `}
      </style>
    </div>
  );
};

export default CaseStudies;

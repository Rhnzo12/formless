import { Suspense, useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment } from '@react-three/drei';
import * as THREE from 'three';
import Header from './components/Header';
import FluidBackground from './components/FluidBackground';

// 3D Model Component with rotation
const Logo3D = () => {
  const { scene } = useGLTF('/logo.glb');
  const modelRef = useRef();

  useFrame((state) => {
    if (modelRef.current) {
      // Faster rotation speed
      modelRef.current.rotation.y += 0.02;
      modelRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.8) * 0.3;
      modelRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.6) * 0.15;
    }
  });

  return (
    <primitive 
      ref={modelRef} 
      object={scene} 
      scale={3.5}
      position={[0, 0, 0]}
    />
  );
};

const About = () => {
  const [creatorsVisible, setCreatorsVisible] = useState(false);
  const [fundsVisible, setFundsVisible] = useState(false);
  const [angelsVisible, setAngelsVisible] = useState(false);
  const [teamVisible, setTeamVisible] = useState(false);
  const [foundersVisible, setFoundersVisible] = useState(false);
  const [joinVisible, setJoinVisible] = useState(false);
  const [expandedBios, setExpandedBios] = useState({});
  const [teamIndex, setTeamIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const creatorsRef = useRef(null);
  const fundsRef = useRef(null);
  const angelsRef = useRef(null);
  const teamRef = useRef(null);
  const foundersRef = useRef(null);
  const joinRef = useRef(null);

  const toggleBio = (index) => {
    setExpandedBios(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const nextTeam = () => {
    setTeamIndex(prev => Math.min(prev + 1, teamMembers.length - 1));
  };

  const prevTeam = () => {
    setTeamIndex(prev => Math.max(prev - 1, 0));
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.clientX);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const diff = e.clientX - startX;
    setDragOffset(diff);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    // Determine if we should change slide based on drag distance
    const threshold = 100;
    if (dragOffset < -threshold && teamIndex < teamMembers.length - 1) {
      setTeamIndex(prev => prev + 1);
    } else if (dragOffset > threshold && teamIndex > 0) {
      setTeamIndex(prev => prev - 1);
    }
    setDragOffset(0);
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      handleMouseUp();
    }
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const diff = e.touches[0].clientX - startX;
    setDragOffset(diff);
  };

  const handleTouchEnd = () => {
    handleMouseUp();
  };

  useEffect(() => {
    document.title = 'About';
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === creatorsRef.current) {
              setCreatorsVisible(true);
            }
            if (entry.target === fundsRef.current) {
              setFundsVisible(true);
            }
            if (entry.target === angelsRef.current) {
              setAngelsVisible(true);
            }
            if (entry.target === teamRef.current) {
              setTeamVisible(true);
            }
            if (entry.target === foundersRef.current) {
              setFoundersVisible(true);
            }
            if (entry.target === joinRef.current) {
              setJoinVisible(true);
            }
          }
        });
      },
      { threshold: 0.2 }
    );

    if (creatorsRef.current) {
      observer.observe(creatorsRef.current);
    }
    if (fundsRef.current) {
      observer.observe(fundsRef.current);
    }
    if (angelsRef.current) {
      observer.observe(angelsRef.current);
    }
    if (teamRef.current) {
      observer.observe(teamRef.current);
    }
    if (foundersRef.current) {
      observer.observe(foundersRef.current);
    }
    if (joinRef.current) {
      observer.observe(joinRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const teamMembers = [
    {
      name: 'Brandon Thorpe',
      title: 'Founder / CTO',
      image: '/founder/founder1.png',
      bio: "Brandon founded Formless with the belief that creativity and technology are one and the same. In his previous role as a Staff Engineer at Google AI, Brandon led a team of engineers at the intersection of Research and Machine Intelligence (RMI) and Search. Prior to that, he was a Senior Engineer at Apple in Cupertino working on multiple releases of iOS during the company's historic rise to a $1 trillion valuation. In the music industry, Brandon has worked with industry legends such as Timbaland and Dallas Austin (Grammy Award Winner and SongWriters Hall of Fame)."
    },
    {
      name: 'Jason Martin',
      title: 'Co-Founder / CEO',
      image: '/founder/founder2.png',
      bio: "Jason brings over two decades of experience leading teams in business operations and management, communications, and product marketing at companies ranging from technology start-ups to national brands. Jason holds an MBA from Georgia Tech, and was most recently in a product marketing leadership role at Unbanked where he helped enable crypto payment rails via white-label debit cards for partners including Litecoin, Nexo, and StormX. As co-founder and CEO of Formless, Jason brings years of experience and research in the crypto/blockchain/Web3 space, and a passion for growing technologies that value distributed ownership, data privacy, and permissionless access."
    },
    {
      name: 'Bixia Mac',
      title: 'Co-Founder / COO',
      image: '/founder/founder3.png',
      bio: "Bixia is an economist and rigorous finance professional based in Boston with over ten years of experience in traditional finance where she's held roles in wealth management at institutions such as Morgan Stanley, E*TRADE, and Fidelity Investments. She was an early adopter of distributed ledger technology, investing in and utilizing decentralized finance products long before they came widely known. As co-founder and COO of Formless, Bixia is responsible for all financial planning, capital efficiency, payroll, and technical infrastructure cost management. Bixia is also extremely active in women-led Web3 projects, continuously advocating for equity in the space."
    }
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
      <Header activePage="about" />
      
      {/* Hero Section */}
      <section
        className="about-hero-section"
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
        <div className="about-hero-flex" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          maxWidth: '1500px',
          margin: '0 auto',
          gap: 'clamp(60px, 18vw, 150px)',
          flexWrap: 'wrap',
        }}>
          {/* Left Column - Large Italic Text */}
          <div style={{ flex: '1 1 400px', maxWidth: '1000px' }}>
            <h1 style={{ 
              fontSize: 'clamp(28px, 5.5vw, 58px)', 
              fontWeight: '400',
              lineHeight: '1.05',
              margin: 0,
              fontFamily: '"Inter", sans-serif',
              letterSpacing: '-1px',
            }}>
              Illuminating human purpose through technology
            </h1>
          </div>
          
          {/* Right Column - Description */}
          <div style={{ 
            flex: '1 1 400px',
            maxWidth: '550px',
            paddingTop: '50px',
            paddingLeft: '30px',
          }}>
            <p style={{ 
              fontSize: 'clamp(10px, 1.8vw, 19px)', 
              lineHeight: '1.55',
              fontWeight: '400',
              margin: 0,
              fontFamily: '"Inter", sans-serif',
            }}>
              FORMLESS is a community of like-minded individuals, where anyone can go to be themselves and take part in the future of the internet. Learn more about who we are and the vision that drives the team at FORMLESS.
            </p>
          </div>
        </div>
      </section>

      {/* Gradient Fade to Black */}
      <div
        className="gradient-fade"
        style={{
          position: 'relative',
          zIndex: 2,
          height: '300px',
          background: 'linear-gradient(to bottom, transparent 0%, #000 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* By Creators Section with 3D Logo */}
      <section
        ref={creatorsRef}
        className="about-creators-section"
        style={{
          position: 'relative',
          zIndex: 3,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          padding: '100px clamp(16px, 3vw, 40px)',
          backgroundColor: '#000',
        }}
      >
        <div className="about-creators-flex" style={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          maxWidth: '1500px',
          margin: '0 auto',
          gap: 'clamp(40px, 5vw, 80px)',
          flexWrap: 'wrap',
        }}>
          {/* Left - 3D Logo */}
          <div className="about-3d-canvas" style={{
            flex: '1 1 400px',
            height: '600px',
            minWidth: '300px',
          }}>
            <Canvas
              camera={{ position: [0, 0, 4.5], fov: 50 }}
              style={{ background: 'transparent' }}
              gl={{ 
                antialias: true, 
                alpha: true,
                toneMapping: THREE.ACESFilmicToneMapping,
                toneMappingExposure: 1.5,
              }}
            >
              <Suspense fallback={null}>
                <ambientLight intensity={0.4} />
                <directionalLight position={[10, 10, 5]} intensity={2} />
                <directionalLight position={[-10, -10, -5]} intensity={1} color="#4488ff" />
                <spotLight position={[0, 10, 0]} intensity={1} angle={0.5} penumbra={1} />
                <pointLight position={[5, 0, 5]} intensity={1} color="#ff8844" />
                <pointLight position={[-5, 0, 5]} intensity={1} color="#4488ff" />
                <pointLight position={[0, 5, -5]} intensity={0.8} color="#44ff88" />
                <Environment preset="city" />
                <Logo3D />
              </Suspense>
            </Canvas>
          </div>

          {/* Right - Content with animation */}
          <div className="about-creators-content" style={{
            flex: '1 1 400px',
            maxWidth: '600px',
            opacity: creatorsVisible ? 1 : 0,
            transform: creatorsVisible ? 'translateY(0)' : 'translateY(40px)',
            transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
          }}>
            {/* Italic Heading */}
            <h2 style={{
              fontSize: 'clamp(36px, 5vw, 64px)',
              fontWeight: '400',
              lineHeight: '1.05',
              margin: '0 0 40px 0',
              fontFamily: '"Inter", sans-serif',
              letterSpacing: '-1px',
            }}>
              By creators,<br />for creators
            </h2>

            {/* Description Paragraphs */}
            <p style={{
              fontSize: 'clamp(16px, 1.5vw, 20px)',
              lineHeight: '1.6',
              fontWeight: '400',
              margin: '0 0 30px 0',
              fontFamily: '"Inter", sans-serif',
            }}>
              We aim to be a space that liberates creators from the rules that govern most forms of expression and distribution in the digital world today.
            </p>

            <p style={{
              fontSize: 'clamp(16px, 1.5vw, 20px)',
              lineHeight: '1.6',
              fontWeight: '400',
              margin: 0,
              fontFamily: '"Inter", sans-serif',
            }}>
              We empower individuals to tell the stories they want to tell, build loyal communities and set the terms around the distribution and ownership of their work.
            </p>
          </div>
        </div>
      </section>

      {/* Gradient Fade from Black */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          height: '300px',
          background: 'linear-gradient(to bottom, #000 0%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Proudly Backed By Section */}
      <section
        className="backed-section"
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          alignItems: 'flex-start',
          padding: '100px clamp(16px, 3vw, 40px) 60px',
          background: 'transparent',
          marginTop: '-150px',
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          width: '100%',
          maxWidth: '1500px',
        }}>
          {/* Hexagon Shape */}
          <svg 
            width="30" 
            height="30" 
            viewBox="0 0 16 18" 
            fill="white"
            style={{
              flexShrink: 0,
            }}
          >
            <polygon points="8,0 16,4.5 16,13.5 8,18 0,13.5 0,4.5"/>
          </svg>
          
          {/* Text */}
          <h2 style={{
            fontSize: 'clamp(32px, 5vw, 56px)',
            fontWeight: '400',
            lineHeight: '1.1',
            fontFamily: '"Inter", sans-serif',
            margin: 0,
            letterSpacing: '-1px',
          }}>
            Proudly backed by:
          </h2>
        </div>
      </section>

      {/* Funds Section */}
      <section
        ref={fundsRef}
        className="funds-section"
        style={{
          position: 'relative',
          zIndex: 2,
          padding: '60px clamp(16px, 3vw, 40px)',
          background: 'transparent',
        }}
      >
        <div style={{
          width: '100%',
          maxWidth: '1500px',
          margin: '0 auto',
        }}>
          {/* Funds Label */}
          <h3 style={{
            fontSize: '24px',
            fontWeight: '400',
            fontFamily: '"Inter", sans-serif',
            margin: '0 0 40px 0',
            letterSpacing: '0px',
            opacity: fundsVisible ? 1 : 0,
            transform: fundsVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
          }}>
            Funds
          </h3>

          {/* Funds Logo Grid */}
          <div className="funds-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            borderTop: '1px solid rgba(255,255,255,0.15)',
            borderLeft: '1px solid rgba(255,255,255,0.15)',
          }}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
              const rowIndex = Math.floor((num - 1) / 3);
              const delay = 0.3 + (rowIndex * 0.2); // 0.3s base + 0.2s per row
              return (
                <div
                  key={num}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px 15px',
                    borderRight: '1px solid rgba(255,255,255,0.15)',
                    borderBottom: '1px solid rgba(255,255,255,0.15)',
                    minHeight: '120px',
                    opacity: fundsVisible ? 1 : 0,
                    transform: fundsVisible ? 'translateY(0)' : 'translateY(30px)',
                    transition: `opacity 0.6s ease-out ${delay}s, transform 0.6s ease-out ${delay}s`,
                  }}
                >
                  <img
                    src={`/funds-logo/funds${num}.png`}
                    alt={`Fund ${num}`}
                    style={{
                      maxWidth: '280px',
                      maxHeight: '100px',
                      width: 'auto',
                      height: 'auto',
                      objectFit: 'contain',
                      filter: 'brightness(0) invert(1)',
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Angel Investors Section */}
      <section
        ref={angelsRef}
        className="angels-section"
        style={{
          position: 'relative',
          zIndex: 2,
          padding: '60px clamp(16px, 3vw, 40px)',
          background: 'transparent',
        }}
      >
        <div style={{
          width: '100%',
          maxWidth: '1500px',
          margin: '0 auto',
        }}>
          {/* Angel Investors Label */}
          <h3 style={{
            fontSize: '24px',
            fontWeight: '400',
            fontFamily: '"Inter", sans-serif',
            margin: '0 0 40px 0',
            letterSpacing: '0px',
            opacity: angelsVisible ? 1 : 0,
            transform: angelsVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
          }}>
            Angel Investors
          </h3>

          {/* Angel Investors Grid */}
          <div className="angels-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            borderTop: '1px solid rgba(255,255,255,0.15)',
            borderLeft: '1px solid rgba(255,255,255,0.15)',
          }}>
            {[
              { name: 'Sandeep Nailwal', title: 'Founder and CEO of Polygon Network' },
              { name: 'Ryan Fang', title: 'Co-Founder and COO of Ankr' },
              { name: 'Dharmesh Shah', title: 'Founder and CTO of HubSpot' },
              { name: 'Dallas Austin', title: 'Founder and CEO of Dallas Austin Distribution' },
              { name: 'Vinson Leow', title: 'Co-founder of 3Suite' },
            ].map((investor, index) => {
              const rowIndex = Math.floor(index / 3);
              const delay = 0.3 + (rowIndex * 0.2);
              return (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '40px 20px',
                    borderRight: '1px solid rgba(255,255,255,0.15)',
                    borderBottom: '1px solid rgba(255,255,255,0.15)',
                    minHeight: '120px',
                    opacity: angelsVisible ? 1 : 0,
                    transform: angelsVisible ? 'translateY(0)' : 'translateY(30px)',
                    transition: `opacity 0.6s ease-out ${delay}s, transform 0.6s ease-out ${delay}s`,
                  }}
                >
                  <h4 style={{
                    fontSize: '20px',
                    fontWeight: '500',
                    fontFamily: '"Inter", sans-serif',
                    margin: '0 0 8px 0',
                    textAlign: 'center',
                  }}>
                    {investor.name}
                  </h4>
                  <p style={{
                    fontSize: '14px',
                    fontWeight: '400',
                    fontFamily: '"Inter", sans-serif',
                    margin: 0,
                    color: 'rgba(255,255,255,0.8)',
                    textAlign: 'center',
                  }}>
                    {investor.title}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Meet the Founders Section */}
      <section
        ref={foundersRef}
        className="founders-section"
        style={{
          position: 'relative',
          zIndex: 3,
          padding: '150px clamp(16px, 3vw, 40px)',
          background: 'linear-gradient(to bottom, transparent 0%, #000 30%, #000 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
        }}
      >
        <h2 style={{
          fontSize: 'clamp(48px, 8vw, 120px)',
          fontWeight: '400',
          fontFamily: '"Inter", sans-serif',
          textAlign: 'center',
          margin: 0,
          letterSpacing: '-2px',
          opacity: foundersVisible ? 1 : 0,
          transform: foundersVisible ? 'translateY(0)' : 'translateY(40px)',
          transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
        }}>
          Meet the Founders
        </h2>
      </section>

      {/* Team Section */}
      <section
        ref={teamRef}
        className="team-section"
        style={{
          position: 'relative',
          zIndex: 3,
          padding: '100px 0',
          background: '#000',
          overflow: 'hidden',
        }}
      >
        <div style={{
          width: '100%',
          position: 'relative',
        }}>
          {/* Team Cards Container - Carousel */}
          <div
            className="team-carousel"
            style={{
              display: 'flex',
              gap: '30px',
              paddingLeft: 'clamp(16px, 3vw, 40px)',
              transform: `translateX(calc(-${teamIndex} * (min(550px, 40vw) + 30px) + ${dragOffset}px))`,
              transition: isDragging ? 'none' : 'transform 0.5s ease-out',
              cursor: isDragging ? 'grabbing' : 'grab',
              userSelect: 'none',
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {teamMembers.map((member, index) => {
              const delay = index * 0.2;
              return (
                <div
                  key={index}
                  className="team-card"
                  style={{
                    flex: '0 0 auto',
                    width: 'min(550px, 40vw)',
                    opacity: teamVisible ? 1 : 0,
                    transform: teamVisible ? 'translateY(0)' : 'translateY(40px)',
                    transition: `opacity 0.6s ease-out ${delay}s, transform 0.6s ease-out ${delay}s`,
                  }}
                >
                  {/* Image */}
                  <div style={{
                    width: '100%',
                    aspectRatio: '5/4',
                    overflow: 'hidden',
                    marginBottom: '24px',
                  }}>
                    <img
                      src={member.image}
                      alt={member.name}
                      draggable={false}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'top',
                        pointerEvents: 'none',
                      }}
                    />
                  </div>

                  {/* Name */}
                  <h3 style={{
                    fontSize: 'clamp(20px, 2vw, 28px)',
                    fontWeight: '500',
                    fontFamily: '"Inter", sans-serif',
                    margin: '0 0 8px 0',
                  }}>
                    {member.name}
                  </h3>

                  {/* Title */}
                  <p style={{
                    fontSize: 'clamp(14px, 1.2vw, 16px)',
                    fontWeight: '400',
                    fontFamily: '"Inter", sans-serif',
                    margin: '0 0 20px 0',
                    color: 'rgba(255,255,255,0.9)',
                  }}>
                    {member.title}
                  </p>

                  {/* Bio */}
                  <p style={{
                    fontSize: 'clamp(18px, 1.1vw, 20px)',
                    fontWeight: '400',
                    fontFamily: '"Inter", sans-serif',
                    lineHeight: '1.6',
                    margin: '0 0 16px 0',
                    color: 'rgba(255,255,255,0.85)',
                    display: expandedBios[index] ? 'block' : '-webkit-box',
                    WebkitLineClamp: expandedBios[index] ? 'unset' : 4,
                    WebkitBoxOrient: 'vertical',
                    overflow: expandedBios[index] ? 'visible' : 'hidden',
                  }}>
                    {member.bio}
                  </p>

                  {/* Read More/Less Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleBio(index);
                    }}
                    onMouseDown={(e) => e.stopPropagation()}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'white',
                      fontSize: 'clamp(14px, 1.1vw, 16px)',
                      fontWeight: '400',
                      fontFamily: '"Inter", sans-serif',
                      cursor: 'pointer',
                      padding: 0,
                      textDecoration: 'none',
                      borderBottom: '1px solid transparent',
                      paddingBottom: '2px',
                      transition: 'border-color 0.3s ease',
                    }}
                    onMouseEnter={(e) => e.target.style.borderBottomColor = 'white'}
                    onMouseLeave={(e) => e.target.style.borderBottomColor = 'transparent'}
                  >
                    {expandedBios[index] ? 'Read Less' : 'Read More'}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Navigation Arrows */}
          <div className="team-nav" style={{
            display: 'flex',
            gap: '16px',
            marginTop: '60px',
            paddingLeft: 'clamp(16px, 3vw, 40px)',
            opacity: teamVisible ? 1 : 0,
            transition: 'opacity 0.6s ease-out 0.6s',
          }}>
            {/* Previous Button */}
            <button
              onClick={prevTeam}
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                border: '1px solid rgba(255,255,255,0.3)',
                background: 'transparent',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'border-color 0.3s ease, background 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'white';
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Next Button */}
            <button
              onClick={nextTeam}
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                border: '1px solid rgba(255,255,255,0.3)',
                background: 'transparent',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'border-color 0.3s ease, background 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'white';
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Gradient Fade from Black */}
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
        className="about-footer"
        style={{
          position: 'relative',
          zIndex: 2,
          padding: '20px 20px 5px 20px',
          background: 'transparent',
        }}
      >
        {/* Social Media Icons */}
        <div className="social-icons" style={{
          display: 'flex',
          gap: '80px',
          marginBottom: '30px',
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
          gap: '20px',
          marginBottom: '40px',
        }}>
          {/* Hexagon Logo SVG - matching formless.xyz */}
          <svg
            viewBox="0 0 56 64"
            fill="none"
            style={{
              height: 'clamp(100px, 15vw, 180px)',
              width: 'auto',
              flexShrink: 0,
            }}
          >
            {/* Hexagon outline */}
            <path
              d="M28 1 L54 16 L54 48 L28 63 L2 48 L2 16 Z"
              stroke="white"
              strokeWidth="1.5"
              fill="none"
            />
            {/* Inner triangle pointing up */}
            <path
              d="M28 18 L44 44 L12 44 Z"
              fill="white"
            />
          </svg>

          {/* Big FORMLESS Text */}
          <h2 style={{
            fontSize: 'clamp(70px, 15vw, 200px)',
            fontWeight: '500',
            letterSpacing: '-2px',
            margin: 0,
            color: 'white',
            fontFamily: '"Inter", sans-serif',
          }}>
            FORMLESS<sup style={{
              fontSize: '18%',
              verticalAlign: 'super',
              fontWeight: '400',
              marginLeft: '4px',
            }}>™</sup>
          </h2>
        </div>
        
        {/* Footer Links */}
        <div className="footer-links" style={{
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
          /* Tablet breakpoint */
          @media (max-width: 1024px) {
            .about-hero-flex {
              gap: 60px !important;
            }
            .about-creators-flex {
              gap: 40px !important;
            }
            .about-3d-canvas {
              height: 400px !important;
            }
            .funds-grid {
              grid-template-columns: repeat(2, 1fr) !important;
            }
            .angels-grid {
              grid-template-columns: repeat(2, 1fr) !important;
            }
            .team-card {
              width: min(450px, 60vw) !important;
            }
            .team-carousel {
              transform: translateX(calc(-\${teamIndex} * (min(450px, 60vw) + 30px) + \${dragOffset}px)) !important;
            }
            .join-section {
              padding: 80px 40px !important;
            }
          }

          /* Mobile breakpoint */
          @media (max-width: 768px) {
            .about-hero-section {
              padding-top: 100px !important;
              padding-bottom: 60px !important;
              min-height: auto !important;
            }
            .about-hero-flex {
              flex-direction: column !important;
              gap: 30px !important;
            }
            .about-hero-flex > div:first-child {
              max-width: 100% !important;
            }
            .about-hero-flex > div:last-child {
              padding-top: 0 !important;
              padding-left: 0 !important;
              max-width: 100% !important;
            }
            .about-creators-section {
              padding: 60px 16px !important;
              min-height: auto !important;
            }
            .about-creators-flex {
              flex-direction: column !important;
              gap: 40px !important;
            }
            .about-3d-canvas {
              height: 300px !important;
              min-width: 100% !important;
            }
            .about-creators-content {
              max-width: 100% !important;
            }
            .gradient-fade {
              height: 150px !important;
            }
            .backed-section {
              margin-top: -80px !important;
              padding: 60px 16px 30px !important;
            }
            .backed-section h2 {
              font-size: 28px !important;
            }
            .funds-section {
              padding: 30px 16px !important;
            }
            .funds-grid {
              grid-template-columns: 1fr !important;
            }
            .funds-grid > div {
              padding: 15px 10px !important;
              min-height: 80px !important;
            }
            .funds-grid img {
              max-width: 200px !important;
              max-height: 60px !important;
            }
            .angels-section {
              padding: 30px 16px !important;
            }
            .angels-grid {
              grid-template-columns: 1fr !important;
            }
            .angels-grid > div {
              padding: 25px 15px !important;
              min-height: 80px !important;
            }
            .founders-section {
              padding: 80px 16px !important;
              min-height: 40vh !important;
            }
            .founders-section h2 {
              font-size: 36px !important;
              letter-spacing: -1px !important;
            }
            .team-section {
              padding: 60px 0 !important;
            }
            .team-card {
              width: min(320px, 85vw) !important;
            }
            .team-carousel {
              padding-left: 16px !important;
            }
            .team-nav {
              padding-left: 16px !important;
              margin-top: 40px !important;
            }
            .team-nav button {
              width: 44px !important;
              height: 44px !important;
            }
            .join-section {
              padding: 60px 20px !important;
              min-height: 60vh !important;
              margin-top: -80px !important;
            }
            .join-section h2 {
              font-size: 32px !important;
              margin-bottom: 40px !important;
              letter-spacing: -1px !important;
            }
            .about-footer {
              padding: 20px 16px 5px !important;
            }
            .social-icons {
              gap: 30px !important;
              flex-wrap: wrap !important;
            }
            .footer-logo {
              flex-direction: column !important;
              align-items: flex-start !important;
              gap: 16px !important;
            }
            .footer-logo img {
              height: 60px !important;
            }
            .footer-logo h2 {
              font-size: 48px !important;
            }
            .footer-links {
              gap: 20px !important;
              flex-wrap: wrap !important;
            }
          }

          /* Small mobile */
          @media (max-width: 480px) {
            .about-hero-section {
              padding-left: 12px !important;
              padding-right: 12px !important;
            }
            .team-card {
              width: calc(100vw - 32px) !important;
            }
            .join-section h2 {
              font-size: 28px !important;
            }
            .footer-logo h2 {
              font-size: 36px !important;
            }
            .footer-links {
              flex-direction: column !important;
              gap: 12px !important;
            }
          }
        `}
      </style>
    </div>
  );
};

// Preload the 3D model
useGLTF.preload('/logo.glb');

export default About;
import { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment } from '@react-three/drei';
import * as THREE from 'three';

const services = [
  {
    number: '01',
    title: 'SHARE Protocol and API',
    description1: 'SHARE Protocol is a set of micropayment and revenue sharing smart contracts built for EVM (Ethereum) compatible blockchains, currently deployed on Base Network.',
    description2: 'Our APIs enable you to create and integrate revenue sharing into your products and experiences to increase customer engagement and lifetime value.',
  },
  {
    number: '02',
    title: 'share.stream',
    description1: 'A next-generation direct-to-consumer streaming platform powered by SHARE Protocol.',
    description2: 'See SHARE Protocol in action as creators and fans participate in a unified system of value sharing.',
  },
  {
    number: '03',
    title: 'Consulting Services',
    description1: 'Expert guidance for smart contract integrations and product integrations using SHARE Protocol.',
    description2: 'We help you implement crypto technologies and build community-owned economic systems to supercharge your business goals.',
  },
];

// 3D Model Component
const Logo3D = ({ scrollProgress }) => {
  const { scene } = useGLTF('/logo.glb');
  const modelRef = useRef();
  const smoothProgress = useRef(0);

  useFrame(() => {
    if (modelRef.current) {
      // Smooth interpolation
      smoothProgress.current += (scrollProgress - smoothProgress.current) * 0.08;
      
      // Scroll-based rotation
      modelRef.current.rotation.x = smoothProgress.current * Math.PI * 2;
      modelRef.current.rotation.y = smoothProgress.current * Math.PI * 3;
      modelRef.current.rotation.z = Math.sin(smoothProgress.current * Math.PI) * 0.5;
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

const ServicesSection = () => {
  const sectionRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const sectionHeight = sectionRef.current.offsetHeight;
      const viewportHeight = window.innerHeight;
      
      const scrollTop = -rect.top;
      const scrollableHeight = sectionHeight - viewportHeight;
      const progress = Math.max(0, Math.min(1, scrollTop / scrollableHeight));
      
      setScrollProgress(progress);

      const newIndex = Math.min(2, Math.floor(progress * 3));
      if (newIndex !== activeIndex) {
        setActiveIndex(newIndex);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeIndex]);

  const currentService = services[activeIndex];

  return (
    <>
      <style>
        {`
          /* Desktop - larger screens */
          @media (min-width: 1200px) {
            .services-content {
              padding-right: 100px !important;
            }
            .scroll-indicator {
              right: 150px !important;
            }
          }

          /* Tablet landscape */
          @media (max-width: 1199px) and (min-width: 1025px) {
            .services-content {
              padding-right: 80px !important;
            }
            .scroll-indicator {
              right: 80px !important;
            }
          }

          /* Tablet portrait */
          @media (max-width: 1024px) and (min-width: 769px) {
            .services-sticky {
              flex-direction: row !important;
            }
            .services-3d {
              width: 45% !important;
            }
            .services-content {
              width: 55% !important;
              padding-right: 60px !important;
            }
            .scroll-indicator {
              right: 40px !important;
            }
            .service-number {
              font-size: 100px !important;
              margin-bottom: 40px !important;
            }
          }

          /* Mobile */
          @media (max-width: 768px) {
            .services-section {
              height: 250vh !important;
            }
            .services-sticky {
              flex-direction: column !important;
            }
            .services-3d {
              width: 100% !important;
              height: 35vh !important;
              min-height: 280px !important;
            }
            .services-content {
              width: 100% !important;
              height: auto !important;
              padding: 20px 24px !important;
              min-height: 45vh !important;
            }
            .scroll-indicator {
              display: none !important;
            }
            .service-number {
              font-size: 80px !important;
              margin-bottom: 30px !important;
              letter-spacing: -4px !important;
            }
            .service-title {
              font-size: 18px !important;
              margin-bottom: 16px !important;
            }
            .service-description {
              font-size: 13px !important;
              margin-bottom: 16px !important;
            }
          }

          /* Small mobile */
          @media (max-width: 480px) {
            .services-section {
              height: 220vh !important;
            }
            .services-3d {
              height: 30vh !important;
              min-height: 240px !important;
            }
            .services-content {
              padding: 16px 20px !important;
            }
            .service-number {
              font-size: 60px !important;
              margin-bottom: 24px !important;
              letter-spacing: -3px !important;
            }
            .service-title {
              font-size: 16px !important;
            }
            .service-description {
              font-size: 12px !important;
            }
          }
        `}
      </style>
      <section
        ref={sectionRef}
        className="services-section"
        style={{
          position: 'relative',
          zIndex: 2,
          height: '300vh',
          marginTop: '120px',
        }}
      >
      {/* Top Gradient Fade - from transparent to black */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '400px',
          background: 'linear-gradient(to bottom, transparent 0%, #000 100%)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      {/* Black Background Layer */}
      <div
        style={{
          position: 'absolute',
          top: '400px',
          left: 0,
          right: 0,
          bottom: '400px',
          backgroundColor: '#000',
          zIndex: 0,
        }}
      />

      {/* Bottom Gradient Fade - from black to transparent */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '400px',
          background: 'linear-gradient(to bottom, #000 0%, transparent 100%)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      {/* Sticky Container */}
      <div
        className="services-sticky"
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          display: 'flex',
          overflow: 'hidden',
          zIndex: 2,
        }}
      >
        {/* Left - 3D Logo */}
        <div
          className="services-3d"
          style={{
            width: '50%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{ width: '100%', height: '70%', maxWidth: '550px' }}>
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
                <Logo3D scrollProgress={scrollProgress} />
              </Suspense>
            </Canvas>
          </div>
        </div>

        {/* Right - Content */}
        <div className="services-content" style={{
          width: '50%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          paddingRight: '100px',
        }}>
          <div style={{ width: '100%', maxWidth: '400px' }}>
            {/* Large Number */}
            <div
              key={`number-${activeIndex}`}
              className="service-number"
              style={{
                fontSize: '140px',
                fontWeight: '200',
                lineHeight: '1',
                color: 'rgba(255, 255, 255, 0.9)',
                fontFamily: '"Inter", sans-serif',
                marginBottom: '60px',
                letterSpacing: '-6px',
                animation: 'fadeInUp 0.5s ease-out',
              }}
            >
              {currentService.number}
            </div>

            {/* Title */}
            <h3
              key={`title-${activeIndex}`}
              className="service-title"
              style={{
                fontSize: '22px',
                fontWeight: '600',
                marginBottom: '24px',
                fontFamily: '"Inter", sans-serif',
                animation: 'fadeInUp 0.5s ease-out 0.1s backwards',
              }}
            >
              {currentService.title}
            </h3>

            {/* Description 1 */}
            <p
              key={`desc1-${activeIndex}`}
              className="service-description"
              style={{
                fontSize: '12px',
                lineHeight: '1.7',
                color: 'rgba(255, 255, 255, 0.85)',
                marginBottom: '24px',
                fontFamily: '"Inter", sans-serif',
                fontWeight: '400',
                animation: 'fadeInUp 0.5s ease-out 0.2s backwards',
              }}
            >
              {currentService.description1}
            </p>

            {/* Description 2 */}
            <p
              key={`desc2-${activeIndex}`}
              className="service-description"
              style={{
                fontSize: '12px',
                lineHeight: '1.7',
                color: 'rgba(255, 255, 255, 0.85)',
                fontFamily: '"Inter", sans-serif',
                fontWeight: '400',
                animation: 'fadeInUp 0.5s ease-out 0.3s backwards',
              }}
            >
              {currentService.description2}
            </p>
          </div>
        </div>

        {/* Right Scroll Indicator - 3 segments with gaps */}
        <div
          className="scroll-indicator"
          style={{
            position: 'absolute',
            right: '150px',
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            height: '300px',
          }}
        >
          {/* Segment 1 */}
          <div
            style={{
              flex: 1,
              width: '1px',
              backgroundColor: activeIndex >= 0 ? 'white' : 'rgba(255, 255, 255, 0.2)',
              transition: 'background-color 0.3s ease',
            }}
          />
          {/* Segment 2 */}
          <div
            style={{
              flex: 1,
              width: '1px',
              backgroundColor: activeIndex >= 1 ? 'white' : 'rgba(255, 255, 255, 0.2)',
              transition: 'background-color 0.3s ease',
            }}
          />
          {/* Segment 3 */}
          <div
            style={{
              flex: 1,
              width: '1px',
              backgroundColor: activeIndex >= 2 ? 'white' : 'rgba(255, 255, 255, 0.2)',
              transition: 'background-color 0.3s ease',
            }}
          />
        </div>
      </div>

      {/* Animations */}
      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
      </section>
    </>
  );
};

useGLTF.preload('/logo.glb');

export default ServicesSection;
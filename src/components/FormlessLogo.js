import { useState, useEffect, useRef } from 'react';

const FormlessLogoSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Trigger animation by updating key
          setAnimationKey(prev => prev + 1);
          setIsVisible(true);
        } else {
          // Reset when out of view
          setIsVisible(false);
        }
      },
      {
        threshold: 0.3,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <>
      <style>
        {`
          @keyframes fadeInScale {
            0% {
              opacity: 0;
              transform: scale(0.95);
            }
            100% {
              opacity: 1;
              transform: scale(1);
            }
          }
          
          .formless-logo-animate {
            animation: fadeInScale 1s ease-out forwards;
          }
          
          .formless-logo-hidden {
            opacity: 0;
            transform: scale(0.95);
          }
        `}
      </style>
      
      <section
        ref={sectionRef}
        style={{
          position: 'relative',
          zIndex: 2,
          minHeight: '50vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px 16px',
        }}
      >
        <div 
          key={animationKey}
          className={isVisible ? 'formless-logo-animate' : 'formless-logo-hidden'}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '32px',
          }}
        >
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
      </section>
    </>
  );
};

export default FormlessLogoSection;
import { useState, useEffect, useCallback } from 'react';

const PageLoader = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  const finishLoading = useCallback(() => {
    setFadeOut(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 600);
  }, []);

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      // Accelerate towards the end
      const increment = current < 70 ? 2 : current < 90 ? 3 : 5;
      current = Math.min(current + increment, 100);
      setProgress(current);

      if (current >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          finishLoading();
        }, 200);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [finishLoading]);

  if (!isLoading) {
    return children;
  }

  return (
    <>
      {/* Loading Overlay */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: '#000',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'flex-end',
          padding: '60px 80px',
          opacity: fadeOut ? 0 : 1,
          transition: 'opacity 0.6s ease-out',
        }}
      >
        {/* Percentage Display */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          lineHeight: 1,
        }}>
          <span
            style={{
              fontSize: 'clamp(120px, 20vw, 280px)',
              fontWeight: '400',
              color: 'white',
              fontFamily: '"Inter", sans-serif',
              letterSpacing: '-4px',
              lineHeight: 0.85,
            }}
          >
            {progress}
          </span>
          <span
            style={{
              fontSize: 'clamp(30px, 5vw, 70px)',
              fontWeight: '300',
              color: 'white',
              fontFamily: '"Inter", sans-serif',
              marginTop: '0.05em',
              marginLeft: '4px',
              lineHeight: 1,
            }}
          >
            %
          </span>
        </div>
      </div>

      {/* Render children behind the overlay so they can start loading */}
      <div style={{ visibility: 'hidden' }}>
        {children}
      </div>
    </>
  );
};

export default PageLoader;

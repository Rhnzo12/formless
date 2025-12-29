import { useEffect, useRef } from 'react';
import { Gradient } from 'stripe-gradient';

const FluidBackground = () => {
  const canvasRef = useRef(null);
  const gradientRef = useRef(null);

  useEffect(() => {
    // Initialize the gradient once the canvas is mounted
    if (canvasRef.current && !gradientRef.current) {
      gradientRef.current = new Gradient();
      gradientRef.current.initGradient('#gradient-canvas');
    }

    return () => {
      // Cleanup on unmount
      if (gradientRef.current) {
        gradientRef.current.pause();
        gradientRef.current.disconnect();
      }
    };
  }, []);

  return (
    <canvas
      id="gradient-canvas"
      ref={canvasRef}
      data-js-darken-top=""
      style={{
        '--gradient-color-1': '#0061ff',
        '--gradient-color-2': '#60efff',
        '--gradient-color-3': '#ff00a0',
        '--gradient-color-4': '#ff5770',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
      }}
    />
  );
};

export default FluidBackground;

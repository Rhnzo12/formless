import { useEffect, useRef } from 'react';
import { Gradient } from 'stripe-gradient';

const FluidBackground = () => {
  const canvasRef = useRef(null);
  const gradientRef = useRef(null);

  useEffect(() => {
    // Small delay to ensure CSS is loaded
    const timer = setTimeout(() => {
      if (canvasRef.current && !gradientRef.current) {
        gradientRef.current = new Gradient();
        gradientRef.current.initGradient('#gradient-canvas');
      }
    }, 100);

    return () => {
      clearTimeout(timer);
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
    />
  );
};

export default FluidBackground;

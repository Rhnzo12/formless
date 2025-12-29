import { useEffect, useRef } from 'react';
import { Gradient } from 'stripe-gradient';

const FluidBackground = () => {
  const canvasRef = useRef(null);
  const gradientRef = useRef(null);

  useEffect(() => {
    // Initialize the gradient once the canvas is mounted
    if (canvasRef.current && !gradientRef.current) {
      gradientRef.current = new Gradient();
      // Override the default height to match the window
      gradientRef.current.height = window.innerHeight;
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
        '--gradient-color-1': '#c3e4ff',
        '--gradient-color-2': '#6ec3f4',
        '--gradient-color-3': '#eae2ff',
        '--gradient-color-4': '#b9beff',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    />
  );
};

export default FluidBackground;

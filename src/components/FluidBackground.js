import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import FOG from 'vanta/dist/vanta.fog.min';

const FluidBackground = () => {
  const vantaRef = useRef(null);
  const [vantaEffect, setVantaEffect] = useState(null);

  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(
        FOG({
          el: vantaRef.current,
          THREE: THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.00,
          minWidth: 200.00,
          highlightColor: 0x8aff3a,  // Yellow-green highlight (mouse glow)
          midtoneColor: 0x0a4a4a,    // Subtle dark teal
          lowlightColor: 0x020c0c,   // Very dark
          baseColor: 0x010606,       // Nearly black
          blurFactor: 0.9,
          speed: 0.5,
          zoom: 0.7
        })
      );
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  return (
    <div
      ref={vantaRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 1,
      }}
    />
  );
};

export default FluidBackground;

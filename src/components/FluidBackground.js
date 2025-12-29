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
          highlightColor: 0x00d4aa,  // Bright cyan-teal for the glowing areas
          midtoneColor: 0x064040,    // Medium dark teal
          lowlightColor: 0x010f0f,   // Very dark teal-black
          baseColor: 0x000808,       // Nearly black with slight teal tint
          blurFactor: 0.75,
          speed: 0.8,
          zoom: 0.6
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

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const FluidBackground = () => {
  const containerRef = useRef(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // Shader material for multi-color fog
    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      uniform float uTime;
      uniform vec2 uMouse;
      uniform vec2 uResolution;
      varying vec2 vUv;

      // Simplex noise function
      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

      float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                           -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy));
        vec2 x0 = v - i + dot(i, C.xx);
        vec2 i1;
        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod289(i);
        vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                + i.x + vec3(0.0, i1.x, 1.0));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
                  dot(x12.zw,x12.zw)), 0.0);
        m = m*m;
        m = m*m;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
        vec3 g;
        g.x = a0.x * x0.x + h.x * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }

      float fbm(vec2 p) {
        float value = 0.0;
        float amplitude = 0.5;
        float frequency = 1.0;
        for(int i = 0; i < 6; i++) {
          value += amplitude * snoise(p * frequency);
          amplitude *= 0.5;
          frequency *= 2.0;
        }
        return value;
      }

      void main() {
        vec2 uv = vUv;
        vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);

        // Mouse influence with smooth falloff
        vec2 mouse = uMouse;
        float mouseInfluence = 1.0 - smoothstep(0.0, 0.8, length((uv - mouse) * aspect));

        // Animated fog layers
        float time = uTime * 0.15;

        // Layer 1: Teal/Cyan fog (right side dominant)
        vec2 p1 = uv * 2.0 + vec2(time * 0.3, time * 0.2);
        float fog1 = fbm(p1) * 0.5 + 0.5;
        fog1 *= smoothstep(0.0, 1.0, uv.x + 0.3);
        fog1 += mouseInfluence * 0.3;
        vec3 color1 = vec3(0.0, 0.9, 0.8) * fog1 * 0.6; // Cyan/teal

        // Layer 2: Orange/Yellow fog (center-left)
        vec2 p2 = uv * 1.8 + vec2(-time * 0.2, time * 0.25);
        float fog2 = fbm(p2 + 3.0) * 0.5 + 0.5;
        fog2 *= smoothstep(0.8, 0.2, uv.x) * smoothstep(0.0, 0.5, uv.y);
        fog2 += mouseInfluence * 0.25;
        vec3 color2 = vec3(1.0, 0.5, 0.0) * fog2 * 0.5; // Orange

        // Layer 3: Purple/Violet fog (scattered)
        vec2 p3 = uv * 2.2 + vec2(time * 0.1, -time * 0.3);
        float fog3 = fbm(p3 + 7.0) * 0.5 + 0.5;
        fog3 *= (1.0 - abs(uv.x - 0.5) * 1.5);
        fog3 += mouseInfluence * 0.2;
        vec3 color3 = vec3(0.5, 0.2, 0.8) * fog3 * 0.4; // Purple

        // Layer 4: Green accent
        vec2 p4 = uv * 1.5 + vec2(time * 0.25, time * 0.15);
        float fog4 = fbm(p4 + 11.0) * 0.5 + 0.5;
        fog4 *= smoothstep(0.7, 0.3, uv.y);
        vec3 color4 = vec3(0.2, 0.8, 0.3) * fog4 * 0.3; // Green

        // Dark base color
        vec3 baseColor = vec3(0.02, 0.04, 0.05);

        // Combine all layers
        vec3 finalColor = baseColor + color1 + color2 + color3 + color4;

        // Add subtle vignette
        float vignette = 1.0 - smoothstep(0.4, 1.4, length((uv - 0.5) * 1.5));
        finalColor *= vignette * 0.8 + 0.2;

        // Tone mapping and gamma correction
        finalColor = finalColor / (finalColor + vec3(1.0));
        finalColor = pow(finalColor, vec3(0.9));

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    const uniforms = {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Mouse movement handler
    const handleMouseMove = (e) => {
      mouseRef.current.x = e.clientX / window.innerWidth;
      mouseRef.current.y = 1.0 - e.clientY / window.innerHeight;
    };

    // Touch handler
    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        mouseRef.current.x = e.touches[0].clientX / window.innerWidth;
        mouseRef.current.y = 1.0 - e.touches[0].clientY / window.innerHeight;
      }
    };

    // Resize handler
    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('resize', handleResize);

    // Animation loop
    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      uniforms.uTime.value += 0.016;

      // Smooth mouse following
      uniforms.uMouse.value.x += (mouseRef.current.x - uniforms.uMouse.value.x) * 0.05;
      uniforms.uMouse.value.y += (mouseRef.current.y - uniforms.uMouse.value.y) * 0.05;

      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', handleResize);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
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

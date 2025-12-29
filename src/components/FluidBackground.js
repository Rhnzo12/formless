import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const FluidBackground = () => {
  const containerRef = useRef(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 });
  const sceneRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // If we already have a scene setup, just restart the animation
    if (sceneRef.current) {
      const { renderer, scene, camera, uniforms, geometry, material } = sceneRef.current;

      // Re-append canvas if it was removed
      if (!containerRef.current.contains(renderer.domElement)) {
        containerRef.current.appendChild(renderer.domElement);
      }

      // Restart animation
      let animationId;
      let lastTime = performance.now();

      const animate = (currentTime) => {
        animationId = requestAnimationFrame(animate);
        const delta = (currentTime - lastTime) / 1000;
        lastTime = currentTime;
        uniforms.uTime.value += delta;
        const lerpSpeed = 0.08;
        mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * lerpSpeed;
        mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * lerpSpeed;
        uniforms.uMouse.value.x = mouseRef.current.x;
        uniforms.uMouse.value.y = mouseRef.current.y;
        renderer.render(scene, camera);
      };

      animationId = requestAnimationFrame(animate);

      return () => {
        cancelAnimationFrame(animationId);
      };
    }

    // Check for WebGL support
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
      console.warn('WebGL not supported, skipping FluidBackground');
      return;
    }

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
        failIfMajorPerformanceCaveat: false
      });
    } catch (error) {
      console.warn('Failed to create WebGL renderer:', error);
      return;
    }

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

      // Simplex noise
      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

      float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                           -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy));
        vec2 x0 = v - i + dot(i, C.xx);
        vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod289(i);
        vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
        m = m*m*m*m;
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
        for(int i = 0; i < 5; i++) {
          value += amplitude * snoise(p);
          p *= 2.0;
          amplitude *= 0.5;
        }
        return value;
      }

      void main() {
        vec2 uv = vUv;
        float time = uTime;

        // Mouse position creates a displacement/attraction effect
        vec2 mouse = uMouse;
        vec2 toMouse = mouse - uv;
        float distToMouse = length(toMouse);
        float mouseStrength = smoothstep(0.5, 0.0, distToMouse);

        // Displace UV based on mouse - fog follows mouse
        vec2 displaced = uv + toMouse * mouseStrength * 0.3;

        // Animated base coordinates
        float t1 = time * 0.4;
        float t2 = time * 0.3;

        // Layer 1: Teal/Cyan (dominant on right, follows mouse)
        vec2 p1 = displaced * 1.5 + vec2(t1 * 0.5, t2 * 0.3);
        float n1 = fbm(p1) * 0.5 + 0.5;
        n1 *= smoothstep(-0.2, 0.8, uv.x);
        n1 += mouseStrength * 0.5;
        vec3 teal = vec3(0.0, 0.85, 0.75) * n1;

        // Layer 2: Orange/Gold (center-left, follows mouse)
        vec2 p2 = displaced * 1.3 + vec2(-t1 * 0.4, t2 * 0.5);
        float n2 = fbm(p2 + 5.0) * 0.5 + 0.5;
        n2 *= smoothstep(0.9, 0.1, uv.x) * smoothstep(-0.1, 0.6, uv.y);
        n2 += mouseStrength * 0.4;
        vec3 orange = vec3(1.0, 0.45, 0.0) * n2;

        // Layer 3: Purple/Magenta (scattered)
        vec2 p3 = displaced * 1.8 + vec2(t1 * 0.2, -t2 * 0.4);
        float n3 = fbm(p3 + 10.0) * 0.5 + 0.5;
        n3 *= smoothstep(1.0, 0.3, abs(uv.x - 0.5) * 2.0);
        n3 += mouseStrength * 0.35;
        vec3 purple = vec3(0.6, 0.1, 0.8) * n3;

        // Layer 4: Green accent (bottom area)
        vec2 p4 = displaced * 1.4 + vec2(t1 * 0.35, t2 * 0.25);
        float n4 = fbm(p4 + 15.0) * 0.5 + 0.5;
        n4 *= smoothstep(0.8, 0.2, uv.y);
        n4 += mouseStrength * 0.3;
        vec3 green = vec3(0.1, 0.7, 0.2) * n4;

        // Dark background
        vec3 bg = vec3(0.01, 0.02, 0.03);

        // Combine with intensity control
        vec3 color = bg;
        color += teal * 0.55;
        color += orange * 0.45;
        color += purple * 0.35;
        color += green * 0.25;

        // Mouse glow effect - bright spot follows mouse
        float glow = smoothstep(0.4, 0.0, distToMouse);
        color += vec3(0.1, 0.3, 0.3) * glow;

        // Vignette
        float vig = 1.0 - smoothstep(0.3, 1.2, length((uv - 0.5) * 1.3));
        color *= vig * 0.7 + 0.3;

        // Tonemap
        color = color / (color + 1.0);
        color = pow(color, vec3(0.95));

        gl_FragColor = vec4(color, 1.0);
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

    // Store refs for potential reuse
    sceneRef.current = { renderer, scene, camera, uniforms, geometry, material, mesh };

    // Mouse movement - update target position
    const handleMouseMove = (e) => {
      mouseRef.current.targetX = e.clientX / window.innerWidth;
      mouseRef.current.targetY = 1.0 - e.clientY / window.innerHeight;
    };

    // Touch handler
    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        mouseRef.current.targetX = e.touches[0].clientX / window.innerWidth;
        mouseRef.current.targetY = 1.0 - e.touches[0].clientY / window.innerHeight;
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
    let lastTime = performance.now();

    const animate = (currentTime) => {
      animationId = requestAnimationFrame(animate);

      const delta = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      // Update time
      uniforms.uTime.value += delta;

      // Smooth mouse interpolation (lerp)
      const lerpSpeed = 0.08;
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * lerpSpeed;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * lerpSpeed;

      uniforms.uMouse.value.x = mouseRef.current.x;
      uniforms.uMouse.value.y = mouseRef.current.y;

      renderer.render(scene, camera);
    };

    animationId = requestAnimationFrame(animate);

    // Cleanup - use deferred disposal to handle StrictMode
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', handleResize);

      // Deferred cleanup - only dispose if component truly unmounts
      // In StrictMode, the effect will re-run immediately and reuse the scene
      const currentScene = sceneRef.current;
      const timeoutId = setTimeout(() => {
        // If sceneRef still points to this scene after timeout, truly dispose
        if (sceneRef.current === currentScene) {
          if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
            containerRef.current.removeChild(renderer.domElement);
          }
          geometry.dispose();
          material.dispose();
          renderer.dispose();
          sceneRef.current = null;
        }
      }, 100);

      // Store timeout to clear if component remounts
      sceneRef.current.cleanupTimeout = timeoutId;
    };
  }, []);

  // Clear any pending cleanup timeout when effect runs
  useEffect(() => {
    if (sceneRef.current?.cleanupTimeout) {
      clearTimeout(sceneRef.current.cleanupTimeout);
      sceneRef.current.cleanupTimeout = null;
    }
  });

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
        pointerEvents: 'auto',
      }}
    />
  );
};

export default FluidBackground;

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const FluidBackground = () => {
  const containerRef = useRef(null);
  const mouseRef = useRef({
    x: 0.5,
    y: 0.5,
    targetX: 0.5,
    targetY: 0.5,
    velocityX: 0,
    velocityY: 0,
    speed: 0,
    lastX: 0.5,
    lastY: 0.5,
    lastTime: performance.now()
  });
  const sceneRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // If we already have a scene setup, just restart the animation
    if (sceneRef.current) {
      const { renderer, scene, camera, uniforms } = sceneRef.current;

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

        // Position interpolation
        const lerpSpeed = 0.06;
        const prevX = mouseRef.current.x;
        const prevY = mouseRef.current.y;
        mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * lerpSpeed;
        mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * lerpSpeed;

        // Calculate velocity
        const vx = mouseRef.current.x - prevX;
        const vy = mouseRef.current.y - prevY;
        mouseRef.current.velocityX = mouseRef.current.velocityX * 0.9 + vx * 0.1;
        mouseRef.current.velocityY = mouseRef.current.velocityY * 0.9 + vy * 0.1;
        mouseRef.current.speed = Math.sqrt(vx * vx + vy * vy) * 100;

        // Update uniforms
        uniforms.uMouse.value.x = mouseRef.current.x;
        uniforms.uMouse.value.y = mouseRef.current.y;
        uniforms.uVelocity.value.x = mouseRef.current.velocityX * 50;
        uniforms.uVelocity.value.y = mouseRef.current.velocityY * 50;
        uniforms.uSpeed.value = uniforms.uSpeed.value * 0.95 + mouseRef.current.speed * 0.05;

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

    // Shader material for Liquid Glass effect
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
      uniform vec2 uVelocity;
      uniform float uSpeed;
      uniform vec2 uResolution;
      varying vec2 vUv;

      // Simplex noise functions
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

      // Fractional Brownian Motion for organic movement
      float fbm(vec2 p) {
        float value = 0.0;
        float amplitude = 0.5;
        for(int i = 0; i < 6; i++) {
          value += amplitude * snoise(p);
          p *= 2.0;
          amplitude *= 0.5;
        }
        return value;
      }

      // Glass-like refraction distortion
      vec2 glassDistort(vec2 uv, vec2 mouse, float speed) {
        vec2 toMouse = uv - mouse;
        float dist = length(toMouse);

        // Liquid ripple effect based on speed
        float ripple = sin(dist * 15.0 - uTime * 3.0) * 0.02;
        ripple *= smoothstep(0.8, 0.0, dist);
        ripple *= (1.0 + speed * 2.0);

        // Glass refraction - bends light around mouse position
        float refract = smoothstep(0.6, 0.0, dist) * 0.15;
        refract *= (1.0 + speed * 1.5);

        vec2 distortion = normalize(toMouse + 0.001) * (ripple + refract);
        distortion += uVelocity * smoothstep(0.5, 0.0, dist) * 0.3;

        return uv + distortion;
      }

      void main() {
        vec2 uv = vUv;
        float time = uTime;

        // Apply glass distortion based on mouse position and speed
        vec2 distortedUV = glassDistort(uv, uMouse, uSpeed);

        // Mouse interaction
        vec2 toMouse = uMouse - uv;
        float distToMouse = length(toMouse);
        float mouseInfluence = smoothstep(0.7, 0.0, distToMouse);
        float speedInfluence = min(uSpeed * 2.0, 1.0);

        // Liquid displacement - follows mouse with velocity trail
        vec2 liquidOffset = toMouse * mouseInfluence * 0.4;
        liquidOffset += uVelocity * mouseInfluence * 0.5;
        vec2 liquidUV = distortedUV + liquidOffset;

        // Time-based animation speeds
        float t1 = time * 0.25;
        float t2 = time * 0.15;
        float t3 = time * 0.1;

        // === LIQUID GLASS COLOR LAYERS ===

        // Layer 1: Bright Green core (center, follows mouse)
        vec2 p1 = liquidUV * 1.2 + vec2(t1 * 0.3, t2 * 0.2);
        float n1 = fbm(p1) * 0.5 + 0.5;
        float greenMask = smoothstep(0.8, 0.2, distToMouse);
        greenMask *= smoothstep(0.0, 0.4, uv.y) * smoothstep(1.0, 0.5, uv.y);
        n1 *= greenMask;
        n1 += mouseInfluence * 0.6 * (1.0 + speedInfluence);
        vec3 brightGreen = vec3(0.2, 0.95, 0.4) * n1;

        // Layer 2: Teal/Cyan (surrounds green, creates glass edge)
        vec2 p2 = liquidUV * 1.4 + vec2(-t1 * 0.25, t2 * 0.35);
        float n2 = fbm(p2 + 3.0) * 0.5 + 0.5;
        float tealMask = smoothstep(0.3, 0.6, distToMouse) * smoothstep(1.0, 0.4, distToMouse);
        tealMask += smoothstep(0.5, 0.8, uv.x) * 0.5;
        n2 *= tealMask;
        n2 += mouseInfluence * 0.3;
        vec3 teal = vec3(0.0, 0.75, 0.7) * n2;

        // Layer 3: Deep Blue (outer edges, ambient glow)
        vec2 p3 = liquidUV * 1.0 + vec2(t1 * 0.15, -t2 * 0.2);
        float n3 = fbm(p3 + 7.0) * 0.5 + 0.5;
        float blueMask = smoothstep(0.2, 0.8, length(uv - vec2(0.5, 0.5)));
        blueMask += smoothstep(0.3, 0.0, uv.y) * 0.6;
        n3 *= blueMask;
        vec3 deepBlue = vec3(0.05, 0.15, 0.35) * n3;

        // Layer 4: Cyan highlights (glass reflections)
        vec2 p4 = liquidUV * 2.0 + vec2(t1 * 0.4, t2 * 0.5);
        float n4 = fbm(p4 + 12.0) * 0.5 + 0.5;
        n4 = pow(n4, 2.0); // Sharper highlights
        float highlightMask = mouseInfluence * (1.0 + speedInfluence * 2.0);
        highlightMask += smoothstep(0.6, 0.3, distToMouse) * 0.3;
        n4 *= highlightMask;
        vec3 cyanHighlight = vec3(0.3, 0.9, 0.85) * n4;

        // Dark background with subtle gradient
        vec3 bg = mix(
          vec3(0.02, 0.03, 0.06),
          vec3(0.01, 0.02, 0.04),
          uv.y
        );

        // Combine all layers
        vec3 color = bg;
        color += deepBlue * 0.8;
        color += teal * 0.6;
        color += brightGreen * 0.7;
        color += cyanHighlight * 0.5;

        // Liquid glass glow at mouse position
        float glowIntensity = smoothstep(0.5, 0.0, distToMouse);
        glowIntensity *= (1.0 + speedInfluence * 1.5);
        vec3 glowColor = mix(
          vec3(0.1, 0.8, 0.5),  // Green glow
          vec3(0.2, 0.9, 0.8),  // Cyan glow when moving fast
          speedInfluence
        );
        color += glowColor * glowIntensity * 0.4;

        // Speed-based light streaks
        float streak = fbm(uv * 3.0 + uVelocity * 5.0 + time * 0.5);
        streak = smoothstep(0.3, 0.8, streak) * speedInfluence * mouseInfluence;
        color += vec3(0.2, 0.7, 0.6) * streak * 0.3;

        // Subtle vignette
        float vig = 1.0 - smoothstep(0.4, 1.3, length((uv - 0.5) * 1.4));
        color *= vig * 0.6 + 0.4;

        // Glass-like specular highlights
        float specular = pow(max(0.0, fbm(liquidUV * 4.0 + time * 0.3)), 4.0);
        specular *= mouseInfluence * 0.5;
        color += vec3(0.4, 0.9, 0.7) * specular;

        // Tone mapping and gamma correction
        color = color / (color + 0.8);
        color = pow(color, vec3(0.9));

        gl_FragColor = vec4(color, 1.0);
      }
    `;

    const uniforms = {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uVelocity: { value: new THREE.Vector2(0, 0) },
      uSpeed: { value: 0 },
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

      // Store previous position for velocity calculation
      const prevX = mouseRef.current.x;
      const prevY = mouseRef.current.y;

      // Smooth mouse interpolation (lerp)
      const lerpSpeed = 0.06;
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * lerpSpeed;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * lerpSpeed;

      // Calculate velocity (change in position)
      const vx = mouseRef.current.x - prevX;
      const vy = mouseRef.current.y - prevY;

      // Smooth velocity with momentum
      mouseRef.current.velocityX = mouseRef.current.velocityX * 0.9 + vx * 0.1;
      mouseRef.current.velocityY = mouseRef.current.velocityY * 0.9 + vy * 0.1;

      // Calculate speed magnitude
      mouseRef.current.speed = Math.sqrt(vx * vx + vy * vy) * 100;

      // Update shader uniforms
      uniforms.uMouse.value.x = mouseRef.current.x;
      uniforms.uMouse.value.y = mouseRef.current.y;
      uniforms.uVelocity.value.x = mouseRef.current.velocityX * 50;
      uniforms.uVelocity.value.y = mouseRef.current.velocityY * 50;
      uniforms.uSpeed.value = uniforms.uSpeed.value * 0.95 + mouseRef.current.speed * 0.05;

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

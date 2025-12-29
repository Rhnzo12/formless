import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const TRAIL_LENGTH = 12; // Number of trail points

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
    // Trail history - array of past positions
    trail: Array(TRAIL_LENGTH).fill().map(() => ({ x: 0.5, y: 0.5 })),
    trailIndex: 0,
    lastTrailUpdate: 0
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
        const lerpSpeed = 0.08;
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

        // Update trail - add new position every few frames
        if (currentTime - mouseRef.current.lastTrailUpdate > 30) {
          mouseRef.current.trail[mouseRef.current.trailIndex] = {
            x: mouseRef.current.x,
            y: mouseRef.current.y
          };
          mouseRef.current.trailIndex = (mouseRef.current.trailIndex + 1) % TRAIL_LENGTH;
          mouseRef.current.lastTrailUpdate = currentTime;
        }

        // Update uniforms
        uniforms.uMouse.value.x = mouseRef.current.x;
        uniforms.uMouse.value.y = mouseRef.current.y;
        uniforms.uVelocity.value.x = mouseRef.current.velocityX * 50;
        uniforms.uVelocity.value.y = mouseRef.current.velocityY * 50;
        uniforms.uSpeed.value = uniforms.uSpeed.value * 0.95 + mouseRef.current.speed * 0.05;

        // Update trail uniforms
        for (let i = 0; i < TRAIL_LENGTH; i++) {
          const trailIdx = (mouseRef.current.trailIndex - 1 - i + TRAIL_LENGTH) % TRAIL_LENGTH;
          uniforms.uTrail.value[i].x = mouseRef.current.trail[trailIdx].x;
          uniforms.uTrail.value[i].y = mouseRef.current.trail[trailIdx].y;
        }

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

    // Shader material for Formless-style effect with trail
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
      uniform vec2 uTrail[${TRAIL_LENGTH}];
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

      vec2 fluidDistort(vec2 uv, float time) {
        vec2 distortion;
        distortion.x = fbm(uv * 2.0 + vec2(time * 0.1, 0.0)) * 0.06;
        distortion.y = fbm(uv * 2.0 + vec2(0.0, time * 0.12)) * 0.06;
        return uv + distortion;
      }

      // Get color based on distance from center (for gradient effect)
      vec3 getGlowColor(float normalizedDist) {
        vec3 yellow = vec3(1.0, 1.0, 0.2);
        vec3 lime = vec3(0.7, 1.0, 0.2);
        vec3 green = vec3(0.2, 0.9, 0.4);
        vec3 cyan = vec3(0.1, 0.8, 0.8);
        vec3 blue = vec3(0.2, 0.4, 0.9);
        vec3 purple = vec3(0.5, 0.2, 0.8);
        vec3 magenta = vec3(0.8, 0.2, 0.6);

        if (normalizedDist < 0.15) {
          return mix(yellow, lime, normalizedDist / 0.15);
        } else if (normalizedDist < 0.3) {
          return mix(lime, green, (normalizedDist - 0.15) / 0.15);
        } else if (normalizedDist < 0.5) {
          return mix(green, cyan, (normalizedDist - 0.3) / 0.2);
        } else if (normalizedDist < 0.7) {
          return mix(cyan, blue, (normalizedDist - 0.5) / 0.2);
        } else if (normalizedDist < 0.85) {
          return mix(blue, purple, (normalizedDist - 0.7) / 0.15);
        } else {
          return mix(purple, magenta, (normalizedDist - 0.85) / 0.15);
        }
      }

      void main() {
        vec2 uv = vUv;
        float time = uTime * 0.5;

        // Aspect ratio correction
        float aspect = uResolution.x / uResolution.y;
        vec2 uvAspect = vec2(uv.x * aspect, uv.y);

        // Apply fluid distortion
        vec2 fluidUV = fluidDistort(uv, time);

        // Background colors
        vec3 darkTeal = vec3(0.02, 0.10, 0.12);
        vec3 deepBlue = vec3(0.01, 0.03, 0.06);
        vec3 teal = vec3(0.0, 0.4, 0.45);
        vec3 green = vec3(0.15, 0.7, 0.4);

        // Dark gradient background
        vec3 color = mix(deepBlue, darkTeal, pow(uv.y, 0.5));

        // Subtle aurora in background
        vec2 p1 = fluidUV * 1.5 + vec2(time * 0.05, time * 0.03);
        vec2 p2 = fluidUV * 2.0 + vec2(-time * 0.04, time * 0.05);
        float aurora1 = fbm(p1) * 0.5 + 0.5;
        float aurora2 = fbm(p2 + 5.0) * 0.5 + 0.5;

        float auroraMask = smoothstep(0.0, 0.4, uv.y) * smoothstep(1.0, 0.5, uv.y);
        aurora1 *= auroraMask * smoothstep(0.45, 0.7, aurora1);
        aurora2 *= smoothstep(0.35, 0.6, aurora2) * auroraMask;

        color = mix(color, teal * 0.4, aurora2 * 0.5);
        color = mix(color, green * 0.3, aurora1 * 0.4);

        // === TRAIL RENDERING ===
        // Render glows for each trail point (oldest to newest)
        for (int i = ${TRAIL_LENGTH - 1}; i >= 0; i--) {
          vec2 trailPos = uTrail[i];
          vec2 trailAspect = vec2(trailPos.x * aspect, trailPos.y);
          float distToTrail = length(uvAspect - trailAspect);

          // Trail intensity decreases for older points
          float age = float(i) / float(${TRAIL_LENGTH - 1});
          float trailIntensity = 1.0 - age * 0.7; // Older = dimmer
          float trailSize = 0.5 - age * 0.2; // Older = smaller

          float normalizedDist = distToTrail / trailSize;
          float glowFalloff = exp(-normalizedDist * normalizedDist * 2.5);

          // Get color based on position in trail
          vec3 trailColor = getGlowColor(age);

          // Apply trail glow
          color = mix(color, trailColor, glowFalloff * trailIntensity * 0.6);
        }

        // === MAIN MOUSE GLOW (brightest, on top) ===
        vec2 mouseAspect = vec2(uMouse.x * aspect, uMouse.y);
        float distToMouse = length(uvAspect - mouseAspect);
        float glowRadius = 0.5;
        float normalizedDist = distToMouse / glowRadius;

        float glowFalloff = exp(-normalizedDist * normalizedDist * 2.0);

        // Main glow color - bright yellow/lime center
        vec3 yellow = vec3(1.0, 1.0, 0.2);
        vec3 lime = vec3(0.6, 1.0, 0.3);
        vec3 mouseColor = mix(yellow, lime, smoothstep(0.0, 0.4, normalizedDist));

        color = mix(color, mouseColor, glowFalloff * 0.9);

        // Bright center highlight
        float centerGlow = exp(-normalizedDist * normalizedDist * 10.0);
        color += yellow * centerGlow * 0.5;

        // Soft vignette
        float vignette = 1.0 - smoothstep(0.3, 1.5, length((uv - 0.5) * 1.6));
        color *= vignette * 0.4 + 0.6;

        // Tone mapping
        color = color / (color + 0.85);
        color = pow(color, vec3(0.95));

        gl_FragColor = vec4(color, 1.0);
      }
    `;

    // Initialize trail uniform array
    const trailArray = [];
    for (let i = 0; i < TRAIL_LENGTH; i++) {
      trailArray.push(new THREE.Vector2(0.5, 0.5));
    }

    const uniforms = {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uVelocity: { value: new THREE.Vector2(0, 0) },
      uSpeed: { value: 0 },
      uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      uTrail: { value: trailArray }
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
      const lerpSpeed = 0.08;
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

      // Update trail - add new position every ~30ms
      if (currentTime - mouseRef.current.lastTrailUpdate > 30) {
        mouseRef.current.trail[mouseRef.current.trailIndex] = {
          x: mouseRef.current.x,
          y: mouseRef.current.y
        };
        mouseRef.current.trailIndex = (mouseRef.current.trailIndex + 1) % TRAIL_LENGTH;
        mouseRef.current.lastTrailUpdate = currentTime;
      }

      // Update shader uniforms
      uniforms.uMouse.value.x = mouseRef.current.x;
      uniforms.uMouse.value.y = mouseRef.current.y;
      uniforms.uVelocity.value.x = mouseRef.current.velocityX * 50;
      uniforms.uVelocity.value.y = mouseRef.current.velocityY * 50;
      uniforms.uSpeed.value = uniforms.uSpeed.value * 0.95 + mouseRef.current.speed * 0.05;

      // Update trail uniforms (ordered from newest to oldest)
      for (let i = 0; i < TRAIL_LENGTH; i++) {
        const trailIdx = (mouseRef.current.trailIndex - 1 - i + TRAIL_LENGTH) % TRAIL_LENGTH;
        uniforms.uTrail.value[i].x = mouseRef.current.trail[trailIdx].x;
        uniforms.uTrail.value[i].y = mouseRef.current.trail[trailIdx].y;
      }

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
      const currentScene = sceneRef.current;
      const timeoutId = setTimeout(() => {
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

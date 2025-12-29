import { useEffect, useRef } from 'react';

const FluidBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

    if (!gl) {
      console.error('WebGL not supported');
      return;
    }

    // Resize canvas
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener('resize', resize);

    // Vertex shader
    const vertexShaderSource = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    // Fragment shader - vapor-like fluid with spectrum colors and depth
    const fragmentShaderSource = `
      precision highp float;

      uniform vec2 u_resolution;
      uniform float u_time;
      uniform vec2 u_mouse;
      uniform float u_velocity;

      // HSL to RGB conversion for spectrum colors
      vec3 hsl2rgb(float h, float s, float l) {
        vec3 rgb = clamp(abs(mod(h * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
        return l + s * (rgb - 0.5) * (1.0 - abs(2.0 * l - 1.0));
      }

      // Simplex noise functions for organic flow
      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

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
        vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
        vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
        m = m * m;
        m = m * m;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
        vec3 g;
        g.x = a0.x * x0.x + h.x * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }

      // Fractal brownian motion for layered noise
      float fbm(vec2 p, float time) {
        float value = 0.0;
        float amplitude = 0.5;
        float frequency = 1.0;
        for (int i = 0; i < 5; i++) {
          value += amplitude * snoise(p * frequency + time * 0.1);
          amplitude *= 0.5;
          frequency *= 2.0;
        }
        return value;
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        float aspect = u_resolution.x / u_resolution.y;

        // Aspect ratio correction
        vec2 p = uv;
        p.x *= aspect;

        // Mouse position normalized with aspect
        vec2 mouse = u_mouse / u_resolution.xy;
        mouse.x *= aspect;

        // Time for animation
        float t = u_time * 0.15;

        // Velocity-based intensity (0.0 to 1.0, smoothed)
        float velocityIntensity = smoothstep(0.0, 1.0, u_velocity * 0.5);

        // Base turbulence that increases with mouse movement
        float baseTurbulence = 0.3 + velocityIntensity * 0.7;

        // === LAYER 1: Deep background (slow, large forms) ===
        vec2 p1 = p * 0.8;
        float noise1 = fbm(p1 + vec2(t * 0.2, t * 0.15), t * 0.5);
        float depth1Hue = fract(t * 0.02 + noise1 * 0.3);
        vec3 depth1Color = hsl2rgb(depth1Hue, 0.7, 0.15);
        float depth1Intensity = smoothstep(-0.5, 0.8, noise1) * 0.4;

        // === LAYER 2: Mid-ground vapor (medium speed) ===
        vec2 p2 = p * 1.5;
        float distToMouse2 = length(p - mouse);
        float mouseInfluence2 = smoothstep(1.5, 0.0, distToMouse2);

        // Flowing movement influenced by mouse
        vec2 flow2 = vec2(
          snoise(p2 + t * 0.3) * baseTurbulence,
          snoise(p2 + vec2(100.0) + t * 0.25) * baseTurbulence
        );
        p2 += flow2 * (0.2 + mouseInfluence2 * 0.3);

        float noise2 = fbm(p2, t * 0.8);
        float vapor2 = smoothstep(-0.3, 0.6, noise2);

        // Spectrum color that shifts with time and position
        float hue2 = fract(t * 0.05 + uv.x * 0.2 + noise2 * 0.4 + velocityIntensity * 0.2);
        vec3 vapor2Color = hsl2rgb(hue2, 0.8 + velocityIntensity * 0.2, 0.45 + velocityIntensity * 0.15);
        float vapor2Intensity = vapor2 * (0.35 + mouseInfluence2 * 0.25);

        // === LAYER 3: Foreground wisps (fast, reactive) ===
        vec2 p3 = p * 2.5;
        float distToMouse3 = length(p - mouse);
        float mouseInfluence3 = smoothstep(0.8, 0.0, distToMouse3);

        // Strong mouse-reactive flow
        vec2 flow3 = vec2(
          snoise(p3 + t * 0.6 + mouse * 2.0) * baseTurbulence * 1.5,
          snoise(p3 + vec2(50.0) + t * 0.5 + mouse * 2.0) * baseTurbulence * 1.5
        );
        p3 += flow3 * (0.15 + mouseInfluence3 * 0.4 + velocityIntensity * 0.3);

        float noise3 = fbm(p3, t * 1.2);
        float wisps = smoothstep(0.0, 0.7, noise3);

        // Faster hue cycling for foreground
        float hue3 = fract(t * 0.08 + uv.y * 0.3 + noise3 * 0.5 - velocityIntensity * 0.3);
        vec3 wispsColor = hsl2rgb(hue3, 0.9, 0.55 + velocityIntensity * 0.2);
        float wispsIntensity = wisps * (0.2 + mouseInfluence3 * 0.5 + velocityIntensity * 0.3);

        // === LAYER 4: Bright reactive particles near cursor ===
        float particleNoise = snoise(p * 8.0 + t * 2.0 + mouse * 5.0);
        float particles = smoothstep(0.6, 0.9, particleNoise);
        float particleGlow = particles * mouseInfluence3 * (0.3 + velocityIntensity * 0.7);
        float hue4 = fract(t * 0.12 + particleNoise * 0.8);
        vec3 particleColor = hsl2rgb(hue4, 1.0, 0.7);

        // === Combine all layers with depth blending ===
        vec3 finalColor = vec3(0.02, 0.02, 0.04); // Dark base

        // Layer compositing (back to front)
        finalColor = mix(finalColor, depth1Color, depth1Intensity);
        finalColor = mix(finalColor, vapor2Color, vapor2Intensity);
        finalColor = mix(finalColor, wispsColor, wispsIntensity);
        finalColor += particleColor * particleGlow;

        // === Global effects ===

        // Subtle pulsing glow
        float pulse = sin(t * 2.0) * 0.5 + 0.5;
        float globalGlow = (depth1Intensity + vapor2Intensity + wispsIntensity) * 0.1;
        finalColor += finalColor * globalGlow * (0.2 + pulse * 0.1);

        // Vignette for depth
        float vignette = 1.0 - smoothstep(0.3, 1.5, length((uv - 0.5) * 1.8));
        finalColor *= 0.7 + vignette * 0.3;

        // Intensity boost near mouse
        float mouseGlow = smoothstep(1.0, 0.0, distToMouse2) * (0.1 + velocityIntensity * 0.2);
        finalColor += finalColor * mouseGlow;

        // Calculate alpha based on content
        float alpha = smoothstep(0.0, 0.15, depth1Intensity + vapor2Intensity + wispsIntensity);
        alpha = max(alpha, 0.85);

        gl_FragColor = vec4(finalColor, alpha);
      }
    `;

    // Compile shader
    const compileShader = (source, type) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compile error:', gl.getShaderInfoLog(shader));
        return null;
      }
      return shader;
    };

    const vertexShader = compileShader(vertexShaderSource, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER);

    // Create program
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    // Set up geometry (full-screen quad)
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1, 1, -1, -1, 1,
      -1, 1, 1, -1, 1, 1
    ]), gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Get uniform locations
    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
    const timeLocation = gl.getUniformLocation(program, 'u_time');
    const mouseLocation = gl.getUniformLocation(program, 'u_mouse');
    const velocityLocation = gl.getUniformLocation(program, 'u_velocity');

    // Mouse tracking with smooth interpolation and velocity
    let mouseX = canvas.width * 0.5;
    let mouseY = canvas.height * 0.5;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;
    let prevMouseX = mouseX;
    let prevMouseY = mouseY;
    let velocity = 0;
    let targetVelocity = 0;

    const handleMouseMove = (e) => {
      targetMouseX = e.clientX;
      targetMouseY = canvas.height - e.clientY;

      // Calculate velocity from mouse movement
      const dx = e.clientX - prevMouseX;
      const dy = e.clientY - prevMouseY;
      targetVelocity = Math.min(Math.sqrt(dx * dx + dy * dy) / 50, 2.0);

      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Touch support for mobile
    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        targetMouseX = touch.clientX;
        targetMouseY = canvas.height - touch.clientY;

        const dx = touch.clientX - prevMouseX;
        const dy = touch.clientY - prevMouseY;
        targetVelocity = Math.min(Math.sqrt(dx * dx + dy * dy) / 50, 2.0);

        prevMouseX = touch.clientX;
        prevMouseY = touch.clientY;
      }
    };
    window.addEventListener('touchmove', handleTouchMove);

    // Enable blending
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // Animation loop
    let startTime = Date.now();
    let animationId;

    const render = () => {
      const time = (Date.now() - startTime) / 1000;

      // Smooth mouse interpolation
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      // Smooth velocity decay
      velocity += (targetVelocity - velocity) * 0.1;
      targetVelocity *= 0.95; // Natural decay when not moving

      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform1f(timeLocation, time);
      gl.uniform2f(mouseLocation, mouseX, mouseY);
      gl.uniform1f(velocityLocation, velocity);

      gl.clearColor(0.02, 0.02, 0.04, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animationId = requestAnimationFrame(render);
    };
    render();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      cancelAnimationFrame(animationId);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteBuffer(positionBuffer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
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

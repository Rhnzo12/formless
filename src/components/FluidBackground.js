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

    // Fragment shader - smooth vibrant blobs following mouse
    const fragmentShaderSource = `
      precision highp float;

      uniform vec2 u_resolution;
      uniform float u_time;
      uniform vec2 u_mouse;
      uniform float u_velocity;

      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        float aspect = u_resolution.x / u_resolution.y;

        // Aspect ratio correction
        vec2 p = uv;
        p.x *= aspect;

        // Mouse position normalized with aspect
        vec2 mouse = u_mouse / u_resolution.xy;
        mouse.x *= aspect;

        // Time for gentle animation
        float t = u_time * 0.15;

        // Velocity influence for reactivity
        float vel = u_velocity * 0.3;

        // === Create multiple blob centers that orbit around mouse ===

        // Blob 1 - Yellow/Green (orbits close to mouse)
        vec2 blob1 = vec2(
          mouse.x + sin(t * 0.7) * 0.15 + cos(t * 0.5) * 0.1,
          mouse.y + cos(t * 0.6) * 0.15 + sin(t * 0.4) * 0.1
        );

        // Blob 2 - Cyan/Teal (orbits opposite side)
        vec2 blob2 = vec2(
          mouse.x + sin(t * 0.5 + 2.0) * 0.25 + cos(t * 0.3) * 0.15,
          mouse.y + cos(t * 0.4 + 2.0) * 0.2 + sin(t * 0.35) * 0.1
        );

        // Blob 3 - Magenta/Pink (larger orbit)
        vec2 blob3 = vec2(
          mouse.x + sin(t * 0.4 + 4.0) * 0.3 - 0.1,
          mouse.y + cos(t * 0.35 + 4.0) * 0.25 + 0.15
        );

        // Blob 4 - Blue/Purple (trails behind)
        vec2 blob4 = vec2(
          mouse.x + sin(t * 0.3 + 1.0) * 0.2 - 0.2,
          mouse.y + cos(t * 0.25 + 1.0) * 0.3 - 0.1
        );

        // Blob 5 - Orange/Yellow accent
        vec2 blob5 = vec2(
          mouse.x + cos(t * 0.6 + 3.0) * 0.18,
          mouse.y + sin(t * 0.5 + 3.0) * 0.22 - 0.15
        );

        // === Calculate smooth metaball-like distances ===
        float d1 = length(p - blob1);
        float d2 = length(p - blob2);
        float d3 = length(p - blob3);
        float d4 = length(p - blob4);
        float d5 = length(p - blob5);

        // Soft falloff for each blob (larger = bigger blob)
        float size1 = 0.45 + vel * 0.1;
        float size2 = 0.5 + vel * 0.08;
        float size3 = 0.55 + vel * 0.12;
        float size4 = 0.6 + vel * 0.1;
        float size5 = 0.35 + vel * 0.1;

        // Smooth gradient falloff (metaball style)
        float b1 = smoothstep(size1, 0.0, d1);
        float b2 = smoothstep(size2, 0.0, d2);
        float b3 = smoothstep(size3, 0.0, d3);
        float b4 = smoothstep(size4, 0.0, d4);
        float b5 = smoothstep(size5, 0.0, d5);

        // === Vibrant spectrum colors (matching the reference) ===

        // Bright yellow-green
        vec3 color1 = vec3(0.95, 1.0, 0.2);

        // Cyan/Teal
        vec3 color2 = vec3(0.0, 0.95, 0.9);

        // Magenta/Pink
        vec3 color3 = vec3(0.9, 0.2, 0.8);

        // Deep blue/purple
        vec3 color4 = vec3(0.3, 0.2, 0.9);

        // Orange/warm yellow
        vec3 color5 = vec3(1.0, 0.7, 0.1);

        // === Color shifting over time for spectrum effect ===
        float hueShift = t * 0.1;

        // Rotate colors through spectrum
        vec3 c1 = mix(color1, color5, sin(hueShift) * 0.5 + 0.5);
        vec3 c2 = mix(color2, color1, sin(hueShift + 1.0) * 0.5 + 0.5);
        vec3 c3 = mix(color3, color2, sin(hueShift + 2.0) * 0.5 + 0.5);
        vec3 c4 = mix(color4, color3, sin(hueShift + 3.0) * 0.5 + 0.5);
        vec3 c5 = mix(color5, color4, sin(hueShift + 4.0) * 0.5 + 0.5);

        // === Blend all blobs together ===
        vec3 finalColor = vec3(0.0);

        // Additive-style blending for vibrant colors
        finalColor += c1 * b1 * 0.9;
        finalColor += c2 * b2 * 0.85;
        finalColor += c3 * b3 * 0.8;
        finalColor += c4 * b4 * 0.75;
        finalColor += c5 * b5 * 0.7;

        // Where blobs overlap, create interesting color mixing
        float overlap12 = b1 * b2;
        float overlap23 = b2 * b3;
        float overlap34 = b3 * b4;
        float overlap15 = b1 * b5;

        finalColor += vec3(0.5, 1.0, 0.5) * overlap12 * 0.4;
        finalColor += vec3(0.3, 0.7, 1.0) * overlap23 * 0.4;
        finalColor += vec3(0.6, 0.2, 1.0) * overlap34 * 0.4;
        finalColor += vec3(1.0, 0.9, 0.3) * overlap15 * 0.4;

        // === Glow effect near mouse ===
        float mouseDist = length(p - mouse);
        float mouseGlow = smoothstep(0.8, 0.0, mouseDist) * (0.15 + vel * 0.3);
        finalColor += finalColor * mouseGlow;

        // === Subtle vignette ===
        float vignette = 1.0 - smoothstep(0.4, 1.5, length((uv - 0.5) * 1.6));
        finalColor *= 0.85 + vignette * 0.15;

        // Clamp to prevent over-saturation while keeping vibrancy
        finalColor = clamp(finalColor, 0.0, 1.0);

        // Calculate alpha - fully visible where there's color
        float totalIntensity = b1 + b2 + b3 + b4 + b5;
        float alpha = smoothstep(0.0, 0.3, totalIntensity);
        alpha = max(alpha, 0.0);

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
      targetVelocity = Math.min(Math.sqrt(dx * dx + dy * dy) / 30, 2.0);

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
        targetVelocity = Math.min(Math.sqrt(dx * dx + dy * dy) / 30, 2.0);

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

      // Smooth mouse interpolation (faster response)
      mouseX += (targetMouseX - mouseX) * 0.08;
      mouseY += (targetMouseY - mouseY) * 0.08;

      // Smooth velocity decay
      velocity += (targetVelocity - velocity) * 0.15;
      targetVelocity *= 0.92; // Natural decay when not moving

      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform1f(timeLocation, time);
      gl.uniform2f(mouseLocation, mouseX, mouseY);
      gl.uniform1f(velocityLocation, velocity);

      gl.clearColor(0.0, 0.0, 0.0, 1.0);
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

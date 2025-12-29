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

    // Fragment shader - Formless-style dark gradient with mouse-following glow
    const fragmentShaderSource = `
      precision highp float;

      uniform vec2 u_resolution;
      uniform float u_time;
      uniform vec2 u_mouse;

      // Simplex noise function
      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

      float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                           -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy));
        vec2 x0 = v -   i + dot(i, C.xx);
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
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        float aspect = u_resolution.x / u_resolution.y;

        // Slow time for subtle animation
        float t = u_time * 0.05;

        // Create base dark gradient
        vec3 darkBase = vec3(0.02, 0.04, 0.06);
        vec3 darkTop = vec3(0.04, 0.06, 0.08);
        vec3 baseColor = mix(darkBase, darkTop, uv.y * 0.5);

        // Mouse position (normalized)
        vec2 mouse = u_mouse / u_resolution.xy;

        // Aspect-corrected coordinates
        vec2 uvAspect = uv;
        uvAspect.x *= aspect;
        vec2 mouseAspect = mouse;
        mouseAspect.x *= aspect;

        // Create flowing noise layers
        float noise1 = snoise(vec2(uv.x * 1.5 + t * 0.3, uv.y * 1.5 + t * 0.2)) * 0.5 + 0.5;
        float noise2 = snoise(vec2(uv.x * 2.0 - t * 0.2, uv.y * 2.0 + t * 0.15)) * 0.5 + 0.5;
        float noise3 = snoise(vec2(uv.x * 0.8 + t * 0.1, uv.y * 1.2 - t * 0.1)) * 0.5 + 0.5;

        // Glow colors
        vec3 tealGlow = vec3(0.0, 0.4, 0.4);
        vec3 greenGlow = vec3(0.1, 0.35, 0.15);
        vec3 blueGlow = vec3(0.05, 0.15, 0.3);

        // Main glow follows mouse
        vec2 glow1Center = mouseAspect;

        // Secondary glows orbit around mouse
        vec2 glow2Center = mouseAspect + vec2(sin(t * 0.5) * 0.3, cos(t * 0.4) * 0.25);
        vec2 glow3Center = mouseAspect + vec2(cos(t * 0.3) * 0.25, sin(t * 0.35) * 0.3);

        // Calculate distances
        float dist1 = length(uvAspect - glow1Center);
        float dist2 = length(uvAspect - glow2Center);
        float dist3 = length(uvAspect - glow3Center);

        // Create soft radial gradients with noise modulation
        float glow1Intensity = smoothstep(0.7, 0.0, dist1) * noise1 * 0.7;
        float glow2Intensity = smoothstep(0.5, 0.0, dist2) * noise2 * 0.4;
        float glow3Intensity = smoothstep(0.6, 0.0, dist3) * noise3 * 0.35;

        // Combine glows with base
        vec3 finalColor = baseColor;
        finalColor += tealGlow * glow1Intensity;
        finalColor += greenGlow * glow2Intensity;
        finalColor += blueGlow * glow3Intensity;

        // Add subtle noise texture
        float texNoise = snoise(uv * 3.0 + t * 0.1) * 0.015;
        finalColor += texNoise;

        // Subtle vignette
        float vignette = 1.0 - smoothstep(0.3, 1.2, length((uv - 0.5) * 1.5));
        finalColor *= 0.9 + vignette * 0.1;

        // Clamp brightness
        finalColor = clamp(finalColor, 0.0, 0.5);

        gl_FragColor = vec4(finalColor, 1.0);
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

    // Mouse tracking with smooth interpolation
    let mouseX = canvas.width * 0.5;
    let mouseY = canvas.height * 0.5;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;

    const handleMouseMove = (e) => {
      targetMouseX = e.clientX;
      targetMouseY = canvas.height - e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Touch support
    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        targetMouseX = e.touches[0].clientX;
        targetMouseY = canvas.height - e.touches[0].clientY;
      }
    };
    window.addEventListener('touchmove', handleTouchMove);

    // Animation loop
    let startTime = Date.now();
    let animationId;

    const render = () => {
      const time = (Date.now() - startTime) / 1000;

      // Smooth mouse interpolation
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform1f(timeLocation, time);
      gl.uniform2f(mouseLocation, mouseX, mouseY);

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
        zIndex: 0,
      }}
    />
  );
};

export default FluidBackground;

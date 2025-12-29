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

    // Fragment shader - fluid simulation
    const fragmentShaderSource = `
      precision highp float;

      uniform vec2 u_resolution;
      uniform float u_time;
      uniform vec2 u_mouse;
      uniform vec2 u_mouseDelta;

      // Simplex noise functions
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

      float fbm(vec2 p) {
        float value = 0.0;
        float amplitude = 0.5;
        float frequency = 1.0;
        for (int i = 0; i < 6; i++) {
          value += amplitude * snoise(p * frequency);
          amplitude *= 0.5;
          frequency *= 2.0;
        }
        return value;
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        vec2 p = uv * 2.0 - 1.0;
        p.x *= u_resolution.x / u_resolution.y;

        // Mouse influence
        vec2 mouse = u_mouse / u_resolution.xy;
        mouse = mouse * 2.0 - 1.0;
        mouse.x *= u_resolution.x / u_resolution.y;

        float dist = length(p - mouse);
        float mouseInfluence = smoothstep(0.8, 0.0, dist);

        // Time-based flow
        float t = u_time * 0.15;

        // Create fluid-like noise layers
        vec2 q = vec2(0.0);
        q.x = fbm(p + vec2(0.0, 0.0) + t * 0.3);
        q.y = fbm(p + vec2(5.2, 1.3) + t * 0.2);

        vec2 r = vec2(0.0);
        r.x = fbm(p + 4.0 * q + vec2(1.7, 9.2) + t * 0.25 + mouseInfluence * 0.5);
        r.y = fbm(p + 4.0 * q + vec2(8.3, 2.8) + t * 0.35 + mouseInfluence * 0.3);

        float f = fbm(p + 4.0 * r + mouseInfluence * u_mouseDelta.x * 2.0);

        // Color palette - vapor-like spectrum
        vec3 color1 = vec3(0.0, 0.8, 0.9);   // Cyan
        vec3 color2 = vec3(0.9, 0.1, 0.8);   // Magenta
        vec3 color3 = vec3(1.0, 0.9, 0.0);   // Yellow
        vec3 color4 = vec3(0.2, 0.4, 1.0);   // Blue

        // Mix colors based on noise
        vec3 col = mix(color1, color2, clamp((f * f) * 4.0, 0.0, 1.0));
        col = mix(col, color3, clamp(length(q), 0.0, 1.0));
        col = mix(col, color4, clamp(length(r.x), 0.0, 1.0));

        // Add intensity based on mouse proximity
        col += mouseInfluence * 0.3 * vec3(0.5, 0.3, 0.8);

        // Depth and glow
        float intensity = (f + 0.6) * 0.8;
        col *= intensity;

        // Vignette for depth
        float vignette = 1.0 - smoothstep(0.5, 1.5, length(p * 0.5));
        col *= vignette * 0.7 + 0.3;

        // Overall opacity for blending with dark background
        float alpha = smoothstep(0.1, 0.6, intensity) * 0.85;

        gl_FragColor = vec4(col, alpha);
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
    const mouseDeltaLocation = gl.getUniformLocation(program, 'u_mouseDelta');

    // Mouse tracking
    let mouseX = canvas.width / 2;
    let mouseY = canvas.height / 2;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;
    let prevMouseX = mouseX;
    let prevMouseY = mouseY;

    const handleMouseMove = (e) => {
      targetMouseX = e.clientX;
      targetMouseY = canvas.height - e.clientY; // Flip Y for WebGL
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Enable blending
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // Animation loop
    let startTime = Date.now();
    let animationId;

    const render = () => {
      const time = (Date.now() - startTime) / 1000;

      // Smooth mouse interpolation
      mouseX += (targetMouseX - mouseX) * 0.08;
      mouseY += (targetMouseY - mouseY) * 0.08;

      // Calculate mouse delta for fluid disturbance
      const deltaX = mouseX - prevMouseX;
      const deltaY = mouseY - prevMouseY;
      prevMouseX = mouseX;
      prevMouseY = mouseY;

      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform1f(timeLocation, time);
      gl.uniform2f(mouseLocation, mouseX, mouseY);
      gl.uniform2f(mouseDeltaLocation, deltaX * 0.1, deltaY * 0.1);

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animationId = requestAnimationFrame(render);
    };
    render();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
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

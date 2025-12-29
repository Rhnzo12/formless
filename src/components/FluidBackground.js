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

    // Fragment shader - Vapor-like fluid animation
    const fragmentShaderSource = `
      precision highp float;

      uniform vec2 u_resolution;
      uniform float u_time;
      uniform vec2 u_mouse;

      // Simplex 3D noise
      vec4 permute(vec4 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
      vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

      float snoise(vec3 v) {
        const vec2 C = vec2(1.0/6.0, 1.0/3.0);
        const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

        vec3 i  = floor(v + dot(v, C.yyy));
        vec3 x0 = v - i + dot(i, C.xxx);

        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min(g.xyz, l.zxy);
        vec3 i2 = max(g.xyz, l.zxy);

        vec3 x1 = x0 - i1 + C.xxx;
        vec3 x2 = x0 - i2 + C.yyy;
        vec3 x3 = x0 - D.yyy;

        i = mod(i, 289.0);
        vec4 p = permute(permute(permute(
                  i.z + vec4(0.0, i1.z, i2.z, 1.0))
                + i.y + vec4(0.0, i1.y, i2.y, 1.0))
                + i.x + vec4(0.0, i1.x, i2.x, 1.0));

        float n_ = 1.0/7.0;
        vec3 ns = n_ * D.wyz - D.xzx;

        vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_);

        vec4 x = x_ *ns.x + ns.yyyy;
        vec4 y = y_ *ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);

        vec4 b0 = vec4(x.xy, y.xy);
        vec4 b1 = vec4(x.zw, y.zw);

        vec4 s0 = floor(b0)*2.0 + 1.0;
        vec4 s1 = floor(b1)*2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));

        vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
        vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;

        vec3 p0 = vec3(a0.xy, h.x);
        vec3 p1 = vec3(a0.zw, h.y);
        vec3 p2 = vec3(a1.xy, h.z);
        vec3 p3 = vec3(a1.zw, h.w);

        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
        p0 *= norm.x;
        p1 *= norm.y;
        p2 *= norm.z;
        p3 *= norm.w;

        vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
      }

      // Fractal Brownian Motion for vapor effect
      float fbm(vec3 p) {
        float value = 0.0;
        float amplitude = 0.5;
        float frequency = 1.0;
        for (int i = 0; i < 5; i++) {
          value += amplitude * snoise(p * frequency);
          amplitude *= 0.5;
          frequency *= 2.0;
        }
        return value;
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        float aspect = u_resolution.x / u_resolution.y;

        // Time variables
        float t = u_time * 0.08;
        float slowT = u_time * 0.02;

        // Mouse position normalized
        vec2 mouse = u_mouse / u_resolution.xy;

        // Create base dark gradient
        vec3 darkBase = vec3(0.01, 0.02, 0.04);
        vec3 darkMid = vec3(0.02, 0.04, 0.06);
        vec3 baseColor = mix(darkBase, darkMid, uv.y);

        // Vapor/fluid noise layers
        vec3 pos1 = vec3(uv.x * 2.0 * aspect, uv.y * 2.0, t);
        vec3 pos2 = vec3(uv.x * 1.5 * aspect + 100.0, uv.y * 1.5, t * 0.7);
        vec3 pos3 = vec3(uv.x * 3.0 * aspect + 200.0, uv.y * 3.0, t * 0.5);

        // Mouse influence on vapor flow
        float mouseInfluence = 1.0 - smoothstep(0.0, 0.5, length(uv - mouse));
        pos1.xy += mouse * 0.5 * mouseInfluence;
        pos2.xy += mouse * 0.3 * mouseInfluence;

        // Generate vapor layers
        float vapor1 = fbm(pos1) * 0.5 + 0.5;
        float vapor2 = fbm(pos2) * 0.5 + 0.5;
        float vapor3 = fbm(pos3) * 0.5 + 0.5;

        // Vapor colors - teal/cyan dominant with green accents
        vec3 tealVapor = vec3(0.0, 0.25, 0.28);
        vec3 greenVapor = vec3(0.05, 0.22, 0.12);
        vec3 blueVapor = vec3(0.02, 0.12, 0.2);

        // Mouse-reactive glow position
        vec2 glowCenter = mouse;
        float distToMouse = length(uv - glowCenter);
        float mouseGlow = smoothstep(0.6, 0.0, distToMouse);

        // Combine vapor layers with mouse reactivity
        float vaporMask1 = smoothstep(0.3, 0.7, vapor1) * (0.4 + mouseGlow * 0.3);
        float vaporMask2 = smoothstep(0.35, 0.65, vapor2) * 0.35;
        float vaporMask3 = smoothstep(0.4, 0.6, vapor3) * 0.25;

        // Apply vapor colors
        vec3 finalColor = baseColor;
        finalColor = mix(finalColor, finalColor + tealVapor, vaporMask1);
        finalColor = mix(finalColor, finalColor + greenVapor, vaporMask2);
        finalColor = mix(finalColor, finalColor + blueVapor, vaporMask3);

        // Add subtle glow near mouse
        vec3 glowColor = vec3(0.0, 0.3, 0.3);
        finalColor += glowColor * mouseGlow * 0.15 * vapor1;

        // Flowing highlight streaks
        float streak = snoise(vec3(uv.x * 4.0 * aspect + slowT, uv.y * 0.5, slowT * 2.0));
        streak = smoothstep(0.6, 0.9, streak) * 0.08;
        finalColor += vec3(0.0, streak * 0.8, streak);

        // Vignette
        float vignette = 1.0 - smoothstep(0.4, 1.4, length((uv - 0.5) * 1.8));
        finalColor *= 0.85 + vignette * 0.15;

        // Subtle film grain for organic feel
        float grain = snoise(vec3(uv * 500.0, u_time * 10.0)) * 0.015;
        finalColor += grain;

        // Final color adjustments
        finalColor = clamp(finalColor, 0.0, 0.35);

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
    let mouseX = canvas.width * 0.6;
    let mouseY = canvas.height * 0.4;
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
      mouseX += (targetMouseX - mouseX) * 0.03;
      mouseY += (targetMouseY - mouseY) * 0.03;

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

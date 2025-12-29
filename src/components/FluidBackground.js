import { useEffect, useRef } from 'react';

const FluidBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.error('Canvas ref not available');
      return;
    }

    console.log('FluidBackground: Canvas found, dimensions:', window.innerWidth, 'x', window.innerHeight);

    const gl = canvas.getContext('webgl', { antialias: true, alpha: false }) ||
               canvas.getContext('experimental-webgl', { antialias: true, alpha: false });
    if (!gl) {
      console.error('WebGL not supported');
      return;
    }

    console.log('FluidBackground: WebGL context created');

    // Resize
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener('resize', resize);

    // Simple vertex shader
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `);
    gl.compileShader(vertexShader);

    // Fragment shader with fluid-like effect
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, `
      precision mediump float;
      uniform vec2 resolution;
      uniform float time;
      uniform vec2 mouse;

      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
      vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

      float snoise(vec3 v) {
        const vec2 C = vec2(1.0/6.0, 1.0/3.0);
        const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
        vec3 i = floor(v + dot(v, C.yyy));
        vec3 x0 = v - i + dot(i, C.xxx);
        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min(g.xyz, l.zxy);
        vec3 i2 = max(g.xyz, l.zxy);
        vec3 x1 = x0 - i1 + C.xxx;
        vec3 x2 = x0 - i2 + C.yyy;
        vec3 x3 = x0 - D.yyy;
        i = mod289(i);
        vec4 p = permute(permute(permute(
          i.z + vec4(0.0, i1.z, i2.z, 1.0))
          + i.y + vec4(0.0, i1.y, i2.y, 1.0))
          + i.x + vec4(0.0, i1.x, i2.x, 1.0));
        float n_ = 0.142857142857;
        vec3 ns = n_ * D.wyz - D.xzx;
        vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_);
        vec4 x = x_ * ns.x + ns.yyyy;
        vec4 y = y_ * ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);
        vec4 b0 = vec4(x.xy, y.xy);
        vec4 b1 = vec4(x.zw, y.zw);
        vec4 s0 = floor(b0) * 2.0 + 1.0;
        vec4 s1 = floor(b1) * 2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));
        vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
        vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
        vec3 p0 = vec3(a0.xy, h.x);
        vec3 p1 = vec3(a0.zw, h.y);
        vec3 p2 = vec3(a1.xy, h.z);
        vec3 p3 = vec3(a1.zw, h.w);
        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
        p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
        vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / resolution.xy;
        vec2 m = mouse / resolution.xy;
        float t = time * 0.1;

        // Create fluid noise
        float n1 = snoise(vec3(uv * 2.0, t)) * 0.5 + 0.5;
        float n2 = snoise(vec3(uv * 3.0 + 10.0, t * 0.8)) * 0.5 + 0.5;
        float n3 = snoise(vec3(uv * 1.5 + 20.0, t * 1.2)) * 0.5 + 0.5;

        // Mouse glow
        float mouseDist = length(uv - m);
        float glow = smoothstep(0.5, 0.0, mouseDist) * 0.5;

        // Formless colors (teal/cyan on dark) - make more visible
        vec3 color = vec3(0.02, 0.05, 0.1);

        // Add colored noise layers - increased intensity
        color.g += n1 * 0.3;
        color.b += n2 * 0.25;
        color.r += n3 * 0.1;

        // Mouse glow - stronger
        color += vec3(0.0, 0.4, 0.5) * glow;

        gl_FragColor = vec4(color, 1.0);
      }
    `);
    gl.compileShader(fragmentShader);

    // Check for errors
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
      console.error('Vertex shader error:', gl.getShaderInfoLog(vertexShader));
      return;
    }
    console.log('FluidBackground: Vertex shader compiled');

    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
      console.error('Fragment shader error:', gl.getShaderInfoLog(fragmentShader));
      return;
    }
    console.log('FluidBackground: Fragment shader compiled');

    // Create program
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      return;
    }
    console.log('FluidBackground: Program linked');

    gl.useProgram(program);

    // Create quad
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1, 1, -1, -1, 1,
      -1, 1, 1, -1, 1, 1
    ]), gl.STATIC_DRAW);

    const position = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    // Uniforms
    const resolutionLoc = gl.getUniformLocation(program, 'resolution');
    const timeLoc = gl.getUniformLocation(program, 'time');
    const mouseLoc = gl.getUniformLocation(program, 'mouse');

    // Mouse
    let mouseX = canvas.width / 2;
    let mouseY = canvas.height / 2;
    let targetX = mouseX;
    let targetY = mouseY;

    const onMouseMove = (e) => {
      targetX = e.clientX;
      targetY = canvas.height - e.clientY;
    };
    window.addEventListener('mousemove', onMouseMove);

    // Render
    let start = Date.now();
    let animId;
    let frameCount = 0;

    const render = () => {
      const time = (Date.now() - start) / 1000;

      // Log first frame to confirm render is working
      if (frameCount === 0) {
        console.log('FluidBackground: First frame rendering');
      }
      frameCount++;

      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;

      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(resolutionLoc, canvas.width, canvas.height);
      gl.uniform1f(timeLoc, time);
      gl.uniform2f(mouseLoc, mouseX, mouseY);

      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="fluid-canvas"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 1,
        display: 'block',
        pointerEvents: 'none',
      }}
    />
  );
};

export default FluidBackground;

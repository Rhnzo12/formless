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

    // Fragment shader - smooth gradient blobs
    const fragmentShaderSource = `
      precision highp float;

      uniform vec2 u_resolution;
      uniform float u_time;
      uniform vec2 u_mouse;

      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;

        // Aspect ratio correction
        vec2 p = uv;
        p.x *= u_resolution.x / u_resolution.y;

        // Mouse position normalized
        vec2 mouse = u_mouse / u_resolution.xy;
        mouse.x *= u_resolution.x / u_resolution.y;

        // Time for gentle animation
        float t = u_time * 0.1;

        // Create smooth moving blob centers
        vec2 blob1Center = vec2(
          mouse.x + sin(t * 0.5) * 0.1,
          mouse.y + cos(t * 0.4) * 0.1
        );

        vec2 blob2Center = vec2(
          mouse.x + 0.3 + sin(t * 0.3 + 1.0) * 0.15,
          mouse.y - 0.2 + cos(t * 0.35 + 0.5) * 0.12
        );

        vec2 blob3Center = vec2(
          mouse.x - 0.25 + sin(t * 0.4 + 2.0) * 0.1,
          mouse.y + 0.3 + cos(t * 0.45 + 1.5) * 0.15
        );

        // Calculate smooth distances for each blob
        float dist1 = length(p - blob1Center);
        float dist2 = length(p - blob2Center);
        float dist3 = length(p - blob3Center);

        // Create soft, smooth gradients (larger radius, softer falloff)
        float blob1 = smoothstep(0.8, 0.0, dist1);
        float blob2 = smoothstep(0.7, 0.0, dist2);
        float blob3 = smoothstep(0.75, 0.0, dist3);

        // Colors matching the original (green/yellow, cyan/teal, blue)
        vec3 color1 = vec3(0.4, 1.0, 0.3);   // Green/Yellow
        vec3 color2 = vec3(0.0, 0.8, 0.9);   // Cyan/Teal
        vec3 color3 = vec3(0.1, 0.3, 0.8);   // Blue

        // Blend colors smoothly
        vec3 col = vec3(0.0);
        col += color1 * blob1 * 0.7;
        col += color2 * blob2 * 0.5;
        col += color3 * blob3 * 0.6;

        // Add subtle color mixing where blobs overlap
        float overlap = blob1 * blob2 * 0.5;
        col += vec3(0.2, 0.9, 0.7) * overlap;

        // Smooth overall intensity
        float intensity = max(max(blob1, blob2), blob3);

        // Very subtle vignette
        float vignette = 1.0 - smoothstep(0.5, 1.8, length(uv - 0.5) * 1.5);
        col *= vignette * 0.8 + 0.2;

        // Output with smooth alpha
        float alpha = smoothstep(0.0, 0.3, intensity) * 0.85;

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

    // Enable blending
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // Animation loop
    let startTime = Date.now();
    let animationId;

    const render = () => {
      const time = (Date.now() - startTime) / 1000;

      // Smooth mouse interpolation (slower = smoother)
      mouseX += (targetMouseX - mouseX) * 0.03;
      mouseY += (targetMouseY - mouseY) * 0.03;

      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform1f(timeLocation, time);
      gl.uniform2f(mouseLocation, mouseX, mouseY);

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

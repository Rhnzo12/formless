import { useEffect, useRef } from 'react';

const FluidBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let config = {
      SIM_RESOLUTION: 128,
      DYE_RESOLUTION: 1024,
      DENSITY_DISSIPATION: 0.985,
      VELOCITY_DISSIPATION: 0.99,
      PRESSURE: 0.8,
      PRESSURE_ITERATIONS: 20,
      CURL: 6,
      SPLAT_RADIUS: 0.7,
      SPLAT_FORCE: 1500,
      AMBIENT_INTERVAL: 600,
      AMBIENT_SPLAT_RADIUS: 0.9,
      AMBIENT_FORCE: 200,
      IDLE_THRESHOLD: 50,
      MIN_SPLAT_RADIUS: 0.5,
      MAX_SPLAT_RADIUS: 1.2,
      MIN_SPLAT_FORCE: 800,
      MAX_SPLAT_FORCE: 3000,
      SPEED_MULTIPLIER: 20,
    };

    // FORMLESS.XYZ COLOR PALETTE - bright vibrant colors
    const colorPalette = [
      // Cyan/Turquoise (bright)
      { r: 0.0, g: 0.8, b: 0.9 },
      { r: 0.0, g: 0.9, b: 0.8 },
      // Yellow/Lime (bright)
      { r: 0.9, g: 0.95, b: 0.0 },
      { r: 0.8, g: 0.9, b: 0.0 },
      // Purple/Magenta
      { r: 0.6, g: 0.0, b: 0.8 },
      { r: 0.5, g: 0.0, b: 0.7 },
      // Orange
      { r: 0.95, g: 0.5, b: 0.0 },
      // Green
      { r: 0.2, g: 0.9, b: 0.3 },
      // Dark teal (for contrast)
      { r: 0.0, g: 0.3, b: 0.35 },
    ];

    function pointerPrototype() {
      this.id = -1;
      this.texcoordX = 0;
      this.texcoordY = 0;
      this.prevTexcoordX = 0;
      this.prevTexcoordY = 0;
      this.deltaX = 0;
      this.deltaY = 0;
      this.down = false;
      this.moved = false;
      this.color = { r: 0, g: 0, b: 0 };
    }

    let pointers = [new pointerPrototype()];
    let lastMouseMoveTime = Date.now();
    let lastAmbientSplatTime = Date.now();
    let mouseSpeed = 0;
    let lastMouseX = window.innerWidth / 2;
    let lastMouseY = window.innerHeight / 2;
    let prevMouseX = lastMouseX;
    let prevMouseY = lastMouseY;
    let colorIndex = 0;

    const params = { alpha: true, depth: false, stencil: false, antialias: false, preserveDrawingBuffer: false };
    let gl = canvas.getContext('webgl2', params);
    const isWebGL2 = !!gl;
    if (!isWebGL2) gl = canvas.getContext('webgl', params) || canvas.getContext('experimental-webgl', params);
    if (!gl) { console.warn('WebGL not supported'); return; }

    let halfFloat, supportLinearFiltering;
    if (isWebGL2) {
      gl.getExtension('EXT_color_buffer_float');
      supportLinearFiltering = gl.getExtension('OES_texture_float_linear');
    } else {
      halfFloat = gl.getExtension('OES_texture_half_float');
      supportLinearFiltering = gl.getExtension('OES_texture_half_float_linear');
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    const halfFloatTexType = isWebGL2 ? gl.HALF_FLOAT : halfFloat?.HALF_FLOAT_OES;

    function getSupportedFormat(internalFormat, format) {
      if (!supportRenderTextureFormat(internalFormat, format, halfFloatTexType)) {
        if (internalFormat === gl.R16F) return getSupportedFormat(gl.RG16F, gl.RG);
        if (internalFormat === gl.RG16F) return getSupportedFormat(gl.RGBA16F, gl.RGBA);
        return null;
      }
      return { internalFormat, format };
    }

    function supportRenderTextureFormat(internalFormat, format, type) {
      let texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null);
      let fbo = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
      return gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
    }

    let formatRGBA, formatRG, formatR;
    if (isWebGL2) {
      formatRGBA = getSupportedFormat(gl.RGBA16F, gl.RGBA);
      formatRG = getSupportedFormat(gl.RG16F, gl.RG);
      formatR = getSupportedFormat(gl.R16F, gl.RED);
    } else {
      formatRGBA = getSupportedFormat(gl.RGBA, gl.RGBA);
      formatRG = getSupportedFormat(gl.RGBA, gl.RGBA);
      formatR = getSupportedFormat(gl.RGBA, gl.RGBA);
    }

    function compileShader(type, source) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(shader));
      return shader;
    }

    function createProgram(vertexShader, fragmentShader) {
      let program = gl.createProgram();
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) console.error(gl.getProgramInfoLog(program));
      return program;
    }

    function getUniforms(program) {
      let uniforms = {};
      let count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
      for (let i = 0; i < count; i++) {
        let name = gl.getActiveUniform(program, i).name;
        uniforms[name] = gl.getUniformLocation(program, name);
      }
      return uniforms;
    }

    class Program {
      constructor(vertexShader, fragmentShader) {
        this.program = createProgram(vertexShader, fragmentShader);
        this.uniforms = getUniforms(this.program);
      }
      bind() { gl.useProgram(this.program); }
    }

    const baseVS = compileShader(gl.VERTEX_SHADER, `
      precision highp float;
      attribute vec2 aPosition;
      varying vec2 vUv;
      varying vec2 vL, vR, vT, vB;
      uniform vec2 texelSize;
      void main() {
        vUv = aPosition * 0.5 + 0.5;
        vL = vUv - vec2(texelSize.x, 0.0);
        vR = vUv + vec2(texelSize.x, 0.0);
        vT = vUv + vec2(0.0, texelSize.y);
        vB = vUv - vec2(0.0, texelSize.y);
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `);

    const copyFS = compileShader(gl.FRAGMENT_SHADER, `
      precision mediump float;
      varying vec2 vUv;
      uniform sampler2D uTexture;
      void main() { gl_FragColor = texture2D(uTexture, vUv); }
    `);

    const clearFS = compileShader(gl.FRAGMENT_SHADER, `
      precision mediump float;
      varying vec2 vUv;
      uniform sampler2D uTexture;
      uniform float value;
      void main() { gl_FragColor = value * texture2D(uTexture, vUv); }
    `);

    const displayFS = compileShader(gl.FRAGMENT_SHADER, `
      precision highp float;
      varying vec2 vUv, vL, vR, vT, vB;
      uniform sampler2D uTexture;
      uniform vec2 texelSize;
      void main() {
        vec3 c = texture2D(uTexture, vUv).rgb;
        vec3 cL = texture2D(uTexture, vL).rgb;
        vec3 cR = texture2D(uTexture, vR).rgb;
        vec3 cT = texture2D(uTexture, vT).rgb;
        vec3 cB = texture2D(uTexture, vB).rgb;
        vec3 cTL = texture2D(uTexture, vUv + vec2(-texelSize.x, texelSize.y)).rgb;
        vec3 cTR = texture2D(uTexture, vUv + vec2(texelSize.x, texelSize.y)).rgb;
        vec3 cBL = texture2D(uTexture, vUv + vec2(-texelSize.x, -texelSize.y)).rgb;
        vec3 cBR = texture2D(uTexture, vUv + vec2(texelSize.x, -texelSize.y)).rgb;
        c = c * 0.25 + (cL + cR + cT + cB) * 0.125 + (cTL + cTR + cBL + cBR) * 0.0625;
        
        // Clamp to prevent complete white blowout but allow bright colors
        c = min(c, vec3(0.95));
        
        float a = max(c.r, max(c.g, c.b));
        a = smoothstep(0.0, 0.1, a);
        gl_FragColor = vec4(c, a);
      }
    `);

    const splatFS = compileShader(gl.FRAGMENT_SHADER, `
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D uTarget;
      uniform float aspectRatio;
      uniform vec3 color;
      uniform vec2 point;
      uniform float radius;
      void main() {
        vec2 p = vUv - point;
        p.x *= aspectRatio;
        float d = dot(p, p);
        vec3 splat = exp(-d / radius) * color;
        splat *= smoothstep(radius * 5.0, 0.0, d);
        vec3 base = texture2D(uTarget, vUv).xyz;
        gl_FragColor = vec4(base + splat, 1.0);
      }
    `);

    const advectionFS = compileShader(gl.FRAGMENT_SHADER, `
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D uVelocity, uSource;
      uniform vec2 texelSize;
      uniform float dt, dissipation;
      void main() {
        vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
        vec4 result = texture2D(uSource, coord);
        gl_FragColor = result / (1.0 + dissipation * dt);
      }
    `);

    const divergenceFS = compileShader(gl.FRAGMENT_SHADER, `
      precision mediump float;
      varying vec2 vUv, vL, vR, vT, vB;
      uniform sampler2D uVelocity;
      void main() {
        float L = texture2D(uVelocity, vL).x;
        float R = texture2D(uVelocity, vR).x;
        float T = texture2D(uVelocity, vT).y;
        float B = texture2D(uVelocity, vB).y;
        vec2 C = texture2D(uVelocity, vUv).xy;
        if (vL.x < 0.0) L = -C.x;
        if (vR.x > 1.0) R = -C.x;
        if (vT.y > 1.0) T = -C.y;
        if (vB.y < 0.0) B = -C.y;
        gl_FragColor = vec4(0.5 * (R - L + T - B), 0.0, 0.0, 1.0);
      }
    `);

    const curlFS = compileShader(gl.FRAGMENT_SHADER, `
      precision mediump float;
      varying vec2 vUv, vL, vR, vT, vB;
      uniform sampler2D uVelocity;
      void main() {
        float L = texture2D(uVelocity, vL).y;
        float R = texture2D(uVelocity, vR).y;
        float T = texture2D(uVelocity, vT).x;
        float B = texture2D(uVelocity, vB).x;
        gl_FragColor = vec4(0.5 * (R - L - T + B), 0.0, 0.0, 1.0);
      }
    `);

    const vorticityFS = compileShader(gl.FRAGMENT_SHADER, `
      precision highp float;
      varying vec2 vUv, vL, vR, vT, vB;
      uniform sampler2D uVelocity, uCurl;
      uniform float curl, dt;
      void main() {
        float L = texture2D(uCurl, vL).x;
        float R = texture2D(uCurl, vR).x;
        float T = texture2D(uCurl, vT).x;
        float B = texture2D(uCurl, vB).x;
        float C = texture2D(uCurl, vUv).x;
        vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
        force /= length(force) + 0.0001;
        force *= curl * C;
        force.y *= -1.0;
        vec2 velocity = texture2D(uVelocity, vUv).xy + force * dt;
        gl_FragColor = vec4(clamp(velocity, -1000.0, 1000.0), 0.0, 1.0);
      }
    `);

    const pressureFS = compileShader(gl.FRAGMENT_SHADER, `
      precision mediump float;
      varying vec2 vUv, vL, vR, vT, vB;
      uniform sampler2D uPressure, uDivergence;
      void main() {
        float L = texture2D(uPressure, vL).x;
        float R = texture2D(uPressure, vR).x;
        float T = texture2D(uPressure, vT).x;
        float B = texture2D(uPressure, vB).x;
        float div = texture2D(uDivergence, vUv).x;
        gl_FragColor = vec4((L + R + B + T - div) * 0.25, 0.0, 0.0, 1.0);
      }
    `);

    const gradientFS = compileShader(gl.FRAGMENT_SHADER, `
      precision mediump float;
      varying vec2 vUv, vL, vR, vT, vB;
      uniform sampler2D uPressure, uVelocity;
      void main() {
        float L = texture2D(uPressure, vL).x;
        float R = texture2D(uPressure, vR).x;
        float T = texture2D(uPressure, vT).x;
        float B = texture2D(uPressure, vB).x;
        vec2 velocity = texture2D(uVelocity, vUv).xy - vec2(R - L, T - B);
        gl_FragColor = vec4(velocity, 0.0, 1.0);
      }
    `);

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);

    function blit(target) {
      if (target == null) {
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      } else {
        gl.viewport(0, 0, target.width, target.height);
        gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
      }
      gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    }

    const copyProg = new Program(baseVS, copyFS);
    const clearProg = new Program(baseVS, clearFS);
    const displayProg = new Program(baseVS, displayFS);
    const splatProg = new Program(baseVS, splatFS);
    const advProg = new Program(baseVS, advectionFS);
    const divProg = new Program(baseVS, divergenceFS);
    const curlProg = new Program(baseVS, curlFS);
    const vortProg = new Program(baseVS, vorticityFS);
    const pressProg = new Program(baseVS, pressureFS);
    const gradProg = new Program(baseVS, gradientFS);

    let dye, velocity, divergence, curl, pressure;

    function createFBO(w, h, intFmt, fmt, type, filter) {
      gl.activeTexture(gl.TEXTURE0);
      let tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, intFmt, w, h, 0, fmt, type, null);
      let fbo = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
      gl.viewport(0, 0, w, h);
      gl.clear(gl.COLOR_BUFFER_BIT);
      return {
        texture: tex, fbo, width: w, height: h,
        texelSizeX: 1.0 / w, texelSizeY: 1.0 / h,
        attach(id) { gl.activeTexture(gl.TEXTURE0 + id); gl.bindTexture(gl.TEXTURE_2D, tex); return id; }
      };
    }

    function createDoubleFBO(w, h, intFmt, fmt, type, filter) {
      let fbo1 = createFBO(w, h, intFmt, fmt, type, filter);
      let fbo2 = createFBO(w, h, intFmt, fmt, type, filter);
      return {
        width: w, height: h, texelSizeX: fbo1.texelSizeX, texelSizeY: fbo1.texelSizeY,
        get read() { return fbo1; }, set read(v) { fbo1 = v; },
        get write() { return fbo2; }, set write(v) { fbo2 = v; },
        swap() { let t = fbo1; fbo1 = fbo2; fbo2 = t; }
      };
    }

    function getResolution(res) {
      let ar = gl.drawingBufferWidth / gl.drawingBufferHeight;
      if (ar < 1) ar = 1 / ar;
      let min = Math.round(res), max = Math.round(res * ar);
      return gl.drawingBufferWidth > gl.drawingBufferHeight ? { width: max, height: min } : { width: min, height: max };
    }

    function initFBOs() {
      let simRes = getResolution(config.SIM_RESOLUTION);
      let dyeRes = getResolution(config.DYE_RESOLUTION);
      let filter = supportLinearFiltering ? gl.LINEAR : gl.NEAREST;
      gl.disable(gl.BLEND);
      dye = createDoubleFBO(dyeRes.width, dyeRes.height, formatRGBA.internalFormat, formatRGBA.format, halfFloatTexType, filter);
      velocity = createDoubleFBO(simRes.width, simRes.height, formatRG.internalFormat, formatRG.format, halfFloatTexType, filter);
      divergence = createFBO(simRes.width, simRes.height, formatR.internalFormat, formatR.format, halfFloatTexType, gl.NEAREST);
      curl = createFBO(simRes.width, simRes.height, formatR.internalFormat, formatR.format, halfFloatTexType, gl.NEAREST);
      pressure = createDoubleFBO(simRes.width, simRes.height, formatR.internalFormat, formatR.format, halfFloatTexType, gl.NEAREST);
    }

    initFBOs();

    function generateColor(intensity = 0.08) {
      colorIndex = (colorIndex + 1) % colorPalette.length;
      let c = colorPalette[colorIndex];
      return { r: c.r * intensity, g: c.g * intensity, b: c.b * intensity };
    }

    function createInitialSplats() {
      for (let i = 0; i < 6; i++) {
        let color = generateColor(0.5);  // Higher intensity for initial splats
        let x = 0.1 + Math.random() * 0.8;
        let y = 0.1 + Math.random() * 0.8;
        let angle = Math.random() * Math.PI * 2;
        splat(x, y, Math.cos(angle) * 100, Math.sin(angle) * 100, color, 0.8 / 100);
      }
    }

    let lastTime = Date.now();
    let animationId;
    let running = true;

    function update() {
      if (!running) return;
      let now = Date.now();
      let dt = Math.min((now - lastTime) / 1000, 0.016666);
      lastTime = now;

      if (resizeCanvas()) initFBOs();

      pointers.forEach(p => {
        if (p.moved) {
          p.moved = false;
          let sf = Math.min(1, mouseSpeed / config.SPEED_MULTIPLIER);
          let r = config.MIN_SPLAT_RADIUS + (config.MAX_SPLAT_RADIUS - config.MIN_SPLAT_RADIUS) * sf;
          let f = config.MIN_SPLAT_FORCE + (config.MAX_SPLAT_FORCE - config.MIN_SPLAT_FORCE) * sf;
          let color = generateColor();
          splat(p.texcoordX, p.texcoordY, p.deltaX * f, p.deltaY * f, color, r / 100);
        }
      });

      let isIdle = (now - lastMouseMoveTime) > config.IDLE_THRESHOLD;
      if (now - lastAmbientSplatTime > config.AMBIENT_INTERVAL) {
        let color = generateColor(0.5);  // Higher intensity for ambient animation
        let ox = (Math.random() - 0.5) * 0.6;
        let oy = (Math.random() - 0.5) * 0.6;
        let x, y;
        if (isIdle) {
          x = 0.1 + Math.random() * 0.8;
          y = 0.1 + Math.random() * 0.8;
        } else {
          x = Math.max(0.1, Math.min(0.9, lastMouseX / window.innerWidth + ox));
          y = Math.max(0.1, Math.min(0.9, 1 - lastMouseY / window.innerHeight + oy));
        }
        let angle = Math.random() * Math.PI * 2;
        let force = isIdle ? config.AMBIENT_FORCE : config.AMBIENT_FORCE * 0.5;
        splat(x, y, Math.cos(angle) * force, Math.sin(angle) * force, color, config.AMBIENT_SPLAT_RADIUS / 100);
        lastAmbientSplatTime = now;
      }

      gl.disable(gl.BLEND);

      curlProg.bind();
      gl.uniform2f(curlProg.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(curlProg.uniforms.uVelocity, velocity.read.attach(0));
      blit(curl);

      vortProg.bind();
      gl.uniform2f(vortProg.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(vortProg.uniforms.uVelocity, velocity.read.attach(0));
      gl.uniform1i(vortProg.uniforms.uCurl, curl.attach(1));
      gl.uniform1f(vortProg.uniforms.curl, config.CURL);
      gl.uniform1f(vortProg.uniforms.dt, dt);
      blit(velocity.write);
      velocity.swap();

      divProg.bind();
      gl.uniform2f(divProg.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(divProg.uniforms.uVelocity, velocity.read.attach(0));
      blit(divergence);

      clearProg.bind();
      gl.uniform1i(clearProg.uniforms.uTexture, pressure.read.attach(0));
      gl.uniform1f(clearProg.uniforms.value, config.PRESSURE);
      blit(pressure.write);
      pressure.swap();

      pressProg.bind();
      gl.uniform2f(pressProg.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(pressProg.uniforms.uDivergence, divergence.attach(0));
      for (let i = 0; i < config.PRESSURE_ITERATIONS; i++) {
        gl.uniform1i(pressProg.uniforms.uPressure, pressure.read.attach(1));
        blit(pressure.write);
        pressure.swap();
      }

      gradProg.bind();
      gl.uniform2f(gradProg.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(gradProg.uniforms.uPressure, pressure.read.attach(0));
      gl.uniform1i(gradProg.uniforms.uVelocity, velocity.read.attach(1));
      blit(velocity.write);
      velocity.swap();

      advProg.bind();
      gl.uniform2f(advProg.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(advProg.uniforms.uVelocity, velocity.read.attach(0));
      gl.uniform1i(advProg.uniforms.uSource, velocity.read.attach(0));
      gl.uniform1f(advProg.uniforms.dt, dt);
      gl.uniform1f(advProg.uniforms.dissipation, config.VELOCITY_DISSIPATION);
      blit(velocity.write);
      velocity.swap();

      gl.uniform1i(advProg.uniforms.uVelocity, velocity.read.attach(0));
      gl.uniform1i(advProg.uniforms.uSource, dye.read.attach(1));
      gl.uniform1f(advProg.uniforms.dissipation, config.DENSITY_DISSIPATION);
      blit(dye.write);
      dye.swap();

      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.enable(gl.BLEND);
      displayProg.bind();
      gl.uniform2f(displayProg.uniforms.texelSize, 1 / gl.drawingBufferWidth, 1 / gl.drawingBufferHeight);
      gl.uniform1i(displayProg.uniforms.uTexture, dye.read.attach(0));
      blit(null);

      animationId = requestAnimationFrame(update);
    }

    function resizeCanvas() {
      let w = Math.floor(canvas.clientWidth * (window.devicePixelRatio || 1));
      let h = Math.floor(canvas.clientHeight * (window.devicePixelRatio || 1));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        return true;
      }
      return false;
    }

    function splat(x, y, dx, dy, color, radius) {
      splatProg.bind();
      gl.uniform1i(splatProg.uniforms.uTarget, velocity.read.attach(0));
      gl.uniform1f(splatProg.uniforms.aspectRatio, canvas.width / canvas.height);
      gl.uniform2f(splatProg.uniforms.point, x, y);
      gl.uniform3f(splatProg.uniforms.color, dx, dy, 0);
      let r = radius * (canvas.width > canvas.height ? canvas.width / canvas.height : 1);
      gl.uniform1f(splatProg.uniforms.radius, r);
      blit(velocity.write);
      velocity.swap();

      gl.uniform1i(splatProg.uniforms.uTarget, dye.read.attach(0));
      gl.uniform3f(splatProg.uniforms.color, color.r, color.g, color.b);
      blit(dye.write);
      dye.swap();
    }

    function onMouseDown(e) {
      let p = pointers[0];
      let px = e.clientX * (window.devicePixelRatio || 1);
      let py = e.clientY * (window.devicePixelRatio || 1);
      p.texcoordX = px / canvas.width;
      p.texcoordY = 1 - py / canvas.height;
      let color = generateColor();
      splat(p.texcoordX, p.texcoordY, (Math.random() - 0.5) * 300, (Math.random() - 0.5) * 300, color, config.SPLAT_RADIUS / 100);
    }

    function onMouseMove(e) {
      let dx = e.clientX - prevMouseX;
      let dy = e.clientY - prevMouseY;
      mouseSpeed = Math.sqrt(dx * dx + dy * dy);
      prevMouseX = lastMouseX;
      prevMouseY = lastMouseY;
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
      lastMouseMoveTime = Date.now();

      let p = pointers[0];
      let px = e.clientX * (window.devicePixelRatio || 1);
      let py = e.clientY * (window.devicePixelRatio || 1);
      p.prevTexcoordX = p.texcoordX;
      p.prevTexcoordY = p.texcoordY;
      p.texcoordX = px / canvas.width;
      p.texcoordY = 1 - py / canvas.height;
      p.deltaX = p.texcoordX - p.prevTexcoordX;
      p.deltaY = p.texcoordY - p.prevTexcoordY;
      p.moved = Math.abs(p.deltaX) > 0 || Math.abs(p.deltaY) > 0;
    }

    function onWheel(e) {
      let color = generateColor();
      for (let i = 0; i < 2; i++) {
        let x = lastMouseX / window.innerWidth + (Math.random() - 0.5) * 0.2;
        let y = 1 - lastMouseY / window.innerHeight + (Math.random() - 0.5) * 0.2;
        splat(x, y, (Math.random() - 0.5) * 100, e.deltaY * 2, color, config.SPLAT_RADIUS / 100);
      }
    }

    function onTouchStart(e) {
      let t = e.targetTouches[0];
      if (!t) return;
      let p = pointers[0];
      let px = t.clientX * (window.devicePixelRatio || 1);
      let py = t.clientY * (window.devicePixelRatio || 1);
      p.texcoordX = px / canvas.width;
      p.texcoordY = 1 - py / canvas.height;
    }

    function onTouchMove(e) {
      let t = e.targetTouches[0];
      if (!t) return;
      let dx = t.clientX - prevMouseX;
      let dy = t.clientY - prevMouseY;
      mouseSpeed = Math.sqrt(dx * dx + dy * dy);
      prevMouseX = lastMouseX;
      prevMouseY = lastMouseY;
      lastMouseX = t.clientX;
      lastMouseY = t.clientY;
      lastMouseMoveTime = Date.now();

      let p = pointers[0];
      let px = t.clientX * (window.devicePixelRatio || 1);
      let py = t.clientY * (window.devicePixelRatio || 1);
      p.prevTexcoordX = p.texcoordX;
      p.prevTexcoordY = p.texcoordY;
      p.texcoordX = px / canvas.width;
      p.texcoordY = 1 - py / canvas.height;
      p.deltaX = p.texcoordX - p.prevTexcoordX;
      p.deltaY = p.texcoordY - p.prevTexcoordY;
      p.moved = Math.abs(p.deltaX) > 0 || Math.abs(p.deltaY) > 0;
    }

    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('touchstart', onTouchStart);
    window.addEventListener('touchmove', onTouchMove, false);

    resizeCanvas();
    createInitialSplats();
    update();

    return () => {
      running = false;
      if (animationId) cancelAnimationFrame(animationId);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
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
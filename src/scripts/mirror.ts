/* The mirror: the hero painting rendered through a shader. Wet paint that moves
   under the cursor a fraction late, and now and then loses its colour and shows
   only the ink lines underneath, the way Kai does. Falls back to the plain image
   when WebGL is not there. */

const VERT = `attribute vec2 a; varying vec2 v; void main(){ v = a * 0.5 + 0.5; gl_Position = vec4(a, 0.0, 1.0); }`;

const FRAG = `
precision highp float;
varying vec2 v;
uniform sampler2D t;
uniform vec2 res;
uniform vec2 tres;
uniform float time;
uniform vec2 mouse;
uniform float mouseOn;
uniform float ink;
uniform float focus;

vec2 cover(vec2 uv) {
  float ca = res.x / res.y;
  float ia = tres.x / tres.y;
  vec2 s = vec2(1.0);
  if (ca > ia) { s.y = ia / ca; } else { s.x = ca / ia; }
  return uv * s + vec2(0.5, focus) * (1.0 - s);
}
float lum(vec3 c) { return dot(c, vec3(0.299, 0.587, 0.114)); }
float n(vec2 p) { return sin(p.x * 3.1 + time * 0.21) * sin(p.y * 2.3 - time * 0.17); }

void main() {
  vec2 uv = v;
  float asp = res.x / res.y;
  vec2 flow = vec2(n(uv * 4.0), n(uv.yx * 4.0 + 7.0)) * 0.0025;
  vec2 d = (uv - mouse) * vec2(asp, 1.0);
  float r = length(d);
  float ripple = sin(r * 38.0 - time * 3.6) * exp(-r * 5.5) * 0.014 * mouseOn;
  vec2 disp = flow + normalize(d + 1e-5) * ripple;
  vec2 tuv = cover(uv + disp);
  vec3 col;
  col.r = texture2D(t, tuv + disp * 0.35).r;
  col.g = texture2D(t, tuv).g;
  col.b = texture2D(t, tuv - disp * 0.35).b;

  // ink: sobel on the painting, drawn as lines on paper
  vec2 px = 1.6 / tres;
  float gx = lum(texture2D(t, tuv + vec2(px.x, 0.0)).rgb) - lum(texture2D(t, tuv - vec2(px.x, 0.0)).rgb);
  float gy = lum(texture2D(t, tuv + vec2(0.0, px.y)).rgb) - lum(texture2D(t, tuv - vec2(0.0, px.y)).rgb);
  float e = clamp(length(vec2(gx, gy)) * 4.5, 0.0, 1.0);
  vec3 paper = vec3(0.914, 0.863, 0.765);
  vec3 inkc = vec3(0.106, 0.090, 0.125);
  vec3 lines = mix(paper, inkc, e);
  lines = mix(lines, inkc, step(lum(col), 0.2) * 0.55);
  vec3 outc = mix(col, lines, ink);

  // the edges of the painting are darker; the night is around it
  float vig = smoothstep(1.25, 0.35, length((uv - 0.5) * vec2(1.2, 1.0)));
  outc *= mix(0.72, 1.0, vig);
  gl_FragColor = vec4(outc, 1.0);
}`;

export type Mirror = { stop: () => void };

export function mountMirror(host: HTMLElement, img: HTMLImageElement, canvas: HTMLCanvasElement, onInk?: () => void): Mirror | null {
  const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' });
  if (!gl) return null;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const sh = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  };
  const prog = gl.createProgram()!;
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const a = gl.getAttribLocation(prog, 'a');
  gl.enableVertexAttribArray(a);
  gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0);

  const u = (name: string) => gl.getUniformLocation(prog, name);
  const U = { res: u('res'), tres: u('tres'), time: u('time'), mouse: u('mouse'), mouseOn: u('mouseOn'), ink: u('ink'), focus: u('focus') };

  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  let ready = false, stopped = false;
  let tw = 1, th = 1;
  const upload = () => {
    if (stopped) return;
    try {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
      tw = img.naturalWidth; th = img.naturalHeight;
      ready = true;
      host.classList.add('live');
    } catch { /* tainted or not decodable: stay on the plain image */ }
  };
  if (img.complete && img.naturalWidth) upload(); else img.addEventListener('load', upload, { once: true });

  // the cursor, answered late
  let tx = 0.5, ty = 0.5, mx = 0.5, my = 0.5, on = 0, onTarget = 0;
  const move = (e: PointerEvent) => {
    const r = host.getBoundingClientRect();
    tx = (e.clientX - r.left) / r.width;
    ty = 1 - (e.clientY - r.top) / r.height;
    onTarget = 1;
  };
  const leave = () => { onTarget = 0; };
  host.addEventListener('pointermove', move);
  host.addEventListener('pointerleave', leave);

  // the ink: a stepped burst every so often, and while the pointer is held down
  let ink = 0, inkTarget = 0, held = false;
  let burstTimer = 0;
  const burst = () => {
    const pattern = [1, 0, 1, 1, 0, 0, 1, 0];
    let i = 0;
    const step = () => {
      if (stopped) return;
      if (i < pattern.length) { inkTarget = pattern[i++]; ink = inkTarget; setTimeout(step, 55 + Math.random() * 40); }
      else { inkTarget = 0; ink = 0; }
    };
    step();
    onInk?.();
    burstTimer = window.setTimeout(burst, 9000 + Math.random() * 11000);
  };
  if (!reduced) burstTimer = window.setTimeout(burst, 4000 + Math.random() * 6000);
  const down = () => { held = true; };
  const up = () => { held = false; };
  host.addEventListener('pointerdown', down);
  addEventListener('pointerup', up);

  let visible = true;
  const io = new IntersectionObserver((es) => { visible = es[0].isIntersecting; }, { threshold: 0 });
  io.observe(host);

  const dpr = Math.min(devicePixelRatio || 1, 1.5);
  const size = () => {
    const w = Math.max(1, Math.round(host.clientWidth * dpr)), h = Math.max(1, Math.round(host.clientHeight * dpr));
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; gl.viewport(0, 0, w, h); }
  };
  const ro = new ResizeObserver(() => { size(); if (reduced) draw(); });
  ro.observe(host);

  let raf = 0;
  const t0 = performance.now();
  const draw = () => {
    if (!ready) return;
    const t = (performance.now() - t0) / 1000;
    mx += (tx - mx) * 0.045;
    my += (ty - my) * 0.045;
    on += (onTarget - on) * 0.05;
    if (held) ink += (1 - ink) * 0.15; else if (inkTarget === 0) ink += (0 - ink) * 0.5;
    gl.uniform2f(U.res, canvas.width, canvas.height);
    gl.uniform2f(U.tres, tw, th);
    gl.uniform1f(U.time, reduced ? 0 : t);
    gl.uniform2f(U.mouse, mx, my);
    gl.uniform1f(U.mouseOn, reduced ? 0 : on);
    gl.uniform1f(U.ink, ink);
    gl.uniform1f(U.focus, 0.35);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  };
  // reduced motion: one still frame once the texture is in, then nothing
  const frame = () => {
    if (stopped) return;
    if (reduced) { if (ready) draw(); else raf = requestAnimationFrame(frame); return; }
    raf = requestAnimationFrame(frame);
    if (!visible || document.hidden) return;
    draw();
  };
  size();
  raf = requestAnimationFrame(frame);

  return {
    stop() {
      stopped = true;
      img.removeEventListener('load', upload);
      host.classList.remove('live');
      cancelAnimationFrame(raf);
      clearTimeout(burstTimer);
      io.disconnect();
      ro.disconnect();
      host.removeEventListener('pointermove', move);
      host.removeEventListener('pointerleave', leave);
      host.removeEventListener('pointerdown', down);
      removeEventListener('pointerup', up);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    },
  };
}

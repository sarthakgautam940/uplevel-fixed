"use client";

import { useEffect, useRef } from "react";

const VERT = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAG = `
precision mediump float;
uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

float caustic(vec2 uv, float t) {
  vec2 p = uv * 6.0;
  float d = 0.0;
  for(int i = 0; i < 5; i++) {
    float fi = float(i);
    p += vec2(
      sin(p.y * 1.3 + t * 0.7 + fi * 1.1),
      cos(p.x * 1.1 + t * 0.5 + fi * 0.9)
    ) * 0.4;
    d += abs(sin(p.x + sin(p.y + t * 0.3)));
  }
  return d / 5.0;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  vec2 mouse = u_mouse / u_resolution;
  float dist = length(uv - mouse);
  float ripple = sin(dist * 25.0 - u_time * 3.0) * exp(-dist * 4.0) * 0.15;
  float c = caustic(uv + ripple, u_time * 0.4);
  vec3 deep = vec3(0.04, 0.09, 0.16);
  vec3 light = vec3(0.10, 0.25, 0.42);
  vec3 color = mix(deep, light, c * 0.6);
  // Warm ember tones in bottom 40% (fire bowl reflection)
  float warmZone = 1.0 - smoothstep(0.3, 0.7, uv.y);
  vec3 warm = vec3(0.18, 0.11, 0.04);
  color = mix(color, warm * 0.6 + color * 0.4, warmZone * 0.3);
  gl_FragColor = vec4(color, 1.0);
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string): WebGLShader | null {
  const s = gl.createShader(type);
  if (!s) return null;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { gl.deleteShader(s); return null; }
  return s;
}

export default function CausticsCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", { antialias: true, alpha: true });
    if (!gl) return;

    const vert = compile(gl, gl.VERTEX_SHADER, VERT);
    const frag = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vert || !frag) return;

    const prog = gl.createProgram()!;
    gl.attachShader(prog, vert);
    gl.attachShader(prog, frag);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);

    const aPos = gl.getAttribLocation(prog, "a_position");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const uTime = gl.getUniformLocation(prog, "u_time");
    const uRes = gl.getUniformLocation(prog, "u_resolution");
    const uMouse = gl.getUniformLocation(prog, "u_mouse");

    let w = window.innerWidth;
    let h = window.innerHeight;
    let mouseX = w / 2;
    let mouseY = h / 2;
    let targetX = w / 2;
    let targetY = h / 2;
    let startTime = performance.now();
    let prevTime = startTime;
    let animId: number;

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    };
    resize();

    const onMouse = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    const render = (now: number) => {
      const delta = Math.min(now - prevTime, 33);
      prevTime = now;
      const t = (now - startTime) / 1000;

      // Smooth mouse lerp
      mouseX += (targetX - mouseX) * 0.08;
      mouseY += (targetY - mouseY) * 0.08;

      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(uTime, t);
      gl.uniform2f(uRes, w, h);
      gl.uniform2f(uMouse, mouseX, h - mouseY);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    window.addEventListener("mousemove", onMouse, { passive: true });

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      window.removeEventListener("mousemove", onMouse);
      gl.deleteBuffer(buf);
      gl.deleteShader(vert);
      gl.deleteShader(frag);
      gl.deleteProgram(prog);
      const ext = gl.getExtension("WEBGL_lose_context");
      ext?.loseContext();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        opacity: 0.22,
      }}
    />
  );
}

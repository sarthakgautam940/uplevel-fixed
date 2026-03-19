"use client";

import { useEffect, useRef } from "react";

const VERT_SHADER = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const FRAG_SHADER = `
  precision mediump float;
  uniform vec2 u_resolution;
  uniform float u_time;
  uniform vec2 u_mouse;
  uniform float u_mouseAge;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i + vec2(0,0)), hash(i + vec2(1,0)), u.x),
      mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), u.x),
      u.y
    );
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * noise(p);
      p = p * 2.0 + vec2(1.7, 9.2);
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    uv.y = 1.0 - uv.y;

    // Slow autonomous wave
    vec2 q = uv * 3.0;
    q.x += u_time * 0.04;
    q.y += u_time * 0.025;
    float wave = fbm(q + fbm(q + fbm(q)));

    // Caustic pattern
    vec2 c = uv * 6.0;
    c += u_time * 0.06;
    float caustic = fbm(c) * 0.5 + 0.5;
    caustic = pow(caustic, 2.5);

    // Cursor ripple
    vec2 mouseUV = u_mouse / u_resolution;
    mouseUV.y = 1.0 - mouseUV.y;
    float mouseDist = length(uv - mouseUV);
    float rippleAge = clamp(u_mouseAge / 2.0, 0.0, 1.0);
    float rippleRadius = rippleAge * 0.6;
    float ripple = 0.0;
    if (rippleAge < 1.0) {
      float ring = abs(mouseDist - rippleRadius);
      ripple = smoothstep(0.04, 0.0, ring) * (1.0 - rippleAge) * 0.6;
    }

    // Color
    vec3 deep = vec3(0.02, 0.06, 0.08);      // #050f14
    vec3 mid = vec3(0.04, 0.12, 0.18);       // #0a1f2e
    vec3 light = vec3(0.08, 0.22, 0.28);     // #143847
    vec3 goldHint = vec3(0.12, 0.10, 0.04);  // subtle gold

    vec3 color = mix(deep, mid, wave);
    color = mix(color, light, caustic * 0.3);
    color += goldHint * caustic * 0.15;
    color += vec3(0.1, 0.3, 0.4) * ripple;

    float alpha = 0.18;
    gl_FragColor = vec4(color, alpha);
  }
`;

function compileShader(gl: WebGLRenderingContext, type: number, src: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

interface WaterCanvasProps {
  className?: string;
  style?: React.CSSProperties;
}

export default function WaterCanvas({ className, style }: WaterCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: false });
    if (!gl) return;

    const vert = compileShader(gl, gl.VERTEX_SHADER, VERT_SHADER);
    const frag = compileShader(gl, gl.FRAGMENT_SHADER, FRAG_SHADER);
    if (!vert || !frag) return;

    const prog = gl.createProgram()!;
    gl.attachShader(prog, vert);
    gl.attachShader(prog, frag);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;

    gl.useProgram(prog);

    const positions = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const aPosLoc = gl.getAttribLocation(prog, "a_position");
    gl.enableVertexAttribArray(aPosLoc);
    gl.vertexAttribPointer(aPosLoc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "u_resolution");
    const uTime = gl.getUniformLocation(prog, "u_time");
    const uMouse = gl.getUniformLocation(prog, "u_mouse");
    const uMouseAge = gl.getUniformLocation(prog, "u_mouseAge");

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    let mouseX = width / 2;
    let mouseY = height / 2;
    let mouseLastMoved = 0;
    let animId: number;
    let prevTime = 0;

    const resize = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
    };
    resize();

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      mouseLastMoved = performance.now() / 1000;
    };

    const render = (timestamp: number) => {
      const delta = Math.min((timestamp - prevTime) / 1000, 0.05);
      prevTime = timestamp;
      const t = timestamp / 1000;

      const mouseAge = t - mouseLastMoved;

      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(uRes, width, height);
      gl.uniform1f(uTime, t);
      gl.uniform2f(uMouse, mouseX, mouseY);
      gl.uniform1f(uMouseAge, mouseAge);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        ...style,
      }}
    />
  );
}

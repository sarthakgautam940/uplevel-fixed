// ripple.vert.glsl
// Sine-wave displacement for image planes in the WebGL carousel

uniform float uTime;
uniform float uScrollOffset;   // 0..1 based on scroll position
uniform float uHover;          // 0..1 animated on hover
uniform vec2 uMouse;           // mouse influence on this plane

varying vec2 vUv;
varying float vWave;

void main() {
  vUv = uv;
  
  // Base wave — gentle breathing
  float waveX = sin(position.x * 3.0 + uTime * 1.2) * 0.015;
  float waveY = sin(position.y * 3.0 + uTime * 0.9 + 1.57) * 0.015;
  
  // Scroll-linked bend — plane curves as it enters/exits view
  float scrollBend = sin(uScrollOffset * 3.14159) * 0.08;
  
  // Hover ripple — expands from center on hover
  float dist = length(position.xy);
  float hoverWave = sin(dist * 6.0 - uTime * 3.0) * uHover * 0.04 * (1.0 - dist * 0.5);
  
  float totalDisplace = waveX + waveY + scrollBend + hoverWave;
  vWave = totalDisplace;
  
  vec3 displaced = position + vec3(0.0, 0.0, totalDisplace);
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
}

// glass.vert.glsl
// Vertex shader for the glass hero object
// Distorts geometry based on mouse position and time

uniform float uTime;
uniform vec2 uMouse;       // normalized -1..1
uniform float uDistortion; // 0..1 intensity multiplier

varying vec3 vNormal;
varying vec3 vWorldPosition;
varying vec3 vViewDirection;
varying vec2 vUv;
varying float vFresnel;

// Smooth noise for organic movement
float hash(vec3 p) {
  p = fract(p * vec3(443.897, 441.423, 437.195));
  p += dot(p, p.yxz + 19.19);
  return fract((p.x + p.y) * p.z);
}

float smoothNoise(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  f = f * f * (3.0 - 2.0 * f); // smoothstep
  return mix(
    mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x),
        mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
    mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
        mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y),
    f.z
  );
}

void main() {
  vUv = uv;
  
  // Base normal
  vec3 n = normalize(normalMatrix * normal);
  
  // World position for refraction calculation
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vWorldPosition = worldPos.xyz;
  
  // View direction for fresnel
  vec3 cameraPos = (inverse(viewMatrix) * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
  vViewDirection = normalize(cameraPos - worldPos.xyz);
  
  // Fresnel effect — more reflective at grazing angles
  vFresnel = pow(1.0 - max(0.0, dot(n, vViewDirection)), 3.0);
  
  // --- Distortion ---
  // 1. Organic breathing via layered noise
  float breathe = smoothNoise(position * 1.5 + vec3(uTime * 0.3)) * 0.04;
  
  // 2. Mouse proximity distortion — push vertices toward/away from mouse
  vec2 mouseInfluence = uMouse * 0.5; // -0.5..0.5
  float mouseDist = length(position.xy * 0.5 - mouseInfluence);
  float mouseWave = sin(mouseDist * 8.0 - uTime * 2.0) * 0.02 * uDistortion;
  float mouseDisplace = exp(-mouseDist * 3.0) * 0.08 * uDistortion;
  
  // 3. Edge ripple — vertices on silhouette ripple more
  float edgeRipple = vFresnel * sin(uTime * 1.5 + position.y * 4.0) * 0.015;
  
  // Total displacement along normal
  float displacement = breathe + mouseWave + mouseDisplace + edgeRipple;
  vec3 displacedPosition = position + normal * displacement;
  
  // Pass distorted normal for fragment
  vNormal = normalize(normalMatrix * (normal + vec3(uMouse * 0.15, 0.0)));
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(displacedPosition, 1.0);
}

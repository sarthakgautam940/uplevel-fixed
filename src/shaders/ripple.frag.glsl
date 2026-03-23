// ripple.frag.glsl
// Texture display with edge fade and wave-driven distortion for carousel planes

uniform sampler2D uTexture;
uniform float uTime;
uniform float uHover;
uniform float uAlpha;        // 0..1 for entrance/exit fade
uniform vec3 uAccentColor;   // neon green tint on hover

varying vec2 vUv;
varying float vWave;

void main() {
  // UV distortion — slight chromatic shift on wave peak
  vec2 distortedUV = vUv;
  distortedUV += vec2(vWave * 0.02, vWave * 0.015);
  
  // Chromatic aberration on hover
  float aberration = uHover * 0.005;
  float r = texture2D(uTexture, distortedUV + vec2(aberration, 0.0)).r;
  float g = texture2D(uTexture, distortedUV).g;
  float b = texture2D(uTexture, distortedUV - vec2(aberration, 0.0)).b;
  vec3 color = vec3(r, g, b);
  
  // Edge vignette/fade
  vec2 uvCentered = vUv * 2.0 - 1.0;
  float vignette = 1.0 - smoothstep(0.7, 1.0, length(uvCentered));
  
  // Subtle neon tint on hover
  vec3 tintedColor = mix(color, color + uAccentColor * 0.12, uHover * vignette);
  
  // Scanline artifact — cyber aesthetic
  float scanline = sin(vUv.y * 200.0) * 0.02 * uHover;
  tintedColor -= scanline;
  
  gl_FragColor = vec4(tintedColor, uAlpha * vignette);
}

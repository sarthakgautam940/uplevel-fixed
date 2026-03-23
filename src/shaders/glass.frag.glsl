// glass.frag.glsl
// Fragment shader for glass hero object
// Fresnel-based reflectivity + refraction approximation + neon internal light scatter

uniform float uTime;
uniform vec2 uMouse;
uniform samplerCube uEnvMap;      // environment cubemap for reflections
uniform float uIOR;               // index of refraction (glass ~1.45)
uniform vec3 uColorA;             // neon green: vec3(0.0, 1.0, 0.53)
uniform vec3 uColorB;             // neon blue:  vec3(0.04, 0.64, 1.0)
uniform float uOpacity;
uniform float uRoughness;

varying vec3 vNormal;
varying vec3 vWorldPosition;
varying vec3 vViewDirection;
varying vec2 vUv;
varying float vFresnel;

// Chromatic aberration offset for refraction rays
vec3 refractRGB(vec3 dir, vec3 normal, float ior) {
  float iorR = ior - 0.02;
  float iorG = ior;
  float iorB = ior + 0.02;
  return vec3(
    textureCube(uEnvMap, refract(-dir, normal, 1.0 / iorR)).r,
    textureCube(uEnvMap, refract(-dir, normal, 1.0 / iorG)).g,
    textureCube(uEnvMap, refract(-dir, normal, 1.0 / iorB)).b
  );
}

// Hexagonal prismatic scatter — internal light scattering
float prismScatter(vec3 normal, vec3 viewDir, float time) {
  float angle = atan(normal.y, normal.x) + time * 0.5;
  return abs(sin(angle * 6.0)) * 0.5 + 0.5;
}

void main() {
  vec3 N = normalize(vNormal);
  vec3 V = normalize(vViewDirection);
  
  // --- Reflection ---
  vec3 R = reflect(-V, N);
  vec3 reflection = textureCube(uEnvMap, R).rgb;
  
  // Add roughness by blending mip levels (approximate)
  vec3 roughReflection = textureCube(uEnvMap, R, uRoughness * 8.0).rgb;
  reflection = mix(reflection, roughReflection, uRoughness);
  
  // --- Refraction with chromatic aberration ---
  vec3 refraction = refractRGB(V, N, uIOR);
  
  // --- Internal neon scatter ---
  float scatter1 = prismScatter(N, V, uTime);
  float scatter2 = prismScatter(N, V, uTime + 3.14159);
  
  // Green-to-blue gradient across the surface
  float gradientFactor = (vUv.y + N.y * 0.5 + 0.5) * 0.5;
  gradientFactor = clamp(gradientFactor + sin(uTime * 0.4) * 0.1, 0.0, 1.0);
  vec3 neonColor = mix(uColorA, uColorB, gradientFactor);
  
  // Bright scatter along edges (grazing angles)
  vec3 scatterColor = neonColor * (scatter1 * 0.6 + scatter2 * 0.4) * vFresnel * 2.0;
  
  // Thin-film iridescence approximation
  float thinFilm = sin(dot(N, V) * 12.0 + uTime * 0.8) * 0.5 + 0.5;
  vec3 iridescence = mix(uColorA, uColorB, thinFilm) * thinFilm * 0.3;
  
  // Mouse-driven color intensity
  float mouseIntensity = length(uMouse) * 0.5;
  scatterColor *= (1.0 + mouseIntensity * 0.8);
  
  // --- Composite ---
  // Fresnel splits between reflection and refraction
  float fresnelMix = vFresnel;
  vec3 baseColor = mix(refraction, reflection, fresnelMix * 0.8);
  
  // Add neon glow from inside
  vec3 finalColor = baseColor + scatterColor * 0.4 + iridescence;
  
  // Subtle neon tint on the glass itself
  finalColor = mix(finalColor, neonColor * 0.2, 0.15);
  
  // Edge glow for bloom to pick up
  float edgeGlow = pow(vFresnel, 1.5) * 1.5;
  finalColor += neonColor * edgeGlow * 0.6;
  
  // Opacity: glass is mostly transparent, edges more opaque
  float opacity = mix(uOpacity * 0.3, uOpacity * 0.85, vFresnel);
  
  gl_FragColor = vec4(finalColor, opacity);
}

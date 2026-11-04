/* GLSL for the garden valley. Plain strings, so no bundler loader is needed. */

/** Shared by leaves and flowers: world wrapping, terrain, noise, cursor push. */
const common = /* glsl */ `
  uniform float uTime, uIntro, uDisperse, uAspect, uScale, uPR;
  uniform vec2 uMouse;
  uniform vec3 uOrigin;
  uniform vec2 uTile;

  float pathX(float z) { return 6.0 * sin(z * 0.035) + 3.0 * sin(z * 0.011 + 1.3); }

  float hash12(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
  }
  vec4 hash42(vec2 p) {
    vec4 p4 = fract(vec4(p.xyxy) * vec4(0.1031, 0.1030, 0.0973, 0.1099));
    p4 += dot(p4, p4.wzxy + 33.33);
    return fract((p4.xxyz + p4.yzzw) * p4.zywx);
  }
  float vnoise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash12(i), hash12(i + vec2(1.0, 0.0)), u.x),
               mix(hash12(i + vec2(0.0, 1.0)), hash12(i + vec2(1.0, 1.0)), u.x), u.y);
  }

  // valley floor along the path, banks rising to either side
  float groundH(vec2 w) {
    float d = w.x - pathX(w.y);
    float a = abs(d);
    return 0.05 * a * a * smoothstep(0.8, 3.0, a) + (vnoise(w * 0.15) - 0.5) * 0.8 + (vnoise(w * 0.5) - 0.5) * 0.25;
  }

  vec2 wrapWorld(vec2 local) { return mod(local - uOrigin.xz, uTile) + uOrigin.xz; }

  // push away from the cursor in screen space; returns the push strength
  float mousePush(inout vec4 clip) {
    vec2 ndc = clip.xy / clip.w;
    vec2 d = ndc - uMouse;
    d.x *= uAspect;
    float l = length(d);
    float f = exp(-l * l / 0.05);
    vec2 push = l > 1e-4 ? d / l * f * 0.07 : vec2(0.0);
    push.x /= uAspect;
    clip.xy += push * clip.w;
    return f;
  }

  // darkness falls off into the distance
  float distShade(float dist) { return exp(-max(dist - 6.0, 0.0) * 0.13); }

  void cull() { gl_Position = vec4(0.0, 0.0, 2.0, 1.0); gl_PointSize = 0.0; }
`;

// ------------------------------------------------------------------ leaves

/** position = local point in the tile; aData = (seed, layer, rotation, size) */
export const leafVertex = /* glsl */ `
  ${common}
  uniform vec3 uLeaf[5];
  attribute vec4 aData;
  varying vec3 vColor;
  varying float vShade, vRot;

  void main() {
    vec2 w2 = wrapWorld(position.xz);
    float d = w2.x - pathX(w2.y);
    float seed = aData.x, layer = aData.y;

    // the path is a darker, lower, thinner strip of foliage
    float path = 1.0 - smoothstep(0.3, 1.2, abs(d));
    if (seed < path * 0.45) { cull(); return; }

    vec3 p = vec3(w2.x, groundH(w2) + layer * 0.9 * (1.0 - path * 0.7) + vnoise(w2 * 0.35) * 0.6, w2.y);
    p.x += sin(uTime * 1.2 + seed * 40.0 + p.z * 0.3) * 0.025 * layer;
    p.y += uDisperse * layer * 0.15;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    float dist = -mv.z;
    vec4 clip = projectionMatrix * mv;
    float glow = mousePush(clip);
    gl_Position = clip;

    float grow = smoothstep(layer * 0.5, layer * 0.5 + 0.5, uIntro * 1.2);
    float size = (0.2 + aData.w * 0.26) * grow;
    gl_PointSize = min(size * uScale * uPR / max(dist, 0.5), 400.0);

    float n = clamp(vnoise(w2 * 0.18 + 3.0) * 1.15 - 0.05, 0.0, 0.999) * 4.0;
    int i = int(floor(n));
    vColor = mix(uLeaf[i], uLeaf[min(i + 1, 4)], fract(n)) * (0.4 + 0.8 * hash12(vec2(seed * 13.0, layer)));
    vShade = distShade(dist) * mix(0.14, 1.05, layer * layer) * (1.0 - path * 0.5) * (0.6 + 0.8 * vnoise(w2 * 0.45 + 7.0)) * (1.0 + glow * 0.5) * mix(1.0, 0.6, uDisperse);
    vRot = aData.z + sin(uTime * 0.9 + seed * 20.0) * 0.06;
  }
`;

export const leafFragment = /* glsl */ `
  varying vec3 vColor;
  varying float vShade, vRot;

  // one leaf growing out from the sprite centre; returns brightness or -1 outside
  float leaf(vec2 p, float ang) {
    float c = cos(ang), s = sin(ang);
    p = mat2(c, s, -s, c) * p;
    float t = p.y / 0.95;
    if (t < 0.0 || t > 1.0) return -1.0;
    float hw = 0.34 * sin(t * 3.14159) * (1.0 - 0.2 * t) + 0.02;
    if (abs(p.x) > hw) return -1.0;
    float side = p.x / hw;
    float v = 0.35 + 0.6 * t - 0.25 * abs(side) + (side > 0.0 ? 0.1 : -0.05);
    v += abs(p.x) < 0.025 ? 0.15 : 0.0; // midrib
    return clamp(v, 0.0, 1.2);
  }

  void main() {
    vec2 uv = (gl_PointCoord * 2.0 - 1.0) * vec2(1.0, -1.0);
    float s = -1.0;
    for (int i = 0; i < 3; i++) {
      float v = leaf(uv, vRot + float(i) * 2.4);
      if (v >= 0.0) s = v;
    }
    if (s < 0.0) discard;
    gl_FragColor = vec4(vColor * s * vShade, 1.0);
  }
`;

// ------------------------------------------------------------------ flowers

/** position = local point in the tile; aData = (seed, layer, rotation, size) */
export const flowerVertex = /* glsl */ `
  ${common}
  uniform vec3 uPetal[8];
  uniform vec3 uCenter[8];
  uniform float uPetals[8];
  uniform float uSize[8];
  attribute vec4 aData;
  varying vec3 vPetal, vCenter;
  varying float vShade, vRot, vPetals, vDisp;

  // strongest flower patch at w; species = (main, mixed-in)
  float patchMask(vec2 w, out vec2 species) {
    vec2 cell = floor(w / 7.0);
    float best = 0.0;
    species = vec2(0.0);
    for (int j = -1; j <= 1; j++) {
      for (int i = -1; i <= 1; i++) {
        vec2 c = cell + vec2(float(i), float(j));
        vec4 h = hash42(c);
        vec2 ctr = (c + 0.5 + (h.yz - 0.5) * 0.7) * 7.0;
        // the banks either side of the path are in full bloom, framing the view
        float side = smoothstep(2.5, 7.0, abs(ctr.x - pathX(ctr.y)));
        if (h.x < mix(0.22, 0.03, side)) continue; // plain greenery
        float rad = (1.8 + h.w * 3.0) * mix(1.0, 1.45, side);
        vec2 q = (w - ctr) * vec2(1.0, 0.75 + h.y * 0.5);
        float dd = length(q) + (vnoise(w * 0.7 + c) - 0.5) * 2.4 + (vnoise(w * 2.2) - 0.5) * 0.8;
        float m = 1.0 - smoothstep(rad * 0.4, rad, dd);
        if (m > best) {
          best = m;
          float a = floor(hash12(c * 1.7 + 3.1) * 8.0);
          float b = hash12(c * 2.3) > 0.6 ? floor(hash12(c * 4.1 + 1.0) * 8.0) : a;
          species = vec2(a, b);
        }
      }
    }
    return best;
  }

  void main() {
    vec2 w2 = wrapWorld(position.xz);
    float seed = aData.x, layer = aData.y;
    vec2 sp;
    float m = patchMask(w2, sp) * smoothstep(0.4, 1.3, abs(w2.x - pathX(w2.y)));
    if (seed > m * m * 0.95) { cull(); return; }

    int si = int(hash12(vec2(seed * 91.7, aData.z)) < 0.5 ? sp.x : sp.y);
    vPetal = uPetal[si] * (0.8 + 0.4 * hash12(vec2(seed, 7.0)));
    vCenter = uCenter[si];
    vPetals = uPetals[si];

    vec3 p = vec3(w2.x, groundH(w2) + 0.45 + layer * 0.9 + m * 0.5, w2.y);
    p.xz += vec2(sin(uTime * 1.3 + seed * 40.0 + p.z * 0.2), cos(uTime * 1.1 + seed * 23.0)) * 0.035;

    // hover: lift off into floating particles
    vec3 dir = normalize(vec3(fract(seed * 12.9898) - 0.5, fract(seed * 78.233) * 0.9 + 0.3, fract(seed * 37.719) - 0.5));
    p += dir * uDisperse * (1.5 + layer * 3.0)
       + vec3(sin(uTime * 0.5 + seed * 13.0), sin(uTime * 0.6 + seed * 20.0) + 1.5, cos(uTime * 0.45 + seed * 9.0)) * 0.6 * uDisperse;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    float dist = -mv.z;
    vec4 clip = projectionMatrix * mv;
    float glow = mousePush(clip);
    gl_Position = clip;

    float grow = smoothstep(seed * 0.7, seed * 0.7 + 0.3, uIntro);
    float size = (0.08 + aData.w * 0.07) * uSize[si] * grow * mix(1.0, 0.7, uDisperse);
    gl_PointSize = min(size * uScale * uPR / max(dist, 0.5), 400.0);

    vShade = distShade(dist) * (0.55 + 0.5 * layer) * (1.0 + glow * 0.7);
    vRot = aData.z + sin(uTime * 0.7 + seed * 30.0) * 0.1;
    vDisp = uDisperse;
  }
`;

export const flowerFragment = /* glsl */ `
  varying vec3 vPetal, vCenter;
  varying float vShade, vRot, vPetals, vDisp;

  void main() {
    vec2 uv = gl_PointCoord * 2.0 - 1.0;
    float c = cos(vRot), s = sin(vRot);
    uv = mat2(c, -s, s, c) * uv;
    float r = length(uv), a = atan(uv.y, uv.x);
    float k = abs(cos(a * vPetals * 0.5));
    float pr = mix(0.42, 1.0, pow(k, 0.7));
    if (r > mix(pr, 0.6, vDisp)) discard;

    float t = r / pr;
    vec3 col = vPetal * (0.62 + 0.5 * t) * (1.0 - 0.35 * pow(1.0 - k, 3.0));
    if (r < 0.24) col = vCenter * (1.1 - r * 2.0);
    col = mix(col, vPetal * 1.4 + 0.2, vDisp);
    gl_FragColor = vec4(col * (vShade + vDisp * 0.8), 1.0);
  }
`;

// ------------------------------------------------------------------ fireflies

/** position = spot in the firefly box; aData = (seed, blink speed, wander, size) */
export const fireflyVertex = (box: { x: number; y: number; z: number }) => /* glsl */ `
  ${common}
  uniform vec3 uFlyOrigin;
  attribute vec4 aData;
  varying float vLight, vHalo;

  void main() {
    float seed = aData.x;
    vec3 B = vec3(${box.x.toFixed(1)}, ${box.y.toFixed(1)}, ${box.z.toFixed(1)});
    float t = uTime * (0.25 + aData.z * 0.35);

    // lazy looping flight
    vec3 p = position + vec3(
      sin(t + seed * 40.0) * 1.6 + sin(t * 2.3 + seed * 7.0) * 0.4,
      0.0,
      cos(t * 0.8 + seed * 23.0) * 1.6 + cos(t * 1.9 + seed * 3.0) * 0.4
    );
    p.xz = mod(p.xz - uFlyOrigin.xz, B.xz) + uFlyOrigin.xz;
    p.y = groundH(p.xz) + 0.35 + position.y + sin(t * 1.3 + seed * 11.0) * 0.35;
    // drift upward with the flowers during the hover transition
    p.y += uDisperse * (0.6 + seed * 1.2);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    float dist = -mv.z;
    vec4 clip = projectionMatrix * mv;
    mousePush(clip);
    gl_Position = clip;

    // each one pulses on its own rhythm
    float phase = uTime * (0.6 + aData.y * 1.2) + seed * 50.0;
    float blink = pow(max(sin(phase), 0.0), 3.0);
    vLight = (0.2 + 0.8 * blink) * smoothstep(0.4, 1.5, dist) * exp(-max(dist - 8.0, 0.0) * 0.08)
           * smoothstep(0.0, 0.6, uIntro);
    vHalo = blink;

    float size = (0.16 + aData.w * 0.12) * (0.75 + 0.5 * blink);
    gl_PointSize = min(size * uScale * uPR / max(dist, 0.4), 120.0 * uPR);
  }
`;

export const fireflyFragment = /* glsl */ `
  varying float vLight, vHalo;
  void main() {
    float r = length(gl_PointCoord - 0.5) * 2.0;
    if (r > 1.0) discard;
    float core = exp(-r * r * 22.0);
    float halo = exp(-r * r * 3.0) * (0.3 + 0.5 * vHalo);
    vec3 col = vec3(0.8, 1.0, 0.35) * halo + vec3(1.0, 1.0, 0.75) * core * 2.6;
    gl_FragColor = vec4(col * vLight, 1.0);
  }
`;

// ------------------------------------------------------------------ dust

export const dustVertex = (box: number) => /* glsl */ `
  uniform float uTime, uScale, uPR, uDisperse;
  uniform vec3 uCam;
  attribute float aSeed;
  varying float vA;

  void main() {
    float B = ${box.toFixed(1)};
    vec3 p = position + vec3(sin(uTime * 0.1 + aSeed * 30.0) * 2.0, uTime * (0.15 + aSeed * 0.25), cos(uTime * 0.08 + aSeed * 20.0) * 2.0);
    vec3 o = uCam - vec3(B * 0.5, B * 0.6, B);
    p = mod(p - o, vec3(B)) + o;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    float d = -mv.z;
    gl_PointSize = (0.03 + aSeed * 0.04) * uScale * uPR / max(d, 0.5) * (1.0 + uDisperse);
    vA = smoothstep(B, 4.0, d) * smoothstep(0.5, 2.0, d) * (0.25 + 0.25 * sin(uTime * 1.5 + aSeed * 50.0));
  }
`;

export const dustFragment = /* glsl */ `
  varying float vA;
  void main() {
    float r = length(gl_PointCoord - 0.5) * 2.0;
    gl_FragColor = vec4(vec3(1.0, 0.9, 0.7) * exp(-r * r * 4.0) * vA, 1.0);
  }
`;

// ------------------------------------------------------------------ finish pass

export const finishVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

/**
 * Lens: depth-of-field style blur toward the edges and foreground (bokeh-weighted),
 * chromatic fringing where it is blurred, a warm grade, vignette and grain.
 */
export const finishFragment = (taps: number) => /* glsl */ `
  uniform sampler2D tDiffuse;
  uniform vec2 uRes;
  uniform float uTime, uBlur, uSplit, uVig, uCalm;
  varying vec2 vUv;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }

  void main() {
    float aspect = uRes.x / uRes.y;
    vec2 c = vUv - vec2(0.52, 0.52);
    c.x *= aspect;
    c.y *= c.y < 0.0 ? 1.7 : 0.9; // foreground blurs harder than the distance
    float m = smoothstep(0.42, 0.98, length(c));
    m *= m * (3.0 - 2.0 * m);
    m = max(m, uCalm * 0.75);

    float rad = m * uBlur * (1.0 + uVig * 0.6);
    vec2 fringe = (vUv - 0.5) * (uSplit + m * 0.006);
    float spin = hash(vUv * uRes) * 6.2831;

    vec3 acc = vec3(0.0);
    float wsum = 0.0;
    for (int i = 0; i < ${taps}; i++) {
      float fi = float(i);
      float r = sqrt((fi + 0.5) / ${taps.toFixed(1)}) * rad;
      float a = fi * 2.39996 + spin;
      vec2 o = vec2(cos(a), sin(a)) * r / uRes;
      vec3 s = vec3(
        texture2D(tDiffuse, vUv + o + fringe).r,
        texture2D(tDiffuse, vUv + o).g,
        texture2D(tDiffuse, vUv + o - fringe).b
      );
      float w = 1.0 + dot(s, vec3(0.3, 0.59, 0.11)) * 4.0; // bright petals bloom into bokeh
      acc += s * w;
      wsum += w;
    }
    vec3 col = acc / wsum;

    // warm, slightly lifted grade
    col *= vec3(1.06, 1.0, 0.9);
    col = col * 0.97 + 0.004;
    col *= 1.0 - uCalm * 0.4;

    float l = length((vUv - 0.5) * vec2(1.0, 0.9));
    col *= 1.0 - smoothstep(0.3 - uVig * 0.12, 0.9 - uVig * 0.3, l) * 0.8;

    col += (hash(vUv * uRes + floor(uTime * 24.0)) - 0.5) * 0.02;
    gl_FragColor = vec4(max(col, 0.0), 1.0);
  }
`;

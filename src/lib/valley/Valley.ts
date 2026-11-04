import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";

import {
  CAMERA_HEIGHT, DUST_BOX, FIREFLY_BOX, IDLE_DRIFT, IDLE_DRIFT_REDUCED, INTRO_SECONDS, LEAF_GREENS, LOOK_AHEAD,
  SPECIES, TILE, TOUCH_MULTIPLIER, WHEEL_SPEED, getQuality, pathX, type ValleyQuality,
} from "./config";
import {
  dustFragment, dustVertex, finishFragment, fireflyFragment, fireflyVertex, finishVertex, flowerFragment, flowerVertex, leafFragment, leafVertex,
} from "./shaders";

export interface ValleyCallbacks {
  /** First frame rendered: hide the loader. */
  onLoaded?: () => void;
  /** Camera has settled after the intro: reveal the interface. Called once. */
  onIntroDone?: () => void;
}

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const damp = (rate: number, dt: number) => 1 - Math.exp(-dt * rate);
const OFFSCREEN = new THREE.Vector2(9, 9);
const CENTER = new THREE.Vector2(0, 0);
const INTRO_LIFT = 7;

export class Valley {
  private readonly container: HTMLElement;
  private readonly callbacks: ValleyCallbacks;
  private readonly quality: ValleyQuality;
  private readonly reducedMotion: boolean;
  private readonly listeners = new AbortController();

  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene = new THREE.Scene();
  private readonly camera: THREE.PerspectiveCamera;
  private readonly composer: EffectComposer;
  private readonly bloom: UnrealBloomPass;
  private readonly finish: ShaderPass;
  private readonly timer = new THREE.Timer();

  /** Shared by leaves and flowers. */
  private readonly uniforms = {
    uTime: { value: 0 },
    uIntro: { value: 0 },
    uDisperse: { value: 0 },
    uMouse: { value: OFFSCREEN.clone() },
    uAspect: { value: 1 },
    uScale: { value: 1 },
    uPR: { value: 1 },
    uOrigin: { value: new THREE.Vector3() },
    uTile: { value: new THREE.Vector2(TILE.x, TILE.z) },
  };
  private readonly dustUniforms;
  private readonly flyOrigin = new THREE.Vector3();

  // flight state
  private target = 0;
  private distance = 0;
  private speed = 0;
  private hover = 0;
  private hoverTarget = 0;
  private hovering = false;
  private calm = false;
  private calmAmount = 0;
  private introStart = -1;
  private introDone = false;
  private loaded = false;
  private raf = 0;
  private disposed = false;
  private paused = false;

  // pointer state
  private hasMouse = false;
  private touchY: number | null = null;
  private readonly mouse = new THREE.Vector2();
  private readonly mouseSmooth = new THREE.Vector2();
  private readonly tilt = new THREE.Vector2();

  private readonly look = new THREE.Vector3();
  private readonly lookSmooth = new THREE.Vector3();
  private firstFrame = true;

  constructor(container: HTMLElement, callbacks: ValleyCallbacks = {}) {
    this.container = container;
    this.callbacks = callbacks;
    this.quality = getQuality();
    this.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    this.renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: "high-performance" });
    this.renderer.setPixelRatio(this.quality.pixelRatio);
    this.renderer.setClearColor(0x000000, 1);
    Object.assign(this.renderer.domElement.style, { display: "block", width: "100%", height: "100%" });
    container.appendChild(this.renderer.domElement);
    this.uniforms.uPR.value = this.quality.pixelRatio;

    this.camera = new THREE.PerspectiveCamera(this.quality.fov, 1, 0.05, 120);

    this.scene.add(this.buildLeaves());
    this.scene.add(this.buildFlowers());
    this.dustUniforms = {
      uTime: this.uniforms.uTime,
      uScale: this.uniforms.uScale,
      uPR: this.uniforms.uPR,
      uDisperse: this.uniforms.uDisperse,
      uCam: { value: new THREE.Vector3() },
    };
    this.scene.add(this.buildDust());
    this.scene.add(this.buildFireflies());

    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));
    this.bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.22, 0.6, 0.55);
    this.composer.addPass(this.bloom);
    this.finish = new ShaderPass({
      uniforms: {
        tDiffuse: { value: null },
        uRes: { value: new THREE.Vector2(1, 1) },
        uTime: { value: 0 },
        uBlur: { value: 14 },
        uSplit: { value: 0.0015 },
        uVig: { value: 0 },
        uCalm: { value: 0 },
      },
      vertexShader: finishVertex,
      fragmentShader: finishFragment(this.quality.blurTaps),
    });
    this.composer.addPass(this.finish);
    this.composer.addPass(new OutputPass());

    this.timer.connect(document); // pauses delta while the tab is hidden
    this.resize();
    this.bindEvents();
    this.raf = requestAnimationFrame(this.frame);
  }

  /** Ease the flight to a stop and lift the flowers into floating particles. */
  startHoverTransition() {
    this.hovering = true;
    this.syncHover();
  }

  /** Reverse the hover transition (unless calm mode is holding it). */
  stopHoverTransition() {
    this.hovering = false;
    this.syncHover();
  }

  /**
   * Calm mode, for pages that sit over the valley: flowers float as particles,
   * the whole view softens and darkens so content on top stays readable.
   */
  setCalm(on: boolean) {
    this.calm = on;
    this.syncHover();
  }

  /** Stop drawing while a page fully covers the valley (saves GPU and battery). */
  setPaused(on: boolean) {
    this.paused = on;
  }

  private syncHover() {
    this.hoverTarget = this.hovering || this.calm ? 1 : 0;
  }

  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    this.listeners.abort();
    this.timer.dispose();

    this.scene.traverse((obj) => {
      const o = obj as THREE.Points;
      o.geometry?.dispose();
      const mats = Array.isArray(o.material) ? o.material : o.material ? [o.material] : [];
      mats.forEach((m) => m.dispose());
    });
    this.composer.dispose();
    this.bloom.dispose();
    this.renderer.dispose();
    this.renderer.forceContextLoss();
    this.renderer.domElement.remove();
  }

  // ---------------------------------------------------------------- build

  /** Random points across the wrapping tile; the shaders place and colour them in world space. */
  private tilePoints(count: number) {
    const pos = new Float32Array(count * 3);
    const data = new Float32Array(count * 4);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = Math.random() * TILE.x;
      pos[i * 3 + 2] = Math.random() * TILE.z;
      // seed, layer (0 = bottom of the canopy), rotation, size
      data.set([Math.random(), Math.random(), Math.random() * Math.PI * 2, Math.random()], i * 4);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("aData", new THREE.BufferAttribute(data, 4));
    return geo;
  }

  private buildLeaves() {
    const material = new THREE.ShaderMaterial({
      uniforms: { ...this.uniforms, uLeaf: { value: LEAF_GREENS.map((c) => new THREE.Color(c)) } },
      vertexShader: leafVertex,
      fragmentShader: leafFragment,
    });
    const points = new THREE.Points(this.tilePoints(this.quality.leaves), material);
    points.frustumCulled = false;
    return points;
  }

  private buildFlowers() {
    const material = new THREE.ShaderMaterial({
      uniforms: {
        ...this.uniforms,
        uPetal: { value: SPECIES.map((s) => new THREE.Color(s.petal)) },
        uCenter: { value: SPECIES.map((s) => new THREE.Color(s.center)) },
        uPetals: { value: SPECIES.map((s) => s.petals) },
        uSize: { value: SPECIES.map((s) => s.size) },
      },
      vertexShader: flowerVertex,
      fragmentShader: flowerFragment,
    });
    const points = new THREE.Points(this.tilePoints(this.quality.flowers), material);
    points.frustumCulled = false;
    points.renderOrder = 1;
    return points;
  }

  private buildFireflies() {
    const count = this.quality.fireflies;
    const pos = new Float32Array(count * 3);
    const data = new Float32Array(count * 4);
    for (let i = 0; i < count; i++) {
      pos.set([Math.random() * FIREFLY_BOX.x, Math.random() * FIREFLY_BOX.y, Math.random() * FIREFLY_BOX.z], i * 3);
      // seed, blink speed, wander speed, size
      data.set([Math.random(), Math.random(), Math.random(), Math.random()], i * 4);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("aData", new THREE.BufferAttribute(data, 4));
    const fireflies = new THREE.Points(geo, new THREE.ShaderMaterial({
      uniforms: { ...this.uniforms, uFlyOrigin: { value: this.flyOrigin } },
      vertexShader: fireflyVertex(FIREFLY_BOX),
      fragmentShader: fireflyFragment,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }));
    fireflies.frustumCulled = false;
    fireflies.renderOrder = 3;
    return fireflies;
  }

  private buildDust() {
    const count = this.quality.dust;
    const pos = new Float32Array(count * 3);
    const seed = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos.set([Math.random() * DUST_BOX, Math.random() * DUST_BOX, Math.random() * DUST_BOX], i * 3);
      seed[i] = Math.random();
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
    const dust = new THREE.Points(geo, new THREE.ShaderMaterial({
      uniforms: this.dustUniforms,
      vertexShader: dustVertex(DUST_BOX),
      fragmentShader: dustFragment,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }));
    dust.frustumCulled = false;
    dust.renderOrder = 2;
    return dust;
  }

  // ---------------------------------------------------------------- input

  private bindEvents() {
    const signal = this.listeners.signal;
    const opts = { passive: true, signal };

    window.addEventListener("resize", this.resize, { signal });
    window.addEventListener("wheel", (e) => {
      this.target += e.deltaY * (e.deltaMode === 1 ? 16 : 1) * WHEEL_SPEED;
    }, opts);
    window.addEventListener("touchstart", (e) => { this.touchY = e.touches[0].clientY; }, opts);
    window.addEventListener("touchmove", (e) => {
      const y = e.touches[0].clientY;
      if (this.touchY !== null) this.target += (this.touchY - y) * WHEEL_SPEED * TOUCH_MULTIPLIER;
      this.touchY = y;
    }, opts);
    window.addEventListener("touchend", () => { this.touchY = null; }, opts);
    window.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown" || e.key === "PageDown") this.target += 4;
      if (e.key === "ArrowUp" || e.key === "PageUp") this.target -= 4;
    }, { signal });
    window.addEventListener("pointermove", (e) => {
      if (e.pointerType !== "mouse") return;
      this.hasMouse = true;
      this.mouse.set((e.clientX / innerWidth) * 2 - 1, -((e.clientY / innerHeight) * 2 - 1));
    }, opts);
    document.addEventListener("pointerleave", () => { this.hasMouse = false; }, { signal });
  }

  private resize = () => {
    const w = this.container.clientWidth || innerWidth;
    const h = this.container.clientHeight || innerHeight;
    this.renderer.setSize(w, h, false);
    this.composer.setSize(w, h);
    this.bloom.setSize(w, h);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.uniforms.uAspect.value = w / h;
    // pixels per world unit at distance 1, so point sizes are in world units
    this.uniforms.uScale.value = h / (2 * Math.tan(THREE.MathUtils.degToRad(this.camera.fov) / 2));
    const pr = this.renderer.getPixelRatio();
    this.finish.uniforms.uRes.value.set(w * pr, h * pr);
    this.finish.uniforms.uBlur.value = h * pr * 0.022;
  };

  // ---------------------------------------------------------------- loop

  private frame = (timestamp: number) => {
    if (this.disposed) return;
    this.timer.update(timestamp);
    if (this.paused && this.loaded) {
      this.raf = requestAnimationFrame(this.frame);
      return;
    }
    const dt = Math.min(this.timer.getDelta(), 0.05);
    const t = this.timer.getElapsed();
    const u = this.uniforms;
    u.uTime.value = t;
    this.finish.uniforms.uTime.value = t;

    // hover transition
    this.hover += (this.hoverTarget - this.hover) * damp(2.2, dt);
    const hover = easeInOut(THREE.MathUtils.clamp(this.hover, 0, 1));
    u.uDisperse.value = hover;
    this.calmAmount += ((this.calm ? 1 : 0) - this.calmAmount) * damp(1.6, dt);
    this.finish.uniforms.uCalm.value = easeInOut(THREE.MathUtils.clamp(this.calmAmount, 0, 1));

    // intro: descend from above while the garden grows in
    let intro = 0;
    let lift = INTRO_LIFT;
    if (this.introStart >= 0) {
      intro = Math.min((t - this.introStart) / INTRO_SECONDS, 1);
      lift = (1 - easeInOut(intro)) * INTRO_LIFT;
      if (intro >= 1 && !this.introDone) {
        this.introDone = true;
        this.callbacks.onIntroDone?.();
      }
    }
    u.uIntro.value = Math.min(intro * 1.25, 1);

    // flight down the valley: idle drift + virtual scroll, braked by hover
    const flying = 1 - hover;
    const drift = this.reducedMotion ? IDLE_DRIFT_REDUCED : IDLE_DRIFT;
    this.target += dt * drift * flying * intro;
    this.target -= (this.target - this.distance) * hover * Math.min(dt * 3, 1);
    const prev = this.distance;
    this.distance += (this.target - this.distance) * damp(2.4, dt) * flying;
    const speed = Math.abs(this.distance - prev) / Math.max(dt, 1e-4);
    this.speed += (speed - this.speed) * damp(4, dt);
    const fast = THREE.MathUtils.clamp((this.speed - 1) / 10, 0, 1);
    this.finish.uniforms.uVig.value = fast;
    this.finish.uniforms.uSplit.value = 0.0015 + fast * 0.006 + hover * 0.002;

    // mouse: smoothed push target and a slight camera tilt
    const mouseGoal = this.hasMouse ? this.mouse : CENTER;
    this.mouseSmooth.lerp(mouseGoal, damp(5, dt));
    u.uMouse.value.copy(this.hasMouse ? this.mouseSmooth : OFFSCREEN);
    this.tilt.lerp(mouseGoal, damp(2, dt));

    const z = -this.distance;
    const lz = z - LOOK_AHEAD;
    this.camera.position.set(pathX(z) + this.tilt.x * 0.25, CAMERA_HEIGHT + lift, z);
    this.look.set(pathX(lz) + this.tilt.x * 1.2, 0.6 + this.tilt.y * 0.8, lz);
    if (this.firstFrame) this.lookSmooth.copy(this.look);
    else this.lookSmooth.lerp(this.look, damp(6, dt));
    this.firstFrame = false;
    this.camera.lookAt(this.lookSmooth);

    // keep the garden tile wrapped around the camera
    u.uOrigin.value.set(this.camera.position.x - TILE.x / 2, 0, z - TILE.ahead);
    this.dustUniforms.uCam.value.copy(this.camera.position);
    this.flyOrigin.set(this.camera.position.x - FIREFLY_BOX.x / 2, 0, z - FIREFLY_BOX.ahead);

    this.composer.render(dt);

    if (!this.loaded) {
      this.loaded = true;
      this.callbacks.onLoaded?.();
      this.introStart = t + 0.3;
    }
    this.raf = requestAnimationFrame(this.frame);
  };
}

"use client";
import { useEffect, useRef, type RefObject } from "react";
import Placeholder from "@/components/ui/Placeholder";
import { INK_MAX } from "./stages";

/*
 * `.marquee-canvas`: the image window that grows to full screen and then dissolves like ink.
 * Implementation: plain WebGL (no three.js) full-screen quad running the reference fragment shader verbatim
 * (random / value noise / 5-octave fbm, smoothstep threshold). The canvas is viewport-sized and centred in the
 * card, so the growing card is a window onto a fixed picture. While no client image exists the shader samples a
 * flat placeholder colour (CSS var --placeholder) instead of the texture; pass `src` to switch to a cover-fit texture.
 * Fallback without WebGL: the <Placeholder> fades with the mean alpha of the shader, 1 - smoothstep(0,1,1.2u - .5).
 */

const VERT = `attribute vec2 aPos; void main(){ gl_Position = vec4(aPos, 0.0, 1.0); }`;

const FRAG = `
precision highp float;
uniform sampler2D uTexture;
uniform vec2 uResolution;
uniform vec2 uTexSize;
uniform float uTime;
uniform float uProgress;
uniform float uHasTex;
uniform vec3 uColor;

float random(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
float noise(vec2 p) {
  vec2 i = floor(p); vec2 f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);
  float a = random(i); float b = random(i + vec2(1.0, 0.0));
  float c = random(i + vec2(0.0, 1.0)); float d = random(i + vec2(1.0, 1.0));
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}
float fbm(vec2 p) {
  float value = 0.0; float amplitude = 0.5;
  for (int i = 0; i < 5; i++) { value += amplitude * noise(p); p *= 2.0; amplitude *= 0.5; }
  return value;
}
void main() {
  vec2 frag = gl_FragCoord.xy;
  vec2 texSize = max(uTexSize, vec2(1.0));
  float scale = max(uResolution.x / texSize.x, uResolution.y / texSize.y);
  vec2 scaledTex = texSize * scale;
  vec2 offset = (scaledTex - uResolution) * 0.5;
  vec2 texUV = (frag + offset) / scaledTex;
  texUV.y = 1.0 - texUV.y;

  vec2 uv = frag / uResolution.xy;
  vec2 noiseUV = uv * vec2(uResolution.x / uResolution.y, 1.0);
  float ink = fbm(noiseUV * 2.0 + uTime * 0.16);
  float threshold = smoothstep(0.0, 1.0, ink - (1.0 - uProgress * 1.2));
  float alpha = 1.0 - threshold;

  vec4 color = uHasTex > 0.5 ? texture2D(uTexture, texUV) : vec4(uColor, 1.0);
  float a = color.a * alpha;
  gl_FragColor = vec4(color.rgb * a, a); // premultiplied (canvas default)
}`;

function parseColor(css: string): [number, number, number] {
  const hex = css.trim().replace("#", "");
  if (/^[0-9a-f]{6}$/i.test(hex)) {
    return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255) as [number, number, number];
  }
  return [216 / 255, 209 / 255, 194 / 255]; // #d8d1c2
}

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type);
  if (!s) throw new Error("createShader failed");
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? "shader compile failed");
  return s;
}

export default function InkDissolveCard({
  progressRef,
  src,
  slot,
  reduced,
}: {
  /** shader uProgress 0..1.5 written by the scroll timeline */
  progressRef: RefObject<number>;
  src: string | null;
  slot: string;
  reduced: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fallbackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    const canvas = canvasRef.current;
    const fallback = fallbackRef.current;
    if (!card || !canvas || !fallback) return;

    let raf = 0;
    let running = false;
    const start = (loop: (t: number) => void) => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const gl = canvas.getContext("webgl", { alpha: true, antialias: false, premultipliedAlpha: true, powerPreference: "default" });
    let cleanupGl = () => {};
    let frame: (t: number) => void;

    if (!gl) {
      // CSS fallback: placeholder opacity follows the shader's mean alpha
      canvas.style.display = "none";
      frame = () => {
        const u = Math.min(INK_MAX, progressRef.current ?? 0);
        const x = Math.min(1, Math.max(0, 1.2 * u - 0.5));
        fallback.style.opacity = String(1 - x * x * (3 - 2 * x));
        if (running) raf = requestAnimationFrame(frame);
      };
    } else {
      let program: WebGLProgram | null = null;
      try {
        program = gl.createProgram();
        if (!program) throw new Error("createProgram failed");
        gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERT));
        gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FRAG));
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program) ?? "link failed");
      } catch (err) {
        console.error("InkDissolveCard: WebGL initialization failed.", err);
        canvas.style.display = "none";
        return;
      }
      gl.useProgram(program);
      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
      const aPos = gl.getAttribLocation(program, "aPos");
      gl.enableVertexAttribArray(aPos);
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

      const u = (n: string) => gl.getUniformLocation(program, n);
      const uRes = u("uResolution"), uTex = u("uTexSize"), uTime = u("uTime"), uProg = u("uProgress"), uHas = u("uHasTex"), uCol = u("uColor");
      gl.uniform1i(u("uTexture"), 0);
      gl.uniform2f(uTex, 1, 1);
      gl.uniform1f(uHas, 0);
      gl.uniform3fv(uCol, parseColor(getComputedStyle(document.documentElement).getPropertyValue("--placeholder")));

      let texture: WebGLTexture | null = null;
      if (src) {
        const img = new Image();
        img.decoding = "async";
        img.onload = () => {
          texture = gl.createTexture();
          gl.activeTexture(gl.TEXTURE0);
          gl.bindTexture(gl.TEXTURE_2D, texture);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
          gl.uniform2f(uTex, img.naturalWidth, img.naturalHeight);
          gl.uniform1f(uHas, 1);
        };
        img.src = src;
      }

      const resize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
        canvas.width = Math.max(1, Math.round(window.innerWidth * dpr));
        canvas.height = Math.max(1, Math.round(window.innerHeight * dpr));
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.uniform2f(uRes, canvas.width, canvas.height);
      };
      resize();
      window.addEventListener("resize", resize);
      fallback.style.visibility = "hidden"; // canvas now paints the blank card

      frame = (t: number) => {
        gl.uniform1f(uTime, reduced ? 0 : t * 0.001);
        gl.uniform1f(uProg, progressRef.current ?? 0);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        if (running) raf = requestAnimationFrame(frame);
      };
      frame(0);

      cleanupGl = () => {
        window.removeEventListener("resize", resize);
        if (texture) gl.deleteTexture(texture);
        gl.deleteBuffer(buf);
        gl.deleteProgram(program);
      };
    }

    // only animate while the section is on screen (the reference renders every frame forever)
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start(frame) : stop()), { rootMargin: "100px 0px" });
    io.observe(card.closest("section") ?? card);

    return () => {
      io.disconnect();
      stop();
      cleanupGl();
      fallback.style.visibility = "";
      fallback.style.opacity = "";
      canvas.style.display = "";
    };
  }, [progressRef, src, reduced]);

  return (
    <div
      ref={cardRef}
      className="marquee-canvas pointer-events-none absolute left-1/2 top-1/2 z-40 h-[28vh] w-[min(70vw,18rem)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-sm lg:h-[38vh] lg:w-[min(72vw,24rem)] ls:h-[45vh] ls:w-[72vh]"
      aria-hidden="true"
    >
      <div ref={fallbackRef} className="absolute left-1/2 top-1/2 h-screen w-screen -translate-x-1/2 -translate-y-1/2">
        <Placeholder slot={slot} tone="light" />
      </div>
      <canvas
        ref={canvasRef}
        className="absolute left-1/2 top-1/2 block h-screen w-screen -translate-x-1/2 -translate-y-1/2"
      />
    </div>
  );
}

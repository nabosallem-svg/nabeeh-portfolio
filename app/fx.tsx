'use client';

import { Fragment, useEffect, useRef, useState } from 'react';

const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// /* ★ INTRO — boot sequence shown when the site opens ★ */
const BOOT = [
  '> initializing recon module...',
  '> subfinder -d nabeeh.dev',
  '> httpx -probe  [200]  [200]  [302]',
  '> nuclei -severity critical,high',
  '> loading portfolio assets...',
  '> ACCESS GRANTED',
];

export function Intro({ onDone }: { onDone: () => void }) {
  const [lines, setLines] = useState(0);
  const barRef = useRef<HTMLElement>(null);
  const pctRef = useRef<HTMLDivElement>(null);
  const [leaving, setLeaving] = useState(false);
  const doneRef = useRef(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    setLeaving(true);
    setTimeout(onDone, 900);
  };

  useEffect(() => {
    if (reduced()) {
      doneRef.current = true;
      onDone();
      return;
    }
    document.documentElement.classList.add('booting');
    const t0 = performance.now();
    const DURATION = 2600;
    let raf = 0;
    const tick = (now: number) => {
      const k = Math.min(1, (now - t0) / DURATION);
      // bar and percentage are written directly; React only re-renders when a log line appears
      const pct = Math.round((1 - Math.pow(1 - k, 2)) * 100);
      if (barRef.current) barRef.current.style.transform = `scaleX(${pct / 100})`;
      if (pctRef.current) pctRef.current.textContent = `${String(pct).padStart(3, '0')}%`;
      setLines(Math.min(BOOT.length, Math.floor(k * (BOOT.length + 0.6))));
      if (k < 1) raf = requestAnimationFrame(tick);
      else setTimeout(finish, 350);
    };
    raf = requestAnimationFrame(tick);

    // matrix rain behind the boot log
    const c = canvasRef.current;
    const ctx = c?.getContext('2d');
    let rain = 0;
    if (c && ctx) {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      c.width = innerWidth * dpr;
      c.height = innerHeight * dpr;
      ctx.scale(dpr, dpr);
      const size = 16;
      const cols = Math.ceil(innerWidth / size);
      const drops = Array.from({ length: cols }, () => Math.random() * -40);
      const chars = '01アイウエオカキクケコサシスセソ<>/{}[]#$%NABEEH';
      const draw = () => {
        ctx.fillStyle = 'rgba(5,6,9,0.14)';
        ctx.fillRect(0, 0, innerWidth, innerHeight);
        ctx.font = `${size - 2}px ui-monospace, monospace`;
        for (let i = 0; i < cols; i++) {
          const y = drops[i] * size;
          ctx.fillStyle = Math.random() > 0.975 ? '#fff' : 'rgba(255,59,92,0.75)';
          ctx.fillText(chars[(Math.random() * chars.length) | 0], i * size, y);
          if (y > innerHeight && Math.random() > 0.975) drops[i] = 0;
          drops[i] += 1;
        }
        rain = requestAnimationFrame(draw);
      };
      rain = requestAnimationFrame(draw);
    }
    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(rain);
      document.documentElement.classList.remove('booting');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={leaving ? 'intro leaving' : 'intro'} onClick={finish} aria-hidden="true">
      <canvas ref={canvasRef} className="intro-rain" />
      <div className="intro-panel top" />
      <div className="intro-panel bottom" />
      <div className="intro-center">
        <div className="intro-logo" data-text="NABEEH">
          NABEEH
        </div>
        <div className="intro-sub">RED TEAMING · BUG HUNTING</div>
        <pre className="intro-log">
          {BOOT.slice(0, lines).map((l, i) => (
            <span key={i} className={i === BOOT.length - 1 ? 'ok' : undefined}>
              {l}
              {'\n'}
            </span>
          ))}
          <span className="intro-caret" />
        </pre>
        <div className="intro-bar">
          <i ref={barRef} style={{ transform: 'scaleX(0)' }} />
        </div>
        <div className="intro-pct" ref={pctRef}>
          000%
        </div>
      </div>
      <button
        type="button"
        className="intro-skip"
        onClick={(e) => {
          e.stopPropagation();
          finish();
        }}
      >
        Skip ›
      </button>
    </div>
  );
}

// /* ★ NETWORK OF NODES IN THE BACKGROUND — reacts to the cursor ★ */
export function ParticleField() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (reduced()) return;
    const c = ref.current!;
    const ctx = c.getContext('2d')!;
    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const mouse = { x: -999, y: -999 };
    type P = { x: number; y: number; vx: number; vy: number };
    let pts: P[] = [];
    const resize = () => {
      w = innerWidth;
      h = innerHeight;
      c.width = w * dpr;
      c.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.min(90, Math.floor((w * h) / 16000));
      pts = Array.from({ length: n }, () => ({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35 }));
    };
    resize();
    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    let raf = 0;
    const readAccent = () => getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#FF3B5C';
    let accent = readAccent();
    const themeObs = new MutationObserver(() => {
      accent = readAccent();
    });
    themeObs.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme', 'style'] });
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of pts) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const d = Math.hypot(dx, dy);
        if (d < 130) {
          p.x += (dx / d) * 1.2;
          p.y += (dy / d) * 1.2;
        }
      }
      ctx.strokeStyle = accent;
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const a = pts[i];
          const b = pts[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 130) {
            ctx.globalAlpha = (1 - d / 130) * 0.22;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
        const m = Math.hypot(pts[i].x - mouse.x, pts[i].y - mouse.y);
        if (m < 180) {
          ctx.globalAlpha = (1 - m / 180) * 0.5;
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }
      ctx.fillStyle = accent;
      for (const p of pts) {
        ctx.globalAlpha = 0.55;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      themeObs.disconnect();
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
    };
  }, []);
  return <canvas ref={ref} className="particles" aria-hidden="true" />;
}

// /* ★ CUSTOM CURSOR — dot + trailing ring that grows over links and cards ★ */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (reduced() || !window.matchMedia('(pointer: fine)').matches) return;
    document.documentElement.classList.add('has-cursor');
    let x = innerWidth / 2;
    let y = innerHeight / 2;
    let rx = x;
    let ry = y;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      const t = e.target as Element | null;
      ring.current?.classList.toggle('hover', !!t?.closest('a,button,[role="button"],input,textarea,.project'));
      if (!raf) raf = requestAnimationFrame(loop);
    };
    const onDown = () => ring.current?.classList.add('down');
    const onUp = () => ring.current?.classList.remove('down');
    const loop = () => {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      if (dot.current) dot.current.style.transform = `translate(${x}px,${y}px)`;
      if (ring.current) ring.current.style.transform = `translate(${rx}px,${ry}px)`;
      // stop once the ring has caught up; the next pointer move restarts it
      raf = Math.abs(x - rx) + Math.abs(y - ry) > 0.2 ? requestAnimationFrame(loop) : 0;
    };
    raf = requestAnimationFrame(loop);
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove('has-cursor');
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
    };
  }, []);
  return (
    <>
      <div ref={ring} className="cursor-ring" aria-hidden="true" />
      <div ref={dot} className="cursor-dot" aria-hidden="true" />
    </>
  );
}

// /* ★ MAGNETIC BUTTONS + SCROLL PARALLAX ★ */
export function useMotion(deps: unknown[] = []) {
  useEffect(() => {
    if (reduced()) return;
    const els = Array.from(document.querySelectorAll<HTMLElement>('.btn-primary,.btn-ghost,.cta-min,.chip,.theme-toggle,.btn-submit'));
    const handlers = els.map((el) => {
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        el.style.translate = `${dx * 0.25}px ${dy * 0.35}px`;
      };
      const leave = () => {
        el.style.translate = '';
      };
      el.addEventListener('pointermove', move);
      el.addEventListener('pointerleave', leave);
      return () => {
        el.removeEventListener('pointermove', move);
        el.removeEventListener('pointerleave', leave);
      };
    });
    // parallax: set --sy only on the layers that use it, once per frame
    const layers = Array.from(document.querySelectorAll<HTMLElement>('.radar,.orb-a,.orb-b'));
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const sy = String(window.scrollY);
        for (const el of layers) el.style.setProperty('--sy', sy);
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      handlers.forEach((off) => off());
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

// /* ★ SPLIT TEXT — each word rises in when its section scrolls into view ★ */
export function Words({ text, base = 0 }: { text: string; base?: number }) {
  return (
    <span className="words" aria-label={text}>
      {text.split(' ').map((w, i) => (
        <Fragment key={i}>
          {i > 0 && ' '}
          <span className="word" aria-hidden="true">
            <span style={{ '--w': `${base + i * 0.06}s` } as React.CSSProperties}>{w}</span>
          </span>
        </Fragment>
      ))}
    </span>
  );
}

// /* ★ SKILLS TICKER — endless marquee of the same skill names ★ */
export function Marquee({ items }: { items: string[] }) {
  const row = items.map((t, i) => (
    <span key={i}>
      {t}
      <i>✦</i>
    </span>
  ));
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {row}
        {row}
      </div>
    </div>
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  Download,
  Code2,
  ExternalLink,
  Mail,
  MapPin,
  Send,
  CheckCircle2,
  GraduationCap,
  Briefcase,
  X,
  Play,
  Moon,
  Sun,
} from 'lucide-react';
import { groups, projects, type Project, type ProjectGroup } from './projects';
import { Intro, ParticleField, Cursor, useMotion, Words, Marquee } from './fx';
const Github = Code2;

// === SKILLS (static) ===
const skills = [
  { label: 'Programming', items: ['C++', 'Python', 'Java', 'Bash'] },
  { label: 'Development', items: ['Next.js', 'FastAPI', 'Qt Creator'] },
  { label: 'AI & Data', items: ['Machine Learning', 'Computer Vision', 'YOLO', 'OpenCV'] },
  { label: 'Cybersecurity & QA', items: ['Nmap', 'Burp Suite', 'Penetration Testing', 'Manual Testing', 'ISTQB'] },
];

const GLYPHS = '!<>-_\\/[]{}—=+*^?#01ABCDEFX';

// /* ★ "DECRYPT" EFFECT — text starts scrambled and resolves to the real words ★ */
function Scramble({ text, delay = 0 }: { text: string; delay?: number }) {
  const [out, setOut] = useState(text);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let frame = 0;
    let raf = 0;
    const total = 26 + text.length;
    const start = performance.now() + delay;
    const tick = (now: number) => {
      if (now < start) {
        setOut(text.replace(/\S/g, () => GLYPHS[(Math.random() * GLYPHS.length) | 0]));
        raf = requestAnimationFrame(tick);
        return;
      }
      frame++;
      const revealed = Math.floor((frame / total) * text.length * 1.4);
      setOut(
        text
          .split('')
          .map((c, i) => (c === ' ' || i < revealed ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0]))
          .join(''),
      );
      if (revealed < text.length) raf = requestAnimationFrame(tick);
      else setOut(text);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text, delay]);
  return (
    <span aria-label={text} className="scramble">
      <span aria-hidden="true">{out}</span>
    </span>
  );
}

// /* ★ CURSOR SPOTLIGHT + SUBTLE TILT FOR CARDS ★ */
function onCardMove(e: React.PointerEvent<HTMLElement>) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  const x = e.clientX - r.left;
  const y = e.clientY - r.top;
  el.style.setProperty('--x', `${x}px`);
  el.style.setProperty('--y', `${y}px`);
  el.style.setProperty('--rx', `${((y / r.height) - 0.5) * -4}deg`);
  el.style.setProperty('--ry', `${((x / r.width) - 0.5) * 4}deg`);
}
function onCardLeave(e: React.PointerEvent<HTMLElement>) {
  e.currentTarget.style.setProperty('--rx', '0deg');
  e.currentTarget.style.setProperty('--ry', '0deg');
}

// /* ★ TERMINAL — replays a real recorded run line by line ★ */
function Terminal({ text }: { text: string }) {
  const lines = text.split('\n');
  const [n, setN] = useState(1);
  const [run, setRun] = useState(0);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setN(lines.length);
      return;
    }
    setN(1);
    const t = setInterval(() => setN((v) => Math.min(v + 1, lines.length)), 70);
    return () => clearInterval(t);
  }, [text, run, lines.length]);
  const bodyRef = useRef<HTMLPreElement>(null);
  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight });
  }, [n]);
  return (
    <div className="term">
      <div className="term-bar">
        <i />
        <i />
        <i />
        <span>Output — real run</span>
        <button type="button" onClick={() => setRun((r) => r + 1)} aria-label="Replay output">
          ↻ Replay
        </button>
      </div>
      <pre ref={bodyRef}>
        {lines.slice(0, n).map((l, i) => (
          <span key={i} className={l.startsWith('$ ') ? 'term-cmd' : undefined}>
            {l}
            {'\n'}
          </span>
        ))}
        {n < lines.length && <span className="art-caret" />}
      </pre>
    </div>
  );
}

// /* ★ PLACEHOLDER ART FOR PROJECTS WITHOUT A SCREENSHOT ★ */
function ProjectArt({ p }: { p: Project }) {
  if (p.image) return <img src={p.image} alt={p.title} loading="lazy" />;
  return (
    <div className={`art art-${p.group}`} aria-hidden="true">
      <div className="art-bar">
        <i />
        <i />
        <i />
        <span>{p.github ? p.github.replace('https://github.com/', '') : p.title}</span>
      </div>
      <div className="art-body">
        <span className="art-prompt">$</span> {p.tech.join(' · ')}
        <span className="art-caret" />
      </div>
      <div className="art-big">{p.id}</div>
    </div>
  );
}

export default function Home() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [selected, setSelected] = useState<Project | null>(null);
  const [filter, setFilter] = useState<'all' | ProjectGroup>('all');
  const [active, setActive] = useState('home');
  const [booted, setBooted] = useState(false);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const init = saved ?? (prefersDark ? 'dark' : 'light');
    setTheme(init);
    document.documentElement.classList.toggle('dark', init === 'dark');
    setMounted(true);
  }, []);
  useEffect(() => {
    if (!mounted) return;
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme, mounted]);
  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('theme', next);
  }

  // /* ★ SCROLL PROGRESS + BACKGROUND GLOW FOLLOWS CURSOR ★ */
  useEffect(() => {
    const root = document.documentElement;
    const bar = document.querySelector<HTMLElement>('.progress');
    // one update per frame, written to the elements that use it (not :root)
    let scrollRaf = 0;
    let scrolled = false;
    const onScroll = () => {
      if (scrollRaf) return;
      scrollRaf = requestAnimationFrame(() => {
        scrollRaf = 0;
        const max = root.scrollHeight - root.clientHeight;
        bar?.style.setProperty('--progress', String(max > 0 ? root.scrollTop / max : 0));
        if (scrolled !== root.scrollTop > 8) {
          scrolled = !scrolled;
          root.classList.toggle('scrolled', scrolled);
        }
      });
    };
    let mx = 0;
    let my = 0;
    let moveRaf = 0;
    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (moveRaf) return;
      moveRaf = requestAnimationFrame(() => {
        moveRaf = 0;
        bgRef.current?.style.setProperty('--mx', `${mx}px`);
        bgRef.current?.style.setProperty('--my', `${my}px`);
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      cancelAnimationFrame(scrollRaf);
      cancelAnimationFrame(moveRaf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onMove);
    };
  }, []);

  // /* ★ ACTIVE NAV LINK FOLLOWS THE SECTION ON SCREEN ★ */
  useEffect(() => {
    const ids = ['home', 'about', 'projects', 'contact'];
    const o = new IntersectionObserver(
      (entries) => entries.forEach((en) => en.isIntersecting && setActive(en.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) o.observe(el);
    });
    return () => o.disconnect();
  }, []);

  // /* ★ REVEAL ON SCROLL ★ */
  useEffect(() => {
    const o = new IntersectionObserver(
      (entries) =>
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add('visible');
            o.unobserve(en.target);
          }
        }),
      { threshold: 0.12 },
    );
    document.querySelectorAll('.reveal:not(.visible)').forEach((el) => o.observe(el));
    return () => o.disconnect();
  }, [filter]);

  // /* ★ CLOSE ON ESCAPE + LOCK SCROLL ★ */
  useEffect(() => {
    if (selected) {
      document.body.style.overflow = 'hidden';
      const onEsc = (e: KeyboardEvent) => e.key === 'Escape' && setSelected(null);
      window.addEventListener('keydown', onEsc);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', onEsc);
      };
    } else document.body.style.overflow = '';
  }, [selected]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    const subject = `Portfolio Contact from ${form.name}`;
    const body = `Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`;
    const mailto = `mailto:nabosallem@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    // يفتح برنامج الإيميل مباشرة
    window.location.href = mailto;
    // يبعت مباشرة لـ Gmail عبر FormSubmit (أول مرة هيجيلك إيميل تأكيد دوس Confirm وبعدها يوصلك علطول)
    fetch('https://formsubmit.co/ajax/nabosallem@gmail.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ name: form.name, email: form.email, message: form.message, _subject: subject, _captcha: 'false' }),
    }).catch(() => {});
    setSent(true);
    setTimeout(() => setSent(false), 3000);
    setForm({ name: '', email: '', message: '' });
  }

  useMotion([filter, booted, selected]);

  const shown = projects.filter((p) => filter === 'all' || p.group === filter);

  return (
    <main>
      {/* ——— Animated background ——— */}
      {!booted && <Intro onDone={() => setBooted(true)} />}
      <Cursor />
      <div className="bg" ref={bgRef} aria-hidden="true">
        <div className="bg-grid" />
        <ParticleField />
        <div className="bg-orb orb-a" />
        <div className="bg-orb orb-b" />
        <div className="bg-spot" />
      </div>
      <div className="progress" aria-hidden="true" />

      <header className="topbar">
        <a className="brand" href="#home">
          <span className="brand-dot" />
          NABEEH <span>— Portfolio 2026</span>
        </a>
        <nav className="nav" aria-label="Primary">
          {['about', 'projects', 'contact'].map((id) => (
            <a key={id} href={`#${id}`} className={active === id ? 'active' : ''}>
              {id[0].toUpperCase() + id.slice(1)}
            </a>
          ))}
        </nav>
        <div className="topbar-actions">
          <button className="theme-toggle" onClick={toggleTheme} aria-label={theme === 'dark' ? 'Light mode' : 'Dark mode'} title={theme === 'dark' ? 'Light mode' : 'Dark mode'}>
            {mounted ? (theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />) : <Moon size={15} style={{ opacity: 0 }} />}
          </button>
          <a className="cta-min" href="#contact">
            Let&apos;s talk <ArrowUpRight size={13} />
          </a>
        </div>
      </header>

      <section className="hero" id="home">
        <div className="hero-main" key={booted ? 'on' : 'off'}>
          <p className="hero-label">
            <span className="pulse" />
            Cybersecurity — Red Teaming & Bug Hunting · Available for internships
          </p>
          <h1>
            <span className="l1">
              <Scramble text="Nabeeh Mohamed" delay={150} />
            </span>
            <span className="l2">
              <Scramble text="Abo Salem —" delay={350} />
            </span>
            <span className="l3">
              <span className="accent">
                <Scramble text="Red Teaming" delay={550} />
              </span>{' '}
              <Scramble text="& Bug Hunting." delay={700} />
              <span className="caret" aria-hidden="true" />
            </span>
          </h1>
          <p className="hero-desc">
            <strong>Cybersecurity (Red Teaming & Bug Hunting)</strong> — break to learn, then build to defend. AI & Science student at Horus University (Class of 2029) — AI as supporting stack. DEPI trainee, based in Samannoud, Al Gharbiyah, Egypt.
          </p>
          <div className="hero-meta">
            <span className="meta-pill">Samannoud, Al Gharbiyah · Remote</span>
            <span className="meta-pill">Red Teaming & Bug Hunting</span>
            <span className="meta-pill">Horus University — 2029</span>
          </div>
          <div className="hero-actions">
            <a className="btn-primary" href="#projects">
              View projects <ArrowRight size={14} />
            </a>
            <a className="btn-ghost" href="/Nabeeh_Mohamed_CV.pdf" target="_blank" rel="noreferrer">
              <Download size={14} /> Download CV
            </a>
            <a className="btn-ghost" href="https://github.com/nabosallem-svg" target="_blank" rel="noreferrer">
              <Code2 size={14} /> GitHub
            </a>
          </div>
        </div>

        {/* Radar — decorative */}
        <div className="radar" aria-hidden="true">
          <div className="radar-ring r1" />
          <div className="radar-ring r2" />
          <div className="radar-ring r3" />
          <div className="radar-cross" />
          <div className="radar-sweep" />
          <i className="blip b1" />
          <i className="blip b2" />
          <i className="blip b3" />
          <i className="blip b4" />
        </div>

        <div className="skills-mini reveal">
          <h3>Skills — simple, grouped</h3>
          {skills.map((g, i) => (
            <div key={g.label} className="tag-row">
              <b>{g.label}</b>
              {g.items.map((t, j) => (
                <span key={t} className="tag" style={{ '--d': `${i * 0.08 + j * 0.04}s` } as React.CSSProperties}>
                  {t}
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      <Marquee items={skills.flatMap((g) => g.items)} />

      <section className="section" id="about">
        <div className="section-head reveal">
          <h2>
            <Words text="About" /> <span><Words text="— core focus" base={0.12} /></span>
          </h2>
          <p>
            <strong>Cybersecurity (Red Teaming & Bug Hunting)</strong> is my core — break to learn, then build to defend. AI is my supporting stack.
          </p>
          <div className="line" />
        </div>
        <div className="about-card reveal d1">
          <div className="about-id">
            <div className="avatar-ring">
              <img src="/assets/avatar.png" alt="Nabeeh Mohamed Abo Salem" />
            </div>
            <div>
              <h3>Nabeeh Mohamed Abo Salem</h3>
              <p>
                <strong>Cybersecurity · Red Teaming & Bug Hunting</strong> — Primary Focus
                <br />
                <span className="faint">AI & Science Student — Supporting stack</span> · Horus University
              </p>
            </div>
          </div>

          <p className="about-text">
            Cybersecurity (Red Teaming & Bug Hunting) is my core focus. I am an AI & Science student at Horus University (Class of 2029), currently training in software testing with DEPI and Red Teaming with Hussam Shady & CyberGuardX. I build and secure full systems with a hacker mindset.
            <br />
            <span className="faint small">Core Stack: Python · Java · C++ · Dart · Linux · Nmap · Burp Suite · Wireshark · YOLO</span>
          </p>
        </div>

        <div className="info-grid">
          <div className="info-card reveal d2" onPointerMove={onCardMove} onPointerLeave={onCardLeave}>
            <h4>
              <GraduationCap size={14} /> Education
            </h4>
            <p className="info-title">Horus University — B.Sc. in AI & Science</p>
            <p className="info-sub">Class of 2029 · Samannoud, Al Gharbiyah</p>
          </div>
          <div className="info-card reveal d3" onPointerMove={onCardMove} onPointerLeave={onCardLeave}>
            <h4>
              <Briefcase size={14} /> Training & Experience
            </h4>
            <p className="info-title">DEPI — Software Testing & Red Team Track</p>
            <p className="info-sub">Jul 2026–Present · Hussam Shadeed · CyberGuardX · ISTQB, STLC</p>
          </div>
        </div>
      </section>

      {/* PROJECTS — CLICKABLE CARDS → MODAL */}
      <section className="section" id="projects">
        <div className="section-head reveal">
          <h2>
            <Words text="Selected" /> <span><Words text={`work — ${projects.length} projects`} base={0.12} /></span>
          </h2>
          <p>Click any card to open its modal — backdrop or Esc closes it.</p>
          <div className="line" />
        </div>

        <div className="filters reveal" role="tablist" aria-label="Filter projects">
          {groups.map((g) => {
            const n = g.key === 'all' ? projects.length : projects.filter((p) => p.group === g.key).length;
            return (
              <button key={g.key} role="tab" aria-selected={filter === g.key} className={filter === g.key ? 'chip on' : 'chip'} onClick={() => setFilter(g.key)}>
                {g.label} <em>{n}</em>
              </button>
            );
          })}
        </div>

        <div className="project-grid reveal" key={filter}>
          {shown.map((p, i) => (
            <article
              key={p.title}
              className={`project ${p.featured ? 'project-featured' : ''}`}
              style={{ '--i': i } as React.CSSProperties}
              // /* ★ CLICK CARD → OPEN ITS SPECIFIC MODAL ★ */
              onClick={() => setSelected(p)}
              onPointerMove={onCardMove}
              onPointerLeave={onCardLeave}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setSelected(p)}
              aria-label={`Open ${p.title} details`}
            >
              <div className="project-media">
                <ProjectArt p={p} />
                {p.featured && <span className="featured-badge">★ Featured</span>}
                {p.video && <span className="video-badge">▶ Demo video</span>}
                {!p.video && (p.live || p.demo.startsWith('/demos/') || p.demo.includes('vercel.app')) && <span className="video-badge">▶ Live demo</span>}
              </div>
              <div className="project-body">
                <div className="project-top">
                  <span className="project-type">{p.type}</span>
                  <span className="project-year">{p.year}</span>
                </div>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
                <div className="project-tech">
                  {p.tech.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
                <div className="project-links" style={{ pointerEvents: 'none' }}>
                  {(p.demo || !p.github) && (
                    <span>
                      Open <ArrowUpRight size={12} />
                    </span>
                  )}
                  {p.github && (
                    <span>
                      GitHub <Github size={12} />
                    </span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* MODAL — BACKDROP + FADE */}
      {selected && (
        // /* ★ BACKDROP CLICK CLOSES MODAL ★ */
        <div className="modal-backdrop" onClick={() => setSelected(null)} role="dialog" aria-modal="true" aria-label={selected.title}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelected(null)} aria-label="Close">
              <X size={16} />
            </button>
            <div className={selected.video ? 'modal-media modal-video' : 'modal-media'}>
              {selected.video ? (
                <video src={selected.video} poster={selected.image} autoPlay muted loop playsInline controls aria-label={`${selected.title} walkthrough`} />
              ) : (
                <ProjectArt p={selected} />
              )}
              {selected.featured && <span className="modal-badge">Featured — Live SaaS</span>}
            </div>
            <div className="modal-body">
              <p className="project-type" style={{ marginBottom: 8 }}>
                {selected.type} · {selected.year}
              </p>
              <h3>{selected.title}</h3>
              <p className="modal-desc">{selected.desc}</p>
              <div className="modal-tech">
                {selected.tech.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
              <div className="modal-section">
                <h4>{selected.howTitle}</h4>
                <p>{selected.how}</p>
                <pre>{selected.run}</pre>
              </div>
              {selected.output && <Terminal text={selected.output} />}

              {selected.live && (
                <a className="btn-primary live-btn" href={selected.live} target="_blank" rel="noreferrer">
                  <Play size={14} />
                  {selected.liveLabel}
                </a>
              )}

              {/* /* ★ FUNCTIONAL <a> TAGS — EMPTY LINKS ARE HIDDEN ★ */}
              <div className={selected.demo && selected.github ? 'modal-actions' : 'modal-actions single'}>
                {selected.demo && (
                  <a
                    className={selected.featured ? 'btn-primary modal-primary' : selected.live ? 'btn-ghost' : 'btn-primary'}
                    href={selected.demo}
                    target={selected.demo.startsWith('http') || selected.demo.startsWith('/demos/') || selected.demo.endsWith('.html') ? '_blank' : undefined}
                    rel="noreferrer"
                    // /* ★ DOWNLOAD ATTRIBUTE — ONLY FOR APK/JAR/ZIP/EXE FILES ★ */
                    download={/\.(apk|jar|zip|exe)$/i.test(selected.demo) ? '' : undefined}
                  >
                    {selected.featured ? (
                      <>
                        <Play size={14} />
                        Launch RedPulse
                      </>
                    ) : (
                      <>
                        {/\.(apk|jar|zip|exe)$/i.test(selected.demo) ? <Download size={14} /> : <ExternalLink size={14} />}
                        {selected.demoLabel}
                      </>
                    )}
                  </a>
                )}
                {selected.github && (
                  <a className={selected.demo || selected.live ? 'btn-ghost' : 'btn-primary'} href={selected.github} target="_blank" rel="noreferrer">
                    <Github size={14} />
                    GitHub
                  </a>
                )}
              </div>
              <p className="modal-hint">Click backdrop or press Esc to close</p>
            </div>
          </div>
        </div>
      )}

      <section className="section" id="contact">
        <div className="section-head reveal">
          <h2>
            <Words text="Contact" /> <span><Words text="— simple" base={0.12} /></span>
          </h2>
          <p>One form, no noise. I reply within 24 hours.</p>
          <div className="line" />
        </div>
        <div className="contact-wrap reveal d1">
          <form className="contact-form" onSubmit={onSubmit}>
            <h3>Send a message</h3>
            <p>Direct to my inbox — nabosallem@gmail.com</p>
            <div className="field">
              <label htmlFor="name">Name</label>
              <input id="name" placeholder="Nabeeh Mohamed" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input id="email" type="email" placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div className="field">
              <label htmlFor="message">Message</label>
              <textarea id="message" placeholder="Hello Nabeeh, I'd like to..." value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
            </div>
            <button className="btn-submit" type="submit" disabled={sent}>
              {sent ? (
                <>
                  <CheckCircle2 size={14} />
                  Sent — thank you
                </>
              ) : (
                <>
                  <Send size={14} />
                  Send message
                </>
              )}
            </button>
          </form>
          <div className="contact-side">
            <h3>Direct</h3>
            <p>Here are the essentials.</p>
            <div className="contact-list">
              <div>
                <Mail size={14} />
                <a href="mailto:nabosallem@gmail.com">nabosallem@gmail.com</a>
              </div>
              <div>
                <MapPin size={14} />
                <span>Samannoud, Al Gharbiyah — Remote</span>
              </div>
              <div>
                <Code2 size={14} />
                <a href="https://github.com/nabosallem-svg" target="_blank" rel="noreferrer">
                  github.com/nabosallem-svg
                </a>
              </div>
              <div>
                <ExternalLink size={14} />
                <a href="https://linkedin.com/in/nabeeh-mohamed-91b2aa386" target="_blank" rel="noreferrer">
                  linkedin.com/in/nabeeh-mohamed
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <p>© 2026 Nabeeh Mohamed Abo Salem — Minimal, calm, content-first.</p>
        <nav>
          <a href="mailto:nabosallem@gmail.com">Email</a>
          <a href="https://github.com/nabosallem-svg" target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href="https://linkedin.com/in/nabeeh-mohamed-91b2aa386" target="_blank" rel="noreferrer">
            LinkedIn
          </a>
        </nav>
      </footer>

      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}
    </main>
  );
}

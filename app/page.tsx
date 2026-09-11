'use client';

import { useEffect, useState } from 'react';
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
  Moon,
  Sun,
  GraduationCap,
  Briefcase,
  X,
  Play,
} from 'lucide-react';
const Github = Code2;

// === SKILLS (static) ===
const skills = [
  { label: 'Programming', items: ['C++', 'Python', 'Java', 'Dart', 'Bash'] },
  { label: 'Development', items: ['Flutter', 'Next.js', 'FastAPI'] },
  { label: 'AI & Data', items: ['Machine Learning', 'Computer Vision', 'YOLO', 'OpenCV'] },
  { label: 'Cybersecurity & QA', items: ['Nmap', 'Burp Suite', 'Penetration Testing', 'Manual Testing', 'ISTQB'] },
];

// ==========================================
// /* ★★★ PUT YOUR REAL URLS HERE — EDIT THESE 4 LINES BELOW ★★★ */
// Each project has TWO functional <a> links: GitHub + Open/Live. Never use <button>.
// For APK/JAR, keep the `download` attribute — it forces download instead of preview.
// ==========================================
type Project = (typeof projects)[number];
const projects = [
  {
    id: '01',
    type: 'SaaS · Security — Featured',
    title: 'RedPulse / ReconPilot',
    desc: 'Automated penetration testing platform — subdomain discovery, live probing and vulnerability scanning with reporting.',
    tech: ['FastAPI', 'Next.js', 'Supabase', 'Vercel'],
    year: '2026',
    image: '/assets/project-reconpilot.png',
    // /* ★ PUT YOUR REDPULSE GITHUB LINK HERE ★ */  ⬇️ paste your repo URL
    github: 'https://github.com/nabosallem-svg/RedPulse',
    // /* ★ PUT YOUR REDPULSE LIVE LINK HERE ★ */  ⬇️ paste your Vercel URL (use redpulse-frontend — the "nine" link is dead)
    demo: 'https://redpulse-frontend.vercel.app',
    demoLabel: 'Launch RedPulse',
    howTitle: 'How it works',
    how: 'FastAPI runs Subfinder → httpx → Nuclei/Nmap → stores assets & findings in PostgreSQL → Next.js dashboard shows results with real-time status. Auth via Supabase, payments via Stripe.',
    run: '1) Clone: git clone https://github.com/nabosallem-svg/RedPulse\n2) cd reconpilot && cp .env.example .env\n3) docker-compose up  →  frontend http://localhost:3000  |  api http://localhost:8000',
    featured: true,
  },
  {
    id: '02',
    type: 'Business Software',
    title: 'Data Gris Store',
    desc: 'Comprehensive store & inventory system — POS, suppliers, purchases, sales, barcode, treasury and commissions. Built with my friend.',
    tech: ['Flutter', 'Dart', 'Hive', 'Firebase'],
    year: '2025',
    image: '/assets/project-store.png',
    // /* ★ PUT YOUR DATA GRIS GITHUB LINK HERE — PRIVATE NOW ★ */
    github: 'https://github.com/nabosallem-svg/DataGris-Store',
    // /* ★ PUT YOUR APK LINK HERE ★ */  — local file in /public or external URL. Keep `download` attribute on the <a> tag!
    demo: '/DataGris-App.apk',
    demoLabel: 'Download APK',
    howTitle: 'How inventory & sales work',
    how: 'Flutter POS scans barcode → Hive caches locally → Firebase syncs → stock auto-deducts, low-stock alerts trigger, treasury updates and invoices generate. Works offline then syncs.',
    run: '1) Download APK above and install on Android\n2) Or: flutter pub get && flutter run  (Hive local DB + Firebase)',
    featured: false,
  },
  {
    id: '03',
    type: 'Backend · Java',
    title: 'VELOX — Modular Commerce Engine',
    desc: 'E-commerce engine and delivery system built with Java and Maven using object-oriented design.',
    tech: ['Java 17', 'Maven', 'OOP'],
    year: '2025',
    image: '/assets/project-velox.png',
    // /* ★ PUT YOUR VELOX GITHUB LINK HERE ★ */
    github: 'https://github.com/nabosallem-svg/VELOX',
    // /* ★ PUT YOUR JAR LINK HERE ★ */  — keep `download` attribute!
    demo: '/Velox.jar',
    demoLabel: 'Download JAR',
    howTitle: 'How to run locally',
    how: 'Polymorphic stores (Fashion/Tech/Restaurant) with Strategy discounts and pluggable payments. Delivery simulation included.',
    run: '1) java -jar Velox.jar\n2) Or: mvn clean package && mvn exec:java\n3) Or: mvn package && java -jar target/Velox-1.0.jar',
    featured: false,
  },
  {
    id: '04',
    type: 'Desktop · C++',
    title: 'Numerical Calculator GUI',
    desc: 'Advanced desktop calculator with a clean Qt interface — precise operations and error handling.',
    tech: ['C++', 'Qt Creator', 'CMake'],
    year: '2024',
    image: '/assets/project-calculator.png',
    // /* ★ PUT YOUR CALCULATOR GITHUB LINK HERE — PRIVATE NOW ★ */
    github: 'https://github.com/nabosallem-svg/Numerical-Calculator-GUI',
    // /* ★ PUT YOUR CALCULATOR DEMO/REQUEST LINK HERE ★ */
    demo: 'https://github.com/nabosallem-svg/Numerical-Calculator-GUI',
    demoLabel: 'Open Repo',
    howTitle: 'How to run locally',
    how: 'Qt Widgets GUI with expression parser and validation. CMake builds on Windows/Linux.',
    run: '1) Qt Creator → open CMakeLists.txt → Build & Run\n2) Or: cmake -B build && cmake --build build && ./build/Calculator',
    featured: false,
  },
];

export default function Home() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  // /* ★ WORKING MODAL LOGIC — useState controls which card's modal is open ★ */
  const [selected, setSelected] = useState<Project | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const init = saved ?? 'light';
    setTheme(init);
    document.documentElement.classList.toggle('dark', init === 'dark');
    setMounted(true);
  }, []);
  useEffect(() => {
    if (!mounted) return;
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme, mounted]);



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

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('theme', next);
  }
  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSent(true);
    setTimeout(() => setSent(false), 2800);
    setForm({ name: '', email: '', message: '' });
  }

  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#home">
          NABEEH <span>— Portfolio 2026</span>
        </a>
        <nav className="nav" aria-label="Primary">
          <a href="#about">About</a>
          <a href="#projects">Projects</a>
          <a href="#contact">Contact</a>
        </nav>
        <div className="topbar-actions">
          <button className="theme-toggle" onClick={toggleTheme} aria-label={theme === 'dark' ? 'Light mode' : 'Dark mode'} title={theme === 'dark' ? 'Light mode' : 'Dark mode'}>
            {mounted ? (theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />) : <Moon size={15} style={{ opacity: 0 }} />}
          </button>
          <a className="cta-min" href="#contact">
            Let&apos;s talk <ArrowUpRight size={13} style={{ display: 'inline', marginLeft: 6, verticalAlign: -1 }} />
          </a>
        </div>
      </header>

      <section className="hero" id="home">
        <p className="hero-label">Cybersecurity — Red Teaming & Bug Hunting · Available for internships</p>
        <h1>
          <span className="l1">Nabeeh Mohamed</span>
          <span className="l2">Abo Salem —</span>
          <span className="l3">
            <span>Cybersecurity</span> & Systems.
          </span>
        </h1>
        <p className="hero-desc">
          <strong style={{ color: 'var(--text)' }}>Cybersecurity (Red Teaming & Bug Hunting)</strong> — break to learn, then build to defend. AI & Science student at Horus University (Class of 2029) — AI as supporting stack. DEPI trainee, based in Samannoud, Al Gharbiyah, Egypt.
        </p>
        <div className="hero-meta" style={{ marginTop: 18, display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          <span className="meta-pill">Samannoud, Al Gharbiyah · Remote</span>
          <span className="meta-pill">Red Teaming & Bug Hunting</span>
          <span className="meta-pill">Horus University — 2029</span>
        </div>
        <div className="hero-actions">
          <a className="btn-primary" href="#projects">
            View projects <ArrowRight size={14} style={{ display: 'inline', marginLeft: 6 }} />
          </a>
          <a className="btn-ghost" href="/Nabeeh_Mohamed_CV.pdf" target="_blank" rel="noreferrer">
            <Download size={14} style={{ display: 'inline', marginRight: 6, verticalAlign: -2 }} /> Download CV
          </a>
          <a className="btn-ghost" href="https://github.com/nabosallem-svg" target="_blank" rel="noreferrer">
            <Code2 size={14} style={{ display: 'inline', marginRight: 6, verticalAlign: -2 }} /> GitHub
          </a>
        </div>
        <div className="skills-mini reveal">
          <h3>Skills — simple, grouped</h3>
          {skills.map((g, i) => (
            <div key={g.label} className="tag-row reveal" style={{ transitionDelay: `${i * 0.06}s` } as any}>
              <b>{g.label}</b>
              {g.items.map((t) => (
                <span key={t} className="tag">
                  {t}
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section className="section reveal" id="about">
        <div className="section-head">
          <h2>
            About <span>— core focus</span>
          </h2>
          <p>
            <strong style={{ color: 'var(--text)' }}>Cybersecurity (Red Teaming & Bug Hunting)</strong> is my core — break to learn, then build to defend. AI is my supporting stack.
          </p>
          <div className="line" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '88px 1fr', gap: 14, alignItems: 'start', marginBottom: 16 }}>
          <img src="/assets/avatar.png" alt="Nabeeh Mohamed Abo Salem" style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--line)' }} />
          <div>
            <h3 style={{ margin: '0 0 3px', fontSize: 16, fontWeight: 800 }}>Nabeeh Mohamed Abo Salem</h3>
            <p style={{ margin: 0, color: 'var(--muted)', fontSize: 12.5, lineHeight: 1.5 }}>
              <strong style={{ color: 'var(--text)' }}>Cybersecurity · Red Teaming & Bug Hunting</strong> — Primary Focus
              <br />
              <span style={{ color: 'var(--faint)' }}>AI & Science Student — Supporting stack</span> · Horus University
            </p>
          </div>
        </div>

        <p style={{ margin: '0 0 18px', color: 'var(--muted)', fontSize: 13, lineHeight: 1.7 }}>
          I study <strong style={{ color: 'var(--text)' }}>AI & Science at Horus University, Class of 2029</strong>, and train in{' '}
          <strong style={{ color: 'var(--text)' }}>Red Teaming with Hussam Shadeed & CyberGuardX</strong> alongside DEPI Software Testing (ISTQB, STLC, Manual Testing). I build complete, secure systems — UI, database, and tests — and harden them with a hacker mindset.{' '}
          <strong style={{ color: 'var(--text)' }}>Why work with me?</strong> Reliable, clean code, thorough testing, and security-first thinking. Passionate about breaking to learn, then defending with automation.{' '}
          <span style={{ color: 'var(--faint)' }}>Python · Java · C++ · Dart · Flutter · Linux · Nmap · Burp Suite · Wireshark · YOLO · OpenCV</span>
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ padding: 16, background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 12 }}>
            <h4 style={{ margin: '0 0 8px', fontSize: 12, fontWeight: 800, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--faint)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <GraduationCap size={14} /> Education
            </h4>
            <p style={{ margin: 0, fontSize: 13.5, fontWeight: 700 }}>Horus University — B.Sc. in AI & Science</p>
            <p style={{ margin: '4px 0 0', color: 'var(--muted)', fontSize: 13 }}>Class of 2029 · Samannoud, Al Gharbiyah</p>
          </div>
          <div style={{ padding: 16, background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 12 }}>
            <h4 style={{ margin: '0 0 8px', fontSize: 12, fontWeight: 800, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--faint)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Briefcase size={14} /> Training & Experience
            </h4>
            <p style={{ margin: 0, fontSize: 13.5, fontWeight: 700 }}>DEPI — Software Testing & Red Team Track</p>
            <p style={{ margin: '4px 0 0', color: 'var(--muted)', fontSize: 13 }}>Jul 2026–Present · Hussam Shadeed · CyberGuardX · ISTQB, STLC</p>
          </div>
        </div>
      </section>

      {/* PROJECTS — CLICKABLE CARDS → MODAL */}
      <section className="section" id="projects">
        <div className="section-head reveal">
          <h2>
            Selected <span>work — 4 projects</span>
          </h2>
          <p>Click any card to open its modal — backdrop or Esc closes it.</p>
          <div className="line" />
        </div>
        <div className="project-grid">
          {projects.map((p, i) => (
            <article
              key={p.title}
              className={`project reveal ${p.featured ? 'project-featured' : ''}`}
              style={{ transitionDelay: `${i * 0.06}s` } as any}
              // /* ★ CLICK CARD → OPEN ITS SPECIFIC MODAL ★ */
              onClick={() => setSelected(p)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setSelected(p)}
              aria-label={`Open ${p.title} details`}
            >
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
                <span>
                  Open <ArrowUpRight size={12} />
                </span>
                <span>
                  GitHub <Github size={12} />
                </span>
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
            <div className="modal-media">
              <img src={selected.image} alt={selected.title} />
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

              {/* /* ★ TWO FUNCTIONAL <a> TAGS — NO <button href="#"> — EDIT HREFS ABOVE ★ */ }
              <div className="modal-actions">
                {/* /* ★ OPEN/LIVE BUTTON — <a> with href + target="_blank" ★ */}
                <a
                  className={selected.featured ? 'btn-primary modal-primary' : 'btn-primary'}
                  href={selected.demo}
                  target={selected.demo.startsWith('http') || selected.demo.startsWith('mailto:') ? '_blank' : undefined}
                  rel="noreferrer"
                  // /* ★ DOWNLOAD ATTRIBUTE — ONLY FOR APK/JAR (starts with "/") ★ */
                  download={selected.demo.startsWith('/') ? '' : undefined}
                >
                  {selected.featured ? (
                    <>
                      <Play size={14} style={{ display: 'inline', marginRight: 6, verticalAlign: -2 }} />
                      Launch RedPulse
                    </>
                  ) : (
                    <>
                      <ExternalLink size={14} style={{ display: 'inline', marginRight: 6, verticalAlign: -2 }} />
                      {selected.demoLabel}
                    </>
                  )}
                </a>
                {/* /* ★ GITHUB BUTTON — <a> with href + target="_blank" ★ */}
                <a className="btn-ghost" href={selected.github} target="_blank" rel="noreferrer">
                  <Github size={14} style={{ display: 'inline', marginRight: 6, verticalAlign: -2 }} />
                  GitHub
                </a>
              </div>
              <p style={{ margin: '10px 0 0', color: 'var(--faint)', fontSize: 11, textAlign: 'center' }}>Click backdrop or press Esc to close</p>
            </div>
          </div>
        </div>
      )}

      <section className="section" id="contact">
        <div className="section-head reveal">
          <h2>
            Contact <span>— simple</span>
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
                  <CheckCircle2 size={14} style={{ display: 'inline', marginRight: 8, verticalAlign: -2 }} />
                  Sent — thank you
                </>
              ) : (
                <>
                  <Send size={14} style={{ display: 'inline', marginRight: 8, verticalAlign: -2 }} />
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

      {toast && <div style={{ position: 'fixed', bottom: 20, left: '50%', transform: 'translateX(-50%)', background: 'var(--text)', color: 'var(--bg)', padding: '10px 16px', borderRadius: 999, fontSize: 12, fontWeight: 600, zIndex: 99 }}>{toast}</div>}

      <script
        dangerouslySetInnerHTML={{
          __html: `(()=>{const o=new IntersectionObserver(e=>{e.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');o.unobserve(e.target)}})},{threshold:.12});document.querySelectorAll('.reveal').forEach(e=>o.observe(e))})();`,
        }}
      />
    </main>
  );
}

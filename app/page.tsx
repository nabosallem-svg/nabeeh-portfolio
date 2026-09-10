import { ArrowRight, ArrowUpRight, Braces, Bug, Code2, Database, Code2 as Github, Mail, MapPin, Radar, ShieldCheck } from 'lucide-react';

const skillGroups = [
  { icon: Braces, label: 'Languages', value: 'Python · C++ · Java · Dart · SQL · Bash' },
  { icon: Code2, label: 'Development', value: 'Flutter · Git · GitHub · VS Code · CMake · Docker' },
  { icon: Database, label: 'Data & systems', value: 'Firebase · Firestore · SQLite · MySQL · Linux · Windows' },
  { icon: ShieldCheck, label: 'QA & security', value: 'Manual Testing · Test Planning · Nmap · Wireshark · Burp Suite' },
];

const projects = [
  { id: '01', type: 'Business Software', title: 'Pharmacy Management System', copy: 'Medicine inventory, POS workflows, and expiration tracking in one complete system.', tech: ['Java', 'C++', 'Python', 'Flutter', 'Firebase'], className: 'project-violet' },
  { id: '02', type: 'Operations', title: 'Store & Inventory Management', copy: 'Sales, inventory reporting, and proactive low-stock alerts for better daily operations.', tech: ['Java', 'C++', 'Python', 'Flutter', 'Firebase'], className: 'project-coral' },
  { id: '03', type: 'Artificial Intelligence', title: 'Full-Stack AI Web Chatbot', copy: 'A dynamic Gemini-powered chat experience with Firebase cloud storage.', tech: ['Gemini API', 'Firebase', 'Full-Stack'], className: 'project-blue' },
  { id: '04', type: 'Computer Vision', title: 'Subsurface Object Detection', copy: 'Detecting underground objects from GPR imagery with a custom vision pipeline.', tech: ['YOLO', 'Python', 'OpenCV', 'GPR'], className: 'project-lime' },
];

function Eyebrow({ children }: { children: React.ReactNode }) { return <p className="eyebrow"><span>+</span>{children}</p>; }

export default function Home() {
  return <main>
    <header className="topbar"><a className="brand" href="#home">NABEEH<span>®</span></a><nav aria-label="Main navigation"><a href="#about">About</a><a href="#work">Work</a><a href="#skills">Skills</a></nav><a className="contact-pill" href="mailto:nabosallem@gmail.com">Let’s talk <ArrowUpRight size={17}/></a></header>

    <section className="hero" id="home">
      <div className="hero-status"><span className="status-dot"/> OPEN TO OPPORTUNITIES <b>CAIRO, EG</b></div>
      <div className="hero-title"><h1>AI STUDENT<br/><span>& SOFTWARE</span><br/>DEVELOPER.</h1><div className="hero-stamp" aria-hidden="true"><span>NM</span><small>BUILD · TEST · SECURE</small></div></div>
      <div className="hero-foot"><p>I design and build reliable digital products — from the interface to the database, with quality and security in mind.</p><a href="#work">View selected work <ArrowRight size={19}/></a></div>
      <div className="ticker" aria-hidden="true"><div>PYTHON&nbsp;&nbsp;✦&nbsp;&nbsp; FLUTTER&nbsp;&nbsp;✦&nbsp;&nbsp; QA TESTING&nbsp;&nbsp;✦&nbsp;&nbsp; CYBERSECURITY&nbsp;&nbsp;✦&nbsp;&nbsp; ARTIFICIAL INTELLIGENCE&nbsp;&nbsp;✦&nbsp;&nbsp;</div></div>
    </section>

    <section className="about layout" id="about">
      <aside><Eyebrow>About me</Eyebrow><p>01 — 04</p></aside>
      <div className="about-main"><h2>I turn complex problems into <em>clear, dependable</em> software.</h2><div className="about-copy"><p>An AI & Science student at Horus University, Class of 2029. I build applications, design thoughtful interfaces, and structure the databases that make products work.</p><p>My practice extends into quality assurance and cybersecurity — testing software manually, planning test coverage, reporting bugs clearly, and exploring how systems can be made safer.</p></div><div className="stats"><div><strong>2029</strong><span>Graduation year</span></div><div><strong>04</strong><span>Featured projects</span></div><div><strong>03</strong><span>Core disciplines</span></div></div></div>
    </section>

    <section className="work layout" id="work">
      <aside><Eyebrow>Selected work</Eyebrow><p>02 — 04</p></aside>
      <div className="work-main"><div className="section-intro"><h2>Projects with<br/>a purpose.</h2><p>A selection of systems built across business software, AI, and computer vision.</p></div><div className="project-grid">{projects.map((project)=><article className={`project ${project.className}`} key={project.id}><div className="project-art"><span>{project.id}</span><div className="mock-window"><i/><i/><i/><b>{project.type}</b><small>PROJECT / {project.id}</small></div></div><div className="project-info"><p>{project.type}</p><h3>{project.title}</h3><p className="project-copy">{project.copy}</p><div>{project.tech.map(t=><span key={t}>{t}</span>)}</div></div></article>)}</div></div>
    </section>

    <section className="skills layout" id="skills"><aside><Eyebrow>Capabilities</Eyebrow><p>03 — 04</p></aside><div className="skills-main"><h2>Tools I use to<br/><em>make things work.</em></h2><div className="skill-list">{skillGroups.map(({icon:Icon,label,value},index)=><article key={label}><span className="skill-index">0{index+1}</span><Icon/><div><h3>{label}</h3><p>{value}</p></div><ArrowUpRight className="skill-arrow"/></article>)}</div><div className="specialties"><div><Bug/><span>Manual testing<br/>& bug reporting</span></div><div><Radar/><span>YOLO, OpenCV<br/>& GPR detection</span></div><div><ShieldCheck/><span>Security tools<br/>& network analysis</span></div></div></div></section>

    <footer id="contact"><div className="footer-top"><Eyebrow>Start a conversation</Eyebrow><h2>LET’S MAKE<br/><span>SOMETHING</span><br/>USEFUL.</h2><a href="mailto:nabosallem@gmail.com" aria-label="Send email"><ArrowUpRight/></a></div><div className="footer-links"><div><MapPin size={17}/> Egypt · Available remotely</div><a href="mailto:nabosallem@gmail.com"><Mail size={17}/> nabosallem@gmail.com</a><a href="https://github.com/nabosallem-svg" target="_blank" rel="noreferrer"><Github size={17}/> GitHub</a><a href="https://linkedin.com/in/nabeeh-mohamed-91b2aa386" target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight size={16}/></a></div><div className="copyright">© 2026 NABEEH MOHAMED ABO SALEM <span>DESIGNED TO EVOLVE</span></div></footer>
  </main>;
}

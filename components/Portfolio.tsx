"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  MotionConfig,
  useReducedMotion,
  useScroll,
  useSpring,
} from "motion/react";
import {
  Github,
  Linkedin,
  Mail,
  Copy,
  Check,
  FileText,
  X,
  MessageSquare,
  ArrowUpRight,
  GraduationCap,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";
import Character from "./Character";
import IntroSequence from "./IntroSequence";
import TechGraph from "./TechGraph";
import AskPortfolio from "./AskPortfolio";
import IdentityDemo from "./IdentityDemo";
import CharacterScene from "./CharacterScene";
import { experience, profile, projects, type Project } from "@/data/portfolio";

const navigation = [
  { id: "stack", label: "TECH" },
  { id: "build", label: "WORK" },
  { id: "about", label: "ABOUT" },
  { id: "contact", label: "CONTACT" },
];
const sections = [
  { id: "home", label: "HOME" },
  { id: "stack", label: "TECH" },
  { id: "build", label: "WORK" },
  { id: "numbers", label: "NUMBERS" },
  { id: "ask", label: "ASK" },
  { id: "about", label: "ABOUT" },
  { id: "contact", label: "CONTACT" },
];
const phrases = [
  "privacy-first tools",
  "cloud detections",
  "identity lifecycles",
  "secure pipelines",
];
const highlights: Record<string, string[]> = {
  password: [
    "3 integrated password tools",
    "5-character hash prefix",
    "Fully client-side",
  ],
  sentinel: [
    "Entra ID log ingestion",
    "Scheduled KQL detection",
    "Account entity mapping",
  ],
  devsecops: [
    "tfsec + Checkov scanning",
    "Critical / high remediation",
    "Risk-based security gates",
  ],
  iam: [
    "Joiner–Mover–Leaver lifecycle",
    "Role-based least privilege",
    "Audited incident response",
  ],
};

function ProjectDetail({
  project,
  close,
}: {
  project: Project;
  close: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    dialog.current?.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
      opener?.focus({ preventScroll: true });
    };
  }, []);
  return (
    <dialog
      ref={dialog}
      className="project-dialog"
      aria-labelledby="project-title"
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <button
        className="dialog-close"
        aria-label="Close project details"
        onClick={close}
        autoFocus
      >
        <X size={22} />
      </button>
      <div className="dialog-content">
        <p className="section-kicker">
          PROJECT {project.number} · {project.category}
        </p>
        <h2 id="project-title">{project.title}</h2>
        <p className="dialog-headline">{project.headline}</p>
        {project.image && (
          <Image
            className="dialog-image"
            src={project.image}
            alt={project.imageAlt!}
            width={1400}
            height={900}
            sizes="(max-width:700px) 90vw, 780px"
          />
        )}
        <div className="tags">
          {project.tags.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
        <h3>What I built</h3>
        <ul>
          {project.details.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
        <h3>The result</h3>
        <p>{project.outcome}</p>
        <div className="dialog-links">
          {project.repo && (
            <a href={project.repo} target="_blank" rel="noopener noreferrer">
              <Github size={17} />
              Explore repository
            </a>
          )}
          {project.live && (
            <a href={project.live} target="_blank" rel="noopener noreferrer">
              <ArrowUpRight size={17} />
              Try the live tool
            </a>
          )}
        </div>
      </div>
    </dialog>
  );
}

function FlipCard({
  project,
  onOpen,
  onTechnology,
}: {
  project: Project;
  onOpen: () => void;
  onTechnology: (t: string) => void;
}) {
  const [flipped, setFlipped] = useState(false);
  const [settling, setSettling] = useState(false);
  const reducedMotion = useReducedMotion();
  const frontButton = useRef<HTMLButtonElement>(null);
  const backButton = useRef<HTMLButtonElement>(null);
  const previousFlip = useRef(false);
  useEffect(() => {
    if (previousFlip.current === flipped) return;
    previousFlip.current = flipped;
    (flipped ? backButton : frontButton).current?.focus({
      preventScroll: true,
    });
  }, [flipped]);
  useEffect(() => {
    const timer = setTimeout(() => setSettling(false), reducedMotion ? 0 : 720);
    return () => clearTimeout(timer);
  }, [flipped, reducedMotion]);
  return (
    <article
      className={`flip-card ${flipped ? "flipped" : ""}`}
      id={`project-${project.id}`}
    >
      <div className="flip-inner">
        <div
          className="card-face card-front"
          aria-hidden={flipped}
          inert={flipped}
        >
          <p className="card-category">{project.category}</p>
          <h3>{project.title}</h3>
          <p className="card-subtitle">
            {project.id === "password"
              ? "Web application · Live on GitHub Pages"
              : "Independent project · Simulated lab"}
          </p>
          <p className="card-description">{project.description}</p>
          <span className="flip-hint">TAP TO SEE THE DETAILS ↻</span>
          <button
            ref={frontButton}
            className="card-flip-target"
            onClick={() => {
              setSettling(true);
              setFlipped(true);
            }}
            aria-label={`Flip ${project.title} to see details`}
          />
        </div>
        <div
          className="card-face card-back"
          aria-hidden={!flipped}
          inert={!flipped}
        >
          <button
            ref={backButton}
            className="unflip-button"
            onClick={() => setFlipped(false)}
            aria-label={`Show front of ${project.title}`}
          >
            <RotateCcw size={15} />
          </button>
          <h3>{project.title}</h3>
          <ul>
            {highlights[project.id].map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
          <div className="card-technologies">
            {project.tags.map((t) => (
              <button key={t} onClick={() => onTechnology(t)}>
                {t}
              </button>
            ))}
          </div>
          <button
            className="case-study-button"
            onClick={onOpen}
            disabled={settling}
          >
            VIEW CASE STUDY <ArrowUpRight size={14} />
          </button>
        </div>
      </div>
    </article>
  );
}

function AnimatedValue({ value }: { value: string }) {
  return (
    <motion.strong
      initial={{ opacity: 0.3, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      {value}
    </motion.strong>
  );
}

export default function Portfolio() {
  const [active, setActive] = useState("home");
  const [phrase, setPhrase] = useState(0);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedTech, setSelectedTech] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-20% 0px -45% 0px" },
    );
    document
      .querySelectorAll("main > section[id]")
      .forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (reduced) return;
    const interval = setInterval(
      () => setPhrase((p) => (p + 1) % phrases.length),
      3300,
    );
    return () => clearInterval(interval);
  }, [reduced]);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setCopyError(false);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2400);
    } catch {
      setCopyError(true);
    }
  };
  const selectTechnology = (t: string) => {
    setSelectedTech(t);
    document
      .getElementById("stack")
      ?.scrollIntoView({ behavior: reduced ? "instant" : "smooth" });
  };
  const openProject = (id: string) => {
    const p = projects.find((p) => p.id === id);
    if (p) setSelectedProject(p);
  };

  return (
    <MotionConfig reducedMotion="user" transition={{ type: "spring", bounce: 0.2 }}>
      <IntroSequence />
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div className="star-field" aria-hidden="true">
        {Array.from({ length: 100 }, (_, i) => (
          <i
            key={i}
            style={{
              left: `${(i * 37.731 + 7) % 100}%`,
              top: `${(i * 61.271 + 3) % 100}%`,
              width: 1 + (i % 3),
              height: 1 + (i % 3),
              opacity: 0.06 + (i % 6) * 0.035,
              animationDelay: `${i % 9}s`,
            }}
          />
        ))}
      </div>
      <motion.div className="scroll-progress" style={{ scaleX }} />
      <header className="site-header">
        <a className="brand" href="#home" aria-label="Nishant Suthar home">
          NS
        </a>
        <nav aria-label="Main navigation">
          {navigation.map((n) => (
            <a
              key={n.id}
              href={`#${n.id}`}
              className={active === n.id ? "active" : ""}
              aria-current={active === n.id ? "location" : undefined}
            >
              {n.label}
            </a>
          ))}
        </nav>
      </header>
      <aside className="social-rail" aria-label="Social links">
        <a
          href={profile.github}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
        >
          <Github size={19} />
        </a>
        <a
          href={profile.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
        >
          <Linkedin size={18} />
        </a>
        <a href={`mailto:${profile.email}`} aria-label="Email Nishant">
          <Mail size={18} />
        </a>
        <span />
      </aside>
      <a
        className="floating-resume"
        href={profile.resume}
        target="_blank"
        rel="noopener noreferrer"
      >
        RESUME <FileText size={13} />
      </a>
      <nav className="section-rail" aria-label="On this page">
        {sections.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className={active === s.id ? "active" : ""}
            aria-label={s.label}
            aria-current={active === s.id ? "location" : undefined}
          >
            <span>{s.label}</span>
            <i />
          </a>
        ))}
      </nav>
      <a className="floating-chat" href="#ask" aria-label="Ask me anything">
        <MessageSquare size={24} />
      </a>
      <main id="main">
        <section className="hero" id="home" aria-label="Home">
          <motion.div
            className="hero-name"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <p>Hello! I’m</p>
            <h1>
              Nishant
              <br />
              Suthar
            </h1>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Character />
          </motion.div>
          <motion.div
            className="hero-build"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <p>I build</p>
            <div className="phrase-wrap">
              <AnimatePresence mode="wait">
                <motion.span
                  className="gradient-text"
                  key={phrase}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: reduced ? 0 : 0.35 }}
                >
                  {phrases[phrase]}
                </motion.span>
              </AnimatePresence>
            </div>
          </motion.div>
          <motion.a
            className="hero-scroll"
            href="#stack"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            whileHover={{ y: 4 }}
          >
            scroll ↓<span />
          </motion.a>
        </section>
        <section
          className="stack-section content-section"
          id="stack"
          aria-label="Tech stack"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="gradient-text">Tech Stack</h2>
          </motion.div>
          <motion.p
            className="section-kicker"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            A LIVING NETWORK · DRAG TO ROTATE · SCROLL TO ZOOM · HOVER TO TRACE
            LINKS
          </motion.p>
          <TechGraph selected={selectedTech} onSelect={setSelectedTech} />
        </section>
        <section
          className="work-section content-section"
          id="build"
          aria-label="What I build"
        >
          <motion.p
            className="section-kicker work-kicker"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <span /> WHAT I BUILD · TAP A CARD TO FLIP · TAP A CHIP TO FIND IT
            IN THE STACK
          </motion.p>
          <div className="work-layout">
            <motion.div
              className="work-column"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, staggerChildren: 0.15 }}
            >
              {projects.slice(0, 2).map((p) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5 }}
                >
                  <FlipCard
                    project={p}
                    onOpen={() => setSelectedProject(p)}
                    onTechnology={selectTechnology}
                  />
                </motion.div>
              ))}
            </motion.div>
            <motion.div
              className="workspace-scene"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <CharacterScene />
              <h2>Selected Projects</h2>
            </motion.div>
            <motion.div
              className="work-column"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, staggerChildren: 0.15 }}
            >
              {projects.slice(2, 4).map((p) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5 }}
                >
                  <FlipCard
                    project={p}
                    onOpen={() => setSelectedProject(p)}
                    onTechnology={selectTechnology}
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
          <motion.a
            className="github-note"
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ x: 4 }}
          >
            <Github size={16} /> Explore the code and documentation{" "}
            <ArrowUpRight size={15} />
          </motion.a>
        </section>
        <section
          className="numbers-section content-section"
          id="numbers"
          aria-label="By the numbers"
        >
          <motion.p
            className="section-kicker"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            BY THE NUMBERS
          </motion.p>
          <motion.div
            className="numbers-grid"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, staggerChildren: 0.1 }}
          >
            {[
              { value: "4", label: "projects built & documented" },
              { value: "3.8", label: "GPA · College of DuPage" },
              { value: "2", label: "certificates · High Honors" },
              { value: "3", label: "tools in one password app" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <AnimatedValue value={item.value} />
                <span>{item.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </section>
        <AskPortfolio onProject={openProject} />
        <section
          className="about-section content-section"
          id="about"
          aria-label="About me"
        >
          <motion.div
            className="about-layout"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <IdentityDemo />
            </motion.div>
            <motion.div
              className="about-copy"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <p className="section-kicker">ABOUT ME</p>
              <h2>
                Cybersecurity student.
                <br />
                Builder with a{" "}
                <span className="gradient-text">security-first mindset.</span>
              </h2>
              <p>
                I build hands-on projects in cloud security, detection
                engineering, identity and access management, and web
                development. I’m a B.S. Cybersecurity student at DePaul
                University, following an A.A.S. in Cybersecurity & Defense at
                College of DuPage with a 3.8 GPA.
              </p>
              <p>
                I learn by building complete things, understanding the code and
                the security decisions, and documenting what worked. My
                experience supporting customers and troubleshooting devices at
                Amazon taught me to troubleshoot clearly, communicate with
                people, and take ownership.
              </p>
              <div className="about-tags">
                <span>DePaul · Cybersecurity</span>
                <span>College of DuPage · GPA 3.8</span>
                <span>Chicago area / Illinois</span>
              </div>
              <ul className="principles">
                <li>
                  <strong>Security first.</strong> Think about access, privacy
                  and failure before adding features.
                </li>
                <li>
                  <strong>Understand the why.</strong> Learn what the code and
                  the logs are actually telling you.
                </li>
                <li>
                  <strong>Build to learn.</strong> Finish the project, debug it,
                  and document the decisions.
                </li>
              </ul>
              <p className="code-note">
                // cloud · code · identity — all connected
              </p>
            </motion.div>
          </motion.div>
          <motion.div
            className="background-grid"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, staggerChildren: 0.1 }}
          >
            <div className="education">
              <p className="section-kicker">
                <GraduationCap size={17} /> EDUCATION
              </p>
              <article>
                <span className="small-label">2026 — PRESENT</span>
                <h3>DePaul University</h3>
                <p>B.S. in Cybersecurity</p>
                <p className="muted">
                  Jarvis College of Computing and Digital Media
                  <br />
                  Chicago, Illinois · Current student
                </p>
              </article>
              <article>
                <span className="small-label">COMPLETED</span>
                <h3>College of DuPage</h3>
                <p>A.A.S. in Cybersecurity & Defense</p>
                <p className="muted">Glen Ellyn, Illinois</p>
                <div className="tags">
                  <span>3.8 GPA</span>
                  <span>Academic Honors</span>
                  <span>Phi Theta Kappa</span>
                </div>
              </article>
            </div>
            <div className="certificates">
              <p className="section-kicker">
                <ShieldCheck size={17} /> CERTIFICATES & LEARNING
              </p>
              <div>
                <Check size={17} />
                <p>
                  Cybersecurity Specialist Certificate
                  <small>College of DuPage · High Honors</small>
                </p>
              </div>
              <div>
                <Check size={17} />
                <p>
                  CIT CCNA Certificate
                  <small>College of DuPage · High Honors</small>
                </p>
              </div>
              <p className="small-label">CURRENTLY STUDYING · IN PROGRESS</p>
              <div className="learning-tags">
                <span>CompTIA Security+ (SY0-701)</span>
                <span>AWS Cloud Practitioner</span>
              </div>
            </div>
          </motion.div>
        </section>
        <section className="experience-section content-section" id="experience">
          <motion.p
            className="section-kicker"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            WORK EXPERIENCE
          </motion.p>
          <motion.h2
            className="gradient-text"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Beyond the projects.
          </motion.h2>
          <motion.div
            className="experience-list"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, staggerChildren: 0.08 }}
          >
            {experience.map((e, i) => (
              <motion.details
                key={e.company}
                open={i === 0}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
              >
                <summary>
                  <div>
                    <h3>{e.role}</h3>
                    <p>{e.company}</p>
                  </div>
                  <span>{e.date}</span>
                  <span className="expand-sign">+</span>
                </summary>
                <div className="experience-body">
                  <p className="small-label">{e.location}</p>
                  <ul>
                    {e.points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </div>
              </motion.details>
            ))}
          </motion.div>
          <motion.a
            className="resume-download"
            href={profile.resume}
            download="Nishant-Suthar-Portfolio-Reference.pdf"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ x: 4 }}
          >
            <FileText size={17} /> Download résumé reference{" "}
            <ArrowUpRight size={16} />
          </motion.a>
        </section>
        <section
          className="contact-section content-section"
          id="contact"
          aria-label="Contact"
        >
          <motion.div
            className="contact-hero"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="contact-copy"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <p className="section-kicker">CONTACT</p>
              <h2>
                Let’s build something
                <br />
                <span className="gradient-text">with security in mind.</span>
              </h2>
              <motion.a
                className="say-hello"
                href={`mailto:${profile.email}`}
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                Say hello <ArrowUpRight size={19} />
              </motion.a>
            </motion.div>
            <motion.div
              className="contact-character"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <CharacterScene variant="security" />
            </motion.div>
          </motion.div>
          <motion.div
            className="contact-cards"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, staggerChildren: 0.1 }}
          >
            <motion.button
              className="contact-card"
              onClick={copyEmail}
              aria-label="Copy email address"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <span className="contact-card-label">EMAIL</span>
              <span className="contact-card-value">{profile.email}</span>
              {copied ? <Check size={19} /> : <Copy size={19} />}
            </motion.button>
            <motion.a
              className="contact-card"
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open LinkedIn"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <span className="contact-card-label">LINKEDIN</span>
              <span className="contact-card-value">
                linkedin.com/in/sutharn555
              </span>
              <ArrowUpRight size={20} />
            </motion.a>
            <motion.a
              className="contact-card"
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open GitHub"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <span className="contact-card-label">GITHUB</span>
              <span className="contact-card-value">github.com/Nsuthar1464</span>
              <ArrowUpRight size={20} />
            </motion.a>
          </motion.div>
          <p className="copy-feedback" role="status">
            {copied
              ? "Email address copied."
              : copyError
                ? "You can reach me at the email address above."
                : ""}
          </p>
          <footer>
            <span>
              © {new Date().getFullYear()} Nishant Suthar — Chicago area /
              Illinois
            </span>
            <a href="#home">Back to top ↑</a>
          </footer>
        </section>
      </main>
      {selectedProject && (
        <ProjectDetail
          key={selectedProject.id}
          project={selectedProject}
          close={() =>
            setSelectedProject((current) =>
              current?.id === selectedProject.id ? null : current,
            )
          }
        />
      )}
    </MotionConfig>
  );
}

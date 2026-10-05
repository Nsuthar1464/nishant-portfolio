"use client";
import { useState } from "react";
import { Send, MessageCircle } from "lucide-react";
import { projects, profile } from "@/data/portfolio";

function answer(question: string): { text: string; projectId?: string } {
  const q = question.toLowerCase();
  const project = projects.find(
    (p) =>
      q.includes(p.id) ||
      q.includes(p.title.toLowerCase()) ||
      (p.id === "password" && /password|privacy|breach/.test(q)) ||
      (p.id === "sentinel" && /soc|sentinel|kql|detection/.test(q)) ||
      (p.id === "devsecops" && /terraform|pipeline|checkov|tfsec/.test(q)) ||
      (p.id === "iam" && /identity|entra|lifecycle|rbac/.test(q)),
  );
  if (/certif|security\+|cloud practitioner|ccna certificate/.test(q))
    return {
      text: "I earned the Cybersecurity Specialist and CIT CCNA certificates at College of DuPage, both with High Honors. I’m currently studying for CompTIA Security+ (SY0-701) and AWS Cloud Practitioner; those certifications are still in progress.",
    };
  if (project)
    return {
      text: `${project.title}: ${project.description} ${project.details.slice(0, 2).join(" ")}`,
      projectId: project.id,
    };
  if (/educat|universit|college|depaul|student|study|studying|gpa|degree/.test(q))
    return {
      text: "I’m a current B.S. Cybersecurity student at DePaul University’s Jarvis College of Computing and Digital Media (2026–present). I completed an A.A.S. in Cybersecurity & Defense at College of DuPage with a 3.8 GPA, Academic Honors and Phi Theta Kappa membership.",
    };
  if (/experien|amazon|job|employ|career|business/.test(q))
    return {
      text: "I worked as a Locker+ Associate at Amazon in Downers Grove from October 2025 to August 2026, supporting customers, troubleshooting devices and training new hires. My cybersecurity work is demonstrated through my independently built projects in detection engineering, identity governance, infrastructure security scanning and web development.",
    };
  if (/project|built|build|portfolio/.test(q))
    return {
      text: "My four featured projects are Password Security Tool, Cloud SOC Detection Lab, DevSecOps Pipeline and Identity Lifecycle Lab. They cover privacy-preserving web development, Sentinel detection engineering, Terraform security scanning and Entra ID access governance. You can open each project’s case study in the Work section.",
    };
  if (/skill|technolog|tool|stack|cloud|security/.test(q))
    return {
      text: "My hands-on toolkit includes Microsoft Sentinel, Entra ID, Azure, KQL, Terraform, GitHub Actions, tfsec, Checkov, RBAC, Linux and networking. For web development I use HTML, CSS, JavaScript, the Web Crypto API and REST APIs. AWS IAM and S3 are fundamentals in my current background.",
    };
  if (/contact|email|linkedin|github|hello|hi\b/.test(q))
    return {
      text: `You can reach me at ${profile.email}. My GitHub is Nsuthar1464, and my LinkedIn profile is sutharn555. Both are linked in the Contact section.`,
    };
  return {
    text: "I can answer questions about my four projects, technical skills, education, certificates and work experience using my résumé and project documentation. For a question those materials don’t cover, please email me — I’d rather give you a real answer than guess.",
  };
}

export default function AskPortfolio({
  onProject,
}: {
  onProject: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<
    { question: string; response: ReturnType<typeof answer> }[]
  >([]);
  const ask = (value: string) => {
    const q = value.trim();
    if (!q) return;
    setMessages((previous) => [
      ...previous.slice(-3),
      { question: q, response: answer(q) },
    ]);
    setQuery("");
  };
  return (
    <section className="ask-section content-section" id="ask">
      <p className="section-kicker">CONVERSATION</p>
      <h2>
        Ask me <span className="gradient-text">anything</span>
      </h2>
      <p className="ask-description">
        Answers from my résumé and project docs. Ask a question — or tap a
        starter.
      </p>
      <div className="conversation" aria-live="polite">
        {messages.map((m, i) => (
          <div className="message-pair" key={`${i}-${m.question}`}>
            <p className="question-message">{m.question}</p>
            <div className="answer-message">
              <span className="answer-initial">NS</span>
              <div>
                <p>{m.response.text}</p>
                {m.response.projectId && (
                  <button onClick={() => onProject(m.response.projectId!)}>
                    Explore this project
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <form
        className="ask-form"
        onSubmit={(e) => {
          e.preventDefault();
          ask(query);
        }}
      >
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          maxLength={600}
          aria-label="Ask a question"
          placeholder="Ask a question…"
        />
        <button
          type="submit"
          aria-label="Send question"
          disabled={!query.trim()}
        >
          <Send size={19} />
        </button>
      </form>
      <div className="question-starters">
        {[
          "What have you built?",
          "What’s your security background?",
          "Where do you study?",
        ].map((q) => (
          <button key={q} onClick={() => ask(q)}>
            <MessageCircle size={12} />
            {q}
          </button>
        ))}
      </div>
    </section>
  );
}

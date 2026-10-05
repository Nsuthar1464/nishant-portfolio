"use client";
import { useState } from "react";
import {
  UserRound,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  KeyRound,
} from "lucide-react";
const stages = [
  {
    title: "Joiner",
    label: "Least-privilege onboarding",
    group: "BankOps-Analyst",
    event: "Account created. Role-based access assigned.",
  },
  {
    title: "Mover",
    label: "A role changes. Access changes too.",
    group: "BankOps-Manager",
    event: "New role assigned. Previous group access removed.",
  },
  {
    title: "Leaver",
    label: "Remove access. Preserve the audit trail.",
    group: "Access removed",
    event: "Account disabled. Group memberships removed.",
  },
];
export default function IdentityDemo() {
  const [step, setStep] = useState(0);
  const [incident, setIncident] = useState(false);
  const stage = stages[step];
  return (
    <div className="identity-demo">
      <div className="demo-topline">
        <span>IDENTITY LIFECYCLE</span>
        <span>SIMULATED LAB</span>
      </div>
      <div className="identity-flow">
        <div className="flow-node">
          <UserRound size={29} />
          <span>Test account</span>
        </div>
        <ArrowRight size={22} />
        <div className={`flow-node ${incident ? "alert-node" : ""}`}>
          <KeyRound size={29} />
          <span>{incident ? "IT-Security" : stage.group}</span>
        </div>
      </div>
      <div
        className="lifecycle-controls"
        aria-label="Identity lifecycle stages"
      >
        {stages.map((s, i) => (
          <button
            key={s.title}
            aria-pressed={step === i && !incident}
            onClick={() => {
              setStep(i);
              setIncident(false);
            }}
          >
            {s.title}
          </button>
        ))}
      </div>
      <h3>{incident ? "Unexpected privilege change." : stage.label}</h3>
      <p>
        Explore the decisions in my Entra ID lab: onboard, adjust access, and
        offboard. Then try a simulated unauthorized group change.
      </p>
      <div
        className={`demo-status ${incident ? "is-alert" : ""}`}
        role="status"
      >
        {incident ? <ShieldAlert size={16} /> : <ShieldCheck size={16} />}
        <span>
          {incident
            ? "Unauthorized IT-Security membership detected."
            : stage.event}
        </span>
      </div>
      <button
        className="incident-toggle"
        onClick={() => {
          setIncident(!incident);
          if (incident) setStep(2);
        }}
      >
        {incident ? "Contain incident" : "Simulate privilege escalation"}
      </button>
      <small>A visual walkthrough — no live tenant is connected.</small>
    </div>
  );
}

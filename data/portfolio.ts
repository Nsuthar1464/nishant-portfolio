export const profile = {
  name: "Nishant Suthar",
  email: "Nishantrsuthar@gmail.com",
  github: "https://github.com/Nsuthar1464",
  linkedin: "https://www.linkedin.com/in/sutharn555/",
  location: "Willowbrook, Illinois",
  resume: "/nishant-suthar-resume.pdf",
  avatar: "/images/nishant-head.webp",
};

export type Project = {
  id: string;
  number: string;
  title: string;
  category: string;
  color: string;
  description: string;
  tags: string[];
  image?: string;
  imageAlt?: string;
  repo?: string;
  live?: string;
  headline: string;
  details: string[];
  outcome: string;
};
export const projects: Project[] = [
  {
    id: "password",
    number: "01",
    title: "Password Security Tool",
    category: "WEB DEVELOPMENT · PRIVACY",
    color: "lime",
    description:
      "A small tool with a big principle: your password stays yours. Check its strength, generate a better one, and search breach data without sharing the original.",
    tags: ["JavaScript", "Web Crypto API", "HaveIBeenPwned", "HTML / CSS"],
    image: "/images/password.webp",
    imageAlt:
      "The actual Password Security Tool website, showing its strength checker",
    repo: "https://github.com/Nsuthar1464/password-security-tool",
    live: "https://nsuthar1464.github.io/password-security-tool/",
    headline: "Privacy starts in the browser.",
    details: [
      "Built three integrated tools: a real-time strength checker, a generator with random, memorable and PIN modes, and a breach checker.",
      "Implemented k-anonymity: hash locally with the Web Crypto API, send only the first five hash characters to HaveIBeenPwned, and compare results on the device.",
      "Designed a responsive interface with copy controls, adjustable generation settings and scroll-triggered animations. Deployed and verified the tools on GitHub Pages.",
    ],
    outcome:
      "A shipped, client-side tool inspired by family members asking whether their passwords were strong or had been leaked.",
  },
  {
    id: "sentinel",
    number: "02",
    title: "Cloud SOC Detection Lab",
    category: "DETECTION ENGINEERING",
    color: "blue",
    description:
      "From raw identity logs to an actionable incident. A Microsoft Sentinel lab that detects simulated privilege escalation and connects the alert to the affected account.",
    tags: ["Microsoft Sentinel", "KQL", "Entra ID", "MITRE ATT&CK"],
    image: "/images/sentinel.webp",
    imageAlt:
      "Original Sentinel lab screenshot showing an incident with a mapped account entity",
    repo: "https://github.com/Nsuthar1464/sentinel-soc-detection-lab",
    headline: "Make the signal actionable.",
    details: [
      "Connected Entra ID sign-in and audit logs to Microsoft Sentinel and verified ingestion into Log Analytics.",
      "Wrote KQL to unpack nested audit data and detect a user being added to the high-privilege IT-Security group in a simulated tenant.",
      "Created a scheduled analytics rule, mapped the detection to MITRE ATT&CK Privilege Escalation, and tested automatic incident creation.",
      "Triaged the incident as a true positive and improved the rule with account entity mapping for investigation.",
    ],
    outcome:
      "An automated detection pipeline in a simulated environment with fictional test users, documented from ingestion through incident closure.",
  },
  {
    id: "devsecops",
    number: "03",
    title: "DevSecOps Pipeline",
    category: "CLOUD SECURITY · INFRASTRUCTURE",
    color: "purple",
    description:
      "Catch cloud misconfigurations before deployment. Terraform security scanning that turns insecure S3 and SSH settings into a documented remediation workflow.",
    tags: ["Terraform", "GitHub Actions", "tfsec", "Checkov"],
    image: "/images/devsecops.webp",
    imageAlt:
      "Original GitHub Actions screenshot showing the Terraform security scan passing after remediation",
    repo: "https://github.com/Nsuthar1464/devsecops-terraform-pipeline",
    headline: "Build security into the commit.",
    details: [
      "Automated tfsec and Checkov scans of AWS Terraform code on every push to main using GitHub Actions.",
      "Tested the pipeline with intentionally public S3 storage, unrestricted SSH ingress and missing encryption.",
      "Remediated critical and high findings with KMS encryption, S3 public-access blocks, versioning, access logging and restricted network ingress.",
      "Documented advisory versus blocking scan gates and accepted lower-priority findings. This project scans code; it does not deploy AWS resources.",
    ],
    outcome:
      "A complete red-to-green remediation history demonstrating risk-based triage and security checks at the infrastructure code stage.",
  },
  {
    id: "iam",
    number: "04",
    title: "Identity Lifecycle Lab",
    category: "IDENTITY & ACCESS MANAGEMENT",
    color: "orange",
    description:
      "The right access, for the right person, for the right amount of time. Modeling onboarding, role changes, offboarding and incident response in Entra ID.",
    tags: ["Microsoft Entra ID", "RBAC", "Least privilege", "Audit logs"],
    image: "/images/iam.webp",
    imageAlt:
      "Original Entra ID screenshot showing the simulated Lakeshore Financial security group baseline",
    repo: "https://github.com/Nsuthar1464/lakeshore-iam-lab",
    headline: "Treat identity as a security boundary.",
    details: [
      "Created a fictional Lakeshore Financial lab tenant with role-based security groups and test users.",
      "Walked through the full Joiner–Mover–Leaver lifecycle, granting least-privilege access and cleaning up privilege creep after a role change.",
      "Disabled departing accounts and removed memberships while preserving the audit trail.",
      "Detected a simulated unauthorized membership change to IT-Security, removed the access and disabled the affected test account.",
    ],
    outcome:
      "An evidence-backed identity governance lab with audit logs for each scenario. No real company systems or users were involved.",
  },
];

export const skillGroups = [
  {
    id: "cloud",
    title: "Cloud & detection",
    subtitle: "Find the signal in the noise.",
    skills: [
      "Microsoft Sentinel",
      "Microsoft Entra ID",
      "Azure",
      "KQL",
      "Log Analytics",
      "MITRE ATT&CK",
      "AWS IAM & S3 fundamentals",
    ],
    note: "Identity logs, detection rules and end-to-end incident triage.",
    projectIds: ["sentinel", "iam"],
  },
  {
    id: "devsecops",
    title: "DevSecOps & identity",
    subtitle: "Security, earlier in the process.",
    skills: [
      "Terraform",
      "GitHub Actions",
      "tfsec",
      "Checkov",
      "RBAC",
      "Least privilege",
      "Access reviews",
    ],
    note: "Infrastructure scanning and access controls built around real scenarios.",
    projectIds: ["devsecops", "iam"],
  },
  {
    id: "systems",
    title: "Systems & networks",
    subtitle: "Understand what runs underneath.",
    skills: [
      "Ubuntu / Linux",
      "TCP/IP",
      "DNS / DHCP",
      "VLANs",
      "Cisco routing & switching",
      "SSH",
      "UFW",
      "fail2ban",
      "Tailscale",
      "Pi-hole",
    ],
    note: "Hands-on Linux administration and CCNA curriculum networking.",
    projectIds: [],
  },
  {
    id: "web",
    title: "Web & tooling",
    subtitle: "Make the useful thing usable.",
    skills: [
      "HTML",
      "CSS",
      "JavaScript",
      "Web Crypto API",
      "REST APIs",
      "Git / GitHub",
      "Docker",
      "Responsive design",
    ],
    note: "Browser-based tools, clear documentation and complete deployments.",
    projectIds: ["password"],
  },
];
export const experience = [
  {
    company: "Amazon",
    role: "Locker+ Associate",
    date: "OCT 2025 — AUG 2026",
    location: "Downers Grove, Illinois",
    points: [
      "Provided front-line customer and technical support, diagnosing on-site system and device issues in a high-volume environment.",
      "Trained new hires on site systems and daily workflows, explaining technical steps clearly.",
      "Supported management with computer tasks, troubleshooting and accurate documentation.",
    ],
  },
];

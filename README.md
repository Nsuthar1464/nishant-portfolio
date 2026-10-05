# Nishant Suthar — Personal Portfolio

An original, responsive portfolio built with Next.js, React, TypeScript, Motion and Lucide. All project files are in this folder.

## Run locally

Requires Node.js 20.9 or newer and npm.

```sh
cd nishant-portfolio
npm install
npm run dev
```

Open http://127.0.0.1:3000. If that port is in use, Next.js prints the chosen alternative.

Production:

```sh
npm run build
npm start
```

`npm run typecheck` checks TypeScript without creating a build.

## Editing

- `data/portfolio.ts`: identity, social links, projects, technologies and work experience.
- `components/Portfolio.tsx`: sections, native project dialogs, navigation, project flip cards and contact interactions. Education and certificate content is here.
- `components/Character.tsx`: hero portrait cursor tracking and greetings.
- `components/CharacterScene.tsx`: original illustrated character scenes with spring-based cursor movement, drag tilt, keyboard controls and reset buttons.
- `app/globals.css`: design tokens, styles and responsive breakpoints.
- `app/layout.tsx`: page title, description and favicon.
- `public/images/`: optimized images used by the website; source artwork is retained locally.
- `public/nishant-suthar-resume.pdf`: the PDF converted from the latest supplied final résumé, served by the résumé links.

## Character

The original transparent cartoon portrait was generated with the built-in image generation tool, based on the supplied profile photo. All three character scenes use original Nishant artwork.

The integrated asset is `public/images/nishant-head.webp`; the editable PNG source is retained locally. The portrait reacts to cursor position with limited spring-based rotation and translation. It stays in its own stage, rather than following the mouse across the page. An idle float and clickable greeting add personality. Pointer tracking is disabled on coarse-pointer devices and when reduced motion is requested. MotionConfig and CSS also respect reduced motion.

The current character is a transparent, head-only 3D-style cartoon. To replace it, provide a front-facing transparent PNG/WebP, at least 1000 pixels tall, with complete hair and ears in frame. Change `profile.avatar` in `data/portfolio.ts`. The separate original work-section illustration is `public/images/nishant-workspace.webp` (editable PNG retained locally). Both were generated with the built-in image tool from Nishant’s supplied likeness, with no reference-site artwork used.

The revised head prompt requested a friendly floating head preserving the supplied avatar’s curly hair, skin tone, beard, eyes and earring, without a neck, body, logos or background. The work illustration prompt requested the same original character seated with a purple laptop beneath a larger floating laptop on a transparent background.

## Interactions

- `components/TechGraph.tsx`: rotating technology sphere, drag, zoom, hover connections, keyboard controls and an accessible technology list.
- `components/AskPortfolio.tsx`: local, fact-based answers drawn from the résumé and project descriptions. No external AI service, server-side storage or API key is required.
- `components/IdentityDemo.tsx`: simulated Joiner–Mover–Leaver and incident-containment walkthrough.
- Project cards flip to highlights and technology chips. Case studies contain actual evidence screenshots and verified repository links.

## Content provenance

Formal background, education, employment, dates and certificates come from `Nishant-Suthar-resume.pdf`. Security+ and AWS Cloud Practitioner remain explicitly **in progress**. The CIT CCNA credential is the College of DuPage certificate, not a claim of earned Cisco vendor certification. The planned software engineering minor is omitted because the supplied reference says it is conditional.

The public GitHub profile and repository inventories were inspected. Four substantive original projects were selected; forks, course exercise repositories and repositories without enough relevant detail were omitted:

- https://github.com/Nsuthar1464/password-security-tool
- https://github.com/Nsuthar1464/sentinel-soc-detection-lab
- https://github.com/Nsuthar1464/devsecops-terraform-pipeline
- https://github.com/Nsuthar1464/lakeshore-iam-lab

Project descriptions and implementation details were checked against these READMEs. Exactly these four projects are featured, as requested.

Original public evidence images:

- Sentinel: `screenshots/s4-incident-with-entity.png`
- DevSecOps: `screenshots/s4-scan-passed.png`
- IAM: `screenshots/01-groups-baseline.png`
- Password tool: screenshot of the verified live site at https://nsuthar1464.github.io/password-security-tool/

Lab project details identify simulated environments. The Terraform project scans code; it does not claim deployed AWS infrastructure.

Design inspiration: https://coco-web-chi.vercel.app/ — studied on desktop and mobile for dark presentation, large typography, playful character motion and interactive project presentation. The revised version closely follows its floating-head composition, purple/pink palette, typography, technology graph, project flip cards, fixed navigation and section sequence. Personal content, character artwork and cybersecurity demos are Nishant’s own.

Bricolage Grotesque, IBM Plex Sans and IBM Plex Mono are self-hosted; their SIL Open Font Licenses are included in `public/fonts/`. Images are optimized to WebP, and Next.js handles responsive image sizing and lazy loading. No paid services or environment variables are required. The site has no form backend; contact uses your actual mailto address, clipboard and social links.

## Review before public deployment

- Review your cartoon likeness, project descriptions and contact information.
- The résumé download uses the latest supplied final résumé, converted to PDF without content changes.
- This task runs locally; no public deployment has been created.

The original seated character artwork remains unchanged. Scene interactions rotate the illustrated plane within bounded angles; they do not claim to provide a full 360-degree 3D avatar. The third scene uses a small original Nishant character holding a tablet, in front of a floating blue bars-and-chart panel on the right of the Contact heading.

Third scene: `public/images/nishant-tablet-character.webp`; its source PNG is retained locally. The character was generated from the original seated illustration with the same likeness, hair, beard, earring and clothing, standing with a small coral tablet. The blue chart, bars and pink nodes are original HTML/CSS/SVG in `CharacterScene.tsx`, following the reference composition. No Coco screenshot or character is displayed.

Contact uses three outlined rectangular cards: email copy, LinkedIn and GitHub. No phone number is displayed. The seated Work character was enlarged slightly; its source illustration is unchanged.

## Repository privacy

Original supplied documents and photos, preview captures, environment files, dependencies and build output are excluded from Git. The public PDF preserves the latest résumé exactly as supplied, including its contact details. Professional email and social links are intentionally included for portfolio contact.

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nishant Suthar — Cybersecurity & Cloud Security",
  description:
    "Cybersecurity student at DePaul University. Explore Nishant Suthar’s hands-on work in cloud security, detection engineering, identity, DevSecOps, and web development.",
  icons: { icon: "/favicon.svg" },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

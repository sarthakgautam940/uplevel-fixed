import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UpLevel Services — AI-Powered Web Systems for Elite Contractors",
  description: "We build premium website systems, AI phone agents, and automated lead pipelines for elite contractors. 48-hour delivery. Month-to-month contracts. Based in Richmond, VA.",
  keywords: "web design contractors, AI phone agent, lead generation contractors, pool builder website, HVAC website, contractor marketing, Virginia web agency",
  openGraph: {
    title: "UpLevel Services — Your AI-Powered Sales System, Live in 14 Days",
    description: "We build the machine that fills your calendar. Premium web systems + AI automation for elite contractors.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

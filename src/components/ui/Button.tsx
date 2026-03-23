import { cn } from "@/lib/utils";
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  children: React.ReactNode;
}

export function Button({ variant = "primary", className, children, ...props }: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center px-6 py-3 rounded-full font-bold text-sm transition-all duration-300 uppercase tracking-wider";
  
  const variants = {
    primary: "bg-[#00ff88] text-black hover:bg-[#00cc6a] hover:shadow-[0_0_20px_rgba(0,255,136,0.4)]",
    secondary: "bg-[#00a3ff] text-white hover:bg-[#0082cc] hover:shadow-[0_0_20px_rgba(0,163,255,0.4)]",
    outline: "border border-white/20 text-white hover:border-[#00ff88] hover:text-[#00ff88]",
  };

  return (
    <button className={cn(baseStyles, variants[variant], className)} {...props}>
      {children}
    </button>
  );
}

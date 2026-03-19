"use client";

import { useEffect, useRef, useCallback } from "react";

let toastTimeout: ReturnType<typeof setTimeout>;

export function showCopyToast(text: string) {
  // Remove existing toast
  const existing = document.getElementById("copy-toast");
  if (existing) existing.remove();
  clearTimeout(toastTimeout);

  const toast = document.createElement("div");
  toast.id = "copy-toast";
  toast.className = "copy-toast";
  toast.textContent = text;
  document.body.appendChild(toast);

  toastTimeout = setTimeout(() => {
    toast.remove();
  }, 2100);
}

export async function copyToClipboard(text: string, label?: string) {
  try {
    await navigator.clipboard.writeText(text);
    showCopyToast(label ? `${label} copied!` : "Copied!");
  } catch {
    // fallback
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    ta.remove();
    showCopyToast(label ? `${label} copied!` : "Copied!");
  }
}

export default function CopyToast() {
  // This component sets up global click handlers for phone/email copy
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest("a");
      if (!link) return;

      const href = link.getAttribute("href") || "";
      if (href.startsWith("tel:")) {
        e.preventDefault();
        const phone = href.replace("tel:", "");
        copyToClipboard(phone, "Phone number");
        return;
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
}

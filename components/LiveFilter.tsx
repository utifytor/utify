"use client";
import { useEffect } from "react";

/**
 * Upgrades the homepage search box to live filtering when JS is available.
 * Without JS the surrounding GET form still works via a full page load.
 */
export function LiveFilter() {
  useEffect(() => {
    const input = document.getElementById("tool-search") as HTMLInputElement | null;
    if (!input) return;
    const onInput = () => {
      const q = input.value.toLowerCase().split(/\s+/).filter(Boolean);
      document.querySelectorAll<HTMLElement>("[data-tool]").forEach((li) => {
        const hay = li.dataset.tool || "";
        li.style.display = q.every((w) => hay.includes(w)) ? "" : "none";
      });
    };
    input.addEventListener("input", onInput);
    return () => input.removeEventListener("input", onInput);
  }, []);
  return null;
}

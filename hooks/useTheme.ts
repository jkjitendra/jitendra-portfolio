"use client";

import { useEffect, useState } from "react";

export function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    // Initial check
    const getTheme = () => {
      const currentTheme = document.documentElement.getAttribute("data-theme");
      return (currentTheme === "dark" || currentTheme === "light") ? currentTheme : "light";
    };

    setTheme(getTheme());

    // Observer for changes
    const observer = new MutationObserver(() => {
      setTheme(getTheme());
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  return theme;
}

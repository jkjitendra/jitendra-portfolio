"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

const glyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*+=?<>[]/\\";

type ScrambleTextProps = {
  text: string;
  className?: string;
  duration?: number;
  delay?: number;
  emphasisRanges?: Array<{ start: number; end: number }>;
  wrapByWords?: boolean;
};

/**
 * A short, one-time character decode used for prominent interface copy.
 * The real text is preserved for assistive technology and reduced-motion users.
 */
export default function ScrambleText({ text, className, duration, delay = 0, emphasisRanges = [], wrapByWords = false }: ScrambleTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { amount: 0.7 });
  const reduceMotion = useReducedMotion();
  const [displayedText, setDisplayedText] = useState(text);
  const [playId, setPlayId] = useState(0);
  const wasVisible = useRef(false);
  const hasPlayed = useRef(false);
  const scrollDirection = useRef<"initial" | "up" | "down">("initial");
  const previousScrollY = useRef(0);
  const resolvedDuration = duration ?? Math.max(1300, Math.min(2500, text.length * 78));
  const renderText = (value: string, startIndex = 0) => Array.from(value, (character, index) => {
    const isEmphasized = emphasisRanges.some(({ start, end }) => startIndex + index >= start && startIndex + index < end);
    return isEmphasized ? <em key={index}>{character}</em> : character;
  });

  const renderWrappedWords = () => {
    const finalWords = text.split(" ");
    const displayedWords = displayedText.split(" ");
    let startIndex = 0;

    return finalWords.map((word, index) => {
      const wordStartIndex = startIndex;
      startIndex += word.length + 1;

      return (
        <Fragment key={`${word}-${wordStartIndex}`}>
          <span className="decode-word">
            <span className="decode-word-layout">{renderText(word, wordStartIndex)}</span>
            <span className="decode-word-text">{renderText(displayedWords[index] ?? word, wordStartIndex)}</span>
          </span>
          {index < finalWords.length - 1 ? " " : null}
        </Fragment>
      );
    });
  };

  useEffect(() => {
    previousScrollY.current = window.scrollY;
    const onScroll = () => {
      const nextScrollY = window.scrollY;
      if (nextScrollY !== previousScrollY.current) {
        scrollDirection.current = nextScrollY > previousScrollY.current ? "down" : "up";
        previousScrollY.current = nextScrollY;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!isInView) {
      wasVisible.current = false;
      return;
    }

    if (wasVisible.current) return;
    wasVisible.current = true;

    // First render always decodes. Later runs are deliberately triggered only
    // when the user returns to an item while travelling down the page.
    if (!hasPlayed.current || scrollDirection.current === "down") {
      hasPlayed.current = true;
      setPlayId((value) => value + 1);
    }
  }, [isInView]);

  useEffect(() => {
    if (!playId || reduceMotion) return;

    let frame = 0;
    let animationFrame = 0;
    let timer = 0;

    const getNoise = () => Array.from(text, (character, index) => {
      if (character === " ") return " ";
      return glyphs[(index * 11 + playId * 7) % glyphs.length];
    }).join("");

    setDisplayedText(getNoise());

    const begin = () => {
      const start = performance.now();
      const tick = (now: number) => {
        const progress = Math.min((now - start) / resolvedDuration, 1);
        const resolvedCharacters = Math.floor(progress * text.length);
        const nextText = Array.from(text, (character, index) => {
          if (character === " ") return " ";
          if (index < resolvedCharacters) return character;
          return glyphs[(index * 11 + frame * 7) % glyphs.length];
        }).join("");

        setDisplayedText(nextText);
        frame += 1;
        if (progress < 1) animationFrame = requestAnimationFrame(tick);
      };
      animationFrame = requestAnimationFrame(tick);
    };

    timer = window.setTimeout(begin, delay);
    return () => {
      window.clearTimeout(timer);
      cancelAnimationFrame(animationFrame);
    };
  }, [delay, playId, reduceMotion, resolvedDuration, text]);

  return (
    <>
      {wrapByWords ? (
        <span ref={ref} className={`decode-shell decode-shell--words${className ? ` ${className}` : ""}`} aria-hidden="true">
          {renderWrappedWords()}
        </span>
      ) : (
        <span ref={ref} className={`decode-shell${className ? ` ${className}` : ""}`} aria-hidden="true">
          <span className="decode-layout">{renderText(text)}</span>
          <span className="decode-text">{renderText(displayedText)}</span>
        </span>
      )}
      <span className="sr-only">{text}</span>
    </>
  );
}

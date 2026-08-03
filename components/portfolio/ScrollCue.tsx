type ScrollCueProps = {
  side: "left" | "right";
};

/** Decorative section handoff cue. It intentionally has no interactive role. */
export default function ScrollCue({ side }: ScrollCueProps) {
  return (
    <div className={`scroll-cue scroll-cue--${side}`} aria-hidden="true">
      <span>SCROLL TO EXPLORE</span>
      <svg viewBox="0 0 54 62" focusable="false">
        <path className="scroll-cue-bracket" d="M14 2H5v58h9M40 2h9v58h-9" />
        <path className="scroll-cue-chevron scroll-cue-chevron--one" d="m15 13 12 9 12-9" />
        <path className="scroll-cue-chevron scroll-cue-chevron--two" d="m15 27 12 9 12-9" />
        <path className="scroll-cue-chevron scroll-cue-chevron--three" d="m15 41 12 9 12-9" />
      </svg>
    </div>
  );
}

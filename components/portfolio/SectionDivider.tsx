type SectionDividerProps = {
  side: "left" | "right";
};

/** Decorative handoff between major portfolio sections. */
export default function SectionDivider({ side }: SectionDividerProps) {
  return (
    <div className={`section-divider section-divider--${side}`} aria-hidden="true">
      <span className="section-divider-label">SCROLL TO EXPLORE</span>
      <span className="section-divider-chevron">
        {(["upper", "lower"] as const).map((layer) => (
          <svg className={`section-divider-chevron-layer section-divider-chevron-layer--${layer}`} viewBox="0 0 48 58" focusable="false" key={layer}>
            <path className="section-divider-bracket" d="M11 3H4v52h7M37 3h7v52h-7" />
            <path d="m14 14 10 9 10-9" />
            <path d="m14 28 10 9 10-9" />
            <path d="m14 42 10 9 10-9" />
          </svg>
        ))}
      </span>
    </div>
  );
}

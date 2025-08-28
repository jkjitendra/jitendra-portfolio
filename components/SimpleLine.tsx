type Point = { x: number; y: number };

export default function SimpleLine({
  values,
  width = 480,
  height = 160,
}: {
  values: number[];
  width?: number;
  height?: number;
}) {
  if (!values.length) return null;

  const max = Math.max(...values),
    min = Math.min(...values),
    pad = 12;

  const step = (width - pad * 2) / (values.length - 1 || 1);

  const pts: Point[] = values.map((v, i) => {
    const x = pad + i * step;
    const y =
      height -
      pad -
      ((v - min) / (max - min || 1)) * (height - pad * 2);
    return { x, y };
  });

  const d = pts
    .map((p, i) => `${i ? "L" : "M"}${p.x},${p.y}`)
    .join(" ");

  return (
    <svg
      width={width}
      height={height}
      className="rounded-lg border border-white/10 bg-white/5"
    >
      <path d={d} fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
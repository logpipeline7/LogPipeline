export interface FieldColorTheme {
  name: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  highlightBg: string;
  highlightText: string;
  highlightBorder: string;
}

export const COLOR_PALETTE: FieldColorTheme[] = [
  {
    name: "emerald",
    badgeBg: "bg-emerald-950/80",
    badgeText: "text-emerald-300",
    badgeBorder: "border-emerald-500/50",
    highlightBg: "bg-emerald-500/20",
    highlightText: "text-emerald-200",
    highlightBorder: "border-b-2 border-emerald-400",
  },
  {
    name: "cyan",
    badgeBg: "bg-cyan-950/80",
    badgeText: "text-cyan-300",
    badgeBorder: "border-cyan-500/50",
    highlightBg: "bg-cyan-500/20",
    highlightText: "text-cyan-200",
    highlightBorder: "border-b-2 border-cyan-400",
  },
  {
    name: "amber",
    badgeBg: "bg-amber-950/80",
    badgeText: "text-amber-300",
    badgeBorder: "border-amber-500/50",
    highlightBg: "bg-amber-500/20",
    highlightText: "text-amber-200",
    highlightBorder: "border-b-2 border-amber-400",
  },
  {
    name: "violet",
    badgeBg: "bg-violet-950/80",
    badgeText: "text-violet-300",
    badgeBorder: "border-violet-500/50",
    highlightBg: "bg-violet-500/20",
    highlightText: "text-violet-200",
    highlightBorder: "border-b-2 border-violet-400",
  },
  {
    name: "rose",
    badgeBg: "bg-rose-950/80",
    badgeText: "text-rose-300",
    badgeBorder: "border-rose-500/50",
    highlightBg: "bg-rose-500/20",
    highlightText: "text-rose-200",
    highlightBorder: "border-b-2 border-rose-400",
  },
  {
    name: "sky",
    badgeBg: "bg-sky-950/80",
    badgeText: "text-sky-300",
    badgeBorder: "border-sky-500/50",
    highlightBg: "bg-sky-500/20",
    highlightText: "text-sky-200",
    highlightBorder: "border-b-2 border-sky-400",
  },
  {
    name: "orange",
    badgeBg: "bg-orange-950/80",
    badgeText: "text-orange-300",
    badgeBorder: "border-orange-500/50",
    highlightBg: "bg-orange-500/20",
    highlightText: "text-orange-200",
    highlightBorder: "border-b-2 border-orange-400",
  },
  {
    name: "fuchsia",
    badgeBg: "bg-fuchsia-950/80",
    badgeText: "text-fuchsia-300",
    badgeBorder: "border-fuchsia-500/50",
    highlightBg: "bg-fuchsia-500/20",
    highlightText: "text-fuchsia-200",
    highlightBorder: "border-b-2 border-fuchsia-400",
  },
];

/**
 * Deterministically maps a field name string to one of the available themes
 */
export function getFieldColorTheme(fieldName: string, indexOffset = 0): FieldColorTheme {
  let hash = 0;
  for (let i = 0; i < fieldName.length; i++) {
    hash = (hash << 5) - hash + fieldName.charCodeAt(i);
    hash |= 0;
  }
  const idx = Math.abs(hash + indexOffset) % COLOR_PALETTE.length;
  return COLOR_PALETTE[idx];
}

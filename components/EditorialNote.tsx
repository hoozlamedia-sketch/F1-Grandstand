import { useMemo } from "react";

type Props = {
  kind: "article" | "video";
  title: string;
  source?: string;         // e.g., PlanetF1, Motorsport.com
  channel?: string;        // e.g., F1 Grandstand
  publishedAt?: string;    // ISO or readable date
  maxWords?: number;       // default ~35 words
};

const TEAMS = [
  "Red Bull","Ferrari","Mercedes","McLaren","Aston Martin","Alpine",
  "Williams","RB","Haas","Sauber"
];
const DRIVERS = [
  "Verstappen","Perez","Leclerc","Sainz","Hamilton","Russell","Norris","Piastri",
  "Alonso","Stroll","Ocon","Gasly","Albon","Sargeant","Tsunoda","Ricciardo",
  "Hülkenberg","Magnussen","Bottas","Zhou","Bearman","Lawson"
];

function pickMentions(title: string) {
  const foundTeams = TEAMS.filter(t => new RegExp(`\\b${t}\\b`, "i").test(title));
  const foundDrivers = DRIVERS.filter(d => new RegExp(`\\b${d}\\b`, "i").test(title));
  return { teams: foundTeams.slice(0,2), drivers: foundDrivers.slice(0,2) };
}

function clampWords(s: string, max = 35) {
  const parts = s.trim().split(/\s+/);
  if (parts.length <= max) return s.trim();
  return parts.slice(0, max - 1).join(" ") + "…";
}

export default function EditorialNote({
  kind,
  title,
  source,
  channel,
  publishedAt,
  maxWords = 35,
}: Props) {
  const text = useMemo(() => {
    const { teams, drivers } = pickMentions(title);
    const who =
      drivers.length ? drivers.join(" & ")
      : teams.length ? teams.join(" & ")
      : "the F1 grid";

    const when = publishedAt ? ` (${new Date(publishedAt).toLocaleDateString()})` : "";

    if (kind === "video") {
      const c = channel || "F1 Grandstand";
      const base = `Quick take: ${title}. ${c} breaks down what it means for ${who} and the championship picture${when}.`;
      return clampWords(base, maxWords);
    } else {
      const src = source ? `via ${source}` : "across the paddock";
      const base = `Summary: ${title} — key context for ${who}, with angles on strategy, upgrades and standings ${src}${when}.`;
      return clampWords(base, maxWords);
    }
  }, [kind, title, source, channel, publishedAt, maxWords]);

  return (
    <p className="mt-2 text-sm leading-6 text-neutral-300">
      {text}
    </p>
  );
}

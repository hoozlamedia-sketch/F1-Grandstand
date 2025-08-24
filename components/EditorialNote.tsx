import React from "react";

type Props = { className?: string; children?: React.ReactNode };

export default function EditorialNote({ className = "", children }: Props) {
  return (
    <p className={`text-xs text-neutral-400 ${className}`}>
      {children ?? "Editorial note: F1 Grandstand curates official Formula 1 news videos from our YouTube channel and trusted sources."}
    </p>
  );
}

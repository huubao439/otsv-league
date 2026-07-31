import { type Metadata } from "next";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function siteMetadata(partial?: Partial<Metadata>): Metadata {
  const base: Metadata = {
    title: {
      default: "OTSV FOOTBALL LEAGUE 2026",
      template: "%s | OTSV FOOTBALL LEAGUE 2026",
    },
    description: "Giải bóng đá công ty OTSV 2026 - Nơi giao lưu, gắn kết và thi đấu.",
  };
  return { ...base, ...partial };
}

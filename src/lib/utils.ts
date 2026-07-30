import { type Metadata } from "next";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function siteMetadata(partial?: Partial<Metadata>): Metadata {
  const base: Metadata = {
    title: {
      default: "OTSV League",
      template: "%s | OTSV League",
    },
    description: "Giải bóng đá công ty OTSV - Nơi giao lưu, gắn kết và thi đấu.",
    icons: {
      icon: "/favicon.ico",
    },
  };
  return { ...base, ...partial };
}

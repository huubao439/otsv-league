"use client";

import { useState } from "react";
import { PageHeading } from "@/components/league/page-heading";
import {
  type RuleGroup,
  type RuleLocale,
  localeNames,
  rulesByLocale,
} from "@/data/rules";

const locales: RuleLocale[] = ["en", "vi"];

function Group({ group }: { group: RuleGroup }) {
  const ListTag = group.ordered ? "ol" : "ul";

  return (
    <div className="flex flex-col gap-2.5">
      {group.title ? (
        <h3 className="m-0 font-heading text-[17px] uppercase leading-none">{group.title}</h3>
      ) : null}
      {group.intro ? (
        <p className="m-0 text-[13px] font-medium leading-[1.6] text-muted-foreground">
          {group.intro}
        </p>
      ) : null}

      <ListTag
        className={`m-0 flex flex-col gap-2 pl-5 text-[13.5px] leading-[1.6] text-muted-foreground ${
          group.ordered ? "list-decimal" : "list-disc"
        }`}
      >
        {group.items.map((item, index) => (
          <li key={index} className="marker:text-[var(--pink)]">
            {item.label ? (
              <span className="font-bold text-foreground">{item.label}: </span>
            ) : null}
            {item.text}
          </li>
        ))}
      </ListTag>
    </div>
  );
}

export function RulesContent() {
  // English is the default; the toggle swaps in the original Vietnamese.
  const [locale, setLocale] = useState<RuleLocale>("en");
  const doc = rulesByLocale[locale];

  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-5.5 px-4 py-9 pb-18 sm:px-6 lg:px-8 animate-fade-up">
      <PageHeading
        eyebrow="OTSV Football League 2026"
        title="Tournament"
        accent="rules"
        aside={
          <div
            role="group"
            aria-label="Language"
            data-testid="rules-language-toggle"
            className="flex gap-1.5 rounded-full border border-border bg-[var(--surface-2)] p-1"
          >
            {locales.map((code) => (
              <button
                key={code}
                type="button"
                aria-pressed={code === locale}
                data-testid={`rules-lang-${code}`}
                onClick={() => setLocale(code)}
                className={
                  code === locale
                    ? "cursor-pointer rounded-full bg-[image:var(--grad)] px-4 py-2 text-xs font-bold leading-none text-white"
                    : "cursor-pointer rounded-full px-3.5 py-2 text-xs font-semibold leading-none text-[var(--faint)] transition-colors hover:text-foreground"
                }
              >
                {localeNames[code]}
              </button>
            ))}
          </div>
        }
      />

      <div
        // Vietnamese and English differ in length; keying on locale restarts the
        // fade so the swap reads as a deliberate change rather than a flicker.
        key={locale}
        lang={locale}
        data-testid="rules-document"
        className="flex flex-col gap-4 animate-fade-up"
      >
        <div className="rounded-[20px] border border-border bg-[image:var(--grad-soft)] p-6">
          <h2 className="m-0 font-heading text-[22px] uppercase leading-tight">{doc.title}</h2>
          <p className="mt-2.5 max-w-[70ch] text-[13.5px] font-medium leading-[1.6] text-muted-foreground">
            <span className="font-bold text-foreground">{doc.purposeLabel}: </span>
            {doc.purpose}
          </p>
        </div>

        {doc.sections.map((section) => (
          <section
            key={section.number}
            className="flex flex-col gap-4 rounded-[20px] border border-border bg-[var(--surface)] p-6 shadow-[var(--shadow-soft)]"
          >
            <div className="flex items-baseline gap-3 border-b border-border pb-3">
              <span className="font-heading text-[20px] leading-none text-[var(--pink)]">
                {section.number}
              </span>
              <h2 className="m-0 font-heading text-[20px] uppercase leading-none">
                {section.heading}
              </h2>
            </div>

            <div className="flex flex-col gap-5">
              {section.groups.map((group, index) => (
                <Group key={index} group={group} />
              ))}
            </div>
          </section>
        ))}

        <p className="m-0 rounded-[20px] border border-dashed border-[var(--border-strong)] p-5 text-[12.5px] font-semibold italic leading-[1.6] text-[var(--faint)]">
          {doc.note}
        </p>
      </div>
    </div>
  );
}

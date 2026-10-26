// OWNER: foundation-ui.
//
// AppearanceSwitch: the account menu's Light / Dark / System row (GEN-22), a Radix menu radio group drawn as equal-width
// icon choices that keeps the menu open. Kept out of ui/dropdown-menu.tsx so it never reaches the booking page bundle
// (GEN-07 budget).
"use client";

import * as RadixMenu from "@radix-ui/react-dropdown-menu";
import type * as React from "react";
import { cn } from "@/lib/cn";
export type AppearanceSwitchProps = {
  /** Accessible name of the choice group. */
  label: string;
  value: string;
  options: readonly { value: string; label: string; icon: React.ReactNode }[];
  onValueChange: (value: string) => void;
};
/** A row of equal-width radio choices (icon over a short label) that does not close the menu. */
export function AppearanceSwitch({ label, value, options, onValueChange }: AppearanceSwitchProps) {
  return (
    <RadixMenu.RadioGroup
      aria-label={label}
      value={value}
      onValueChange={onValueChange}
      className="mx-2 mb-1.5 grid auto-cols-fr grid-flow-col gap-1 rounded-[8px] bg-pebble p-1"
    >
      {options.map((o) => (
        <RadixMenu.RadioItem
          key={o.value}
          value={o.value}
          onSelect={(e) => e.preventDefault()}
          className={cn(
            "flex min-h-11 cursor-pointer select-none flex-col items-center justify-center gap-0.5 rounded-[6px] px-2 py-1 text-[12px] leading-4 font-semibold text-ink-2 outline-none",
            "data-[highlighted]:text-ink data-[highlighted]:data-[state=unchecked]:bg-mist data-[state=checked]:bg-[var(--white)] data-[state=checked]:text-ink data-[state=checked]:shadow-[var(--shadow-next)] focus-visible:ring-2 focus-visible:ring-[var(--focus)]",
            "[&_svg]:size-4 [&_svg]:shrink-0",
          )}
        >
          {o.icon}
          {o.label}
        </RadixMenu.RadioItem>
      ))}
    </RadixMenu.RadioGroup>
  );
}

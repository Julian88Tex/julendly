// OWNER: foundation-ui.
//
// DropdownMenu (ARCHITECTURE 20.2, Radix): DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem
// (icon, destructive, href), DropdownMenuSeparator, DropdownMenuLabel, DropdownMenuGroup and DropdownMenuSwitchItem
// (the kebab menu "On/Off" row, ET-05) and DropdownMenuSegmented (a row of icon choices, e.g. Appearance). Classic look: white popover, 40px rows, #F4F8FF highlight, #476788 icons.
// Keyboard: arrows, Home/End, typeahead, Enter/Space, Escape (focus returns to the trigger).
"use client";

import * as RadixMenu from "@radix-ui/react-dropdown-menu";
import Link from "next/link";
import type { Route } from "next";
import type * as React from "react";
import { cn } from "@/lib/cn";
import { menuTriggerOf, rememberReturnTarget } from "./use-return-focus";

export const DropdownMenu = RadixMenu.Root;
export const DropdownMenuTrigger = RadixMenu.Trigger;
export const DropdownMenuGroup = RadixMenu.Group;
export const DropdownMenuSub = RadixMenu.Sub;

export type DropdownMenuContentProps = React.ComponentProps<typeof RadixMenu.Content>;
export function DropdownMenuContent({ className, sideOffset = 6, align = "end", collisionPadding = 8, ...rest }: DropdownMenuContentProps) {
  return (
    <RadixMenu.Portal>
      <RadixMenu.Content
        sideOffset={sideOffset}
        align={align}
        collisionPadding={collisionPadding}
        className={cn(
          "z-50 max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-52 max-w-[calc(100vw-16px)] overflow-y-auto",
          "rounded-[var(--radius-card)] border border-line bg-white p-1 text-ink shadow-[var(--shadow-pop)] outline-none data-[state=open]:animate-pop-in",
          className,
        )}
        {...rest}
      />
    </RadixMenu.Portal>
  );
}

export type DropdownMenuItemProps = React.ComponentProps<typeof RadixMenu.Item> & {
  icon?: React.ReactNode;
  destructive?: boolean;
  /** Renders the item as a Next link. */
  href?: Route;
  shortcut?: string;
};

const ITEM =
  "relative flex min-h-10 cursor-pointer select-none items-center gap-3 rounded-[6px] px-3 py-2 text-[14px] leading-5 text-ink outline-none " +
  "data-[highlighted]:bg-primary-soft data-[disabled]:pointer-events-none data-[disabled]:text-ink-3 [&_svg]:size-4 [&_svg]:shrink-0";

export function DropdownMenuItem({ icon, destructive, href, shortcut, className, children, asChild, onSelect, ...rest }: DropdownMenuItemProps) {
  const cls = cn(ITEM, destructive && "text-danger-text data-[highlighted]:bg-danger-soft", className);
  // A dialog opened from this item mounts after the menu closes: remember the menu trigger as its focus return target.
  const select = onSelect
    ? (event: Event) => {
        rememberReturnTarget(menuTriggerOf(event.currentTarget instanceof Element ? event.currentTarget : null));
        onSelect(event);
      }
    : undefined;
  const content = (
    <>
      {icon && <span className={cn("inline-flex", destructive ? "text-danger-text" : "text-ink-2")}>{icon}</span>}
      <span className="min-w-0 flex-1">{children}</span>
      {shortcut && <span className="text-body-sm text-ink-2">{shortcut}</span>}
    </>
  );
  if (asChild) {
    return (
      <RadixMenu.Item asChild className={cls} onSelect={select} {...rest}>
        {children}
      </RadixMenu.Item>
    );
  }
  if (href) {
    return (
      <RadixMenu.Item asChild className={cls} onSelect={select} {...rest}>
        <Link href={href}>{content}</Link>
      </RadixMenu.Item>
    );
  }
  return (
    <RadixMenu.Item className={cls} onSelect={select} {...rest}>
      {content}
    </RadixMenu.Item>
  );
}

export function DropdownMenuSeparator({ className, ...rest }: React.ComponentProps<typeof RadixMenu.Separator>) {
  return <RadixMenu.Separator className={cn("-mx-1 my-1 h-px bg-line", className)} {...rest} />;
}

export function DropdownMenuLabel({ className, ...rest }: React.ComponentProps<typeof RadixMenu.Label>) {
  return <RadixMenu.Label className={cn("px-3 pt-2 pb-1 text-eyebrow text-ink-2", className)} {...rest} />;
}

export type DropdownMenuSwitchItemProps = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
};
/** A menu row with an On/Off switch that does not close the menu. */
export function DropdownMenuSwitchItem({ checked, onCheckedChange, children, disabled, className }: DropdownMenuSwitchItemProps) {
  return (
    <RadixMenu.CheckboxItem
      checked={checked}
      disabled={disabled}
      onCheckedChange={(v) => onCheckedChange(v === true)}
      onSelect={(e) => e.preventDefault()}
      className={cn(ITEM, "justify-between gap-4", className)}
    >
      <span className="min-w-0 flex-1">{children}</span>
      <span className="inline-flex items-center gap-2">
        <span aria-hidden="true" className="w-6 text-right text-body-sm font-semibold text-ink-2">
          {checked ? "On" : "Off"}
        </span>
        <span aria-hidden="true" className={cn("inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors", checked ? "bg-primary" : "bg-ink-3")}>
          <span
            className={cn(
              "block size-4 rounded-full bg-white shadow-[0_1px_2px_rgba(10,37,64,0.3)] transition-transform",
              checked ? "translate-x-[18px]" : "translate-x-0.5",
            )}
          />
        </span>
      </span>
    </RadixMenu.CheckboxItem>
  );
}

export type DropdownMenuSegmentedProps = {
  /** Accessible name of the choice group. */
  label: string;
  value: string;
  options: readonly { value: string; label: string; icon: React.ReactNode }[];
  onValueChange: (value: string) => void;
};
/** A row of equal-width radio choices (icon over a short label) that does not close the menu. */
export function DropdownMenuSegmented({ label, value, options, onValueChange }: DropdownMenuSegmentedProps) {
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
            "data-[highlighted]:text-ink data-[highlighted]:data-[state=unchecked]:bg-mist data-[state=checked]:bg-[var(--white)] data-[state=checked]:text-ink data-[state=checked]:shadow-[var(--shadow-next)]",
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

import type { ReactNode } from "react";
import { Popover as HeadlessPopover, PopoverButton, PopoverPanel } from "@headlessui/react";

type PopoverProps = {
  trigger: ReactNode;
  children: ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
};

export const Popover = (props: Readonly<PopoverProps>) => {
  const alignClass =
    props.align === "start"
      ? "left-0"
      : props.align === "end"
        ? "right-0"
        : "left-1/2 -translate-x-1/2";
  const sideClass = props.side === "top" ? "bottom-full mb-2" : "top-full mt-2";

  return (
    <HeadlessPopover className="relative inline-flex">
      {({ open }) => (
        <>
          <PopoverButton className="inline-flex items-center gap-2" aria-haspopup="dialog">
            {props.trigger}
            <span className={`text-xs transition ${open ? "rotate-180" : ""}`}>▾</span>
          </PopoverButton>
          <PopoverPanel
            className={`absolute z-20 w-max max-w-[280px] rounded-md border border-black/10 bg-[color:var(--color-surface)] p-3 shadow-lg outline-none ${alignClass} ${sideClass}`}
          >
            {props.children}
          </PopoverPanel>
        </>
      )}
    </HeadlessPopover>
  );
};

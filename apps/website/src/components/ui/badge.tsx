import type { ReactNode } from "react";

export const Badge = (props: Readonly<{ children: ReactNode }>) => {
  return (
    <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-[color:var(--color-primary)]/15 px-2 text-xs font-semibold text-[color:var(--color-primary)]">
      {props.children}
    </span>
  );
};

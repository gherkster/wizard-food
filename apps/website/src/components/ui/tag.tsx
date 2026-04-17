import type { ReactNode } from "react";

export const Tag = (props: Readonly<{ children: ReactNode }>) => {
  return (
    <span className="inline-flex items-center rounded-full bg-[color:var(--color-surface-soft)] px-3 py-1 text-xs font-medium text-[color:var(--color-muted)]">
      {props.children}
    </span>
  );
};

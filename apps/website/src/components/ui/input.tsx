import type { InputHTMLAttributes } from "react";

export const Input = (props: Readonly<InputHTMLAttributes<HTMLInputElement>>) => {
  return (
    <input
      {...props}
      className={`w-full rounded-full border border-[color:var(--color-muted)]/20 bg-[color:var(--color-surface)] px-4 py-2 text-sm outline-none transition focus:border-[color:var(--color-primary)] focus:ring-2 focus:ring-[color:var(--color-primary)]/20 ${props.className ?? ""}`}
    />
  );
};

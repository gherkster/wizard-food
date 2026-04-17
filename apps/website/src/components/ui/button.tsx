import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "ghost";
type ButtonSize = "inline" | "small" | "medium" | "large";

type ButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const sizeClasses: Record<ButtonSize, string> = {
  inline: "p-0 leading-none",
  small: "px-2 py-1 text-sm",
  medium: "px-4 py-2 text-sm",
  large: "min-w-[140px] px-5 py-3 text-base",
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-[color:var(--color-primary)] text-white hover:brightness-95 active:brightness-90",
  ghost: "bg-transparent text-[color:var(--color-foreground)] hover:bg-black/5",
};

export const Button = (props: Readonly<ButtonProps>) => {
  const { variant = "primary", size = "medium", className, children, ...buttonProps } = props;

  return (
    <button
      {...buttonProps}
      className={`rounded-md transition disabled:cursor-not-allowed disabled:opacity-60 ${sizeClasses[size]} ${variantClasses[variant]} ${className ?? ""}`}
    >
      {children}
    </button>
  );
};

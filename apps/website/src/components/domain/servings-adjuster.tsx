import { Button } from "@/components/ui/button";

type ServingsAdjusterProps = {
  servings: number;
  singularLabel?: string;
  pluralLabel?: string;
  onChange: (servings: number) => void;
};

export const ServingsAdjuster = (props: Readonly<ServingsAdjusterProps>) => {
  const label =
    props.servings > 1 ? (props.pluralLabel ?? "servings") : (props.singularLabel ?? "serving");

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="inline"
        aria-label="Decrease servings"
        disabled={props.servings <= 1}
        onClick={() => props.onChange(Math.max(1, props.servings - 1))}
      >
        <span className="text-xl">−</span>
      </Button>
      <span className="min-w-[90px] text-sm">
        <b>{props.servings}</b> {label}
      </span>
      <Button
        variant="ghost"
        size="inline"
        aria-label="Increase servings"
        onClick={() => props.onChange(props.servings + 1)}
      >
        <span className="text-xl">+</span>
      </Button>
    </div>
  );
};

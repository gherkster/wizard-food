import type { Image } from "@wizard/content";
import { Link } from "@tanstack/react-router";

import { Tag } from "@/components/ui/tag";
import { BlurrableImage } from "@/components/domain/blurrable-image";

type RecipeCardProps = {
  slug: string;
  title: string;
  image: Image;
  tag?: string;
  duration?: string;
  description?: string;
  variant?: "preview" | "promo";
  lazy?: boolean;
};

export const RecipeCard = (props: Readonly<RecipeCardProps>) => {
  const variant = props.variant ?? "preview";

  return (
    <Link
      to="/recipes/$slug"
      params={{ slug: props.slug }}
      className={`block rounded-md ${variant === "promo" ? "bg-[color:var(--color-surface-soft)] p-3" : ""}`}
    >
      <div className={variant === "promo" ? "grid gap-3 sm:grid-cols-[1.2fr_1fr]" : "space-y-3"}>
        <BlurrableImage
          image={props.image}
          variant={variant === "promo" ? "cover" : "preview"}
          aspectRatio="square"
          lazy={props.lazy}
        />
        <div className="space-y-2">
          <p className="font-semibold leading-tight">{props.title}</p>
          {props.description ? (
            <p className="text-sm text-[color:var(--color-muted)]">{props.description}</p>
          ) : null}
          <div className="flex items-center justify-between gap-2">
            {props.tag ? <Tag>{props.tag}</Tag> : <span />}
            {props.duration ? (
              <small className="text-[color:var(--color-muted)]">{props.duration}</small>
            ) : null}
          </div>
        </div>
      </div>
    </Link>
  );
};

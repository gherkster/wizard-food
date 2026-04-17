import type { Image } from "@wizard/content";

type BlurrableImageProps = {
  image: Image;
  variant: "cover" | "preview" | "instruction";
  aspectRatio: "square" | "portrait";
  alt?: string;
  lazy?: boolean;
};

const aspectClass: Record<BlurrableImageProps["aspectRatio"], string> = {
  square: "aspect-square",
  portrait: "aspect-[3/4]",
};

export const BlurrableImage = (props: Readonly<BlurrableImageProps>) => {
  const variantImage = props.image.variants[props.variant][props.aspectRatio];
  const blur = props.image.metadata?.base64Url;

  return (
    <div className={`relative overflow-hidden rounded-md ${aspectClass[props.aspectRatio]}`}>
      {blur ? (
        <img src={blur} alt="" aria-hidden className="absolute inset-0 h-full w-full blur-xl" />
      ) : null}
      <img
        src={variantImage.src}
        srcSet={variantImage.srcSet}
        sizes={variantImage.sizes}
        alt={props.alt ?? props.image.title}
        loading={props.lazy ? "lazy" : undefined}
        className="absolute inset-0 h-full w-full object-cover"
      />
    </div>
  );
};

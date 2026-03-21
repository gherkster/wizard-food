export type ImagePurpose = "cover" | "preview" | "instruction";
export type AspectRatio = "square" | "portrait";

export type ImageVariant = {
  src: string;
  srcSet: string;
  sizes: string;
};

export type ImageVariants = Record<ImagePurpose, Record<AspectRatio, ImageVariant>>;

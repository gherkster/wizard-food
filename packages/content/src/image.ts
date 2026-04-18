import { type Image, type ImagePurpose, type AspectRatio, type ImageShape } from "./types";

export const getAspectRatio = (shape: ImageShape): AspectRatio => {
  switch (shape) {
    case "portrait":
      return {
        x: 3,
        y: 4,
      };
    case "square":
      return {
        x: 1,
        y: 1,
      };
  }
};

export const getVariant = (image: Image, purpose: ImagePurpose, shape: ImageShape) => {
  return image.variants[purpose][shape];
};

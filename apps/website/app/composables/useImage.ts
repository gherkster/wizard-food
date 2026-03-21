import type { Image } from "~~/shared/types/recipe";
import type { AspectRatio, ImagePurpose } from "~~/shared/types/image";

export function useImage() {
  function getAspectRatio(aspectRatio: AspectRatio): { x: number; y: number } {
    switch (aspectRatio) {
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
  }

  function getVariant(image: Image, purpose: ImagePurpose, aspectRatio: AspectRatio) {
    return image.variants[purpose][aspectRatio];
  }

  return {
    getAspectRatio,
    getVariant,
  };
}

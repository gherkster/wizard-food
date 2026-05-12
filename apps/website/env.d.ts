import { ImgHTMLAttributes } from "vue";

export type ImgHTMLFetchPriority = "high" | "low" | "auto";

declare module "vue" {
  interface ImgHTMLAttributes {
    fetchpriority?: ImgHTMLFetchPriority;
  }
}

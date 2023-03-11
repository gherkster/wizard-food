declare module "*.scss" {
  const content: { [className: string]: string };
  export default content;
}

interface ImportMetaEnv {
  readonly VITE_APIURL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

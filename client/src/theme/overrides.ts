import { GlobalThemeOverrides } from "naive-ui";
import variables from "../styles/vars.module.scss";

const overrides: GlobalThemeOverrides = {
  common: {
    borderRadius: variables.borderRadius,
    inputColor: variables.colourInputBackground,
  },
  Divider: {
    color: variables.colourFontMutedLight,
  },
};

export default overrides;

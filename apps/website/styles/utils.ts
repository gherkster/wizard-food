import { css } from "styled-system/css";

export const fadeSlideTransition = {
  enterActiveClass: css({
    transition: "opacity,transform 0.1s cubic-bezier(0.2, 0.8, 0.4, 1)",
  }),
  enterFromClass: css({
    opacity: 0,
    transform: "translateY(-10px)",
  }),
  enterToClass: css({
    opacity: 1,
    transform: "translateY(0)",
  }),
  leaveActiveClass: css({
    transition: "all 0.10s ease-in",
  }),
  leaveToClass: css({
    opacity: 0,
    transform: "translateY(-4px)",
  }),
};

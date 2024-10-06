import { cva } from "class-variance-authority";

export const buttonCva = cva("px-4 py-2 rounded-md text-black font-bold", {
  variants: {
    type: {
      normal: "bg-yellow-400",
      light: "bg-pink-400",
      dark: "bg-gray-600 text-white",
    },
    text: {
      lg: "text-lg",
      md: "text-base",
      sm: "text-sm",
    },
  },
  defaultVariants: {
    type: "normal",
    text: "md",
  },
});

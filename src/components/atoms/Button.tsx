"use client";
import React from "react";
import { cva, type VariantProps } from "class-variance-authority";

const ButtonStyle = cva("btn", {
  variants: {
    intent: {
      primary: "btn-primary",
      secondary: "btn-secondary",
      accent: "btn-accent",
      success: "btn-success",
      warning: "btn-warning",
      error: "btn-error",
      ghost: "btn-ghost",
      link: "btn-link",
      outline: "btn-outline",
    },
    size: {
      xs: "btn-xs",
      sm: "btn-sm",
      md: "btn-md",
      lg: "btn-lg",
    },
    wide: {
      true: "btn-wide",
      false: "",
    },
    rounded: {
      true: "btn-rounded",
      false: "",
    },
    disabled: {
      true: "btn-disabled",
      false: "",
    },
    circle: {
      true: "btn-circle",
      false: "",
    },
    square: {
      true: "btn-square",
      false: "",
    },
    active: {
      true: "btn-active",
      false: "",
    },
    loading: {
        true: "btn-loading",
        false: "",
    },
  },
  defaultVariants: {
    intent: "primary",
    size: "md",
    wide: false,
    rounded: false,
    disabled: false,
    circle: false,
    square: false,
  },
});

interface ButtonProps extends VariantProps<typeof ButtonStyle> {
  children?: React.ReactNode;
  type?: "button" | "submit" | "reset";
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

function Button({ children, onClick, type = "button", ...rest }: ButtonProps) {
  return (
    <button type={type} onClick={onClick} className={ButtonStyle({ ...rest })}>
      {children}
    </button>
  );
}

export default Button;

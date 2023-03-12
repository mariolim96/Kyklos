"use client";
import React from "react";
import { cva, type VariantProps } from "class-variance-authority";

const SelectStyle = cva("select w-full max-w-xs", {
  variants: {
    intent: {
      ghost: "select-ghost",
      border: "select-bordered",
      normal: "",
    },
    color: {
      primary: "select-primary",
      secondary: "select-secondary",
      accent: "select-accent",
      success: "select-success",
      warning: "select-warning",
      error: "select-error",
    },
    size: {
      xs: "select-xs",
      sm: "select-sm",
      md: "select-md",
      lg: "select-lg",
    },
  },
  defaultVariants: {
    intent: "normal",
    size: "md",
  },
});

// eslint-disable-next-line @typescript-eslint/ban-ts-comment

interface Props
  extends VariantProps<typeof SelectStyle> {
  options: string[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  selected?: string;
  disabled?: boolean;
}

const Select = ({
  options,
  selected,
  onChange,
  disabled,
  intent,
  size,
  color,
  ...rest
}: Props & React.HTMLAttributes<HTMLSelectElement>) => {
  return (
    <select
      className={SelectStyle({
        intent,
        size,
        color,
      })}
      disabled={disabled}
      onChange={onChange}
      {...rest}
      defaultValue={selected}
    >
      {options.map((option, i) => {
        return (
          <option key={i} value={option}>
            {option}
          </option>
        );
      })}
    </select>
  );
};

export default Select;

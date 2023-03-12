"use client";
import React, { useState } from "react";
import { cva, type VariantProps } from "class-variance-authority";

const InputStyle = cva("input", {
  variants: {
    intent: {
      ghost: "input-ghost",
      border: "input-border",
      normal: "",
    },
    size: {
      xs: "input-xs",
      sm: "input-sm",
      md: "input-md",
      lg: "input-lg",
    },
    color: {
      primary: "input-primary",
      secondary: "input-secondary",
      neutral: "input-neutral",
      accent: "input-accent",
      success: "input-success",
      warning: "input-warning",
      error: "input-error",
    },
  },
});
type labelPosition = "top" | "bottom";
type labelJustify = "left" | "right";

interface Props extends VariantProps<typeof InputStyle> {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  label?: string;
  labelPosition?: labelPosition;
  labelJustify?: labelJustify;
}

function Input({
  placeholder,
  value,
  onChange,
  disabled,
  label,
  labelPosition = "top",
  labelJustify = "left",
  ...rest
}: Props) {
  const [inputValue, setInputValue] = useState(value);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    onChange && onChange(e);
  };
  return (
    <div className="form-control w-full max-w-xs">
      {labelPosition === "top" && (
        <label className="label">
          <span
            className={
              labelJustify === "left" ? "label-text" : "label-text-alt"
            }
          >
            {label}
          </span>
        </label>
      )}
      <input
        type="text"
        placeholder={placeholder}
        className={InputStyle({ ...rest })}
        disabled={disabled}
        value={inputValue}
        onChange={handleChange}
      />
      {labelPosition === "bottom" && (
        <label className="label">
          <span
            className={
              labelJustify === "left" ? "label-text" : "label-text-alt"
            }
          >
            {label}
          </span>
        </label>
      )}
    </div>
  );
}

export default Input;

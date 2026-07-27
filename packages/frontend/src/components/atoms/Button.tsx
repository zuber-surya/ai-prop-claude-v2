import React from "react";
import { ButtonProps } from "./button.types";

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "medium",
  onClick,
  ...props
}) => {
  return (
    <button
      className={`
        px-4 py-2 rounded-lg font-medium transition-all duration-200
        ${variant === "primary"
          ? "bg-blue-500 text-white hover:bg-blue-600"
          : variant === "secondary"
          ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
          : variant === "outline"
          ? "border border-gray-300 text-gray-800 hover:bg-gray-100"
          : ""}
        ${size === "small"
          ? "px-2 py-1 text-sm"
          : size === "large"
          ? "px-6 py-3 text-lg"
          : ""}
      `}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
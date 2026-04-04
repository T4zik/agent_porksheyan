// components/buttons/ActionButton.jsx
import React from "react";
import getButtonStyle from "./getButtonStyle";

const ActionButton = ({
  status,
  onClick,
  disabled,
  children,
  variant = "primary",
  style = {},
}) => {
  const baseStyles = {
    padding: "8px 16px",
    marginRight: "10px",
    cursor: "pointer",
    border: "none",
    borderRadius: "4px",
    color: "white",
  };

  const variants = {
    primary: { backgroundColor: "#007bff" },
    danger: { backgroundColor: "#dc3545" },
    success: { backgroundColor: "#28a745" },
    warning: { backgroundColor: "#ffc107" },
  };

  return (
    <button
      style={getButtonStyle(status, {
        ...baseStyles,
        ...variants[variant],
        ...style,
      })}
      onClick={onClick}
      disabled={disabled || status === "loading"}
    >
      {children}
    </button>
  );
};

export default ActionButton;

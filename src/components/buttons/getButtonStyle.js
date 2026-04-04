// components/buttons/getButtonStyle.js
const getButtonStyle = (status, baseStyle) => {
  if (status === "loading")
    return { ...baseStyle, cursor: "wait", opacity: 0.6 };
  if (status === "success") return { ...baseStyle, backgroundColor: "#28a745" };
  if (status === "error") return { ...baseStyle, backgroundColor: "#dc3545" };
  return baseStyle;
};

export default getButtonStyle;
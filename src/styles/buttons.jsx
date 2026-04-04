// Стили (простые inline для наглядности)
import React from "react";
const styles = {
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  section: {
    marginBottom: "30px",
    padding: "15px",
    border: "1px solid #ddd",
    borderRadius: "8px",
  },
  button: {
    padding: "8px 16px",
    marginRight: "10px",
    cursor: "pointer",
    border: "none",
    borderRadius: "4px",
    color: "white",
  },
  buttonPrimary: { backgroundColor: "#007bff" },
  buttonSuccess: { backgroundColor: "#28a745" },
  buttonDanger: { backgroundColor: "#dc3545" },
  buttonDisabled: { backgroundColor: "#ccc", cursor: "not-allowed" },
  select: { marginRight: "10px", padding: "6px" },
  itemsList: { listStyle: "none", padding: 0 },
  item: {
    padding: "10px",
    margin: "5px 0",
    backgroundColor: "#f8f9fa",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "0.2s",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    minWidth: "300px",
    maxWidth: "500px",
  },
  queueList: { paddingLeft: "20px" },
};
export default styles;

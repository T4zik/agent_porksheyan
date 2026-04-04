// styles/buttons.jsx
const styles = {
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  section: {
    marginBottom: "30px",
    padding: "15px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    backgroundColor: "#fff",
  },
  button: {
    padding: "8px 16px",
    marginRight: "10px",
    cursor: "pointer",
    border: "none",
    borderRadius: "4px",
    color: "white",
  },
  buttonPrimary: {
    backgroundColor: "#007bff",
  },
  buttonDanger: {
    backgroundColor: "#dc3545",
  },
  buttonSuccess: {
    backgroundColor: "#28a745",
  },
  select: {
    padding: "6px",
    marginRight: "10px",
    borderRadius: "4px",
    border: "1px solid #ddd",
  },
  itemsList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  item: {
    padding: "10px",
    margin: "5px 0",
    backgroundColor: "#f8f9fa",
    borderRadius: "4px",
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
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    minWidth: "300px",
    maxWidth: "500px",
    maxHeight: "80vh",
    overflowY: "auto",
  },
  queueList: {
    paddingLeft: "20px",
  },
};

export default styles;

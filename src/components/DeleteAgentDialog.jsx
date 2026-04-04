// components/DeleteAgentDialog.jsx
import React from "react";
import styles from "../styles/buttons";

const DeleteAgentDialog = ({
  isOpen,
  confirmStep,
  agents,
  selectedAgentId,
  onSelectAgent,
  onConfirm,
  onFinalDelete,
  onCancel,
}) => {
  if (!isOpen) return null;

  const getAgentStatusText = (status) => {
    switch (status) {
      case "active":
        return "Активен";
      case "busy":
        return "Занят";
      case "idle":
        return "Ожидает";
      case "error":
        return "Ошибка";
      default:
        return "Неизвестно";
    }
  };

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        {!confirmStep ? (
          <>
            <h3>Выберите агента для удаления</h3>
            <select
              style={styles.select}
              value={selectedAgentId}
              onChange={(e) => onSelectAgent(e.target.value)}
            >
              <option value="">Выберите агента</option>
              {agents.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  {agent.name} ({getAgentStatusText(agent.status)})
                </option>
              ))}
            </select>
            <div
              style={{
                marginTop: "20px",
                display: "flex",
                gap: "10px",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={onCancel}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#6c757d",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Отмена
              </button>
              <button
                onClick={onConfirm}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Далее
              </button>
            </div>
          </>
        ) : (
          <>
            <h3>Подтверждение удаления</h3>
            <p style={{ fontSize: "16px", margin: "20px 0" }}>
              Вы действительно хотите удалить{" "}
              <strong>
                {agents.find((a) => a.id.toString() === selectedAgentId)
                  ?.name || `Агента №${selectedAgentId}`}
              </strong>
              ?
            </p>
            <p style={{ color: "#dc3545", fontSize: "14px" }}>
              Это действие невозможно отменить!
            </p>
            <div
              style={{
                marginTop: "20px",
                display: "flex",
                gap: "10px",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={onCancel}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#6c757d",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Отмена
              </button>
              <button
                onClick={onFinalDelete}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#dc3545",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Да, удалить
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DeleteAgentDialog;

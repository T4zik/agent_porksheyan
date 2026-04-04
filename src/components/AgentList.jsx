// components/AgentList.jsx
import React from "react";
import styles from "../styles/buttons";

const AgentList = ({
  agents,
  loading,
  selectedAgent,
  onSelectAgent,
  onInterruptAgent,
}) => {
  const getAgentStatusColor = (status) => {
    switch (status) {
      case "active":
        return "#28a745";
      case "busy":
        return "#ffc107";
      case "idle":
        return "#17a2b8";
      case "error":
        return "#dc3545";
      default:
        return "#6c757d";
    }
  };

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

  if (loading) {
    return <p>Загрузка агентов...</p>;
  }

  return (
    <div style={styles.section}>
      <h3>Активные агенты (нажмите для мониторинга)</h3>
      <ul style={styles.itemsList}>
        {agents.map((agent) => (
          <li
            key={agent.id}
            style={{
              ...styles.item,
              borderLeft: `4px solid ${getAgentStatusColor(agent.status)}`,
              backgroundColor:
                selectedAgent?.id === agent.id ? "#e3f2fd" : "#f8f9fa",
              cursor: "pointer",
            }}
          >
            <div onClick={() => onSelectAgent(agent)}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <strong>{agent.name}</strong>
                  <span
                    style={{
                      marginLeft: "10px",
                      fontSize: "12px",
                      color: getAgentStatusColor(agent.status),
                      fontWeight: "bold",
                    }}
                  >
                    {getAgentStatusText(agent.status)}
                  </span>
                </div>
                <span style={{ fontSize: "11px", color: "#6c757d" }}>
                  Uptime: {agent.uptime} дней
                </span>
              </div>
              <div
                style={{ fontSize: "12px", color: "#6c757d", marginTop: "5px" }}
              >
                Текущая задача: {agent.currentTask}
              </div>
            </div>
            {agent.canBeInterrupted !== false && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onInterruptAgent(agent);
                }}
                style={{
                  marginTop: "10px",
                  padding: "4px 12px",
                  backgroundColor: "#dc3545",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "12px",
                  width: "100%",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#c82333")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "#dc3545")
                }
              >
                ⚡ Прервать работу
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AgentList;

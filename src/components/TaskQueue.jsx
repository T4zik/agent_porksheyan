// components/TaskQueue.jsx
import React from "react";
import styles from "../styles/buttons";

const TaskQueue = ({ agent, getAgentStatusText, interruptedTask }) => {
  return (
    <div style={styles.section}>
      <h3>Очередь задач</h3>
      <div
        style={{
          maxHeight: "400px",
          overflowY: "auto",
          padding: "10px",
          backgroundColor: "#f8f9fa",
          borderRadius: "4px",
        }}
      >
        {agent ? (
          agent.tasksQueue && agent.tasksQueue.length > 0 ? (
            <ul style={{ ...styles.queueList, margin: 0 }}>
              {agent.tasksQueue.map((task, idx) => (
                <li
                  key={idx}
                  style={{
                    padding: "8px",
                    marginBottom: "5px",
                    backgroundColor:
                      interruptedTask === task ? "#fff3cd" : "white",
                    borderRadius: "4px",
                    borderLeft: `3px solid ${
                      interruptedTask === task
                        ? "#ffc107"
                        : idx === 0
                          ? "#28a745"
                          : "#007bff"
                    }`,
                    fontSize: "13px",
                    textDecoration:
                      interruptedTask === task ? "line-through" : "none",
                    opacity: interruptedTask === task ? 0.7 : 1,
                  }}
                >
                  {idx === 0 && !interruptedTask && (
                    <span
                      style={{
                        color: "#28a745",
                        fontWeight: "bold",
                        marginRight: "8px",
                      }}
                    >
                      ▶
                    </span>
                  )}
                  {interruptedTask === task && (
                    <span
                      style={{
                        color: "#ffc107",
                        fontWeight: "bold",
                        marginRight: "8px",
                      }}
                    >
                      ⛔
                    </span>
                  )}
                  {task}
                  {idx === 0 && !interruptedTask && (
                    <span
                      style={{
                        fontSize: "11px",
                        color: "#6c757d",
                        marginLeft: "8px",
                      }}
                    >
                      (выполняется)
                    </span>
                  )}
                  {interruptedTask === task && (
                    <span
                      style={{
                        fontSize: "11px",
                        color: "#dc3545",
                        marginLeft: "8px",
                      }}
                    >
                      (прервана)
                    </span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p
              style={{
                textAlign: "center",
                color: "#6c757d",
                margin: "20px 0",
              }}
            >
              Нет задач в очереди
            </p>
          )
        ) : (
          <p
            style={{ textAlign: "center", color: "#6c757d", margin: "20px 0" }}
          >
            Выберите агента из списка
          </p>
        )}
      </div>
      {agent && (
        <div style={{ marginTop: "10px" }}>
          <p style={{ fontSize: "12px", color: "#6c757d" }}>
            Агент: {agent.name} | Статус: {getAgentStatusText(agent.status)}
          </p>
          {agent.canBeInterrupted === false && (
            <p style={{ fontSize: "11px", color: "#dc3545", marginTop: "5px" }}>
              ⚠️ Этот агент не может быть прерван в данный момент
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskQueue;

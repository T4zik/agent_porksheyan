// components/InterruptAgentDialog.jsx
import React, { useState } from 'react';
import styles from '../styles/buttons';

const InterruptAgentDialog = ({ isOpen, agent, onConfirm, onCancel }) => {
  const [reason, setReason] = useState("");
  const [selectedOption, setSelectedOption] = useState("stop");

  if (!isOpen || !agent) return null;

  const handleConfirm = () => {
    onConfirm(agent.id, agent.currentTask, selectedOption, reason);
  };

  const getInterruptionOptions = () => {
    if (agent.status === "busy") {
      return [
        { value: "stop", label: "Остановить текущую задачу", color: "#dc3545", description: "Немедленно остановить выполнение" },
        { value: "skip", label: "Пропустить текущую задачу", color: "#ffc107", description: "Отметить как пропущенную и перейти к следующей" },
        { value: "postpone", label: "Отложить задачу", color: "#17a2b8", description: "Переместить в конец очереди" }
      ];
    } else if (agent.status === "active") {
      return [
        { value: "stop", label: "Прервать выполнение", color: "#dc3545", description: "Остановить активную задачу" },
        { value: "pause", label: "Приостановить", color: "#ffc107", description: "Временно приостановить агента" }
      ];
    } else {
      return [
        { value: "stop", label: "Остановить агента", color: "#dc3545", description: "Полная остановка агента" },
        { value: "restart", label: "Перезапустить", color: "#28a745", description: "Перезапустить агента" }
      ];
    }
  };

  const options = getInterruptionOptions();

  return (
    <div style={styles.modalOverlay}>
      <div style={{ ...styles.modalContent, maxWidth: "500px" }}>
        <h3 style={{ color: "#dc3545", marginBottom: "15px" }}>
          ⚠️ Прерывание работы агента
        </h3>
        
        <div style={{ 
          padding: "10px", 
          backgroundColor: "#f8f9fa", 
          borderRadius: "4px", 
          marginBottom: "20px" 
        }}>
          <p><strong>Агент:</strong> {agent.name}</p>
          <p><strong>Статус:</strong> 
            <span style={{ 
              marginLeft: "5px",
              color: agent.status === "busy" ? "#ffc107" : 
                     agent.status === "active" ? "#28a745" : 
                     agent.status === "error" ? "#dc3545" : "#17a2b8"
            }}>
              {agent.status === "busy" ? "Занят" : 
               agent.status === "active" ? "Активен" : 
               agent.status === "error" ? "Ошибка" : "Ожидает"}
            </span>
          </p>
          <p><strong>Текущая задача:</strong> {agent.currentTask}</p>
          {agent.tasksQueue && agent.tasksQueue.length > 0 && (
            <p><strong>Очередь задач:</strong> {agent.tasksQueue.length} задач в очереди</p>
          )}
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ fontWeight: "bold", display: "block", marginBottom: "10px" }}>
            Выберите действие:
          </label>
          {options.map(option => (
            <label 
              key={option.value}
              style={{ 
                display: "block", 
                marginBottom: "10px",
                padding: "10px",
                backgroundColor: selectedOption === option.value ? "#e3f2fd" : "white",
                borderRadius: "4px",
                border: `1px solid ${selectedOption === option.value ? option.color : "#ddd"}`,
                cursor: "pointer"
              }}
            >
              <input
                type="radio"
                value={option.value}
                checked={selectedOption === option.value}
                onChange={(e) => setSelectedOption(e.target.value)}
                style={{ marginRight: "10px" }}
              />
              <div style={{ display: "inline-block" }}>
                <div style={{ fontWeight: "bold", color: option.color }}>
                  {option.label}
                </div>
                <div style={{ fontSize: "12px", color: "#6c757d" }}>
                  {option.description}
                </div>
              </div>
            </label>
          ))}
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ fontWeight: "bold", display: "block", marginBottom: "5px" }}>
            Причина прерывания (опционально):
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Укажите причину прерывания..."
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ddd",
              minHeight: "60px",
              fontFamily: "inherit"
            }}
          />
        </div>

        <div style={{ 
          display: "flex", 
          gap: "10px", 
          justifyContent: "flex-end",
          borderTop: "1px solid #ddd",
          paddingTop: "15px"
        }}>
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
            onClick={handleConfirm}
            style={{
              padding: "8px 16px",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Подтвердить прерывание
          </button>
        </div>

        <div style={{ 
          marginTop: "15px", 
          fontSize: "12px", 
          color: "#6c757d",
          textAlign: "center"
        }}>
          ⚡ Прерывание может привести к потере данных текущей операции
        </div>
      </div>
    </div>
  );
};

export default InterruptAgentDialog;
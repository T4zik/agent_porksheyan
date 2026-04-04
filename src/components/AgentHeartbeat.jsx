// components/AgentHeartbeat.jsx
import React, { useState, useEffect } from "react";
import { api } from "../services/api";

const AgentHeartbeat = ({ agent }) => {
  const [heartbeat, setHeartbeat] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchHeartbeat = async () => {
    if (!agent) return;
    setIsLoading(true);
    try {
      const data = await api.getAgentHeartbeat(agent.id);
      setHeartbeat(data);
    } catch (error) {
      console.error(`Heartbeat error for agent ${agent.id}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHeartbeat();
    let interval;
    if (autoRefresh && agent) {
      interval = setInterval(fetchHeartbeat, 5000);
    }
    return () => clearInterval(interval);
  }, [autoRefresh, agent]);

  if (!agent || !heartbeat) {
    return (
      <div style={{ padding: "10px", textAlign: "center", color: "#6c757d" }}>
        Выберите агента для мониторинга
      </div>
    );
  }

  const getStatusColor = () => {
    switch (heartbeat.status) {
      case "healthy":
        return "#28a745";
      case "unhealthy":
        return "#dc3545";
      default:
        return "#ffc107";
    }
  };

  const getStatusText = () => {
    switch (heartbeat.status) {
      case "healthy":
        return "Здоров";
      case "unhealthy":
        return "Не отвечает";
      default:
        return "Неизвестно";
    }
  };

  return (
    <div
      style={{
        padding: "15px",
        backgroundColor: "#f8f9fa",
        borderRadius: "8px",
        borderLeft: `4px solid ${getStatusColor()}`,
        marginBottom: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: "16px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: getStatusColor(),
              animation:
                heartbeat.status === "healthy" ? "pulse 2s infinite" : "none",
            }}
          ></span>
          Heartbeat: {agent.name}
        </h3>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={fetchHeartbeat}
            disabled={isLoading}
            style={{
              padding: "4px 8px",
              fontSize: "12px",
              cursor: "pointer",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
            }}
          >
            {isLoading ? "..." : "Обновить"}
          </button>
          <label
            style={{
              fontSize: "12px",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
            />
            Авто (5с)
          </label>
        </div>
      </div>

      <div style={{ fontSize: "13px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "8px",
          }}
        >
          <div>
            <strong>Статус:</strong>
            <span
              style={{
                color: getStatusColor(),
                marginLeft: "5px",
                fontWeight: "bold",
              }}
            >
              {getStatusText()}
            </span>
          </div>
          <div>
            <strong>CPU:</strong> {heartbeat.cpu}%
          </div>
          <div>
            <strong>Память:</strong> {heartbeat.memory} MB
          </div>
          <div>
            <strong>Время ответа:</strong> {heartbeat.responseTime} ms
          </div>
          <div style={{ gridColumn: "span 2" }}>
            <strong>Последний пинг:</strong>{" "}
            {heartbeat.lastPing
              ? new Date(heartbeat.lastPing).toLocaleTimeString()
              : "Никогда"}
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.4; }
            100% { opacity: 1; }
          }
        `}
      </style>
    </div>
  );
};

export default AgentHeartbeat;

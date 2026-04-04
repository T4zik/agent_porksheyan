import React, { useState, useEffect } from "react";
import "./App.css";
import styles from "./styles/buttons.jsx";

// Мок-функция для имитации API
const mockFetch = (url, options) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (url === "/api/create-agent") {
        resolve({
          ok: true,
          json: async () => ({
            success: true,
            message: "Агент создан",
            agent: {
              id: Date.now(),
              name: `Агент ${Math.floor(Math.random() * 100)}`,
              status: "idle",
            },
          }),
        });
      } else if (url === "/api/delete-agent") {
        const body = options?.body ? JSON.parse(options.body) : null;
        resolve({
          ok: true,
          json: async () => ({
            success: true,
            message: `Агент ${body?.agentId} удален`,
            deletedId: body?.agentId,
          }),
        });
      } else if (url === "/api/agents") {
        resolve({
          ok: true,
          json: async () => [
            {
              id: 1,
              name: "Агент Альфа",
              status: "active",
              currentTask: "Инициализация системы",
              uptime: 125,
              cpu: 23,
              memory: 512,
              tasksQueue: [
                "Инициализация системы",
                "Загрузка конфигурации",
                "Проверка соединений",
              ],
            },
            {
              id: 2,
              name: "Агент Бета",
              status: "busy",
              currentTask: "Обработка данных пользователя",
              uptime: 89,
              cpu: 67,
              memory: 1024,
              tasksQueue: [
                "Обработка данных пользователя",
                "Сохранение результатов",
                "Отправка уведомления",
              ],
            },
            {
              id: 3,
              name: "Агент Гамма",
              status: "idle",
              currentTask: "Ожидание задач",
              uptime: 45,
              cpu: 5,
              memory: 256,
              tasksQueue: [],
            },
            {
              id: 4,
              name: "Агент Дельта",
              status: "error",
              currentTask: "Ошибка соединения",
              uptime: 12,
              cpu: 0,
              memory: 128,
              tasksQueue: ["Переподключение", "Проверка целостности"],
            },
          ],
        });
      } else if (url.startsWith("/api/agents/") && url.endsWith("/heartbeat")) {
        const id = parseInt(url.split("/")[3]);
        const heartbeats = {
          1: {
            status: "healthy",
            lastPing: new Date().toISOString(),
            responseTime: 45,
            cpu: 23,
            memory: 512,
          },
          2: {
            status: "healthy",
            lastPing: new Date().toISOString(),
            responseTime: 78,
            cpu: 67,
            memory: 1024,
          },
          3: {
            status: "healthy",
            lastPing: new Date().toISOString(),
            responseTime: 32,
            cpu: 5,
            memory: 256,
          },
          4: {
            status: "unhealthy",
            lastPing: new Date(Date.now() - 30000).toISOString(),
            responseTime: 0,
            cpu: 0,
            memory: 128,
          },
        };
        resolve({
          ok: true,
          json: async () =>
            heartbeats[id] || {
              status: "unknown",
              lastPing: null,
              responseTime: 0,
              cpu: 0,
              memory: 0,
            },
        });
      } else {
        resolve({
          ok: false,
          status: 404,
          json: async () => ({ error: "Not found" }),
        });
      }
    }, 500);
  });
};

// Функция для отправки сигнала
const sendSignal = async (endpoint, setStatus, additionalData = null) => {
  setStatus("loading");
  try {
    const response = await mockFetch(endpoint, {
      method: "POST",
      body: additionalData ? JSON.stringify(additionalData) : null,
    });
    if (response.ok) {
      setStatus("success");
      setTimeout(() => setStatus("idle"), 2000);
      return await response.json();
    } else {
      throw new Error("Ошибка сервера");
    }
  } catch (error) {
    console.error(error);
    setStatus("error");
    setTimeout(() => setStatus("idle"), 2000);
    return null;
  }
};

// Функция для получения стиля кнопки
const getButtonStyle = (status, baseStyle) => {
  if (status === "loading")
    return { ...baseStyle, cursor: "wait", opacity: 0.6 };
  if (status === "success") return { ...baseStyle, backgroundColor: "#28a745" };
  if (status === "error") return { ...baseStyle, backgroundColor: "#dc3545" };
  return baseStyle;
};

// Компонент Heartbeat для мониторинга агента
const AgentHeartbeat = ({ agent }) => {
  const [heartbeat, setHeartbeat] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchHeartbeat = async () => {
    if (!agent) return;
    setIsLoading(true);
    try {
      const response = await mockFetch(`/api/agents/${agent.id}/heartbeat`);
      if (response.ok) {
        const data = await response.json();
        setHeartbeat(data);
      }
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

export function HomePage() {
  // Состояния для кнопок
  const [button1Status, setButton1Status] = useState("idle");
  const [button2Status, setButton2Status] = useState("idle");

  // Состояния для зависимых списков
  const [category, setCategory] = useState("fruits");
  const [subcategory, setSubcategory] = useState("apple");
  const [subOptions, setSubOptions] = useState([]);

  // Состояния для списка агентов
  const [agents, setAgents] = useState([]);
  const [agentsLoading, setAgentsLoading] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);

  // Состояния для удаления агента
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState("");
  const [deleteConfirmStep, setDeleteConfirmStep] = useState(false);

  // Категории и их подкатегории
  const categories = {
    fruits: {
      label: "Тип задачи",
      options: {
        data_processing: "Обработка данных",
        system_maintenance: "Обслуживание системы",
        user_interaction: "Взаимодействие с пользователем",
      },
    },
    vegetables: {
      label: "Приоритет",
      options: { high: "Высокий", medium: "Средний", low: "Низкий" },
    },
  };

  // Функции для работы с агентами
  const loadAgents = async () => {
    setAgentsLoading(true);
    try {
      const response = await mockFetch("/api/agents");
      if (response.ok) {
        const data = await response.json();
        setAgents(data);
      } else {
        console.error("Ошибка загрузки агентов");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAgentsLoading(false);
    }
  };

  const handleCreateAgent = async () => {
    const result = await sendSignal("/api/create-agent", setButton1Status);
    if (result?.success) {
      loadAgents(); // Перезагружаем список агентов
    }
  };

  // Функции для удаления агента
  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
    setDeleteConfirmStep(false);
    setSelectedAgentId("");
  };

  const handleDeleteConfirm = () => {
    if (!selectedAgentId) {
      alert("Пожалуйста, выберите агента");
      return;
    }
    setDeleteConfirmStep(true);
  };

  const handleFinalDelete = async () => {
    const result = await sendSignal("/api/delete-agent", setButton2Status, {
      agentId: selectedAgentId,
    });
    if (result?.success) {
      loadAgents(); // Перезагружаем список агентов
      if (selectedAgent?.id.toString() === selectedAgentId) {
        setSelectedAgent(null); // Снимаем выбор, если удалили выбранного агента
      }
    }
    setShowDeleteDialog(false);
    setDeleteConfirmStep(false);
    setSelectedAgentId("");
  };

  const handleCancelDelete = () => {
    setShowDeleteDialog(false);
    setDeleteConfirmStep(false);
    setSelectedAgentId("");
  };

  // Обновление подкатегорий при смене категории
  useEffect(() => {
    const newOptions = categories[category].options;
    setSubOptions(Object.entries(newOptions));
    const firstKey = Object.keys(newOptions)[0];
    setSubcategory(firstKey);
  }, [category]);

  // Загрузка списка агентов при монтировании
  useEffect(() => {
    loadAgents();
  }, []);

  // Получение цвета статуса агента
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

  return (
    <div style={{ ...styles.container, display: "flex", gap: "20px" }}>
      {/* Основной контент - левая колонка */}
      <div style={{ flex: 2 }}>
        <h1>Панель управления агентами</h1>

        {/* Две кнопки управления агентами */}
        <div style={styles.section}>
          <h3>Управление агентами</h3>
          <button
            style={getButtonStyle(button1Status, {
              ...styles.button,
              ...styles.buttonPrimary,
            })}
            onClick={handleCreateAgent}
            disabled={button1Status === "loading"}
          >
            {button1Status === "loading"
              ? "Создание..."
              : button1Status === "success"
                ? "✓ Создан"
                : button1Status === "error"
                  ? "✗ Ошибка"
                  : "Создать агента"}
          </button>
          <button
            style={getButtonStyle(button2Status, {
              ...styles.button,
              ...styles.buttonDanger,
            })}
            onClick={handleDeleteClick}
            disabled={button2Status === "loading"}
          >
            {button2Status === "loading"
              ? "Удаление..."
              : button2Status === "success"
                ? "✓ Удален"
                : button2Status === "error"
                  ? "✗ Ошибка"
                  : "Удалить агента"}
          </button>
        </div>

        {/* Диалог выбора агента для удаления */}
        {showDeleteDialog && (
          <div style={styles.modalOverlay}>
            <div style={styles.modalContent}>
              {!deleteConfirmStep ? (
                <>
                  <h3>Выберите агента для удаления</h3>
                  <select
                    style={styles.select}
                    value={selectedAgentId}
                    onChange={(e) => setSelectedAgentId(e.target.value)}
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
                      onClick={handleCancelDelete}
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
                      onClick={handleDeleteConfirm}
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
                      onClick={handleCancelDelete}
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
                      onClick={handleFinalDelete}
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
        )}

        {/* Модульная строка с настройками задач */}
        <div style={styles.section}>
          <h3>Настройки новой задачи</h3>
          <select
            style={styles.select}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {Object.entries(categories).map(([key, val]) => (
              <option key={key} value={key}>
                {val.label}
              </option>
            ))}
          </select>
          <select
            style={styles.select}
            value={subcategory}
            onChange={(e) => setSubcategory(e.target.value)}
          >
            {subOptions.map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
          <p>
            Выбрано: {categories[category].label} →{" "}
            {categories[category].options[subcategory]}
          </p>
        </div>

        {/* Список активных агентов */}
        <div style={styles.section}>
          <h3>Активные агенты (нажмите для мониторинга)</h3>
          {agentsLoading ? (
            <p>Загрузка агентов...</p>
          ) : (
            <ul style={styles.itemsList}>
              {agents.map((agent) => (
                <li
                  key={agent.id}
                  style={{
                    ...styles.item,
                    borderLeft: `4px solid ${getAgentStatusColor(
                      agent.status,
                    )}`,
                    backgroundColor:
                      selectedAgent?.id === agent.id ? "#e3f2fd" : "#f8f9fa",
                  }}
                  onClick={() => setSelectedAgent(agent)}
                >
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
                    style={{
                      fontSize: "12px",
                      color: "#6c757d",
                      marginTop: "5px",
                    }}
                  >
                    Текущая задача: {agent.currentTask}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Правая колонка с Heartbeat и очередью задач выбранного агента */}
      <div
        style={{
          flex: 1,
          position: "sticky",
          top: "20px",
          alignSelf: "flex-start",
        }}
      >
        {/* Heartbeat модуль для выбранного агента */}
        <AgentHeartbeat agent={selectedAgent} />

        {/* Секция с очередью задач выбранного агента */}
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
            {selectedAgent ? (
              selectedAgent.tasksQueue &&
              selectedAgent.tasksQueue.length > 0 ? (
                <ul style={{ ...styles.queueList, margin: 0 }}>
                  {selectedAgent.tasksQueue.map((task, idx) => (
                    <li
                      key={idx}
                      style={{
                        padding: "8px",
                        marginBottom: "5px",
                        backgroundColor: "white",
                        borderRadius: "4px",
                        borderLeft: `3px solid ${
                          idx === 0 ? "#28a745" : "#007bff"
                        }`,
                        fontSize: "13px",
                      }}
                    >
                      {idx === 0 && (
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
                      {task}
                      {idx === 0 && (
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
                style={{
                  textAlign: "center",
                  color: "#6c757d",
                  margin: "20px 0",
                }}
              >
                Выберите агента из списка
              </p>
            )}
          </div>
          {selectedAgent && (
            <p
              style={{ fontSize: "12px", color: "#6c757d", marginTop: "10px" }}
            >
              Агент: {selectedAgent.name} | Статус:{" "}
              {getAgentStatusText(selectedAgent.status)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomePage;

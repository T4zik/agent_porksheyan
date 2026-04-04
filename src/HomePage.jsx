// pages/HomePage.jsx
import React, { useState, useEffect } from "react";
import styles from "./styles/buttons";
import { api } from "./services/api";
import ActionButton from "./components/buttons/ActionButton";
import AgentHeartbeat from "./components/AgentHeartbeat";
import AgentList from "./components/AgentList";
import CreateTaskForm from "./components/CreateTaskForm";
import DeleteAgentDialog from "./components/DeleteAgentDialog";
import TaskQueue from "./components/TaskQueue";
import InterruptAgentDialog from "./components/InterruptAgentDialog";

export function HomePage() {
  // Состояния для кнопок
  const [createAgentStatus, setCreateAgentStatus] = useState("idle");
  const [deleteAgentStatus, setDeleteAgentStatus] = useState("idle");
  const [createTaskStatus, setCreateTaskStatus] = useState("idle");
  const [interruptStatus, setInterruptStatus] = useState("idle");

  // Состояния для данных
  const [agents, setAgents] = useState([]);
  const [agentsLoading, setAgentsLoading] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);

  // Состояния для удаления агента
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState("");
  const [deleteConfirmStep, setDeleteConfirmStep] = useState(false);

  // Состояния для прерывания агента
  const [showInterruptDialog, setShowInterruptDialog] = useState(false);
  const [agentToInterrupt, setAgentToInterrupt] = useState(null);
  const [interruptedTask, setInterruptedTask] = useState(null);

  // Категории задач
  const categories = {
    data_processing: {
      label: "Обработка данных",
      options: {
        clean: "Очистка данных",
        analyze: "Анализ данных",
        transform: "Трансформация",
      },
    },
    system_maintenance: {
      label: "Обслуживание системы",
      options: {
        backup: "Создание бэкапа",
        update: "Обновление системы",
        cleanup: "Очистка логов",
      },
    },
    user_interaction: {
      label: "Взаимодействие с пользователем",
      options: {
        notification: "Отправка уведомлений",
        report: "Генерация отчета",
        export: "Экспорт данных",
      },
    },
  };

  // Загрузка агентов из БД
  const loadAgents = async () => {
    setAgentsLoading(true);
    try {
      const data = await api.getAgents();
      setAgents(data);
    } catch (err) {
      console.error(err);
    } finally {
      setAgentsLoading(false);
    }
  };

  // Создание агента
  const handleCreateAgent = async () => {
    setCreateAgentStatus("loading");
    try {
      const result = await api.createAgent();
      if (result.success) {
        setCreateAgentStatus("success");
        await loadAgents();
        setTimeout(() => setCreateAgentStatus("idle"), 2000);
      } else {
        throw new Error("Ошибка создания");
      }
    } catch (error) {
      console.error(error);
      setCreateAgentStatus("error");
      setTimeout(() => setCreateAgentStatus("idle"), 2000);
    }
  };

  // Создание задачи и отправка в БД
  const handleCreateTask = async (taskData) => {
    setCreateTaskStatus("loading");
    try {
      const result = await api.createTask(taskData);
      if (result.success) {
        setCreateTaskStatus("success");
        console.log("Задача отправлена в БД:", taskData);
        setTimeout(() => setCreateTaskStatus("idle"), 2000);
      } else {
        throw new Error("Ошибка создания задачи");
      }
    } catch (error) {
      console.error(error);
      setCreateTaskStatus("error");
      setTimeout(() => setCreateTaskStatus("idle"), 2000);
    }
  };

  // Прерывание агента
  const handleInterruptAgent = (agent) => {
    setAgentToInterrupt(agent);
    setShowInterruptDialog(true);
  };

  const handleConfirmInterrupt = async (agentId, taskName, action, reason) => {
    setInterruptStatus("loading");
    try {
      const result = await api.interruptAgent(agentId, taskName);
      if (result.success) {
        setInterruptStatus("success");
        setInterruptedTask(taskName);

        // Показываем уведомление
        console.log(
          `Агент ${agentId} прерван. Действие: ${action}, Причина: ${reason || "Не указана"}`,
        );

        // Обновляем список агентов
        await loadAgents();

        // Обновляем выбранного агента
        const updatedAgent = agents.find((a) => a.id === agentId);
        if (updatedAgent) {
          setSelectedAgent(updatedAgent);
        }

        // Сбрасываем индикатор прерванной задачи через 5 секунд
        setTimeout(() => setInterruptedTask(null), 5000);
        setTimeout(() => setInterruptStatus("idle"), 2000);
      } else {
        throw new Error("Ошибка прерывания");
      }
    } catch (error) {
      console.error(error);
      setInterruptStatus("error");
      setTimeout(() => setInterruptStatus("idle"), 2000);
    }
    setShowInterruptDialog(false);
    setAgentToInterrupt(null);
  };

  const handleCancelInterrupt = () => {
    setShowInterruptDialog(false);
    setAgentToInterrupt(null);
  };

  // Удаление агента
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
    setDeleteAgentStatus("loading");
    try {
      const result = await api.deleteAgent(selectedAgentId);
      if (result.success) {
        setDeleteAgentStatus("success");
        await loadAgents();
        if (selectedAgent?.id.toString() === selectedAgentId) {
          setSelectedAgent(null);
        }
        setTimeout(() => setDeleteAgentStatus("idle"), 2000);
      } else {
        throw new Error("Ошибка удаления");
      }
    } catch (error) {
      console.error(error);
      setDeleteAgentStatus("error");
      setTimeout(() => setDeleteAgentStatus("idle"), 2000);
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

  useEffect(() => {
    loadAgents();
  }, []);

  return (
    <div style={{ ...styles.container, display: "flex", gap: "20px" }}>
      {/* Левая колонка */}
      <div style={{ flex: 2 }}>
        <h1>Панель управления агентами</h1>

        {/* Кнопки управления агентами */}
        <div style={styles.section}>
          <h3>Управление агентами</h3>
          <ActionButton
            status={createAgentStatus}
            onClick={handleCreateAgent}
            variant="primary"
          >
            {createAgentStatus === "loading"
              ? "Создание..."
              : createAgentStatus === "success"
                ? "✓ Создан"
                : createAgentStatus === "error"
                  ? "✗ Ошибка"
                  : "Создать агента"}
          </ActionButton>
          <ActionButton
            status={deleteAgentStatus}
            onClick={handleDeleteClick}
            variant="danger"
          >
            {deleteAgentStatus === "loading"
              ? "Удаление..."
              : deleteAgentStatus === "success"
                ? "✓ Удален"
                : deleteAgentStatus === "error"
                  ? "✗ Ошибка"
                  : "Удалить агента"}
          </ActionButton>
        </div>

        {/* Форма создания задачи */}
        <CreateTaskForm
          categories={categories}
          onSubmit={handleCreateTask}
          buttonStatus={createTaskStatus}
        />

        {/* Список агентов */}
        <AgentList
          agents={agents}
          loading={agentsLoading}
          selectedAgent={selectedAgent}
          onSelectAgent={setSelectedAgent}
          onInterruptAgent={handleInterruptAgent}
        />
      </div>

      {/* Правая колонка */}
      <div
        style={{
          flex: 1,
          position: "sticky",
          top: "20px",
          alignSelf: "flex-start",
        }}
      >
        <AgentHeartbeat agent={selectedAgent} />
        <TaskQueue
          agent={selectedAgent}
          getAgentStatusText={getAgentStatusText}
          interruptedTask={interruptedTask}
        />
      </div>

      {/* Диалог удаления */}
      <DeleteAgentDialog
        isOpen={showDeleteDialog}
        confirmStep={deleteConfirmStep}
        agents={agents}
        selectedAgentId={selectedAgentId}
        onSelectAgent={setSelectedAgentId}
        onConfirm={handleDeleteConfirm}
        onFinalDelete={handleFinalDelete}
        onCancel={handleCancelDelete}
      />

      {/* Диалог прерывания агента */}
      <InterruptAgentDialog
        isOpen={showInterruptDialog}
        agent={agentToInterrupt}
        onConfirm={handleConfirmInterrupt}
        onCancel={handleCancelInterrupt}
      />

      {/* Уведомление о прерывании */}
      {interruptStatus === "success" && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            backgroundColor: "#28a745",
            color: "white",
            padding: "12px 20px",
            borderRadius: "4px",
            zIndex: 1000,
            animation: "slideIn 0.3s ease-out",
          }}
        >
          ✓ Агент успешно прерван
        </div>
      )}

      {interruptStatus === "error" && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            backgroundColor: "#dc3545",
            color: "white",
            padding: "12px 20px",
            borderRadius: "4px",
            zIndex: 1000,
            animation: "slideIn 0.3s ease-out",
          }}
        >
          ✗ Ошибка при прерывании агента
        </div>
      )}

      <style>
        {`
          @keyframes slideIn {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
        `}
      </style>
    </div>
  );
}

export default HomePage;

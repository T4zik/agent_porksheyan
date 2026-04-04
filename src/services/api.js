// services/api.js
// В будущем здесь будет реальное подключение к БД

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:3001/api";

// Мок-функция для имитации API (временно)
export const mockFetch = (url, options) => {
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
      } else if (url === "/api/create-task") {
        const body = options?.body ? JSON.parse(options.body) : null;
        resolve({
          ok: true,
          json: async () => ({
            success: true,
            message: "Задача создана",
            task: body,
          }),
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

// Реальные функции для работы с БД (будет реализовано позже)
export const api = {
  // Агенты
  getAgents: async () => {
    // TODO: Заменить на реальный запрос к БД
    const response = await mockFetch("/api/agents");
    return response.json();
  },

  createAgent: async () => {
    const response = await mockFetch("/api/create-agent", { method: "POST" });
    return response.json();
  },

  deleteAgent: async (agentId) => {
    const response = await mockFetch("/api/delete-agent", {
      method: "POST",
      body: JSON.stringify({ agentId }),
    });
    return response.json();
  },

  getAgentHeartbeat: async (agentId) => {
    const response = await mockFetch(`/api/agents/${agentId}/heartbeat`);
    return response.json();
  },

  // Задачи
  createTask: async (taskData) => {
    // TODO: Отправка задачи в БД
    const response = await mockFetch("/api/create-task", {
      method: "POST",
      body: JSON.stringify(taskData),
    });
    return response.json();
  },
};

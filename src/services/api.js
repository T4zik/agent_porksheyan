// services/api.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Реальные функции для работы с БД
export const api = {
  // Агенты
  getAgents: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/agents`);
      if (!response.ok) throw new Error('Ошибка загрузки агентов');
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
  
  createAgent: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/agents/create`, { 
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error('Ошибка создания агента');
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
  
  deleteAgent: async (agentId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/agents/delete`, { 
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ agentId })
      });
      if (!response.ok) throw new Error('Ошибка удаления агента');
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
  
  interruptAgent: async (agentId, taskName) => {
    try {
      const response = await fetch(`${API_BASE_URL}/agents/interrupt`, { 
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ agentId, taskName })
      });
      if (!response.ok) throw new Error('Ошибка прерывания агента');
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
  
  getAgentHeartbeat: async (agentId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/agents/${agentId}/heartbeat`);
      if (!response.ok) throw new Error('Ошибка получения heartbeat');
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
  
  // Задачи
  createTask: async (taskData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/create`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(taskData)
      });
      if (!response.ok) throw new Error('Ошибка создания задачи');
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
  
  getAgentTasks: async (agentId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/agent/${agentId}`);
      if (!response.ok) throw new Error('Ошибка получения задач');
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }
};
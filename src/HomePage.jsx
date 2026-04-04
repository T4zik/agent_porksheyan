import Header from "./components/Header";
import { Link } from "react-router";
import "./App.css";
import styles from "./styles/buttons.jsx";
import React, { useState, useEffect } from "react";

// Мок-функция для имитации API (временно, пока нет реального сервера)
const mockFetch = (url, options) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (url === "/api/event1") {
        resolve({
          ok: true,
          json: async () => ({ success: true, message: "Событие 1 принято" }),
        });
      } else if (url === "/api/event2") {
        resolve({
          ok: true,
          json: async () => ({ success: true, message: "Событие 2 принято" }),
        });
      } else if (url === "/api/items") {
        resolve({
          ok: true,
          json: async () => [
            { id: 1, name: "Проект Альфа", description: "Основной проект" },
            { id: 2, name: "Задача Бета", description: "Важная задача" },
            { id: 3, name: "Релиз Гамма", description: "Плановый релиз" },
          ],
        });
      } else if (url.startsWith("/api/items/") && url.endsWith("/queue")) {
        const id = parseInt(url.split("/")[3]);
        const queues = {
          1: [
            "Инициализация",
            "Анализ требований",
            "Разработка",
            "Тестирование",
          ],
          2: ["Сбор данных", "Обработка", "Выгрузка отчета"],
          3: ["Подготовка окружения", "Сборка", "Деплой", "Проверка"],
        };
        resolve({
          ok: true,
          json: async () => ({ queue: queues[id] || ["Нет задач"] }),
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
const sendSignal = async (endpoint, setStatus) => {
  setStatus("loading");
  try {
    const response = await mockFetch(endpoint, { method: "POST" });
    if (response.ok) {
      setStatus("success");
      setTimeout(() => setStatus("idle"), 2000);
    } else {
      throw new Error("Ошибка сервера");
    }
  } catch (error) {
    console.error(error);
    setStatus("error");
    setTimeout(() => setStatus("idle"), 2000);
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

export function HomePage() {
  // Состояния для кнопок
  const [button1Status, setButton1Status] = useState("idle");
  const [button2Status, setButton2Status] = useState("idle");

  // Состояния для зависимых списков
  const [category, setCategory] = useState("fruits");
  const [subcategory, setSubcategory] = useState("apple");
  const [subOptions, setSubOptions] = useState([]);

  // Состояния для облака (список из БД)
  const [items, setItems] = useState([]);
  const [itemsLoading, setItemsLoading] = useState(false);

  // Состояния для модального окна
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [queue, setQueue] = useState([]);
  const [queueLoading, setQueueLoading] = useState(false);

  // Категории и их подкатегории
  const categories = {
    fruits: {
      label: "Фрукты",
      options: { apple: "Яблоки", banana: "Бананы", orange: "Апельсины" },
    },
    vegetables: {
      label: "Овощи",
      options: { tomato: "Помидоры", cucumber: "Огурцы", carrot: "Морковь" },
    },
  };

  // Функции для модального окна
  const openModal = async (item) => {
    setSelectedItem(item);
    setModalOpen(true);
    setQueueLoading(true);
    try {
      const response = await mockFetch(`/api/items/${item.id}/queue`);
      if (response.ok) {
        const data = await response.json();
        setQueue(data.queue);
      } else {
        setQueue(["Ошибка загрузки очереди"]);
      }
    } catch (err) {
      console.error(err);
      setQueue(["Ошибка сети"]);
    } finally {
      setQueueLoading(false);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedItem(null);
    setQueue([]);
  };

  // Обновление подкатегорий при смене категории
  useEffect(() => {
    const newOptions = categories[category].options;
    setSubOptions(Object.entries(newOptions));
    const firstKey = Object.keys(newOptions)[0];
    setSubcategory(firstKey);
  }, [category]);

  // Загрузка списка элементов из БД при монтировании
  useEffect(() => {
    const fetchItems = async () => {
      setItemsLoading(true);
      try {
        const response = await mockFetch("/api/items");
        if (response.ok) {
          const data = await response.json();
          setItems(data);
        } else {
          console.error("Ошибка загрузки элементов");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setItemsLoading(false);
      }
    };
    fetchItems();
  }, []);

  return (
    <div style={styles.container}>
      <h1>Панель управления</h1>

      {/* Две кнопки отправки сигналов */}
      <div style={styles.section}>
        <h3>Отправка сигналов на сервер</h3>
        <button
          style={getButtonStyle(button1Status, {
            ...styles.button,
            ...styles.buttonPrimary,
          })}
          onClick={() => sendSignal("/api/event1", setButton1Status)}
          disabled={button1Status === "loading"}
        >
          {button1Status === "loading"
            ? "Отправка..."
            : button1Status === "success"
            ? "✓ Отправлено"
            : button1Status === "error"
            ? "✗ Ошибка"
            : "Отправить событие 1"}
        </button>
        <button
          style={getButtonStyle(button2Status, {
            ...styles.button,
            ...styles.buttonPrimary,
          })}
          onClick={() => sendSignal("/api/event2", setButton2Status)}
          disabled={button2Status === "loading"}
        >
          {button2Status === "loading"
            ? "Отправка..."
            : button2Status === "success"
            ? "✓ Отправлено"
            : button2Status === "error"
            ? "✗ Ошибка"
            : "Отправить событие 2"}
        </button>
      </div>

      {/* Модульная строка с зависимыми выпадающими списками */}
      <div style={styles.section}>
        <h3>Выбор категории и подкатегории</h3>
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

      {/* Облако (список) элементов из БД */}
      <div style={styles.section}>
        <h3>
          Список из базы данных (нажмите на элемент для просмотра очереди задач)
        </h3>
        {itemsLoading ? (
          <p>Загрузка элементов...</p>
        ) : (
          <ul style={styles.itemsList}>
            {items.map((item) => (
              <li
                key={item.id}
                style={styles.item}
                onClick={() => openModal(item)}
              >
                <strong>{item.name}</strong> — {item.description}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Модальное окно с очередью задач */}
      {modalOpen && (
        <div style={styles.modalOverlay} onClick={closeModal}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3>Очередь задач для: {selectedItem?.name}</h3>
            {queueLoading ? (
              <p>Загрузка очереди...</p>
            ) : (
              <ul style={styles.queueList}>
                {queue.map((task, idx) => (
                  <li key={idx}>{task}</li>
                ))}
              </ul>
            )}
            <button
              onClick={closeModal}
              style={{
                marginTop: "15px",
                ...styles.button,
                ...styles.buttonPrimary,
              }}
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;

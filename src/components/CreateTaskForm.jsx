// components/CreateTaskForm.jsx
import React, { useState, useEffect } from "react";
import ActionButton from "./buttons/ActionButton";
import styles from "../styles/buttons";

const CreateTaskForm = ({ categories, onSubmit, buttonStatus }) => {
  const [category, setCategory] = useState(Object.keys(categories)[0]);
  const [subcategory, setSubcategory] = useState("");
  const [subOptions, setSubOptions] = useState([]);
  const [taskName, setTaskName] = useState("");

  useEffect(() => {
    if (category && categories[category]) {
      const options = categories[category].options;
      setSubOptions(Object.entries(options));
      const firstKey = Object.keys(options)[0];
      setSubcategory(firstKey);
    }
  }, [category, categories]);

  const handleSubmit = () => {
    const taskData = {
      type: categories[category].label,
      subtype: categories[category].options[subcategory],
      name:
        taskName ||
        `${categories[category].label}: ${categories[category].options[subcategory]}`,
      timestamp: new Date().toISOString(),
      status: "pending",
    };
    onSubmit(taskData);
    setTaskName("");
  };

  return (
    <div style={styles.section}>
      <h3>Настройка новой задачи</h3>
      <div>
        <input
          type="text"
          placeholder="Название задачи (опционально)"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          style={{
            ...styles.select,
            width: "100%",
            marginBottom: "10px",
            padding: "8px",
          }}
        />
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
        <p style={{ marginTop: "10px", fontSize: "14px", color: "#6c757d" }}>
          Выбрано: {categories[category].label} →{" "}
          {categories[category].options[subcategory]}
        </p>
        <ActionButton
          status={buttonStatus}
          onClick={handleSubmit}
          variant="success"
          style={{ marginTop: "10px", width: "100%" }}
        >
          {buttonStatus === "loading"
            ? "Отправка..."
            : buttonStatus === "success"
              ? "✓ Задача создана"
              : buttonStatus === "error"
                ? "✗ Ошибка"
                : "➕ Отправить задачу в БД"}
        </ActionButton>
      </div>
    </div>
  );
};

export default CreateTaskForm;

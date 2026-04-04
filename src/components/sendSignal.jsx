// Отправка сигнала на сервер (общая функция)
import React from "react";
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
export default sendSignal;

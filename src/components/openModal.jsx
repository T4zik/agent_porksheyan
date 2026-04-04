// Открыть модальное окно с очередью задач для выбранного элемента
import React from "react";
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
export default openModal;

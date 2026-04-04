import React from "react";

const closeModal = () => {
  setModalOpen(false);
  setSelectedItem(null);
  setQueue([]);
};

export default closeModal;

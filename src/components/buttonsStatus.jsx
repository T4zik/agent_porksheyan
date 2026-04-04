import React from "react";

const buttonsStatus = () => {
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

  // Обновление подкатегорий при смене категории
  useEffect(() => {
    const newOptions = categories[category].options;
    setSubOptions(Object.entries(newOptions));
    // Устанавливаем первую подкатегорию по умолчанию
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
};

export default buttonsStatus;

import React, { useState } from "react";
import { FaSearch, FaSpinner } from "react-icons/fa";
import "./SearchBar.css";

export const SearchBar = ({ setResults }) => {
  const [input, setInput] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false); //состояние загрузки

  const fetchData = async (url) => {
    if (!url.trim()) return;

    setIsLoading(true);//врубаем загрузку перед запросом
    setError(null);

    try {
      const response = await fetch('https://g5t12tdl-8000.euw.devtunnels.ms/parse/wb?url='+url,);

      if (!response.ok) {
        throw new Error("Ошибка при запросе к серверу");
      }

      const json = await response.json();
      setResults(p => [...p, json]);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching data:", err);
    } finally {
      setIsLoading(false); //сто пудов врубаем загрузку
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      fetchData(input);
    }
  };

  const handleChange = (e) => {
    setInput(e.target.value);
  };

  return (
    <div className="input-wrapper">
      <FaSearch id="search-icon" />
      <input
        placeholder="Введите ссылку и нажмите Enter..."
        value={input}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={isLoading} //блокирум изменения в строке поиска
      />
      {isLoading && <FaSpinner className='spinner'/>}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

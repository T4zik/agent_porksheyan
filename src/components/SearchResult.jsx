import React from "react";
import { FaSpinner } from "react-icons/fa";
import "./SearchResult.css";

export const SearchResult = ({ result, isLoading=false }) => {
  return (

    <div
      className={"search-result ${isLoading ? 'loading' : ''}"}
      onClick={(e) => !isLoading && alert("Вы выбрали товар: ${result.name}")}
    >
      {isLoading ? (
        <div className='loading-spinner'>
          <FaSpinner className='spinner-icon'/>
        </div>
      ) : (
        <>
          <div className="product-image-container">
            {result.imageUrl && (
              <img
                src={result.imageUrl}
                alt={result.name}
                className="product-image"
              />
            )}
          </div>
          <div className="product-info">
            <h3 className="product-name">{result.name}</h3>
            <div className="product-details">
              <span className="product-price">Цена:
                { `${result.price} ₽`}
              </span>
            </div>
            {result.nm_id && (
            <span className="product-nm_id">Артикул: {result.nm_id}</span>
            )}
          </div>
        </>
      )}
    </div>
  );
};


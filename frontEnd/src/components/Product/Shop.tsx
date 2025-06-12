import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { SushiItem } from "../Types/index";
import { categories, sushiItems } from "./SushiData";
import { useCart } from "../Cart/CartContext";
import "./Shop.css";
import { ShoppingCart, User } from "lucide-react";

// Componente principal da loja
const Shop: React.FC = () => {
  const navigate = useNavigate();
  const { state, addItem } = useCart();
  const [activeCategory, setActiveCategory] = useState("all");

  console.log("Passou nesse carai", { categories, sushiItems, state });

  const [selectedItem, setSelectedItem] = useState<SushiItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [observations, setObservations] = useState("");

  const filteredItems =
    activeCategory === "all"
      ? sushiItems
      : sushiItems.filter((item) => item.category === activeCategory);

  const openModal = (item: SushiItem) => {
    setSelectedItem(item);
    setQuantity(1);
    setObservations("");
  };

  const closeModal = () => {
    setSelectedItem(null);
    setObservations("");
  };

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleObservationsChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    if (value.length <= 140) {
      setObservations(value);
    }
  };

  const addToCart = () => {
    if (selectedItem) {
      addItem(selectedItem, quantity, observations.trim() || undefined);

      //Exibe notificação quando um item é adicionado ao carrinho
      const notification = document.createElement("div");
      notification.className = "add-to-cart-notification";
      notification.textContent = `${selectedItem.name} adicionado ao carrinho!`;
      document.body.appendChild(notification);

      setTimeout(() => {
        notification.remove();
      }, 3000);

      closeModal();
    }
  };

  // Função para redirecionar para a página do carrinho
  const goToCart = () => {
    navigate("/Cart/Cart");
  };

  return (
    <div className="shop-container">
      <div className="shop-header">
        <h1>BEM VINDO ARTHUR</h1>
        <div className="header-actions">
          <button className="filter-btn">
            <User size={24} />
          </button>

          <button className="cart-btn" onClick={goToCart}>
            <ShoppingCart size={24} />
          </button>
        </div>
      </div>

      {/*Abas de Categorias*/}
      <div className="categories-tabs">
        {categories.map((category) => (
          <button
            key={category.id}
            className={`category-tab ${
              activeCategory === category.id ? "active" : ""
            }`}
            onClick={() => setActiveCategory(category.id)}
          >
            <span className="category-icon">{category.icon}</span>
            <span className="category-name">{category.name}</span>
          </button>
        ))}
      </div>

      {/*Items de uma categoria, importados do SushiData.ts*/}
      <div className="items-grid">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="item-card"
            onClick={() => openModal(item)}
          >
            <div className="item-image">
              <img src={item.image} alt={item.name} />
            </div>
            <div className="item-info">
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <div className="price-container">
                {item.originalPrice && (
                  <span className="original-price">
                    R$ {item.originalPrice.toFixed(2).replace(".", ",")}
                  </span>
                )}
                <span className="item-price">
                  R$ {item.price.toFixed(2).replace(".", ",")}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/*Modal para exibir detalhes do item selecionado*/}
      {selectedItem && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={closeModal}>
              ✕
            </button>

            <div className="modal-header">
              <h2>Detalhes</h2>
            </div>

            <div className="modal-body">
              <div className="product-image">
                <img src={selectedItem.image} alt={selectedItem.name} />
              </div>

              <div className="product-details">
                <h3>{selectedItem.name}</h3>
                <ul className="details-list">
                  {selectedItem.details.map((detail, index) => (
                    <li key={index}>{detail}</li>
                  ))}
                </ul>

                <div className="price-section">
                  {selectedItem.originalPrice && (
                    <span className="modal-original-price">
                      R${" "}
                      {selectedItem.originalPrice.toFixed(2).replace(".", ",")}
                    </span>
                  )}
                  <span className="modal-price">
                    R$ {selectedItem.price.toFixed(2).replace(".", ",")}
                  </span>
                </div>

                <div className="tabs-section">
                  <div className="modal-tabs">
                    <button className="modal-tab active">OBSERVAÇÃO</button>
                  </div>
                </div>

                <div className="customization-section">
                  <div className="observations">
                    <h4>Alguma observação?</h4>
                    <textarea
                      placeholder="Tem alguma observação? Pode deixar aqui!"
                      maxLength={140}
                      value={observations}
                      onChange={handleObservationsChange}
                    ></textarea>
                    <span className="char-count">
                      {observations.length}/140
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <div className="quantity-controls">
                <button className="quantity-btn" onClick={decreaseQuantity}>
                  -
                </button>
                <span className="quantity">{quantity}</span>
                <button className="quantity-btn" onClick={increaseQuantity}>
                  +
                </button>
              </div>

              <button className="add-to-cart-btn" onClick={addToCart}>
                ADICIONAR R${" "}
                {(selectedItem.price * quantity).toFixed(2).replace(".", ",")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;

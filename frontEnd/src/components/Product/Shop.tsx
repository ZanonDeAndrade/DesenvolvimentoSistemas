// frontend/src/components/Shop.tsx
import React, { useState, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import type { Product, CategoryTab } from "../Types/index"; // Importe Product do seu arquivo de tipos global
import { useCart } from "../Cart/CartContext";
import "./Shop.css";
import { ShoppingCart, User } from "lucide-react";

// Importar as funções de API
import { getProducts, getBebidas, getCombos, getSushiItems } from "../../services/api"; // Ajuste o caminho conforme necessário

// Defina as categorias aqui, ou importe de um arquivo separado se elas forem estáticas
// Exemplo:
const categories: CategoryTab[] = [
  { id: "all", name: "Todos", icon: "🍱" },
  { id: "combos", name: "Combos", icon: "🍣" },
  { id: "sashimi", name: "Sashimi", icon: "🐟" },
  { id: "uramaki", name: "Uramaki", icon: "🍙" },
  { id: "hot", name: "Hot", icon: "🔥" },
  { id: "temaki", name: "Temaki", icon: "🌯" },
  { id: "bebidas", name: "Bebidas", icon: "🥤" },
];

interface JwtPayload {
  userId: string;
  email: string;
  nome: string;
  exp: number;
  iat: number;
}

// Componente principal da loja
const Shop: React.FC = () => {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedItem, setSelectedItem] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [observations, setObservations] = useState("");
  const [userName, setUserName] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // --- Adicione a URL base do seu backend aqui ---
  const API_BASE_URL = 'http://localhost:5000'; // OU a URL do seu backend em produção
  // ---------------------------------------------

  // Lógica de verificação do token (mantida igual)
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode<JwtPayload>(token);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp > currentTime) {
          const fullName = decodedToken.nome;
          const firstName = fullName.split(' ')[0];
          setUserName(firstName);
        } else {
          console.warn('Token JWT expirado. Redirecionando para o login.');
          localStorage.removeItem('token');
          navigate('/Login');
        }
      } catch (error) {
        console.error('Erro ao decodificar token JWT:', error);
        localStorage.removeItem('token');
        navigate('/Login');
      }
    } else {
      console.log('Nenhum token encontrado. Redirecionando para o login.');
      navigate('/Login');
    }
  }, [navigate]);

  // Função para buscar produtos com base na categoria ativa (mantida como antes)
  const fetchProductsByCategory = useCallback(async (category: string) => {
    try {
      setLoading(true);
      setError(null);
      let data: Product[] = [];
      switch (category) {
        case 'all':
          data = await getProducts();
          break;
        case 'combos':
          data = await getCombos();
          break;
        case 'bebidas':
          data = await getBebidas();
          break;
        case 'sashimi':
        case 'uramaki':
        case 'hot':
        case 'temaki':
          const allSushiItems = await getSushiItems();
          data = allSushiItems.filter(item => item.category === category);
          break;
        default:
          data = await getProducts();
          break;
      }
      setProducts(data);
    } catch (err) {
      console.error(`Erro ao buscar produtos para a categoria ${category}:`, err);
      setError('Não foi possível carregar os produtos.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProductsByCategory(activeCategory);
  }, [activeCategory, fetchProductsByCategory]);


  const filteredItems = products;

  const openModal = (item: Product) => {
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

  const goToCart = () => {
    navigate("/Cart/Cart");
  };

  if (loading) {
    return (
      <div className="shop-container">
        <p>Carregando produtos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="shop-container">
        <p className="error-message">Erro: {error}</p>
      </div>
    );
  }

  return (
    <div className="shop-container">
      <div className="shop-header">
        <h1>BEM VINDO {userName ? userName.toUpperCase() : 'CLIENTE'}</h1>
        <div className="header-actions">
          <button className="filter-btn">
            <User size={24} />
          </button>

          <button className="cart-btn" onClick={goToCart}>
            <ShoppingCart size={24} />
          </button>
        </div>
      </div>

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

      <div className="items-grid">
        {filteredItems.length === 0 && !loading && !error ? (
          <p>Nenhum produto encontrado para a categoria selecionada.</p>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item._id}
              className="item-card"
              onClick={() => openModal(item)}
            >
              <div className="item-image">
                {/* --- MUDANÇA CRUCIAL AQUI --- */}
                <img src={`${API_BASE_URL}/${item.image}`} alt={item.name} 
                loading="lazy"/>
                
                {/* ---------------------------- */}
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
          ))
        )}
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
                {/* --- MUDANÇA CRUCIAL AQUI TAMBÉM --- */}
                <img src={`${API_BASE_URL}/${selectedItem.image}`} alt={selectedItem.name} 
                loading="lazy"/>
                {/* ---------------------------------- */}
              </div>

              <div className="product-details">
                <h3>{selectedItem.name}</h3>
                {selectedItem.details && selectedItem.details.length > 0 && (
                    <ul className="details-list">
                      {selectedItem.details.map((detail, index) => (
                        <li key={index}>{detail}</li>
                      ))}
                    </ul>
                )}
                {(!selectedItem.details || selectedItem.details.length === 0) && selectedItem.volume && (
                    <p>Volume: {selectedItem.volume}</p>
                )}


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
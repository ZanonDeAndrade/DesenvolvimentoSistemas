import React, { useState, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import type { Product, CategoryTab, SushiItemProduct } from "../Types/index"; // Ajuste o caminho se necessário
import { useCart } from "../Cart/CartContext";
import "./Shop.css";
import { ShoppingCart, User } from "lucide-react";

import { getProducts, getBebidas, getCombos, getSushiItems } from "../../services/api";
import { useAuth } from '../../contexts/AuthContext'; // IMPORTANTE: Importe useAuth

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

const Shop: React.FC = () => {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { user, isLoading, logout } = useAuth(); // OBTENHA 'user', 'isLoading' E 'logout' do AuthContext

  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedItem, setSelectedItem] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [observations, setObservations] = useState("");
  const [userName, setUserName] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([]);
  const [shopLoading, setShopLoading] = useState<boolean>(true); // Renomeado
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = 'http://localhost:5000';

  // LÓGICA DE VERIFICAÇÃO DE AUTENTICAÇÃO E REDIRECIONAMENTO
  // Isso só será executado DEPOIS que o AuthContext terminar de carregar
  useEffect(() => {
    // Se o AuthContext ainda está carregando, não faça nada neste useEffect.
    if (isLoading) {
      console.log("Shop.tsx: AuthContext ainda carregando...");
      return;
    }

    // Se AuthContext terminou de carregar E NÃO há um usuário logado
    if (!user) {
      console.log('Shop.tsx: Usuário não logado após inicialização do AuthContext. Redirecionando para o login.');
      navigate('/Login/Login'); // Redireciona para a sua rota de login exata
      return; // Importante para parar a execução do resto do useEffect
    }

    // Se há um usuário logado, continue com a verificação do token
    if (user.token) {
      try {
        const decodedToken = jwtDecode<JwtPayload>(user.token);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp > currentTime) {
          const fullName = decodedToken.nome;
          const firstName = fullName.split(' ')[0];
          setUserName(firstName);
          console.log("Shop.tsx: Token JWT válido, usuário logado:", decodedToken.nome);
        } else {
          console.warn('Shop.tsx: Token JWT expirado. Redirecionando para o login.');
          logout(); // Limpa o usuário no contexto e localStorage
          navigate('/Login/Login'); // Redireciona para a sua rota de login exata
        }
      } catch (error) {
        console.error('Shop.tsx: Erro ao decodificar token JWT ou token inválido:', error);
        logout(); // Limpa o usuário no contexto e localStorage
        navigate('/Login/Login'); // Redireciona para a sua rota de login exata
      }
    } else {
        // Isso acontece se 'user' existe mas 'user.token' não (pode ser um estado inconsistente)
        console.log('Shop.tsx: Usuário logado mas sem token no objeto user. Redirecionando.');
        logout(); // Considerar deslogar o usuário em caso de inconsistência
        navigate('/Login/Login');
    }
  }, [user, isLoading, navigate, logout]); // Dependências: user, isLoading do AuthContext, navigate, e logout

  // Lógica para buscar produtos APENAS se o usuário estiver logado E o AuthContext terminou de carregar
  const fetchProductsByCategory = useCallback(async (category: string) => {
    // Só continue se houver um usuário E o AuthContext terminou de carregar
    if (!user || isLoading) {
      setProducts([]); // Limpar produtos se não houver usuário ou ainda carregando
      setShopLoading(false); // Definir como false para não ficar travado no loading
      return;
    }

    try {
      setShopLoading(true);
      setError(null);
      let data: Product[] = [];
      switch (category) {
        case 'all':
          data = await getProducts();
          break;
        case 'combos':
          data = await getCombos();
          break;
        case 'sashimi':
        case 'uramaki':
        case 'hot':
        case 'temaki':
          const allSushiItems = await getSushiItems();
          data = allSushiItems.filter(item => item.category === category);
          break;
        case 'bebidas':
          data = await getBebidas();
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
      setShopLoading(false);
    }
  }, [user, isLoading]); // Adicione user e isLoading como dependências

  // NOVO useEffect para acionar a busca de produtos
  useEffect(() => {
    // Chama fetchProductsByCategory apenas quando activeCategory muda E user está disponível E não está carregando
    if (user && !isLoading) {
      fetchProductsByCategory(activeCategory);
    }
  }, [activeCategory, fetchProductsByCategory, user, isLoading]);

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
      addItem(selectedItem as SushiItemProduct, quantity, observations.trim() || undefined);

      const notification = document.createElement("div");
      notification.className = "add-to-cart-notification";
      notification.textContent = `${selectedItem.name} adicionado ao carrinho!`;
      document.body.appendChild(notification);

      setTimeout(() => {
        notification.remove();
      }, 2000);

      closeModal();
    }
  };

  const goToCart = () => {
    navigate("/Cart/Cart");
  };

  // Lógica de carregamento principal para renderização
  // Mostra um spinner enquanto o AuthContext está verificando a autenticação
  if (isLoading) {
    return (
      <div className="shop-container">
        <p>Verificando autenticação...</p>
      </div>
    );
  }

  if (!user && !isLoading) { // Este caso só deveria ser alcançado se o redirecionamento acima falhou por algum motivo
      return (
        <div className="shop-container">
          <p>Erro de autenticação. Por favor, faça login novamente.</p>
          <button onClick={() => navigate('/Login/Login')}>Ir para Login</button>
        </div>
      );
  }

  // Se o AuthContext já verificou E há um usuário, mostre o loading dos produtos
  if (shopLoading) {
    return (
      <div className="shop-container">
        <p>Carregando produtos da loja...</p>
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
        {filteredItems.length === 0 && !shopLoading && !error ? (
          <p>Nenhum produto encontrado para a categoria selecionada.</p>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item._id}
              className="item-card"
              onClick={() => openModal(item)}
            >
              <div className="item-image">
                <img src={`${API_BASE_URL}/${item.image}`} alt={item.name} 
                loading="lazy"/>
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
                <img src={`${API_BASE_URL}/${selectedItem.image}`} alt={selectedItem.name} 
                loading="lazy"/>
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
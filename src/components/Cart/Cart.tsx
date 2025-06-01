import { useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';
import './Cart.css';


const Cart: React.FC = () => {
  const { state, removeItem, updateQuantity, clearCart } = useCart();
  const navigate = useNavigate();

  //Aumenta a quantidade de um item no carrinho
  const increaseQuantity = (id: number, currentQuantity: number) => {
    updateQuantity(id, currentQuantity + 1);
  };

  //Diminui a quantidade de um item no carrinho ou remove se a quantidade for 1
  const decreaseQuantity = (id: number, currentQuantity: number) => {
    if (currentQuantity > 1) {
      updateQuantity(id, currentQuantity - 1);
    } else {
      removeItem(id);
    }
  };

  //Remove um item específico do carrinho
  const handleRemoveItem = (id: number) => {
    removeItem(id);
  };

  //Limpa todo o carrinho 
  const handleClearCart = () => {
    if (window.confirm('Tem certeza que deseja limpar o carrinho?')) {
      clearCart();
    }
  };

  //Processa o checkout, redirecionando para a página de checkout
  const handleCheckout = () => {
    if (state.items.length === 0) {
      alert('Seu carrinho está vazio!');
      return;
    }
    
    navigate('/checkout/checkout');
  };

  //Redireciona para a página de compras
  const handleContinueShopping = () => {
    navigate('/shop/shop'); 
  };

  //Renderiza estado vazio do carrinho
  if (state.items.length === 0) {
    return (
      <div className="cart-container">
        <div className="cart-header">
          <h1>Carrinho</h1>
        </div>
        
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>
          <h2>Seu carrinho está vazio</h2>
          <p>Adicione alguns itens deliciosos do nosso cardápio!</p>
          <button 
            className="continue-shopping-btn"
            onClick={handleContinueShopping}
          >
            Continuar Comprando
          </button>
        </div>
      </div>
    );
  }

  //Renderiza carrinho com itens
  return (
    <div className="cart-container">
      <div className="cart-header">
        <h1>Carrinho ({state.itemCount} {state.itemCount === 1 ? 'item' : 'itens'})</h1>
        <button className="clear-cart-btn" onClick={handleClearCart}>
          Limpar Carrinho
        </button>
      </div>

      {/*Lista de itens do carrinho*/}
      <div className="cart-content">
        <div className="cart-items">
          {state.items.map((item, index) => (
            <div key={`${item.id}-${index}`} className="cart-item">
              <div className="cart-item-image">
                <img src={item.image} alt={item.name} />
              </div>

              <div className="cart-item-details">
                <h3>{item.name}</h3>
                <p className="cart-item-description">{item.description}</p>
                
                {item.observations && (
                  <div className="cart-item-observations">
                    <strong>Observação:</strong> {item.observations}
                  </div>
                )}

                <div className="cart-item-price">
                  {item.originalPrice && (
                    <span className="cart-original-price">
                      R$ {item.originalPrice.toFixed(2).replace('.', ',')}
                    </span>
                  )}
                  <span className="cart-price">
                    R$ {item.price.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>

              <div className="cart-item-controls">
                <div className="quantity-controls">
                  <button 
                    className="quantity-btn"
                    onClick={() => decreaseQuantity(item.id, item.quantity)}
                  >
                    -
                  </button>
                  <span className="quantity">{item.quantity}</span>
                  <button 
                    className="quantity-btn"
                    onClick={() => increaseQuantity(item.id, item.quantity)}
                  >
                    +
                  </button>
                </div>

                <div className="cart-item-total">
                  R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                </div>

                <button 
                  className="remove-item-btn"
                  onClick={() => handleRemoveItem(item.id)}
                  title="Remover item"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <div className="summary-card">
            <h3>Resumo do Pedido</h3>
            
            <div className="summary-line">
              <span>Subtotal ({state.itemCount} {state.itemCount === 1 ? 'item' : 'itens'})</span>
              <span>R$ {state.total.toFixed(2).replace('.', ',')}</span>
            </div>

            <div className="summary-line">
              <span>Taxa de entrega</span>
              <span>R$ 5,00</span>
            </div>

            <div className="summary-line total-line">
              <span><strong>Total</strong></span>
              <span><strong>R$ {(state.total + 5).toFixed(2).replace('.', ',')}</strong></span>
            </div>

            <button className="checkout-btn" onClick={handleCheckout}>
              Finalizar Pedido
            </button>

            <button 
              className="continue-shopping-btn"
              onClick={handleContinueShopping}
            >
              Continuar Comprando
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
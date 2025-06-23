import { useNavigate, useLocation } from 'react-router-dom';
import './OrderConfirmation.css';

interface LocationState {
  orderId: string;
  total: number;
}

// Componente de confirmação de pedido
const OrderConfirmation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;

  const { orderId, total } = state || { orderId: 'ERR001', total: 0}; //Arrumar o valor padrão para valor total do pedido


  // Função para redirecionar para a página de compras
  const handleNewOrder = () => {
    navigate('/Shop/Shop');
  };

    return (
    <div className="order-confirmation-container">
      <div className="confirmation-card">
        <div className="success-icon">
          ✅
        </div>
        
        <h1>Pedido Confirmado!</h1>
        
        <div className="order-details">
          <h2>Número do Pedido</h2>
          <div className="order-number">#{orderId}</div>
          
          <div className="order-info">
            <div className="info-item">
              <span className="label">Total Pago:</span>
              <span className="value">R$ {total.toFixed(2).replace('.', ',')}</span>
            </div>
            
            <div className="info-item">
              <span className="label">Tempo Estimado:</span>
              <span className="value">30-45 minutos</span>
            </div>
            
            <div className="info-item">
              <span className="label">Status:</span>
              <span className="value status-preparing">🍳 Preparando</span>
            </div>
          </div>
        </div>

        <div className="confirmation-message">
          <p>
            Obrigado pelo seu pedido! Você receberá uma notificação quando 
            seu pedido estiver a caminho.
          </p>
        </div>

        <div className="action-buttons">
          
          <button 
            className="new-order-btn"
            onClick={handleNewOrder}
          >
             Fazer Novo Pedido
          </button>
        </div>

        <div className="contact-info">
          <p>
            Dúvidas? Entre em contato: 📞 (55) 99999-9999
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
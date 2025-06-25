import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './OrderConfirmation.css';
import type { IOrder } from '../Types/index'; // Importe a interface IOrder que define a estrutura do seu pedido

// Defina a interface do estado que o `useLocation` espera receber
interface LocationState {
  order: IOrder; // O Checkout.tsx está passando o objeto 'order' completo
}

// Componente de confirmação de pedido
const OrderConfirmation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Inicializa o estado local para armazenar os detalhes do pedido
  const [order, setOrder] = useState<IOrder | null>(null);

  useEffect(() => {
    // Acessa o estado passado pela navegação.
    // Garante que location.state não é nulo e que contém a propriedade 'order'.
    if (location.state && (location.state as LocationState).order) {
      const receivedOrder = (location.state as LocationState).order;
      setOrder(receivedOrder);
      console.log('OrderConfirmation: Pedido recebido no estado de navegação:', receivedOrder);
    } else {
      // Se não houver dados do pedido, redireciona para a página de compras
      console.warn('OrderConfirmation: Nenhum dado de pedido encontrado no estado de navegação. Redirecionando para a loja.');
      // Você pode redirecionar para uma página de erro ou para a loja
      navigate('/Shop/Shop');
    }
  }, [location.state, navigate]); // Dependências: re-executa se location.state ou navigate mudarem

  // Função para redirecionar para a página de compras
  const handleNewOrder = () => {
    navigate('/Shop/Shop');
  };

  // Enquanto o pedido não foi carregado, exibe uma mensagem de carregamento
  if (!order) {
    return (
      <div className="order-confirmation-container loading-screen">
        <p>Carregando confirmação do pedido...</p>
      </div>
    );
  }

  // Se o pedido foi carregado com sucesso, exibe os detalhes
  return (
    <div className="order-confirmation-container">
      <div className="confirmation-card">
        <div className="success-icon">
          ✅
        </div>
        
        <h1>Pedido Confirmado!</h1>
        
        <div className="order-details">
          <h2>Número do Pedido</h2>
          {/* Acessa o _id do objeto order */}
          <div className="order-number">#{order._id}</div> 
          
          <div className="order-info">
            <div className="info-item">
              <span className="label">Total Pago:</span>
              {/* Acessa o valorTotal do objeto order */}
              <span className="value">R$ {order.valorTotal.toFixed(2).replace('.', ',')}</span> 
            </div>
            
            <div className="info-item">
              <span className="label">Tempo Estimado:</span>
              <span className="value">30-45 minutos</span> {/* Pode ser fixo ou vir do order.tempoEstimado se o backend fornecer */}
            </div>
            
            <div className="info-item">
              <span className="label">Status:</span>
              {/* Acessa o statusPedido do objeto order */}
              <span className="value status-preparing">🍳 {order.statusPedido === 'pendente' ? 'Pendente' : order.statusPedido === 'confirmado' ? 'Confirmado' : 'Preparando'}</span> 
            </div>
          </div>
        </div>

        {/* Informações adicionais baseadas no método de pagamento, se necessário */}
        

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
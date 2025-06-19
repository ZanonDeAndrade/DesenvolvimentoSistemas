// frontend/src/components/Checkout.tsx
import React, { useState, useEffect } from 'react'; // Adicionado useEffect para decodificar o token
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Importar jwtDecode
import { useCart } from '../Cart/CartContext';
import './Checkout.css';
import { updateUserData } from '../../services/api'; // Importa a função de API para atualizar o usuário
import type { Address as BackendAddress, PaymentMethod } from '../Types'; // Importa a tipagem de endereço do Types/index.ts e PaymentMethod

// Tipagem para o payload do JWT
interface JwtPayload {
  userId: string;
  email: string;
  nome: string;
  exp: number;
  iat: number;
}

// Componente de Checkout
const Checkout: React.FC = () => {
  const { state, clearCart } = useCart();
  const navigate = useNavigate();

  const [userId, setUserId] = useState<string | null>(null); // Estado para armazenar o userId
  const [address, setAddress] = useState<BackendAddress>({
    rua: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '', // Adicionado estado
    cep: ''
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>({
    type: 'credit'
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Efeito para obter o userId do token ao carregar o componente
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode<JwtPayload>(token);
        setUserId(decodedToken.userId);
      } catch (error) {
        console.error('Erro ao decodificar token no Checkout:', error);
        // Opcional: Redirecionar para login se o token for inválido
        // navigate('/Login');
      }
    } else {
      console.warn('Nenhum token encontrado no Checkout. Usuário não autenticado.');
      // Opcional: Redirecionar para login se não houver token
      // navigate('/Login');
    }
  }, []); // Executa apenas uma vez ao montar o componente

  // Handler para campos de endereço
  const handleAddressChange = (field: keyof BackendAddress, value: string) => {
    setAddress(prev => ({ ...prev, [field]: value }));
    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Handler para campos de método de pagamento
  const handlePaymentMethodChange = (field: keyof PaymentMethod, value: any) => {
    setPaymentMethod(prev => ({ ...prev, [field]: value }));
    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[field as keyof Record<string, string>]) { // Ajuste na tipagem para 'errors'
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Função de validação do formulário
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validar endereço
    if (!address.rua.trim()) {
      newErrors.rua = 'Rua é obrigatória';
    }
    if (!address.numero.trim()) {
      newErrors.numero = 'Número é obrigatório';
    }
    if (!address.bairro.trim()) {
      newErrors.bairro = 'Bairro é obrigatório';
    }
    if (!address.cidade.trim()) {
      newErrors.cidade = 'Cidade é obrigatória';
    }
    if (!address.estado.trim()) { // Validar estado
        newErrors.estado = 'Estado é obrigatório';
    } else if (address.estado.trim().length !== 2) {
        newErrors.estado = 'Estado deve ter 2 caracteres (UF)';
    }
    if (!address.cep.trim()) {
      newErrors.cep = 'CEP é obrigatório';
    } else if (!/^\d{5}-?\d{3}$/.test(address.cep)) {
      newErrors.cep = 'CEP deve ter formato 00000-000';
    }

    // Validar método de pagamento
    if (paymentMethod.type === 'credit' || paymentMethod.type === 'debit') {
      if (!paymentMethod.cardNumber || paymentMethod.cardNumber.length < 16) {
        newErrors.cardNumber = 'Número do cartão inválido';
      }
      if (!paymentMethod.cardName?.trim()) {
        newErrors.cardName = 'Nome no cartão é obrigatório';
      }
      if (!paymentMethod.cardExpiry || !/^\d{2}\/\d{2}$/.test(paymentMethod.cardExpiry)) {
        newErrors.cardExpiry = 'Data de validade deve ter formato MM/AA';
      }
      if (!paymentMethod.cardCVV || paymentMethod.cardCVV.length < 3) {
        newErrors.cardCVV = 'CVV inválido';
      }
    } else if (paymentMethod.type === 'cash' && (paymentMethod.cashChange === undefined || paymentMethod.cashChange < total)) {
        newErrors.cashChange = `Valor do troco deve ser maior ou igual ao total (R$ ${total.toFixed(2).replace('.', ',')})`;
    }


    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitOrder = async () => {
    if (!validateForm()) {
      return;
    }

    if (!userId) {
      alert('Usuário não autenticado. Por favor, faça login novamente.');
      navigate('/Login'); // Redirecionar para login se userId não estiver disponível
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Token de autenticação ausente. Faça login novamente.');
        navigate('/Login');
        return;
      }

      // Preparar os dados do endereço para o backend (garantir que os nomes dos campos correspondem)
      const addressToSend: BackendAddress = {
        rua: address.rua,
        numero: address.numero,
        complemento: address.complemento,
        bairro: address.bairro,
        cidade: address.cidade,
        estado: address.estado,
        cep: address.cep,
      };

      // 1. Enviar/Atualizar Endereço do Usuário no Backend
      await updateUserData(userId, { endereco: addressToSend }, token);
      console.log('Endereço do usuário atualizado no backend.');

      // 2. Aqui você faria a chamada para criar o pedido no backend
      // Por enquanto, vamos apenas simular e navegar

      const orderData = {
        items: state.items,
        total: state.total + deliveryFee, // Usar deliveryFee que está definido no componente
        address: addressToSend, // Usar o objeto de endereço no formato do backend
        paymentMethod,
        timestamp: new Date().toISOString()
      };

      console.log('Dados do Pedido para envio (ainda não enviado para o BD de pedidos):', orderData);

      // Limpar carrinho
      clearCart();

      // Navegar para página de confirmação
      navigate('/OrderConfirmation/OrderConfirmation', {
        state: {
          orderId: Math.random().toString(36).substr(2, 9).toUpperCase(), // ID de exemplo
          total: state.total + deliveryFee
        }
      });

    } catch (error) {
      console.error('Erro ao processar pedido ou atualizar endereço:', error);
      alert('Erro ao processar pedido. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCardNumber = (value: string) => {
    return value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim().slice(0, 19);
  };

  const formatExpiry = (value: string) => {
    return value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2').slice(0, 5);
  };

  const formatZipCode = (value: string) => {
    return value.replace(/\D/g, '').replace(/(\d{5})(\d)/, '$1-$2').slice(0, 9);
  };

  const deliveryFee = 5.00;
  const total = state.total + deliveryFee;

  return (
    <div className="checkout-container">
      <div className="checkout-header">
        <button
          className="back-btn"
          onClick={() => navigate('/Cart/Cart')}
        >
          ← Voltar ao Carrinho
        </button>
        <h1>Finalizar Pedido</h1>
      </div>

      <div className="checkout-content">
        <div className="checkout-form">
          <div className="form-section">
            <h2>📍 Endereço de Entrega</h2>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="rua">Rua *</label>
                <input
                  type="text"
                  id="rua"
                  value={address.rua}
                  onChange={(e) => handleAddressChange('rua', e.target.value)}
                  className={errors.rua ? 'error' : ''}
                  placeholder="Nome da rua"
                />
                {errors.rua && <span className="error-message">{errors.rua}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="numero">Número *</label>
                <input
                  type="text"
                  id="numero"
                  value={address.numero}
                  onChange={(e) => handleAddressChange('numero', e.target.value)}
                  className={errors.numero ? 'error' : ''}
                  placeholder="123"
                />
                {errors.numero && <span className="error-message">{errors.numero}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="complemento">Complemento</label>
              <input
                type="text"
                id="complemento"
                value={address.complemento || ''} // Usar || '' para evitar undefined
                onChange={(e) => handleAddressChange('complemento', e.target.value)}
                placeholder="Apartamento, bloco, etc."
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="bairro">Bairro *</label>
                <input
                  type="text"
                  id="bairro"
                  value={address.bairro}
                  onChange={(e) => handleAddressChange('bairro', e.target.value)}
                  className={errors.bairro ? 'error' : ''}
                  placeholder="Nome do bairro"
                />
                {errors.bairro && <span className="error-message">{errors.bairro}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="cidade">Cidade *</label>
                <input
                  type="text"
                  id="cidade"
                  value={address.cidade}
                  onChange={(e) => handleAddressChange('cidade', e.target.value)}
                  className={errors.cidade ? 'error' : ''}
                  placeholder="Nome da cidade"
                />
                {errors.cidade && <span className="error-message">{errors.cidade}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="estado">Estado *</label>
              <input
                type="text"
                id="estado"
                value={address.estado}
                onChange={(e) => handleAddressChange('estado', e.target.value.toUpperCase())} // Converter para maiúsculas
                className={errors.estado ? 'error' : ''}
                placeholder="UF (Ex: SP)"
                maxLength={2}
              />
              {errors.estado && <span className="error-message">{errors.estado}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="cep">CEP *</label>
              <input
                type="text"
                id="cep"
                value={address.cep}
                onChange={(e) => handleAddressChange('cep', formatZipCode(e.target.value))}
                className={errors.cep ? 'error' : ''}
                placeholder="00000-000"
              />
              {errors.cep && <span className="error-message">{errors.cep}</span>}
            </div>
          </div>

          {/* Método de Pagamento */}
          <div className="form-section">
            <h2>💳 Método de Pagamento</h2>

            <div className="payment-methods">
              <label className="payment-method">
                <input
                  type="radio"
                  name="paymentType"
                  value="credit"
                  checked={paymentMethod.type === 'credit'}
                  onChange={(e) => handlePaymentMethodChange('type', e.target.value)}
                />
                <span>💳 Cartão de Crédito</span>
              </label>

              <label className="payment-method">
                <input
                  type="radio"
                  name="paymentType"
                  value="debit"
                  checked={paymentMethod.type === 'debit'}
                  onChange={(e) => handlePaymentMethodChange('type', e.target.value)}
                />
                <span>💳 Cartão de Débito</span>
              </label>

              <label className="payment-method">
                <input
                  type="radio"
                  name="paymentType"
                  value="pix"
                  checked={paymentMethod.type === 'pix'}
                  onChange={(e) => handlePaymentMethodChange('type', e.target.value)}
                />
                <span>📱 PIX</span>
              </label>

              <label className="payment-method">
                <input
                  type="radio"
                  name="paymentType"
                  value="cash"
                  checked={paymentMethod.type === 'cash'}
                  onChange={(e) => handlePaymentMethodChange('type', e.target.value)}
                />
                <span>💵 Dinheiro</span>
              </label>
            </div>

            {/* Dados do cartão */}
            {(paymentMethod.type === 'credit' || paymentMethod.type === 'debit') && (
              <div className="card-details">
                <div className="form-group">
                  <label htmlFor="cardNumber">Número do Cartão *</label>
                  <input
                    type="text"
                    id="cardNumber"
                    value={paymentMethod.cardNumber || ''}
                    onChange={(e) => handlePaymentMethodChange('cardNumber', formatCardNumber(e.target.value))}
                    className={errors.cardNumber ? 'error' : ''}
                    placeholder="0000 0000 0000 0000"
                  />
                  {errors.cardNumber && <span className="error-message">{errors.cardNumber}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="cardName">Nome no Cartão *</label>
                  <input
                    type="text"
                    id="cardName"
                    value={paymentMethod.cardName || ''}
                    onChange={(e) => handlePaymentMethodChange('cardName', e.target.value.toUpperCase())}
                    className={errors.cardName ? 'error' : ''}
                    placeholder="NOME COMO NO CARTÃO"
                  />
                  {errors.cardName && <span className="error-message">{errors.cardName}</span>}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="cardExpiry">Validade *</label>
                    <input
                      type="text"
                      id="cardExpiry"
                      value={paymentMethod.cardExpiry || ''}
                      onChange={(e) => handlePaymentMethodChange('cardExpiry', formatExpiry(e.target.value))}
                      className={errors.cardExpiry ? 'error' : ''}
                      placeholder="MM/AA"
                    />
                    {errors.cardExpiry && <span className="error-message">{errors.cardExpiry}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="cardCVV">CVV *</label>
                    <input
                      type="text"
                      id="cardCVV"
                      value={paymentMethod.cardCVV || ''}
                      onChange={(e) => handlePaymentMethodChange('cardCVV', e.target.value.replace(/\D/g, '').slice(0, 4))}
                      className={errors.cardCVV ? 'error' : ''}
                      placeholder="123"
                    />
                    {errors.cardCVV && <span className="error-message">{errors.cardCVV}</span>}
                  </div>
                </div>
              </div>
            )}

            {/* Campo para troco se for em dinheiro */}
            {paymentMethod.type === 'cash' && (
              <div className="form-group">
                <label htmlFor="cashChange">Troco para *</label>
                <input
                  type="number"
                  id="cashChange"
                  value={paymentMethod.cashChange || ''}
                  onChange={(e) => handlePaymentMethodChange('cashChange', parseFloat(e.target.value))}
                  className={errors.cashChange ? 'error' : ''}
                  placeholder="0.00"
                  min={total}
                  step="0.01"
                />
                {errors.cashChange && <span className="error-message">{errors.cashChange}</span>}
                <small>Valor mínimo: R$ {total.toFixed(2).replace('.', ',')}</small>
              </div>
            )}

            {/* Informações para PIX */}
            {paymentMethod.type === 'pix' && (
              <div className="pix-info">
                <p>📱 Após confirmar o pedido, você receberá o código PIX para pagamento.</p>
              </div>
            )}
          </div>
        </div>

        {/*Resumo do pedido*/}
        <div className="order-summary">
          <div className="summary-card">
            <h3>Resumo do Pedido</h3>

            <div className="summary-items">
              {state.items.map((item, index) => (
                <div key={`${item.id}-${index}`} className="summary-item">
                  <span>{item.quantity}x {item.name}</span>
                  <span>R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
                </div>
              ))}
            </div>

            <div className="summary-line">
              <span>Subtotal</span>
              <span>R$ {state.total.toFixed(2).replace('.', ',')}</span>
            </div>

            <div className="summary-line">
              <span>Taxa de entrega</span>
              <span>R$ {deliveryFee.toFixed(2).replace('.', ',')}</span>
            </div>

            <div className="summary-line total-line">
              <span><strong>Total</strong></span>
              <span><strong>R$ {total.toFixed(2).replace('.', ',')}</strong></span>
            </div>

            <button
              className="place-order-btn"
              onClick={handleSubmitOrder}
              disabled={isLoading}
            >
              {isLoading ? 'Processando...' : 'Confirmar Pedido'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
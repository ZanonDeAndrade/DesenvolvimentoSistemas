import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../Cart/CartContext';
import './Checkout.css';

interface Address {
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  zipCode: string;
}

interface PaymentMethod {
  type: 'credit' | 'debit' | 'pix' | 'cash';
  cardNumber?: string;
  cardName?: string;
  cardExpiry?: string;
  cardCVV?: string;
  cashChange?: number;
}

const Checkout: React.FC = () => {
  const { state, clearCart } = useCart();
  const navigate = useNavigate();

  const [address, setAddress] = useState<Address>({
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    zipCode: ''
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>({
    type: 'credit'
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleAddressChange = (field: keyof Address, value: string) => {
    setAddress(prev => ({ ...prev, [field]: value }));
    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handlePaymentMethodChange = (field: keyof PaymentMethod, value: any) => {
    setPaymentMethod(prev => ({ ...prev, [field]: value }));
    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validar endereço
    if (!address.street.trim()) {
      newErrors.street = 'Rua é obrigatória';
    }
    if (!address.number.trim()) {
      newErrors.number = 'Número é obrigatório';
    }
    if (!address.neighborhood.trim()) {
      newErrors.neighborhood = 'Bairro é obrigatório';
    }
    if (!address.city.trim()) {
      newErrors.city = 'Cidade é obrigatória';
    }
    if (!address.zipCode.trim()) {
      newErrors.zipCode = 'CEP é obrigatório';
    } else if (!/^\d{5}-?\d{3}$/.test(address.zipCode)) {
      newErrors.zipCode = 'CEP deve ter formato 00000-000';
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
    }

    if (paymentMethod.type === 'cash' && !paymentMethod.cashChange) {
      newErrors.cashChange = 'Valor para troco é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitOrder = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simular chamada de API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Aqui você faria a chamada real para a API
      const orderData = {
        items: state.items,
        total: state.total + 5, // incluindo taxa de entrega
        address,
        paymentMethod,
        timestamp: new Date().toISOString()
      };

      console.log('Pedido enviado:', orderData);
      
      // Limpar carrinho
      clearCart();
      
      // Navegar para página de confirmação
      navigate('/order-confirmation', { 
        state: { 
          orderId: Math.random().toString(36).substr(2, 9).toUpperCase(),
          total: state.total + 5 
        } 
      });

    } catch (error) {
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
          onClick={() => navigate('/cart')}
        >
          ← Voltar ao Carrinho
        </button>
        <h1>Finalizar Pedido</h1>
      </div>

      <div className="checkout-content">
        <div className="checkout-form">
          {/* Seção de Endereço */}
          <div className="form-section">
            <h2>📍 Endereço de Entrega</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="street">Rua *</label>
                <input
                  type="text"
                  id="street"
                  value={address.street}
                  onChange={(e) => handleAddressChange('street', e.target.value)}
                  className={errors.street ? 'error' : ''}
                  placeholder="Nome da rua"
                />
                {errors.street && <span className="error-message">{errors.street}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="number">Número *</label>
                <input
                  type="text"
                  id="number"
                  value={address.number}
                  onChange={(e) => handleAddressChange('number', e.target.value)}
                  className={errors.number ? 'error' : ''}
                  placeholder="123"
                />
                {errors.number && <span className="error-message">{errors.number}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="complement">Complemento</label>
              <input
                type="text"
                id="complement"
                value={address.complement}
                onChange={(e) => handleAddressChange('complement', e.target.value)}
                placeholder="Apartamento, bloco, etc."
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="neighborhood">Bairro *</label>
                <input
                  type="text"
                  id="neighborhood"
                  value={address.neighborhood}
                  onChange={(e) => handleAddressChange('neighborhood', e.target.value)}
                  className={errors.neighborhood ? 'error' : ''}
                  placeholder="Nome do bairro"
                />
                {errors.neighborhood && <span className="error-message">{errors.neighborhood}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="city">Cidade *</label>
                <input
                  type="text"
                  id="city"
                  value={address.city}
                  onChange={(e) => handleAddressChange('city', e.target.value)}
                  className={errors.city ? 'error' : ''}
                  placeholder="Nome da cidade"
                />
                {errors.city && <span className="error-message">{errors.city}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="zipCode">CEP *</label>
              <input
                type="text"
                id="zipCode"
                value={address.zipCode}
                onChange={(e) => handleAddressChange('zipCode', formatZipCode(e.target.value))}
                className={errors.zipCode ? 'error' : ''}
                placeholder="00000-000"
              />
              {errors.zipCode && <span className="error-message">{errors.zipCode}</span>}
            </div>
          </div>

          {/* Seção de Pagamento */}
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

            {/* Campos do Cartão */}
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

            {/* Campo para troco */}
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

            {/* Informação PIX */}
            {paymentMethod.type === 'pix' && (
              <div className="pix-info">
                <p>📱 Após confirmar o pedido, você receberá o código PIX para pagamento.</p>
              </div>
            )}
          </div>
        </div>

        {/* Resumo do Pedido */}
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
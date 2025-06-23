import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useCart } from '../Cart/CartContext';
import './Checkout.css';
import { updateUserData, getAddressByCep } from '../../services/api'; // Mantenha createOrder
import type { Address as BackendAddress, PaymentMethod, ViaCepAddress, } from '../Types'; // Mantenha IOrderItem, IOrder

interface JwtPayload {
  userId: string;
  email: string;
  nome: string;
  exp: number;
  iat: number;
}

const Checkout: React.FC = () => {
  const { state, clearCart } = useCart();
  const navigate = useNavigate();

  const [userId, setUserId] = useState<string | null>(null);
  const [address, setAddress] = useState<BackendAddress>({
    rua: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    cep: ''
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>({
    type: 'credit'
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [addressFieldsLocked, setAddressFieldsLocked] = useState(false);


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode<JwtPayload>(token);
        setUserId(decodedToken.userId);
        console.log('Frontend: userId extraído do token:', decodedToken.userId);
      } catch (error) {
        console.error('Frontend: Erro ao decodificar token no Checkout:', error);
      }
    } else {
      console.warn('Frontend: Nenhum token encontrado no Checkout. Usuário não autenticado.');
    }
  }, []);

  useEffect(() => {
    const cleanCep = address.cep.replace(/\D/g, '');

    if (cleanCep.length === 8) {
      console.log('Frontend: CEP completo detectado, buscando endereço:', cleanCep);
      const fetchAddress = async () => {
        setIsLoading(true);
        setErrors(prev => ({ ...prev, cep: '' }));

        const fetchedAddress: ViaCepAddress | null = await getAddressByCep(cleanCep);
        setIsLoading(false);

        if (fetchedAddress && !fetchedAddress.erro) {
          console.log('Frontend: Endereço ViaCEP encontrado:', fetchedAddress);
          setAddress(prevAddress => ({
            ...prevAddress,
            cidade: fetchedAddress.localidade || '',
            estado: fetchedAddress.uf || '',
            complemento: fetchedAddress.complemento || prevAddress.complemento || '',
          }));
          setAddressFieldsLocked(true);
        } else {
          console.warn('Frontend: CEP não encontrado ou inválido pela ViaCEP:', cleanCep);
          setErrors(prev => ({ ...prev, cep: 'CEP não encontrado ou inválido.' }));
          setAddress(prevAddress => ({
            ...prevAddress,
            cidade: '',
            estado: '',
          }));
          setAddressFieldsLocked(false);
        }
      };
      fetchAddress();
    } else {
      if (addressFieldsLocked) {
        console.log('Frontend: CEP incompleto ou apagado, desbloqueando campos de endereço.');
        setAddressFieldsLocked(false);
      }
      if (errors.cep === 'CEP não encontrado ou inválido.' || errors.cep === 'Erro ao buscar CEP. Verifique a conexão ou o CEP.') {
        setErrors(prev => ({ ...prev, cep: '' }));
      }
    }
  }, [address.cep]);

  const handleAddressChange = (field: keyof BackendAddress, value: string) => {
    setAddress(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handlePaymentMethodChange = (field: keyof PaymentMethod, value: any) => {
    setPaymentMethod(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof Record<string, string>]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

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
    if (!address.estado.trim()) {
      newErrors.estado = 'Estado é obrigatório';
    } else if (address.estado.trim().length !== 2) {
      newErrors.estado = 'Estado deve ter 2 caracteres (UF)';
    }
    if (!address.cep.trim()) {
      newErrors.cep = 'CEP é obrigatória';
    } else if (!/^\d{5}-?\d{3}$/.test(address.cep)) {
      newErrors.cep = 'CEP deve ter formato 00000-000';
    }

    if (paymentMethod.type === 'credit' || paymentMethod.type === 'debit') {
      if (!paymentMethod.cardNumber || paymentMethod.cardNumber.replace(/\s/g, '').length < 16) {
        newErrors.cardNumber = 'Número do cartão inválido (mín. 16 dígitos)';
      }
      if (!paymentMethod.cardName?.trim()) {
        newErrors.cardName = 'Nome no cartão é obrigatório';
      }
      if (!paymentMethod.cardExpiry || !/^\d{2}\/\d{2}$/.test(paymentMethod.cardExpiry)) {
        newErrors.cardExpiry = 'Data de validade deve ter formato MM/AA';
      }
      if (!paymentMethod.cardCVV || paymentMethod.cardCVV.length < 3) {
        newErrors.cardCVV = 'CVV inválido (mín. 3 dígitos)';
      }
    } else if (paymentMethod.type === 'cash' && (paymentMethod.cashChange === undefined || paymentMethod.cashChange < total)) {
      newErrors.cashChange = `Valor do troco deve ser maior ou igual ao total (R$ ${total.toFixed(2).replace('.', ',')})`;
    }


    setErrors(newErrors);
    console.log('Frontend: Erros de validação do formulário:', newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitOrder = async () => {
    console.log('Frontend: Início de handleSubmitOrder.');

    if (!validateForm()) {
      console.warn('Frontend: Formulário inválido. Abortando.');
      return;
    }

    if (!userId) {
      console.error('Frontend: userId é nulo. Usuário não autenticado.');
      alert('Usuário não autenticado. Por favor, faça login novamente.');
      navigate('/Login');
      return;
    }

    setIsLoading(true);
    console.log('Frontend: isLoading definido para true.');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Frontend: Token de autenticação ausente.');
        alert('Token de autenticação ausente. Faça login novamente.');
        navigate('/Login');
        return;
      }
      console.log('Frontend: Token JWT presente.');

      const addressToSend: BackendAddress = {
        rua: address.rua,
        numero: address.numero,
        complemento: address.complemento,
        bairro: address.bairro,
        cidade: address.cidade,
        estado: address.estado,
        cep: address.cep.replace(/\D/g, ''),
      };
      console.log('Frontend: Dados do endereço para enviar:', addressToSend);

      // --- Ponto crítico: Requisição de atualização de endereço ---
      console.log('Frontend: Tentando atualizar endereço do usuário...');
      await updateUserData(userId, { endereco: addressToSend }, token);
      console.log('Frontend: updateUserData completado com SUCESSO (frontend perspective).');
      console.log('Frontend: Endereço do usuário atualizado no backend.');

      
      console.log('Frontend: Tentando criar pedido...');

      clearCart();
      console.log('Frontend: Carrinho limpo.');

      navigate('/OrderConfirmation/OrderConfirmation');
      console.log('Frontend: Navegando para a confirmação do pedido.');
      // --- FIM DA LÓGICA DE CRIAÇÃO DE PEDIDO RESTAURADA ---

    } catch (error) {
      console.error('Frontend: Erro no bloco try-catch de handleSubmitOrder:', error);
      if ((error as any).response) {
        console.error('Frontend: Detalhes do erro da resposta do servidor:', (error as any).response.data);
        console.error('Frontend: Status do erro:', (error as any).response.status);
      } else if (error instanceof Error) {
        console.error('Frontend: Mensagem de erro:', error.message);
      }
      alert('Erro ao processar pedido. Tente novamente. Verifique o console para mais detalhes.');
    } finally {
      setIsLoading(false);
      console.log('Frontend: isLoading definido para false. Fim de handleSubmitOrder.');
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
                  name="rua"
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
                  name="numero"
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
                name="complemento"
                value={address.complemento || ''}
                onChange={(e) => handleAddressChange('complemento', e.target.value)}
                placeholder="Apartamento, bloco, etc."
                readOnly={addressFieldsLocked && !!address.complemento}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="bairro">Bairro *</label>
                <input
                  type="text"
                  id="bairro"
                  name="bairro"
                  value={address.bairro}
                  onChange={(e) => handleAddressChange('bairro', e.target.value)}
                  className={errors.bairro ? 'error' : ''}
                  placeholder="Nome do bairro"
                />
                {errors.bairro && <span className="error-message">{errors.bairro}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="cep">CEP *</label>
                <input
                  type="text"
                  id="cep"
                  name="cep"
                  value={address.cep}
                  onChange={(e) => handleAddressChange('cep', formatZipCode(e.target.value))}
                  className={errors.cep ? 'error' : ''}
                  placeholder="00000-000"
                  maxLength={9}
                />
                {errors.cep && <span className="error-message">{errors.cep}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="cidade">Cidade *</label>
                <input
                  type="text"
                  id="cidade"
                  name="cidade"
                  value={address.cidade}
                  onChange={(e) => handleAddressChange('cidade', e.target.value)}
                  className={errors.cidade ? 'error' : ''}
                  placeholder="Nome da cidade"
                  readOnly={addressFieldsLocked && !!address.cidade}
                />
                {errors.cidade && <span className="error-message">{errors.cidade}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="estado">Estado *</label>
              <input
                type="text"
                id="estado"
                name="estado"
                value={address.estado}
                onChange={(e) => handleAddressChange('estado', e.target.value.toUpperCase())}
                className={errors.estado ? 'error' : ''}
                placeholder="UF (Ex: SP)"
                maxLength={2}
                readOnly={addressFieldsLocked && !!address.estado}
              />
              {errors.estado && <span className="error-message">{errors.estado}</span>}
            </div>
          </div>

          {/* Método de Pagamento (restante do código igual) */}
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

            {paymentMethod.type === 'pix' && (
              <div className="pix-info">
                <p>📱 Após confirmar o pedido, você receberá o código PIX para pagamento.</p>
              </div>
            )}
          </div>
        </div>

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
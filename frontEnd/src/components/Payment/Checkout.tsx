import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; // Importa o hook useAuth
import { useCart } from '../Cart/CartContext'; // Importa o hook useCart

import './Checkout.css'; // Estilos CSS para o componente

// Importa serviços de API
import { updateUserData, getAddressByCep, createOrder } from '../../services/api';
// Importa tipos e interfaces
import type { Address, PaymentMethod as PaymentMethodType, ViaCepAddress, IOrderPayload, IOrder, CartItem, IItem } from '../Types/index';

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  // Obtém o estado do usuário, o estado de carregamento e a função de logout do AuthContext
  const { user, isLoading: isAuthLoading, logout } = useAuth();
  // Obtém o estado do carrinho e a função para limpar o carrinho do CartContext
  const { state: cartState, clearCart } = useCart();

  // Estados locais para o formulário de endereço
  const [address, setAddress] = useState<Address>({
    rua: '', numero: '', complemento: '', bairro: '', cidade: '', estado: '', cep: ''
  });
  // Estado local para o método de pagamento
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>({
    type: 'credit' // Padrão para cartão de crédito
  });

  // Estados de controle para UI e erros
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [addressFieldsLocked, setAddressFieldsLocked] = useState(false); // Para bloquear campos de endereço após preenchimento por CEP ou dados do usuário

  // Efeito principal para verificação de autenticação e preenchimento inicial do endereço
  useEffect(() => {
    // Se o AuthContext ainda está carregando, espera.
    if (isAuthLoading) {
      console.log("Checkout.tsx: AuthContext ainda carregando, esperando...");
      return;
    }

    // Se o AuthContext terminou de carregar E não há usuário autenticado (ou token ausente)
    if (!user || !user.token) { // 'user.token' é obrigatório na interface User agora
      console.log('Checkout.tsx: Usuário não logado ou token ausente/inválido. Redirecionando para o login.');
      logout(); // Garante que qualquer resquício de login seja limpo
      navigate('/Login/Login'); // Redireciona para a tela de login
      return;
    }

    // Se há um usuário autenticado e ele tem um endereço salvo no AuthContext
    if (user.address) {
      setAddress(user.address); // Preenche o formulário com o endereço salvo
      setAddressFieldsLocked(true); // Bloqueia os campos preenchidos
      console.log('Checkout.tsx: Endereço do usuário preenchido a partir do AuthContext.');
    } else {
        // Se não há endereço salvo, garante que os campos estejam desbloqueados e limpos
        setAddressFieldsLocked(false);
        setAddress({ rua: '', numero: '', complemento: '', bairro: '', cidade: '', estado: '', cep: '' });
        console.log('Checkout.tsx: Nenhum endereço salvo para o usuário, campos de endereço desbloqueados.');
    }

    console.log('Checkout.tsx: Usuário autenticado e pronto para checkout:', user.name);

  }, [user, isAuthLoading, navigate, logout]); // Dependências do useEffect: re-executa se user, isAuthLoading, navigate ou logout mudarem

  // Lógica de busca de CEP e preenchimento de campos de endereço
  useEffect(() => {
    const cleanCep = address.cep.replace(/\D/g, ''); // Remove caracteres não numéricos do CEP

    if (cleanCep.length === 8) {
      console.log('Frontend: CEP completo detectado, buscando endereço:', cleanCep);
      const fetchAddress = async () => {
        setIsProcessingOrder(true); // Ativa o estado de processamento (pode ser um loading spinner)
        setErrors((prev: Record<string, string>) => ({ ...prev, cep: '' })); // Limpa qualquer erro de CEP anterior

        try {
          const fetchedAddress: ViaCepAddress | null = await getAddressByCep(cleanCep);
          setIsProcessingOrder(false); // Desativa o estado de processamento

          if (fetchedAddress && !fetchedAddress.erro) {
            console.log('Frontend: Endereço ViaCEP encontrado:', fetchedAddress);
            setAddress((prevAddress: Address) => ({
              ...prevAddress,
              // Não preencha rua e bairro automaticamente aqui (apenas cidade, estado e complemento)
              cidade: fetchedAddress.localidade || prevAddress.cidade || '',
              estado: fetchedAddress.uf || prevAddress.estado || '',
              complemento: fetchedAddress.complemento || prevAddress.complemento || '',
            }));
            // Bloqueia apenas os campos que foram preenchidos pelo ViaCEP (cidade e estado)
            setAddressFieldsLocked(true);
          } else {
            console.warn('Frontend: CEP não encontrado ou inválido pela ViaCEP:', cleanCep);
            setErrors((prev: Record<string, string>) => ({ ...prev, cep: 'CEP não encontrado ou inválido.' }));
            setAddress((prevAddress: Address) => ({
              ...prevAddress,
              // Limpa apenas cidade, estado e complemento se ViaCEP não encontrar
              cidade: '', estado: '', complemento: ''
            }));
            setAddressFieldsLocked(false); // Desbloqueia tudo, pois o CEP não ajudou
          }
        } catch (error) {
          console.error('Frontend: Erro ao buscar CEP:', error);
          setErrors((prev: Record<string, string>) => ({ ...prev, cep: 'Erro ao buscar CEP. Verifique a conexão ou o CEP.' }));
          setIsProcessingOrder(false);
          setAddressFieldsLocked(false);
        }
      };
      fetchAddress();
    } else {
      // Se o CEP for apagado ou incompleto, desbloqueie os campos e limpe erros de CEP
      if (addressFieldsLocked) {
        console.log('Frontend: CEP incompleto ou apagado, desbloqueando campos de endereço.');
        setAddressFieldsLocked(false);
        setAddress((prevAddress: Address) => ({
          ...prevAddress,
          // Não apague rua, bairro, cidade, estado aqui. Mantenha o que o usuário digitou.
          complemento: '' // Apenas remove o complemento, se você quiser que ele esteja sempre ligado ao CEP válido
        }));
      }
      if (errors.cep === 'CEP não encontrado ou inválido.' || errors.cep === 'Erro ao buscar CEP. Verifique a conexão ou o CEP.') {
        setErrors((prev: Record<string, string>) => ({ ...prev, cep: '' }));
      }
    }
  }, [address.cep, addressFieldsLocked, errors.cep]); // Dependências: re-executa quando o CEP muda, ou o estado de bloqueio/erros de CEP

  // Handler para mudanças nos campos de endereço
  const handleAddressChange = (field: keyof Address, value: string) => {
    setAddress((prev: Address) => ({ ...prev, [field]: value }));
    // Limpa o erro associado ao campo quando o usuário começa a digitar
    if (errors[field]) {
      setErrors((prev: Record<string, string>) => ({ ...prev, [field]: '' }));
    }
  };

  // Handler para mudanças nos campos do método de pagamento
  const handlePaymentMethodChange = (field: keyof PaymentMethodType, value: any) => {
    setPaymentMethod((prev: PaymentMethodType) => ({ ...prev, [field]: value }));
    // Limpa erros de validação de cartão/troco ao mudar o tipo de pagamento
    if (field === 'type') {
      setErrors((prev: Record<string, string>) => {
        const newErrors = { ...prev };
        delete newErrors.cardNumber;
        delete newErrors.cardName;
        delete newErrors.cardExpiry;
        delete newErrors.cardCVV;
        delete newErrors.cashChange;
        return newErrors;
      });
    }
  };

  const deliveryFee = 5.00; // Taxa de entrega fixa
  const total = cartState.total + deliveryFee; // Calcula o total do pedido

  // Função para validar o formulário antes de enviar o pedido
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validações dos campos de endereço
    if (!address.rua.trim()) newErrors.rua = 'Rua é obrigatória';
    if (!address.numero.trim()) newErrors.numero = 'Número é obrigatório';
    if (!address.bairro.trim()) newErrors.bairro = 'Bairro é obrigatório';
    if (!address.cidade.trim()) newErrors.cidade = 'Cidade é obrigatória';
    if (!address.estado.trim()) {
      newErrors.estado = 'Estado é obrigatório';
    } else if (address.estado.trim().length !== 2) {
      newErrors.estado = 'Estado deve ter 2 caracteres (UF)';
    }
    if (!address.cep.trim()) {
      newErrors.cep = 'CEP é obrigatória';
    } else if (!/^\d{5}-?\d{3}$/.test(address.cep) && !/^\d{8}$/.test(address.cep)) {
      newErrors.cep = 'CEP deve ter formato 00000-000 ou 00000000';
    }

    // Validações dos campos de pagamento
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

    setErrors(newErrors); // Atualiza os erros de validação
    console.log('Frontend: Erros de validação do formulário:', newErrors);
    return Object.keys(newErrors).length === 0; // Retorna true se não houver erros
  };

  // Handler para submeter o pedido
  const handleSubmitOrder = async () => {
    console.log('Frontend: Início de handleSubmitOrder.');

    // 1. Valida o formulário
    if (!validateForm()) {
      console.warn('Frontend: Formulário inválido. Abortando.');
      return;
    }

    // 2. Verifica se o usuário está autenticado e tem as informações necessárias do AuthContext
    // Como 'token' é obrigatório na interface User, basta verificar 'user' e suas propriedades essenciais.
    if (!user || !user._id || !user.name || !user.token) {
      console.error('Frontend: Usuário não autenticado ou informações incompletas do AuthContext. Redirecionando para o login.');
      alert('Sua sessão expirou ou está incompleta. Por favor, faça login novamente.');
      logout(); // Garante a limpeza da sessão
      navigate('/Login/Login'); // Redireciona para o login
      return;
    }

    setIsProcessingOrder(true); // Ativa o estado de processamento (botão de "Processando...")
    console.log('Frontend: isProcessingOrder definido para true.');

    try {
      const token = user.token; // Obtém o token do usuário do AuthContext

      // Prepara o objeto de endereço para enviar ao backend
      const addressToSend: Address = {
        rua: address.rua,
        numero: address.numero,
        complemento: address.complemento,
        bairro: address.bairro,
        cidade: address.cidade,
        estado: address.estado,
        cep: address.cep.replace(/\D/g, ''), // Remove hífen do CEP
      };
      console.log('Frontend: Dados do endereço para enviar:', addressToSend);

      // 3. Tenta atualizar o endereço do usuário no backend (opcional, mas boa prática)
      console.log('Frontend: Tentando atualizar endereço do usuário no backend...');
      await updateUserData(user._id, { endereco: addressToSend }, token);
      console.log('Frontend: Endereço do usuário atualizado no backend com sucesso!');
      // TODO: Se seu AuthContext tiver uma função para atualizar o 'user.address' localmente, chame-a aqui.
      // Isso manteria o 'user.address' no AuthContext atualizado com o que foi enviado.

      // 4. Prepara o payload do pedido para enviar ao backend
      console.log('Frontend: Tentando criar pedido no backend...');

      const orderItems: IItem[] = cartState.items.map((item: CartItem) => ({
        idProduto: item.id,
        nomeProduto: item.name,
        quantidade: item.quantity,
        precoUnitario: item.price,
        observacoes: item.notes || '',
      }));

      const orderPayload: IOrderPayload = {
        idCliente: user._id, // ID do cliente do AuthContext
        nomeCliente: user.name, // Nome do cliente do AuthContext
        enderecoEntrega: addressToSend,
        itens: orderItems,
        valorTotal: total,
        metodoPagamento: paymentMethod.type as IOrderPayload['metodoPagamento'],
        observacoesGerais: '', // Campo para observações adicionais no pedido
      };
      console.log('Frontend: Payload do pedido a ser enviado:', orderPayload);

      // 5. Envia o pedido para o backend
      const newOrder: IOrder = await createOrder(orderPayload, token);
      console.log('Frontend: Pedido criado com SUCESSO no backend:', newOrder);

      clearCart(); // Limpa o carrinho após o pedido ser criado
      console.log('Frontend: Carrinho limpo.');

      // Redireciona para a página de confirmação do pedido, passando os dados do pedido via state
      navigate('/OrderConfirmation/OrderConfirmation', { state: { order: newOrder } });
      console.log('Frontend: Navegando para a confirmação do pedido.');

    } catch (error) {
      console.error('Frontend: Erro no bloco try-catch de handleSubmitOrder:', error);
      // Trata erros da requisição (ex: validação do backend, token inválido)
      if ((error as any).response) {
        console.error('Frontend: Detalhes do erro da resposta do servidor:', (error as any).response.data);
        console.error('Frontend: Status do erro:', (error as any).response.status);
        const errorMessage = (error as any).response.data.message || 'Erro desconhecido ao processar pedido.';
        alert(`Erro ao processar pedido: ${errorMessage}. Verifique o console.`);
        // Se o erro for de autenticação (401), faz logout
        if ((error as any).response.status === 401) {
          logout();
          navigate('/Login/Login');
        }
      } else if (error instanceof Error) {
        console.error('Frontend: Mensagem de erro:', error.message);
        alert(`Erro ao processar pedido: ${error.message}. Verifique o console.`);
      } else {
        alert('Erro ao processar pedido. Tente novamente. Verifique o console para mais detalhes.');
      }
    } finally {
      setIsProcessingOrder(false); // Desativa o estado de processamento
      console.log('Frontend: isProcessingOrder definido para false. Fim de handleSubmitOrder.');
    }
  };

  // Funções de formatação para campos de input (cartão, CEP)
  const formatCardNumber = (value: string) => {
    return value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim().slice(0, 19);
  };

  const formatExpiry = (value: string) => {
    return value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2').slice(0, 5);
  };

  const formatZipCode = (value: string) => {
    const cleanValue = value.replace(/\D/g, '');
    if (cleanValue.length > 5) {
      return `${cleanValue.slice(0, 5)}-${cleanValue.slice(5, 8)}`;
    }
    return cleanValue;
  };

  // Tela de carregamento enquanto o AuthContext está inicializando
  if (isAuthLoading) {
    return (
      <div className="checkout-container loading-screen">
        <p>Verificando sua sessão...</p>
      </div>
    );
  }

  // Se, após o carregamento, não houver usuário (caso raro, pois o useEffect redireciona), exibe mensagem
  if (!user) {
    return (
      <div className="checkout-container loading-screen">
        <p>Você não está autenticado. Redirecionando para o login...</p>
      </div>
    );
  }

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
                  // 'readOnly' removido aqui, pois rua é manual
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
                // 'readOnly' removido, pois complemento pode ser preenchido manualmente ou pelo ViaCEP
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
                  // 'readOnly' removido, pois bairro é manual
                />
                {errors.bairro && <span className="error-message">{errors.bairro}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="cep">CEP *</label>
                <input
                  type="text"
                  id="cep"
                  name="cep"
                  value={formatZipCode(address.cep)}
                  onChange={(e) => handleAddressChange('cep', e.target.value)}
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
                  readOnly={addressFieldsLocked && !!address.cidade} // Mantido readOnly para campos preenchidos pelo ViaCEP
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
                readOnly={addressFieldsLocked && !!address.estado} // Mantido readOnly
              />
              {errors.estado && <span className="error-message">{errors.estado}</span>}
            </div>
          </div>

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
              {cartState.items.map((item, index) => (
                <div key={`${item.id}-${index}`} className="summary-item">
                  <span>{item.quantity}x {item.name}</span>
                  <span>R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
                </div>
              ))}
            </div>

            <div className="summary-line">
              <span>Subtotal</span>
              <span>R$ {cartState.total.toFixed(2).replace('.', ',')}</span>
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
              disabled={isProcessingOrder}
            >
              {isProcessingOrder ? 'Processando...' : 'Confirmar Pedido'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
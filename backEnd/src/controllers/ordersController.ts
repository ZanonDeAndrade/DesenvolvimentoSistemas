// backend/src/controllers/pedidoController.ts
import { Request, Response } from 'express';
// Importa o modelo Pedido e suas interfaces de tipos do módulo Pedidos.ts
import Pedido, { IPedido, IItem, IEndereco } from '../modules/Pedidos';
import { v4 as uuidv4 } from 'uuid'; // Para gerar IDs únicos de pedidos

// npm install uuid @types/uuid (se ainda não fez)

// --- Funções do Controlador ---

// Função para criar um novo pedido
export const criarPedido = async (req: Request, res: Response) => {
  try {
    // Desestruturação dos dados recebidos no corpo da requisição
    const { idCliente, nomeCliente, enderecoEntrega, itens, metodoPagamento, observacoesGerais } = req.body;

    // Validação básica dos campos obrigatórios
    if (!idCliente || !nomeCliente || !enderecoEntrega || !itens || itens.length === 0 || !metodoPagamento) {
      return res.status(400).json({ message: 'Dados do pedido incompletos. Verifique idCliente, nomeCliente, enderecoEntrega, itens e metodoPagamento.' });
    }

    // Validação dos itens (garantindo que cada item tem o necessário)
    for (const item of itens) {
      if (!item.idProduto || !item.nomeProduto || typeof item.quantidade !== 'number' || typeof item.precoUnitario !== 'number' || item.quantidade <= 0 || item.precoUnitario < 0) {
        return res.status(400).json({ message: 'Um ou mais itens do pedido são inválidos (falta idProduto, nomeProduto, quantidade, ou precoUnitario, ou valores inválidos).' });
      }
    }

    // Calcular valorTotal com base nos itens para garantir consistência e evitar manipulação no frontend
    const valorTotal = itens.reduce((sum: number, item: IItem) => sum + (item.precoUnitario * item.quantidade), 0);

    // Cria um objeto com os dados para o novo pedido
    const novoPedidoData: Partial<IPedido> = {
      idPedido: uuidv4(), // Gera um UUID único para o pedido
      idCliente,
      nomeCliente,
      enderecoEntrega,
      itens,
      valorTotal,
      metodoPagamento,
      observacoesGerais,
      statusPedido: 'pendente' // Define o status inicial como pendente
      // dataHoraCriacao e dataHoraAtualizacao serão definidos pelos defaults do schema
    };

    // Cria uma nova instância do modelo Pedido e salva no MongoDB
    const novoPedido = new Pedido(novoPedidoData);
    const pedidoSalvo = await novoPedido.save();

    res.status(201).json(pedidoSalvo); // Retorna o pedido salvo com status 201 (Created)
  } catch (error: any) {
    console.error('Erro ao criar pedido:', error.message);
    res.status(500).json({ message: 'Erro interno do servidor ao criar o pedido.', error: error.message });
  }
};

// Função para listar todos os pedidos
export const listarPedidos = async (req: Request, res: Response) => {
  try {
    const pedidos = await Pedido.find({}); // Busca todos os documentos na coleção 'pedidos'
    res.status(200).json(pedidos); // Retorna a lista de pedidos com status 200 (OK)
  } catch (error: any) {
    console.error('Erro ao listar pedidos:', error.message);
    res.status(500).json({ message: 'Erro interno do servidor ao listar pedidos.', error: error.message });
  }
};

// Função para buscar um pedido por seu idPedido (o UUID gerado, não o _id do MongoDB)
export const buscarPedidoPorId = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // Captura o idPedido da URL (ex: /pedidos/SEU_ID_DO_PEDIDO)
    const pedido = await Pedido.findOne({ idPedido: id }); // Encontra o pedido pelo campo 'idPedido'

    if (!pedido) {
      return res.status(404).json({ message: 'Pedido não encontrado.' }); // Retorna 404 se o pedido não existir
    }
    res.status(200).json(pedido); // Retorna o pedido encontrado
  } catch (error: any) {
    console.error('Erro ao buscar pedido por ID:', error.message);
    res.status(500).json({ message: 'Erro interno do servidor ao buscar pedido.', error: error.message });
  }
};

// Função para atualizar o status de um pedido
export const atualizarStatusPedido = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // idPedido do pedido a ser atualizado
    const { statusPedido } = req.body; // O novo status (ex: "a caminho")

    // Validação para garantir que o status fornecido é um dos valores permitidos
    const statusPermitidos = ['pendente', 'em preparo', 'a caminho', 'entregue', 'cancelado', 'finalizado'];
    if (!statusPedido || !statusPermitidos.includes(statusPedido)) {
      return res.status(400).json({ message: `Status do pedido inválido. Valores permitidos: ${statusPermitidos.join(', ')}.` });
    }

    // Encontra e atualiza o pedido. '{ new: true }' retorna o documento atualizado
    const pedidoAtualizado = await Pedido.findOneAndUpdate(
      { idPedido: id },
      { $set: { statusPedido, dataHoraAtualizacao: new Date() } }, // Atualiza o status e a data de atualização
      { new: true }
    );

    if (!pedidoAtualizado) {
      return res.status(404).json({ message: 'Pedido não encontrado para atualização.' });
    }
    res.status(200).json(pedidoAtualizado); // Retorna o pedido atualizado
  } catch (error: any) {
    console.error('Erro ao atualizar status do pedido:', error.message);
    res.status(500).json({ message: 'Erro interno do servidor ao atualizar pedido.', error: error.message });
  }
};

// --- Exemplo de função adicional: Cancelar Pedido (pode ser um PUT com status 'cancelado' ou uma função separada) ---
export const cancelarPedido = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // idPedido
    // Poderia haver validação aqui para garantir que o pedido só pode ser cancelado se estiver em certos status
    const pedidoCancelado = await Pedido.findOneAndUpdate(
      { idPedido: id },
      { $set: { statusPedido: 'cancelado', dataHoraAtualizacao: new Date() } },
      { new: true }
    );

    if (!pedidoCancelado) {
      return res.status(404).json({ message: 'Pedido não encontrado para cancelamento.' });
    }
    res.status(200).json(pedidoCancelado);
  } catch (error: any) {
    console.error('Erro ao cancelar pedido:', error.message);
    res.status(500).json({ message: 'Erro interno do servidor ao cancelar pedido.', error: error.message });
  }
};

// ... adicione outras funções conforme necessário (ex: atribuir entregador, finalizar pedido, etc.)
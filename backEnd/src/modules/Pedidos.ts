// backend/src/modules/Pedidos.ts
import mongoose, { Document, Schema } from 'mongoose';

// --- 1. Definição das Interfaces TypeScript ---
// Interface para um item dentro do pedido
export interface IItem {
  idProduto: string; // ID do produto (referência ao seu módulo de Produto)
  nomeProduto: string;
  quantidade: number;
  precoUnitario: number;
  observacoes?: string; // Campo opcional
}

// Interface para o endereço de entrega
export interface IEndereco {
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  cep: string;
  complemento?: string; // Campo opcional
}

// Interface principal para o Pedido. Estende 'Document' do Mongoose para incluir _id, save(), etc.
export interface IPedido extends Document {
  idPedido: string; // ID único gerado pela aplicação (UUID, por exemplo)
  idCliente: string; // ID do cliente que fez o pedido (referência ao seu módulo de User)
  nomeCliente: string;
  enderecoEntrega: IEndereco;
  itens: IItem[];
  valorTotal: number;
  statusPedido: 'pendente' | 'em preparo' | 'a caminho' | 'entregue' | 'cancelado' | 'finalizado';
  metodoPagamento: 'dinheiro' | 'pix' | 'cartao de credito' | 'cartao de debito';
  observacoesGerais?: string; // Campo opcional
  dataHoraCriacao: Date;
  dataHoraAtualizacao: Date;
  dataHoraEntregaEstimada?: Date; // Opcional, para logística
  dataHoraEntregue?: Date;       // Opcional, quando foi efetivamente entregue
  entregadorId?: string;         // Opcional, ID do entregador
}

// --- 2. Definição dos Schemas do Mongoose ---

// Schema para o subdocumento de Item
const itemSchema = new Schema<IItem>({
  idProduto: { type: String, required: true },
  nomeProduto: { type: String, required: true },
  quantidade: { type: Number, required: true, min: 1 }, // Garante que a quantidade seja pelo menos 1
  precoUnitario: { type: Number, required: true, min: 0 }, // Garante preço não negativo
  observacoes: { type: String }
}, { _id: false }); // Não cria um _id para cada item no array

// Schema para o subdocumento de Endereço
const enderecoSchema = new Schema<IEndereco>({
  rua: { type: String, required: true },
  numero: { type: String, required: true },
  bairro: { type: String, required: true },
  cidade: { type: String, required: true },
  cep: { type: String, required: true },
  complemento: { type: String }
}, { _id: false }); // Não cria um _id para o endereço aninhado

// Schema principal para o Pedido
const pedidoSchema = new Schema<IPedido>({
  idPedido: { type: String, unique: true, required: true }, // idPedido como campo único e obrigatório
  idCliente: { type: String, required: true },
  nomeCliente: { type: String, required: true },
  enderecoEntrega: { type: enderecoSchema, required: true },
  itens: { type: [itemSchema], required: true }, // Array de itens
  valorTotal: { type: Number, required: true, min: 0 },
  statusPedido: {
    type: String,
    enum: ['pendente', 'em preparo', 'a caminho', 'entregue', 'cancelado', 'finalizado'],
    default: 'pendente', // Valor padrão ao criar um novo pedido
    required: true
  },
  metodoPagamento: {
    type: String,
    enum: ['dinheiro', 'pix', 'cartao de credito', 'cartao de debito'],
    required: true
  },
  observacoesGerais: { type: String },
  dataHoraCriacao: { type: Date, default: Date.now, required: true },
  dataHoraAtualizacao: { type: Date, default: Date.now, required: true },
  dataHoraEntregaEstimada: { type: Date },
  dataHoraEntregue: { type: Date },
  entregadorId: { type: String }
});

// --- 3. Hook do Mongoose ---
// Este hook garante que 'dataHoraAtualizacao' seja sempre atualizado antes de salvar o documento
pedidoSchema.pre('save', function(this: IPedido, next) {
  this.dataHoraAtualizacao = new Date();
  next();
});

// --- 4. Criação e Exportação do Modelo ---
const Pedido = mongoose.model<IPedido>('Pedido', pedidoSchema);
export default Pedido;
// backend/src/routes/orders.ts (Certifique-se de que é ESTE ARQUIVO no seu sistema!)
import { Router } from 'express';
// Importa as funções do controlador de pedidos
import {
  criarPedido,
  listarPedidos,
  buscarPedidoPorId,
  atualizarStatusPedido,
  cancelarPedido
} from '../controllers/ordersController'; // Importa do seu ordersController

const router = Router();

router.post('/', criarPedido);
router.get('/', listarPedidos);
router.get('/:id', buscarPedidoPorId);
router.put('/:id/status', atualizarStatusPedido);
router.put('/:id/cancelar', cancelarPedido);

export default router; // <<< --- ESTA LINHA PRECISA ESTAR AQUI!
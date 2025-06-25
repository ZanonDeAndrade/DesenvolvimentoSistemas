// backend/src/routes/payment.ts
import { Router } from 'express';
import { generatePixPayment } from '../controllers/paymentController'; // Importa o controller

const router = Router();

// Define a rota POST que o frontend vai chamar
// Ex: POST http://localhost:5000/payment/gerar-pix
router.post('/gerar-pix', generatePixPayment);

export default router;
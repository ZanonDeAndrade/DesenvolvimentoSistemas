// backend/src/controllers/paymentController.ts
import { Request, Response } from 'express';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const MERCADO_PAGO_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;

export const generatePixPayment = async (req: Request, res: Response) => {
  const { transaction_amount, payer_email, payer_first_name, payer_last_name, payer_cpf, description } = req.body;

  if (!MERCADO_PAGO_ACCESS_TOKEN) {
    console.error("Token de acesso do Mercado Pago não foi encontrado nas variáveis de ambiente.");
    return res.status(500).json({ message: "Erro de configuração no servidor." });
  }

  const paymentData = {
    transaction_amount: Number(transaction_amount),
    description: description,
    payment_method_id: 'pix',
    payer: {
      email: payer_email,
      first_name: payer_first_name,
      last_name: payer_last_name,
      identification: {
        type: 'CPF',
        number: payer_cpf,
      },
    },
    notification_url: 'https://sua-url-de-webhook.com/webhook', // Lembre-se de configurar um webhook real
  };

  try {
    const response = await axios.post('https://api.mercadopago.com/v1/payments', paymentData, {
      headers: {
        'Authorization': `Bearer ${MERCADO_PAGO_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        'X-Idempotency-Key': uuidv4(),
      },
    });

    const { id, point_of_interaction } = response.data;
    const qrCode = point_of_interaction.transaction_data.qr_code;
    const qrCodeBase64 = point_of_interaction.transaction_data.qr_code_base64;

    console.log(`Pagamento PIX gerado com sucesso! ID do Pagamento: ${id}`);

    return res.status(201).json({
      paymentId: id,
      pixCopiaECola: qrCode,
      qrCode: qrCodeBase64,
    });

  } catch (error: any) {
    console.error('Erro ao gerar pagamento PIX no Mercado Pago:');
    console.error(error.response?.data || error.message);
    return res.status(500).json({
      message: 'Erro ao gerar cobrança PIX.',
      error: error.response?.data?.message || 'Erro desconhecido.'
    });
  }
};
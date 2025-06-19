// backend/src/routes/adress.ts (ou userRoutes.ts)
import { Router } from 'express';
import { User } from '../modules/user'; // Certifique-se de que o caminho está correto
// import { verifyToken } from '../middleware/authMiddleware'; // Se estiver usando

const router = Router();

router.put('/users/:id/address', async (req, res) => {
  console.log('Backend: Requisição PUT para /users/:id/address recebida.');
  console.log('Backend: Conteúdo de req.body:', req.body); // Log para ver o que está chegando
  console.log('Backend: Conteúdo de req.body.endereco:', req.body.endereco); // Log específico para o endereço

  try {
    const userId = req.params.id;
    // CORREÇÃO: Desestruture de req.body.endereco
    const { rua, numero, complemento, bairro, cidade, estado, cep } = req.body.endereco;

    // Validação básica
    if (!rua || !numero || !bairro || !cidade || !estado || !cep) {
      console.log('Backend: Erro de validação - campos obrigatórios faltando.');
      return res.status(400).json({ message: 'Todos os campos de endereço (exceto complemento) são obrigatórios.' });
    }

    const user = await User.findById(userId);

    if (!user) {
      console.log(`Backend: Usuário com ID ${userId} não encontrado.`);
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    user.endereco = {
      rua,
      numero,
      complemento: complemento || '',
      bairro,
      cidade,
      estado,
      cep,
    };

    await user.save();
    console.log('Backend: Endereço atualizado com sucesso para o usuário:', userId);

    res.status(200).json({
      message: 'Endereço atualizado com sucesso!',
      user: user.toObject({ getters: true, virtuals: false, transform: (doc, ret) => { delete ret.senha; return ret; }})
    });
  } catch (error: any) {
    console.error('Backend: Erro ao atualizar endereço do usuário:', error.message || error);
    if (error.name === 'ValidationError') {
        return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Erro interno do servidor ao atualizar o endereço.' });
  }
});

export default router;
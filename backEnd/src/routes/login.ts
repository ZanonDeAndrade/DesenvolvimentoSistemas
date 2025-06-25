// backend/src/routes/login.ts
import express, { Request, Response } from 'express';
import { User } from '../modules/user'; // Verifique se o caminho para 'User' está correto
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

interface LoginRequestBody {
  email: string;
  senha: string;
}

router.post('/login', async (req: Request<LoginRequestBody>, res: Response) => {
  const { email, senha } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      console.log(`Tentativa de login: Usuário com email ${email} não encontrado.`);
      return res.status(401).json({ mensagem: 'E-mail ou senha inválidos.' });
    }

    const senhaCorreta = await bcrypt.compare(senha, user.senha);

    if (!senhaCorreta) {
      console.log(`Tentativa de login: Senha incorreta para o usuário ${email}.`);
      return res.status(401).json({ mensagem: 'E-mail ou senha inválidos.' });
    }

    console.log(`Login bem-sucedido para o usuário: ${email}`);

    if (!process.env.JWT_SECRET) {
        console.error('ERRO DE CONFIGURAÇÃO: JWT_SECRET não está definido nas variáveis de ambiente!');
        return res.status(500).json({ mensagem: 'Erro interno do servidor: JWT_SECRET não configurado.' });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, nome: user.nome }, // Payload
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' }
    );

    // <<-- AJUSTE AQUI: Inclua o ID e o nome do usuário diretamente na resposta
    return res.status(200).json({
      mensagem: 'Login realizado com sucesso!',
      token: token,
      user: {                   // <-- Adicionado este objeto 'user'
        _id: user._id,          // <-- O ID do MongoDB
        name: user.nome         // <-- O nome do usuário (assumindo que user.nome existe no seu modelo User)
      }
    });

  } catch (err: any) {
    console.error("Erro no backend durante o login:", err);
    return res.status(500).json({ mensagem: 'Erro no servidor.', erro: err.message || 'Erro desconhecido' });
  }
});

export default router;
// backEnd/src/routes/register.ts
import express, { Request, Response } from 'express';
import { User } from '../modules/user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'; // <-- Adicionado: Importa jsonwebtoken
import dotenv from 'dotenv';    // <-- Adicionado: Importa dotenv

dotenv.config(); // <-- Adicionado: Carrega as variáveis de ambiente do .env

const router = express.Router();

interface RegisterRequestBody {
  nome: string;
  email: string;
  senha: string;
  telefone: string;
}

router.post(
  '/register',
  async (req: Request<RegisterRequestBody>, res: Response) => {
    // É uma boa prática adicionar um log do que o backend está recebendo, pelo menos durante o desenvolvimento.
    // console.log('Dados recebidos para registro:', req.body); 

    const { nome, email, senha, telefone } = req.body;

    try {
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        // Adicionado 'return' aqui para encerrar a execução da função
        return res.status(409).json({ mensagem: 'E-mail já cadastrado.' });
      }

      const hashedPassword = await bcrypt.hash(senha, 10);

      const newUser = new User({
        nome,
        email,
        senha: hashedPassword,
        telefone,
      });

      await newUser.save(); // Salva o novo usuário no banco de dados

      // *** Parte do JWT: Gerar o token ***
      // Verifica se o segredo JWT está definido. ESSENCIAL!
      if (!process.env.JWT_SECRET) {
          console.error('ERRO DE CONFIGURAÇÃO: JWT_SECRET não está definido nas variáveis de ambiente!');
          // Resposta de erro para o cliente
          return res.status(500).json({ mensagem: 'Erro interno do servidor: JWT_SECRET não configurado.' });
      }

      const token = jwt.sign(
        { userId: newUser._id, email: newUser.email, nome: newUser.nome }, // Payload: informações para incluir no token
        process.env.JWT_SECRET as string,              // Segredo para assinar o token
        { expiresIn: '1h' }                            // Tempo de expiração do token (ex: 1 hora)
      );

      // Envia o token JWT junto com a mensagem de sucesso
      res.status(201).json({
        success: true,
        mensagem: 'Conta criada com sucesso!',
        token: token // <-- O token JWT é enviado aqui
      });

    } catch (err: any) {
      console.error("Erro interno no backend durante o registro:", err); // Log detalhado para depuração

      // Melhor tratamento para erros de validação do Mongoose (campos faltando, etc.)
      if (err.name === 'ValidationError') {
        // Mapeia os erros de validação para uma mensagem mais legível
        const messages = Object.values(err.errors).map((val: any) => val.message);
        // Retorna um status 400 (Bad Request) para erros de validação
        return res.status(400).json({ mensagem: `Erro de validação: ${messages.join(', ')}` });
      }

      // Erros genéricos do servidor
      res.status(500).json({ mensagem: 'Erro ao criar conta.', erro: err.message || 'Erro desconhecido' });
    }
  }
);

export default router;
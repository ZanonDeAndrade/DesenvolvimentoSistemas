// routes/login.ts
import express, { Request, Response } from 'express';
import { User } from '../modules/user'; // Verifique se o caminho para 'User' está correto
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';    // <-- Adicionado: Importa jsonwebtoken
import dotenv from 'dotenv';       // <-- Adicionado: Importa dotenv

dotenv.config(); // <-- Adicionado: Carrega as variáveis de ambiente do .env

const router = express.Router();

interface LoginRequestBody {
  email: string;
  senha: string;
}

// A rota agora é '/login'
// O callback da rota é direto um 'async' function
router.post('/login', async (req: Request<LoginRequestBody>, res: Response) => { 
  // console.log('Tentativa de login com os dados:', req.body); // Opcional: para depuração
  const { email, senha } = req.body;
  
  try {
    const user = await User.findOne({ email }); // 1. Buscar usuário pelo email
    
    if (!user) { // Se o usuário NÃO for encontrado
      console.log(`Tentativa de login: Usuário com email ${email} não encontrado.`); // DEBUG
      return res.status(401).json({ mensagem: 'E-mail ou senha inválidos.' });
    }
    
    // Se o usuário foi encontrado, comparar a senha
    const senhaCorreta = await bcrypt.compare(senha, user.senha); // 2. Comparar a senha fornecida com a senha hash do banco
    
    if (!senhaCorreta) { // Se a senha NÃO estiver correta
      console.log(`Tentativa de login: Senha incorreta para o usuário ${email}.`); // DEBUG
      return res.status(401).json({ mensagem: 'E-mail ou senha inválidos.' });
    }
    
    // Se tudo estiver certo, login bem-sucedido
    console.log(`Login bem-sucedido para o usuário: ${email}`); // DEBUG

    // *** PARTE DO JWT: Gerar o token ***
    // Verifica se o segredo JWT está definido. ESSENCIAL!
    if (!process.env.JWT_SECRET) {
        console.error('ERRO DE CONFIGURAÇÃO: JWT_SECRET não está definido nas variáveis de ambiente!');
        // Resposta de erro para o cliente
        return res.status(500).json({ mensagem: 'Erro interno do servidor: JWT_SECRET não configurado.' });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, nome: user.nome }, // <-- Payload: inclua o nome do usuário aqui
      process.env.JWT_SECRET as string,                        // Segredo para assinar o token
      { expiresIn: '1h' }                                      // Tempo de expiração do token (ex: 1 hora)
    );

    // Retorna a mensagem de sucesso E o token
    return res.status(200).json({ mensagem: 'Login realizado com sucesso!', token: token });
    
  } catch (err: any) {
    console.error("Erro no backend durante o login:", err); // Log mais detalhado do erro real
    return res.status(500).json({ mensagem: 'Erro no servidor.', erro: err.message || 'Erro desconhecido' });
  }
});

export default router;
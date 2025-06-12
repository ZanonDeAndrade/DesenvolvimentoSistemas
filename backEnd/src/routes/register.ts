import express, { Request, Response } from 'express';
import { User } from '../modules/user';
import bcrypt from 'bcrypt';

const router = express.Router();

interface RegisterRequestBody {
  nome: string;
  email: string;
  senha: string;
  telefone: string;
}

router.post(
  '/',
  async (req: Request<RegisterRequestBody>, res: Response) => {
    const { nome, email, senha, telefone } = req.body;

    try {
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        res.status(409).json({ mensagem: 'E-mail já cadastrado.' });
      }

      const hashedPassword = await bcrypt.hash(senha, 10);

      const newUser = new User({
        nome,
        email,
        senha: hashedPassword,
        telefone,
      });

      await newUser.save();

      res.status(201).json({ mensagem: 'Conta criada com sucesso!' });
    } catch (err) {
      res.status(500).json({ mensagem: 'Erro ao criar conta.', erro: err });
    }
  }
);

export default router;

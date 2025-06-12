import express from 'express';
import { User } from '../modules/user';
import bcrypt from 'bcrypt';

const router = express.Router();

interface LoginRequestBody {
  email: string;
  senha: string;
}


router.post('/', (req, res) => {
  const { email, senha } = req.body as LoginRequestBody;
  
  (async () => {
    try {
      const user = await User.findOne({ email });
      
      if (!user) {
        return res.status(401).json({ mensagem: 'E-mail ou senha inválidos.' });
      }
      
      const senhaCorreta = await bcrypt.compare(senha, user.senha);
      
      if (!senhaCorreta) {
        return res.status(401).json({ mensagem: 'E-mail ou senha inválidos.' });
      }
      
      return res.status(200).json({ mensagem: 'Login realizado com sucesso!' });
      
    } catch (err) {
      return res.status(500).json({ mensagem: 'Erro no servidor.', erro: err });
    }
  })();
});

export default router;
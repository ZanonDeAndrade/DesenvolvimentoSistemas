interface IUsuario {
    email: string;
    senha: string;
    permissoes: string[];
}


class Autenticacao {
    private usuarios: IUsuario[] = [
        { email: 'admin@exemplo.com', senha: 'admin123', permissoes: ['admin'] },
        { email: 'usuario@exemplo.com', senha: 'usuario123', permissoes: ['usuario'] }
    ];

    autenticar(email: string, senha: string): IUsuario | null {
        return this.usuarios.find(u => u.email === email && u.senha === senha) || null;
    }
}


class Autorizacao {
    temPermissao(usuario: IUsuario, recurso: string): boolean {
        return usuario.permissoes.includes(recurso);
    }
}


async function login(email: string, senha: string, recurso: string) {
    const autenticacao = new Autenticacao();
    const usuario = autenticacao.autenticar(email, senha);

    if (!usuario) {
        console.log('Email ou senha inválidos!');
        return;
    }

    console.log('Login bem-sucedido!');
    const autorizacao = new Autorizacao();
    if (autorizacao.temPermissao(usuario, recurso)) {
        console.log(`Acesso concedido ao recurso: ${recurso}`);
    } else {
        console.log(`Acesso negado ao recurso: ${recurso}`);
    }
}


login('admin@exemplo.com', 'admin123', 'admin');
login('usuario@exemplo.com', 'usuario123', 'user');

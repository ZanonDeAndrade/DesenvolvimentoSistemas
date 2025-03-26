interface IdadosApi {
    nome: string;
    cpf: string;
    rendaMensal: number;
}

function validarDadosCliente(cliente: IdadosApi): void {
    if (typeof cliente.nome !== 'string') throw new Error("Nome inválido.");
    if (typeof cliente.cpf !== 'string') throw new Error("CPF inválido.");
    if (typeof cliente.rendaMensal !== 'number') throw new Error("Renda mensal inválida.");
}


try {
    validarDadosCliente({ nome: "Arthur", cpf: "123.000.000-00", rendaMensal: 5000 });
    console.log("Dados válidos!");
} catch (erro) {
    console.error("Erro desconhecido.");
   
}

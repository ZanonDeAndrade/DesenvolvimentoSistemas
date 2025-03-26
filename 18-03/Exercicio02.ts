class ContaBancaria {
    private saldo: number;

    public constructor(saldoInicial: number) {
        this.saldo = saldoInicial;
    }

    public depositar(valor: number): void {
            this.saldo += valor;
            console.log(`Depósito de R$${valor} realizado com sucesso!`);
    }

    public getSaldo(): number {
        return this.saldo;
    }
}

const minhaConta = new ContaBancaria(1000);


minhaConta.depositar(500);
console.log("Saldo atual:", minhaConta.getSaldo()); 

minhaConta.depositar(200);
console.log("Saldo atual:", minhaConta.getSaldo()); 

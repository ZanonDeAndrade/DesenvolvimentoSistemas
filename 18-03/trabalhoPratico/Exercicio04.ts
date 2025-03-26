interface ICotacao {
    moeda: string;
    valor: number;
}

async function tempo(tempo: number): Promise<void> {
    return new Promise<void>((resolve) => {
        setTimeout(() => {
            resolve();
        }, tempo);
    });
}

async function carteira(): Promise<ICotacao> {
    await tempo(1000);
    return { moeda: 'USD', valor: 5.58 };
}

async function main() {
    try {
        const cotacao = await carteira();
        console.log('Cotação obtida:', cotacao);
    } catch (erro) {
        console.error('Erro ao obter cotação:')}
}    

main();

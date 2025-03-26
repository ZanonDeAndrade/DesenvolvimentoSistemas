class Carro {
    marca: string;
    modelo: string;

    public constructor(marca: string, modelo: string) {
        this.marca = marca;
        this.modelo = modelo;
    }

    detalhes(): string {
        return `Carro modelo: ${this.modelo}, e marca ${this.marca}`;
    }
}

const meuCarro = new Carro("Fiat", "Argo");

console.log(meuCarro.detalhes());

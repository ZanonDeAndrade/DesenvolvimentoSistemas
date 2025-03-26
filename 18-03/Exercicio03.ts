class Animal {
    emitirSom(): string{
        return "Som"
    }
}

class Vaca extends Animal{
    emitirSom(): string {
        return "Mu";
    }
}

const vaca = new Vaca();
console.log(vaca.emitirSom());
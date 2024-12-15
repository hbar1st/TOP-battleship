export class Ship {

    #length;
    #name;
    #hits = 0;
    #sunk = false;

    constructor(length, name) {
        this.#length = length;
        this.#name = name;
    }


}
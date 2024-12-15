export class Ship {
  #length;
  #name;
  #hits = 0;
  #sunk = false;

  constructor(length, name) {
    this.#length = length;
    this.#name = name;
  }

  get length() {
    return this.#length;
  }

  get name() {
    return this.#name;
  }

  hit() {
    this.#hits += 1;
    if (this.#hits >= this.#length) {
      this.#sunk = true;
    }
    return this.#hits;
  }

  isSunk() {
    return this.#sunk;
  }
}

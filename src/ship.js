export { Carrier, Battleship, Destroyer, Submarine, PatrolBoat, Ship };

class Ship {
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

class Carrier extends Ship {
  id;

  constructor() {
    super(5, "Carrier");
    this.id = "carrier";
  }
}

class Battleship extends Ship {
  id;

  constructor() {
    super(4, "Battle Ship");
    this.id = "battleship";
  }
}

class Destroyer extends Ship {
  id;

  constructor() {
    super(3, "Destroyer");
    this.id = "destroyer";
  }
}

class Submarine extends Ship {
  id;

  constructor() {
    super(3, "Submarine");
    this.id = "submarine";
  }
}

class PatrolBoat extends Ship {
  id;

  constructor() {
    super(2, "Patrol Boat");
    this.id = "patrol-boat";
  }
}

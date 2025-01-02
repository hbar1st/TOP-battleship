import carrierAudio from "./carrier-destroyed.mp3";
import patrolBoatAudio from "./patrol-boat-destroyed.mp3";
import submarineAudio from "./submarine-destroyed.mp3";
import destroyerAudio from "./destroyer-destroyed.mp3";
import battleshipAudio from "./battleship-destroyed.mp3";

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

  get audio() {
    return carrierAudio;
  }
}

class Battleship extends Ship {
  id;

  constructor() {
    super(4, "Battle Ship");
    this.id = "battleship";
  }

  get audio() {
    return battleshipAudio;
  }
}

class Destroyer extends Ship {
  id;

  constructor() {
    super(3, "Destroyer");
    this.id = "destroyer";
  }
  get audio() {
    return destroyerAudio;
  }
}

class Submarine extends Ship {
  id;

  constructor() {
    super(3, "Submarine");
    this.id = "submarine";
  }

  get audio() {
    return submarineAudio;
  }
}

class PatrolBoat extends Ship {
  id;

  constructor() {
    super(2, "Patrol Boat");
    this.id = "patrol-boat";
  }

  get audio() {
    return patrolBoatAudio;
  }
}

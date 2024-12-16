export class Gameboard {
  #size;
  #name;
  #misses = new Map();
  #ships = [];
  static horizontal = "hor";
  static vertical = "ver";

  constructor(size, name) {
    this.#size = size;
    this.#name = name;
  }

  get name() {
    return this.#name;
  }

  placeShip(ship, x1, y1, dir = "hor") {
    // check if this ship was placed on the board earlier
    const otherShips = this.#ships.filter((s) => s.ship !== ship);
    this.#ships = otherShips; //duplicate ship removed now
    //check if the area is free
    if (this.boardFree(x1, y1, ship.length, dir)) {
      this.#ships.push({ ship, x1, y1, dir });
      return true;
    } else {
      return false;
    }
  }

  getIndicatedSpots(x1, y1, length, dir) {
    const positions = [];
    for (let i = 0; i < length; i++) {
      if (dir === "hor") {
        const x2 = x1 + i;
        if (x2 === this.#size) {
          return null; //out of bounds
        }
        positions.push({ x: x2, y: y1 });
      } else {
        const y2 = y1 + i;
        if (y2 === this.#size) {
          return null; //out of bounds
        }
        positions.push({ x: x1, y: y2 });
      }
    }
    return positions;
  }

  getAllShipSpots() {
    const shipPositions = [];
    this.#ships.forEach((shipPos) => {
      for (let i = 0; i < shipPos.ship.length; i++) {
        shipPos.dir === "hor"
          ? shipPositions.push({ x: shipPos.x1 + i, y: shipPos.y1 })
          : shipPositions.push({ x: shipPos.x1, y: shipPos.y1 + i });
      }
    });
    return shipPositions;
  }

  boardFree(x1, y1, length, dir) {
    // compile list of positions to check are free
    const positions = this.getIndicatedSpots(x1, y1, length, dir);
    if (positions === null) {
      return false;
    }
    // iterate over list of ships and compile occupied positions
    const shipPositions = this.getAllShipSpots();

    let found = 0;
    positions.forEach((pos) => {
      const occupiedSpot = shipPositions.find((el) => {
        return el.x === pos.x && el.y === pos.y;
      });
      if (occupiedSpot) {
        found++;
      }
    });
    return found === 0;
  }
}

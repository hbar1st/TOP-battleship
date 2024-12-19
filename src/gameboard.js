export class Gameboard {
  #size;
  #name;
  #misses = [];
  #hits = [];
  #ships = [];
  static horizontal = "hor";
  static vertical = "ver";

  constructor(name, size = 10) {
    this.#size = size;
    this.#name = name;
  }

  get ships() {
    return this.#ships;
  }

  get name() {
    return this.#name;
  }

  get misses() {
    return this.#misses;
  }

  get hits() {
    return this.#hits;
  }

  get size() {
    return this.#size;
  }

  getShipById(id) {
    const result = this.#ships.filter((el) => el.ship.id === id);
    return result.length ? result[0] : null;
  }

  getBoardArray(obfuscate = false) {
    //if obfuscate is true, the ships are not shown, only the hits if any are shown
    // Note: (0,0) is the lower-left corner of the grid like a normal cartesian plane
    // creates a 2d array representing the board with
    // cells marked as m for misses
    // cells marked with ship names being occupied by that ship if obfuscate is false, otherwise they don't show
    // cells marked with x are hits if obfuscate is true
    // cells marked as o are open
    const board = [];

    for (let i = 0; i < this.#size; i++) {
      const row = [];
      for (let j = 0; j < this.#size; j++) {
        row.push("o");
      }
      board.push(row);
    }

    this.misses.forEach((miss) => (board[miss.y][miss.x] = "m"));
    if (obfuscate) {
      this.#hits.forEach((hit) => (board[hit.y][hit.x] = "x"));
    } else {
      this.#ships.forEach((shipSpot) => {
        for (let i = 0; i < shipSpot.ship.length; i++) {
          shipSpot.dir === "hor"
            ? (board[shipSpot.y1][shipSpot.x1 + i] = shipSpot.ship.name)
            : (board[shipSpot.y1 + i][shipSpot.x1] = shipSpot.ship.name);
        }
      });
    }
    let mirrorboard = [];
    for (let i = board.length - 1; i >= 0; i--) {
      mirrorboard.push(board[i]);
    }
    return mirrorboard;
  }

  #addMiss(x, y) {
    this.#misses.push({ x, y });
  }

  #addHit(x, y) {
    this.#hits.push({ x, y });
  }

  receiveAttack(x, y) {
    //is (x,y) a hit?, which ship was hit?
    let hit = false;
    let shipIndex = 0;
    do {
      let currShip = this.#ships[shipIndex];
      let i = 0;
      do {
        if (
          (currShip.dir === "hor" &&
            currShip.x1 + i === x &&
            currShip.y1 === y) ||
          (currShip.dir === "ver" && currShip.x1 === x && currShip.y1 + i === y)
        ) {
          hit = true;
          currShip.ship.hit();
        } else {
          i++;
        }
      } while (!hit && currShip.ship.length > i);
      shipIndex++;
    } while (!hit && this.#ships.length > shipIndex);

    //record a list of hits and misses
    hit ? this.#addHit(x, y) : this.#addMiss(x, y);
    return hit;
  }

  allShipsSunk() {
    return this.#ships.reduce((acc, el) => {
      return acc && el.ship.isSunk();
    }, true);
  }

  placeShip(ship, x1, y1, dir = "hor") {
    // check if this ship was placed on the board earlier
    const otherShips = this.#ships.filter((s) => s.ship !== ship);
    //check if the area is free
    if (this.boardFree(x1, y1, ship.length, dir, otherShips)) {
      otherShips.push({ ship, x1, y1, dir });
      this.#ships = otherShips;
      return true;
    } else {
      return false;
    }
  }

  rotateShip(x1, y1) {
    //attempts to take which ever ship is at x1, y1 and rotate it
    let shipObj = null;
    for (let i = 0; i < this.#ships.length; i++) {
      if (this.#ships[i].x1 === x1 && this.#ships[i].y1 === y1) {
        shipObj = this.#ships[i];
        break;
      }
    }
    if (!shipObj) {
      return shipObj;
    }
    if (shipObj.dir === "hor") {
      //try to rotate 90deg left
      let rotRes = this.placeShip(shipObj.ship, shipObj.x1, shipObj.y1, "ver");
      if (rotRes) {
        shipObj.dir = "ver";
      } else {
        //rotate 270deg anti-clockwise
        rotRes = this.placeShip(
          shipObj.ship,
          shipObj.x1,
          shipObj.y1 - shipObj.ship.length + 1,
          "ver"
        );
        if (rotRes) {
          shipObj.dir = "ver";
          shipObj.y1 = shipObj.y1 - shipObj.ship.length + 1;
        }
      }
    } else {
      // turn 90deg left
      let rotRes = this.placeShip(
        shipObj.ship,
        shipObj.x1 - shipObj.ship.length + 1,
        shipObj.y1,
        "hor"
      );
      if (rotRes) {
        shipObj.dir = "hor";
        shipObj.x1 = shipObj.x1 - shipObj.ship.length + 1;
      } else {
        // try to rotate 270deg anti-clockwise
        rotRes = this.placeShip(shipObj.ship, shipObj.x1, shipObj.y1);
        if (rotRes) {
          shipObj.dir = "hor";
        }
      }
    }

    return shipObj;
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

  getAllShipSpots(newShipArr = this.#ships) {
    const shipPositions = [];
    newShipArr.forEach((shipPos) => {
      for (let i = 0; i < shipPos.ship.length; i++) {
        shipPos.dir === "hor"
          ? shipPositions.push({ x: shipPos.x1 + i, y: shipPos.y1 })
          : shipPositions.push({ x: shipPos.x1, y: shipPos.y1 + i });
      }
    });
    return shipPositions;
  }

  boardFree(x1, y1, length, dir, newShipArr = this.#ships) {
    if (x1 < 0 || y1 < 0 || x1 > this.#size - 1 || y1 > this.#size - 1) {
      return false;
    }
    // compile list of positions to check are free
    const positions = this.getIndicatedSpots(x1, y1, length, dir);
    if (positions === null) {
      return false;
    }
    // iterate over list of ships and compile occupied positions
    const shipPositions = this.getAllShipSpots(newShipArr);

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

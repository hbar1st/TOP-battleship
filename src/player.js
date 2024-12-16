import { Gameboard } from "./gameboard.js";
import { Ship } from "./ship.js";

export function createHumanPlayer() {
  return createPlayer("human");
}

export function createComputerPlayer() {
  return createPlayer("computer");
}

/**
 *
 * @param {*} type can be human or computer
 * @returns object
 */
function createPlayer(type) {
  const carrier = new Ship(5, "Carrier");
  const battleship = new Ship(4, "Battle Ship");
  const destroyer = new Ship(3, "Destroyer");
  const submarine = new Ship(3, "Submarine");
  const patrolBoat = new Ship(2, "Patrol Boat");

  const board = new Gameboard(type);

  // initially we are hardcoding the locations of the ships
  board.placeShip(patrolBoat, 0, 0, Gameboard.horizontal); // (0,0), (1,0)
  board.placeShip(destroyer, 2, 0, Gameboard.horizontal); // (2,0), (3, 0), (4,0)
  board.placeShip(submarine, 7, 7, Gameboard.horizontal); // (7, 7), (8, 7), (9, 7)
  board.placeShip(battleship, 2, 4, Gameboard.vertical); // (2, 4), (2, 5), (2, 6), (2,7)
  board.placeShip(carrier, 3, 2, Gameboard.vertical); // (2,0), (3, 0), (4,0)

  const getBoard = () => {
    return board;
  };

  return { getBoard };
}

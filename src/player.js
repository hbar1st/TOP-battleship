import { Gameboard } from "./gameboard.js";
import {
  Ship,
  PatrolBoat,
  Destroyer,
  Submarine,
  Battleship,
  Carrier,
} from "./ship.js";

export function createHumanPlayer(pname) {
  return createPlayer("human", pname);
}

export function createComputerPlayer() {
  return createPlayer("computer", "Computer");
}

/**
 *
 * @param {*} type can be human or computer
 * @returns object
 */
function createPlayer(type, pname) {
  const carrier = new Carrier();
  const battleship = new Battleship();
  const destroyer = new Destroyer();
  const submarine = new Submarine();
  const patrolBoat = new Ship(2, "Patrol Boat");

  const board = new Gameboard(type);
  const name = pname;

  // initially we are hardcoding the locations of the ships
  board.placeShip(patrolBoat, 0, 0, Gameboard.horizontal); // (0,0), (1,0)
  board.placeShip(destroyer, 2, 0, Gameboard.horizontal); // (2,0), (3, 0), (4,0)
  board.placeShip(submarine, 7, 7, Gameboard.horizontal); // (7, 7), (8, 7), (9, 7)
  board.placeShip(battleship, 2, 4, Gameboard.vertical); // (2, 4), (2, 5), (2, 6), (2,7)
  board.placeShip(carrier, 3, 2, Gameboard.vertical); // (2,0), (3, 0), (4,0)

  const getBoard = () => {
    return board;
  };

  const getName = () => {
    return name;
  };
  return { getBoard, getName };
}

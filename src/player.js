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
  const patrolBoat = new PatrolBoat();

  const board = new Gameboard(type);
  const name = pname;

  // initially we are hardcoding the locations of the ships
  board.placeShip(patrolBoat, 4, 4, Gameboard.horizontal);
  board.placeShip(destroyer, 7, 0, Gameboard.horizontal);
  board.placeShip(submarine, 0, 9, Gameboard.horizontal);
  board.placeShip(battleship, 0, 0, Gameboard.vertical);
  board.placeShip(carrier, 9, 5, Gameboard.vertical);
  const getBoard = () => {
    return board;
  };

  const getName = () => {
    return name;
  };
  return { getBoard, getName };
}

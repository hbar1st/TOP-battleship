import { Gameboard } from "./gameboard.js";
import {
  Ship,
  PatrolBoat,
  Destroyer,
  Submarine,
  Battleship,
  Carrier,
} from "./ship.js";

export function createHumanPlayer(pname, id) {
  if (pname === "Computer") {
    throw new Error("You can't call yourself Computer!");
  }
  const player = createPlayer("human", pname, id);
  const board = player.getBoard();

  const carrier = new Carrier();
  const battleship = new Battleship();
  const destroyer = new Destroyer();
  const submarine = new Submarine();
  const patrolBoat = new PatrolBoat();
  // initially we are hardcoding the locations of the ships
  board.placeShip(patrolBoat, 4, 4, Gameboard.horizontal);
  board.placeShip(destroyer, 7, 0, Gameboard.horizontal);
  board.placeShip(submarine, 0, 9, Gameboard.horizontal);
  board.placeShip(battleship, 0, 0, Gameboard.vertical);
  board.placeShip(carrier, 9, 5, Gameboard.vertical);
  return player;
}

export function isPlayerAComputer(player) {
  return player.getName() === "The Computer";
}

export function createComputerPlayer(id) {
  const computerPlayer = createPlayer("computer", "The Computer", id);
  const board = computerPlayer.getBoard();

  const carrier = new Carrier();
  const battleship = new Battleship();
  const destroyer = new Destroyer();
  const submarine = new Submarine();
  const patrolBoat = new PatrolBoat();
  // initially we are hardcoding the locations of the ships
  // TODO randomize ship locations
  board.placeShip(patrolBoat, 4, 4, Gameboard.horizontal);
  board.placeShip(destroyer, 7, 0, Gameboard.horizontal);
  board.placeShip(submarine, 0, 9, Gameboard.horizontal);
  board.placeShip(battleship, 0, 0, Gameboard.vertical);
  board.placeShip(carrier, 9, 5, Gameboard.vertical);
  return computerPlayer;
}

/**
 *
 * @param {*} type can be human or computer
 * @returns object
 */
function createPlayer(type, pname, pid) {
  const board = new Gameboard(type);
  const name = pname;
  const id = pid;

  const getBoard = () => {
    return board;
  };

  const getName = () => {
    return name;
  };

  const getId = () => {
    return id;
  };
  return { getBoard, getName, getId };
}

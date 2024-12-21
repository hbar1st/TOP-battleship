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
  /*
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
  board.placeShip(carrier, 9, 5, Gameboard.vertical);*/

  board.placeShipRandomly(new PatrolBoat());
  board.placeShipRandomly(new Carrier());
  board.placeShipRandomly(new Battleship());
  board.placeShipRandomly(new Destroyer());
  board.placeShipRandomly(new Submarine());
  return player;
}

export function isPlayerAComputer(player) {
  return player.getName() === "The Computer";
}

export function createComputerPlayer(id) {
  const computerPlayer = createPlayer("computer", "The Computer", id);
  const board = computerPlayer.getBoard();

  const opponentBoardMemory = {}; //a list of all ships sunk with their locations
  const memory = {}; // a list of hits that form a line vertically or horizontally

  board.placeShipRandomly(new PatrolBoat());
  board.placeShipRandomly(new Carrier());
  board.placeShipRandomly(new Battleship());
  board.placeShipRandomly(new Destroyer());
  board.placeShipRandomly(new Submarine());

  const strategicData = { opponentBoardMemory, memory };
  return Object.assign(computerPlayer, strategicData);
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

/**
 * this function tries to give the computer player some good moves to play
 * otherwise, it's just random luck!
 * @param {*} gameboard
 */
export function computerAttacks(gameboard, computer) {
  //don't repeat the hits or the misses!
  const hits = gameboard.hits;
  const hitsAndMisses = [...gameboard.misses, ...hits];
  let viableTarget = null;
  do {
    // how to tell if a prior hit is forming a line?
    const x = Math.floor(Math.random() * 10);
    const y = Math.floor(Math.random() * 10);
    //check if target makes sense
    duplicatePlay = hitsAndMisses.filter((pos) => pos.x === x && pos.y === y);
    if (duplicatePlay.length === 0) {
      viableTarget = { x, y };
    }
  } while (!viableTarget);
  return gameboard.receiveAttack(viableTarget.x, viableTarget.y);
}

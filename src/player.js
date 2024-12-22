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
  let targetDir = null;
  const opponentBoardMemory = new Map(); //a list of all ships sunk with their occupied locations
  const memory = []; // a list of hits that form a line vertically or horizontally

  board.placeShipRandomly(new PatrolBoat());
  board.placeShipRandomly(new Carrier());
  board.placeShipRandomly(new Battleship());
  board.placeShipRandomly(new Destroyer());
  board.placeShipRandomly(new Submarine());
  console.log("The Computer's Board:");
  console.log(board.getBoardArray()); //TODO remove this!!
  /**
   * this function tries to give the computer player some good moves to play
   * otherwise, it's just random luck!
   * @param {*} gameboard
   */
  function computerAttacks(targetboard) {
    //don't repeat the hits or the misses!
    const hits = targetboard.hits;
    const misses = targetboard.misses;
    const hitsAndMisses = [...misses, ...hits];
    let viableTarget = null;

    function isDuplicated(x, y) {
      const duplicatePlay = hitsAndMisses.filter(
        (pos) => pos.x === x && pos.y === y
      );
      return duplicatePlay.length > 0;
    }
    let debugIndex = 0;
    do {
      // use a random pos if nothing better available
      let x = Math.floor(Math.random() * 10);
      let y = Math.floor(Math.random() * 10);
      let surroundingPos = [];
      if (memory.length === 1) {
        //try to establish a direction with the previous hit we found
        surroundingPos = targetboard.getSurroundingPositions(
          memory[0].x,
          memory[0].y
        );
      } else if (memory.length > 1) {
        memory.forEach((prevHit) => {
          const pos = targetboard.getSurroundingPositions(
            prevHit.x,
            prevHit.y,
            targetDir
          );

          pos.forEach((p) => {
            if (!isDuplicated(p)) {
              surroundingPos.push(p);
            }
          });
        });
      }

      // find a viable target
      let index = 0;
      while (index < surroundingPos.length) {
        if (!isDuplicated(surroundingPos[index])) {
          x = surroundingPos[index].x;
          y = surroundingPos[index].y;
          break;
        }
        index++;
      }

      //check if this cell is a dead-end
      if (!targetboard.isCellSurroundedByWater(x, y)) {
        //check if target makes sense
        if (!isDuplicated(x, y)) {
          viableTarget = { x, y };
        }
      }
    } while (!viableTarget && ++debugIndex < 100);
    console.log("debugIndex =", debugIndex);
    const res = targetboard.receiveAttack(viableTarget.x, viableTarget.y);
    if (res && res.isSunk()) {
      //clear the memory
      memory = [];
    } else if (res) {
      // a hit was made
      memory.push(viableTarget);
      if (memory.length === 2) {
        //establish direction
        if (memory[0].x === memory[1].x) {
          targetDir = Gameboard.vertical;
        } else {
          targetDir = Gameboard.horizontal;
        }
      }
    }
    return res;
  }

  function getShipPositions(ship, x, y) {
    const positions = [];
    if (ship.dir === Gameboard.horizontal) {
      //for (let i = )
    } else {
    }
    return positions;
  }

  const strategicData = {
    opponentBoardMemory,
    memory,
    computerAttacks,
  };

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

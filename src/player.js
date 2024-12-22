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
  let memory = []; // a list of hits that form a line vertically or horizontally

  board.placeShipRandomly(new PatrolBoat());
  board.placeShipRandomly(new Carrier());
  board.placeShipRandomly(new Battleship());
  board.placeShipRandomly(new Destroyer());
  board.placeShipRandomly(new Submarine());
  /**
   * this function tries to give the computer player some good moves to play
   * otherwise, it's just random luck!
   * @param {*} gameboard
   */
  function computerAttacks(targetboard) {
    //don't repeat the hits or the misses!
    const hits = targetboard.hits;
    const misses = targetboard.misses;
    let viableTarget = null;

    let debugIndex = 0;
    do {
      // use a random pos if nothing better available
      const randomPick = targetboard.pickRandomRemainingPos();
      let x = randomPick.x;
      let y = randomPick.y;
      let surroundingPos = [];
      if (memory.length === 1) {
        //try to establish a direction with the previous hit we found
        surroundingPos = targetboard.getSurroundingPositions(
          memory[0].x,
          memory[0].y
        );
      } else if (memory.length > 1) {
        memory.forEach((prevHit) => {
          surroundingPos = [
            ...surroundingPos,
            ...targetboard.getSurroundingPositions(
              prevHit.x,
              prevHit.y,
              targetDir
            ),
          ];
        });
        if (surroundingPos.length === 0) {
          targetDir = targetboard.toggleDir(targetDir);
        }
      }

      if (surroundingPos.length > 0) {
        x = surroundingPos[0].x;
        y = surroundingPos[0].y;
      }
      //check if this cell is a dead-end
      if (!targetboard.isCellSurroundedByWater(x, y)) {
        //check if target makes sense
        if (!targetboard.isDuplicated(x, y)) {
          viableTarget = { x, y };
        }
      }
      if (debugIndex === 100) {
        //force memory reset so we don't crash because we're in an infinite loop
        memory = [];
      }
    } while (!viableTarget && ++debugIndex < 200);
    if (debugIndex === 200) {
      throw new Error(
        "Found a bug in the computer playing logic, please report logs"
      );
    }
    const res = targetboard.receiveAttack(viableTarget.x, viableTarget.y);
    if (res && res.isSunk()) {
      //clear the memory of cells that belong to that ship only
      const sortedPos = [viableTarget];
      for (let i = 0; i < memory.length; i++) {
        if (targetDir === Gameboard.horizontal) {
          if (memory[i].y === viableTarget.y) {
            if (sortedPos.length > 0) {
              //try to insert the current pos into the sortedPos
              for (let j = 0; j < sortedPos.length; j++) {
                if (memory[i].x < sortedPos[j].x) {
                  sortedPos.splice(j, 0, memory[i]);
                  break;
                } else {
                  if (j === sortedPos.length - 1) {
                    //insert at the end
                    sortedPos.push(memory[i]);
                    break;
                  }
                }
              }
            } else {
              sortedPos.push(memory[i]);
            }
          }
        } else {
          if (memory[i].x === viableTarget.x) {
            if (sortedPos.length > 0) {
              //try to insert the current pos into the sortedPos
              for (let j = 0; j < sortedPos.length; j++) {
                if (memory[i].y < sortedPos[j].y) {
                  sortedPos.splice(j, 0, memory[i]);
                  break;
                }
              }
            } else {
              sortedPos.push(memory[i]);
            }
          }
        }
      }

      // what is the index of the viableTarget in the sortedPos list?
      // if the index minus the size of the boat +f1)  is < 0, then go right++
      // but if the index plus the size of the boat > (size-1), then go left-- ()
      let vtIndex = 0;
      for (let i = 0; i < res.length; i++) {
        if (
          sortedPos[i].x === viableTarget.x &&
          sortedPos[i].y === viableTarget.y
        ) {
          vtIndex = i;
          break;
        }
      }
      if (vtIndex - res.length + 1 < 0) {
        sortedPos.splice(vtIndex, res.length);
      } else {
        sortedPos.splice(vtIndex - res.length + 1, res.length);
      }

      memory = [...sortedPos];
    } else if (res) {
      // a hit was made
      memory.push(viableTarget);
      if (memory.length >= 2) {
        //establish direction
        if (memory[0].x === memory[1].x) {
          targetDir = Gameboard.vertical;
        } else if (memory[0].y === memory[1].y) {
          targetDir = Gameboard.horizontal;
        }
      }
    }
    return res;
  }

  const strategicData = {
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

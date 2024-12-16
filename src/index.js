import "./styles.css";

import { Gameboard } from "./gameboard.js";
import { Ship } from "./ship.js";

const gameboard = new Gameboard("Player");
const carrier = new Ship(5, "Carrier");
const battleship = new Ship(4, "Battle Ship");
const destroyer = new Ship(3, "Destroyer");
const submarine = new Ship(3, "Submarine");
const patrolBoat = new Ship(2, "Patrol Boat");

gameboard.placeShip(patrolBoat, 0, 0, Gameboard.horizontal); // (0,0), (1,0)
gameboard.placeShip(destroyer, 2, 0, Gameboard.horizontal); // (2,0), (3, 0), (4,0)
gameboard.placeShip(submarine, 7, 7, Gameboard.horizontal); // (7, 7), (8, 7), (9, 7)
gameboard.placeShip(battleship, 2, 4, Gameboard.vertical); // (2, 4), (2, 5), (2, 6), (2,7)
gameboard.placeShip(carrier, 3, 2, Gameboard.vertical); // (2,0), (3, 0), (4,0)
gameboard.receiveAttack(0, 1);
gameboard.receiveAttack(1, 2);
gameboard.receiveAttack(2, 3);
gameboard.receiveAttack(3, 4);
gameboard.receiveAttack(4, 5);

console.log(gameboard.getBoardArray(false));

console.log(gameboard.getBoardArray(true));

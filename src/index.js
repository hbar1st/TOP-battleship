import "./styles.css";

import { Gameboard } from "./gameboard.js";
import { Ship } from "./ship.js";

const gameboard = new Gameboard(10, "Player");
const patrolBoat = new Ship(2, "Patrol Boat");

const destroyer = new Ship(3, "Destroyer");

gameboard.placeShip(patrolBoat, 0, 0, Gameboard.horizontal); // (0,0), (1,0)
gameboard.placeShip(destroyer, 2, 0, Gameboard.horizontal); // (2,0), (3, 0), (4,0)
gameboard.receiveAttack(0, 0);
gameboard.receiveAttack(1, 0);
gameboard.allShipsSunk();
gameboard.receiveAttack(2, 0);
gameboard.receiveAttack(3, 0);
gameboard.receiveAttack(4, 0);

gameboard.allShipsSunk();

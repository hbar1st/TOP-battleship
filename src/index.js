import "./styles.css";

import { Gameboard } from "./gameboard.js";
import { Ship } from "./ship.js";

const gameboard = new Gameboard(10, "Player");
const patrolBoat = new Ship(2, "Patrol Boat");
const patrolBoat2 = new Ship(2, "Patrol Boat 2");

console.log(gameboard.placeShip(patrolBoat, 0, 0, Gameboard.vertical));
console.log(gameboard.placeShip(patrolBoat2, 0, 1, Gameboard.vertical));

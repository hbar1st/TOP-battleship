import { Gameboard } from "./gameboard.js";
import { Ship } from "./ship.js";

describe("Gameboard Test", () => {
  const gameboard = new Gameboard("Player");
  const patrolBoat = new Ship(2, "Patrol Boat");
  const patrolBoat1 = new Ship(2, "Patrol Boat 1");
  const patrolBoat2 = new Ship(2, "Patrol Boat 2");
  const destroyer = new Ship(3, "Destroyer");
  const carrier = new Ship(5, "Carrier");
  const carrier1 = new Ship(5, "Carrier 1");
  const carrier2 = new Ship(5, "Carrier 2");

  const battleship = new Ship(4, "Battleship");

  test("Gameboard Object Created", () => {
    expect(gameboard).toBeInstanceOf(Gameboard);
    expect(gameboard.name).toBe("Player");
    expect(gameboard.size).toBe(10);
  });

  test("Gameboard Place Patrol Ship in Empty Spot, Horizontally", () => {
    expect(gameboard.placeShip(patrolBoat, 0, 0, Gameboard.horizontal)).toBe(
      true
    );
  });

  test("Gameboard Returns Ship List From Ships Property", () => {
    expect(gameboard.ships.length).toBe(1);
    expect(gameboard.ships[0]).toEqual({
      dir: "hor",
      ship: patrolBoat,
      x1: 0,
      y1: 0,
    });
  });

  test("Gameboard Place Patrol Ship in Fully Occupied Spot, Horizontally", () => {
    expect(gameboard.placeShip(patrolBoat1, 0, 0, Gameboard.horizontal)).toBe(
      false
    );
  });

  test("Gameboard Place Patrol Ship in Partially Occupied Spot, Horizontally", () => {
    expect(gameboard.placeShip(patrolBoat2, 1, 0, Gameboard.horizontal)).toBe(
      false
    );
  });

  test("Gameboard Rotate Patrol Ship To Vertical Position", () => {
    const shipObj = gameboard.rotateShip(0, 0);
    const expected = {
      dir: "ver",
      ship: patrolBoat,
      x1: 0,
      y1: 0,
    };
    expect(shipObj).toMatchObject(expected);
  });

  test("Gameboard Place Patrol Ship in Empty Spot, Vertically", () => {
    expect(gameboard.placeShip(patrolBoat, 0, 0, Gameboard.vertical)).toBe(
      true
    );
  });

  test("Gameboard Place Patrol Ship in Fully Occupied Spot, Vertically", () => {
    expect(gameboard.placeShip(patrolBoat1, 0, 0, Gameboard.vertical)).toBe(
      false
    );
  });

  test("Gameboard Place Patrol Ship in Partially Occupied Spot, Vertically", () => {
    expect(gameboard.placeShip(patrolBoat2, 0, 1, Gameboard.vertical)).toBe(
      false
    );
  });

  test("Gameboard Place Carrier in Empty Spot, Horizontally", () => {
    expect(gameboard.placeShip(carrier, 1, 2, Gameboard.horizontal)).toBe(true);
  });

  test("Gameboard Carrier in Fully Occupied Spot, Horizontally", () => {
    expect(gameboard.placeShip(carrier1, 1, 2, Gameboard.horizontal)).toBe(
      false
    );
  });

  test("Gameboard Carrier in Partially Occupied Spot, Horizontally", () => {
    expect(gameboard.placeShip(carrier2, 0, 2, Gameboard.horizontal)).toBe(
      false
    );
  });

  test("Gameboard Place Battleship in Empty Spot, Vertically", () => {
    expect(gameboard.placeShip(battleship, 2, 3, Gameboard.vertical)).toBe(
      true
    );
  });

  test("Gameboard Place Battleship in Disallowed Spot, Vertically", () => {
    expect(gameboard.placeShip(battleship, 0, 7, Gameboard.vertical)).toBe(
      false
    );
  });

  test("Gameboard Place Battleship in Disallowed Spot, Horizontally", () => {
    expect(gameboard.placeShip(battleship, 7, 0, Gameboard.horizontal)).toBe(
      false
    );
  });

  test("Gameboard Registers Hit on Battleship", () => {
    const shipPlaced = gameboard.placeShip(
      battleship,
      6,
      6,
      Gameboard.vertical
    );
    expect(shipPlaced).toBe(true);
    expect(gameboard.receiveAttack(6, 6)).toBe(true); //true means hit
    expect(battleship.isSunk()).toBe(false);
  });

  test("Gameboard Registers Miss on Battleship", () => {
    const expectedMisses = [{ x: 5, y: 6 }];
    expect(gameboard.receiveAttack(5, 6)).toBe(false); //false means miss
    expect(gameboard.misses).toEqual(expect.arrayContaining(expectedMisses));
  });

  test("Gameboard Registers That Patrol Boat Has Sunk After 2 Hits", () => {
    expect(gameboard.receiveAttack(6, 7)).toBe(true); //true means hit
    expect(gameboard.receiveAttack(6, 8)).toBe(true); //true means hit
    expect(battleship.isSunk()).toBe(false);
    expect(gameboard.receiveAttack(6, 9)).toBe(true); //true means hit
    expect(battleship.isSunk()).toBe(true);
  });

  test("Gameboard Knows If All Ships Sank", () => {
    const gameboard = new Gameboard("Player");
    gameboard.placeShip(patrolBoat, 0, 0, Gameboard.horizontal); // (0,0), (1,0)
    gameboard.placeShip(destroyer, 2, 0, Gameboard.horizontal); // (2,0), (3, 0), (4,0)
    gameboard.receiveAttack(0, 0);
    gameboard.receiveAttack(1, 0);
    expect(gameboard.allShipsSunk()).toBe(false);
    gameboard.receiveAttack(2, 0);
    gameboard.receiveAttack(3, 0);
    gameboard.receiveAttack(4, 0);
    expect(gameboard.allShipsSunk()).toBe(true);
  });

  test("Gameboard Array Displays As Open At Start", () => {
    const gameboard = new Gameboard("Player", 5);
    const expected = [
      ["o", "o", "o", "o", "o"],
      ["o", "o", "o", "o", "o"],
      ["o", "o", "o", "o", "o"],
      ["o", "o", "o", "o", "o"],
      ["o", "o", "o", "o", "o"],
    ];
    expect(gameboard.getBoardArray()).toEqual(expect.arrayContaining(expected));
  });

  test("Gameboard Array Displays Misses and Ships", () => {
    const gameboard = new Gameboard("Player", 5);

    gameboard.placeShip(patrolBoat, 0, 1, Gameboard.horizontal); // (0,1), (1,1)
    const expected = [
      ["o", "o", "o", "o", "m"],
      ["m", "o", "o", "o", "o"],
      ["o", "o", "m", "o", "o"],
      ["Patrol Boat", "Patrol Boat", "o", "o", "o"],
      ["m", "o", "o", "o", "o"],
    ];

    gameboard.receiveAttack(0, 0);
    gameboard.receiveAttack(2, 2);
    gameboard.receiveAttack(4, 4);

    gameboard.receiveAttack(0, 3);
    expect(gameboard.getBoardArray()).toEqual(expect.arrayContaining(expected));
  });

  test("Gameboard Array Displays Misses and Hits (Not Ships)", () => {
    const gameboard = new Gameboard("Player", 5);

    gameboard.placeShip(carrier, 0, 1, Gameboard.horizontal); // (0,1), (1,1), (2, 1), (3, 1), (4, 1)
    const expected = [
      ["o", "o", "o", "o", "m"],
      ["m", "o", "o", "o", "o"],
      ["o", "o", "m", "o", "o"],
      ["x", "o", "x", "o", "o"],
      ["m", "o", "o", "o", "o"],
    ];

    gameboard.receiveAttack(0, 0); //miss
    gameboard.receiveAttack(0, 1); //hit
    gameboard.receiveAttack(2, 1); //hit
    gameboard.receiveAttack(2, 2); //miss
    gameboard.receiveAttack(4, 4); //miss
    gameboard.receiveAttack(0, 3); //miss
    expect(gameboard.getBoardArray(true)).toEqual(
      expect.arrayContaining(expected)
    );
  });

  test("Gameboard Rotate Patrol Ship To Horizontal Position", () => {
    const gameboard = new Gameboard("Player", 5);

    gameboard.placeShip(carrier, 0, 0, Gameboard.vertical); // (0,0), (0,1), (0, 2), (0, 3), (0, 4)

    const shipObj = gameboard.rotateShip(0, 0);
    const expected = {
      dir: "hor",
      ship: carrier,
      x1: 0,
      y1: 0,
    };
    expect(shipObj).toMatchObject(expected);
  });

  test("Gameboard Rotate Patrol Ship To Horizontal Out-of-Bounds Position", () => {
    const gameboard = new Gameboard("Player", 5);

    //gameboard.placeShip(carrier, 0, 0, Gameboard.vertical); // (0,0), (0,1), (0, 2), (0, 3), (0, 4)
    gameboard.placeShip(carrier, 4, 0, Gameboard.vertical); // (4,0), (4,1), (4, 2), (4, 3), (4, 4)

    const shipObj = gameboard.rotateShip(4, 0);
    expect(shipObj).toBeNull();
  });
  /*
  test("Gameboard Rotate Patrol Ship To Horizontal Occupied Position", () => {
    const gameboard = new Gameboard("Player", 5);

    gameboard.placeShip(carrier, 0, 0, Gameboard.vertical); // (0,0), (0,1), (0, 2), (0, 3), (0, 4)
    gameboard.placeShip(carrier, 4, 0, Gameboard.vertical); // (4,0), (4,1), (4, 2), (4, 3), (4, 4)

    const shipObj = gameboard.rotateShip(0, 0);
    expect(shipObj).toBeNull();
  });*/
});

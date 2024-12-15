import { Ship } from "./ship.js";

describe("Ship Test", () => {
  const patrolBoat = new Ship(2, "Patrol Boat");

  test("Ship Object Created", () => {
    expect(patrolBoat).toBeInstanceOf(Ship);
  });

  test("Ship Getters", () => {
    expect(patrolBoat.length).toBe(2);
    expect(patrolBoat.name).toBe("Patrol Boat");
  });

  test("Ship Sunk Checks", () => {
    expect(patrolBoat.isSunk()).toBe(false);
    expect(patrolBoat.hit()).toBe(1);

    expect(patrolBoat.isSunk()).toBe(false);
    expect(patrolBoat.hit()).toBe(2);
    expect(patrolBoat.isSunk()).toBe(true);
  });
});

import { PatrolBoat, Ship } from "./ship.js";

describe("Patrol Boat Test", () => {
  const patrolBoat = new PatrolBoat();

  test("Ship Object Created", () => {
    expect(patrolBoat).toBeInstanceOf(Ship);
  });

  test("Ship Getters", () => {
    expect(patrolBoat.length).toBe(2);
    expect(patrolBoat.name).toBe("Patrol Boat");
    expect(patrolBoat.id).toBe("patrol-boat");
  });

  test("Ship Sunk Checks", () => {
    expect(patrolBoat.isSunk()).toBe(false);
    expect(patrolBoat.hit()).toBe(1);

    expect(patrolBoat.isSunk()).toBe(false);
    expect(patrolBoat.hit()).toBe(2);
    expect(patrolBoat.isSunk()).toBe(true);
  });
});

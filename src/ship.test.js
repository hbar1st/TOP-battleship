import { Ship } from "./ship.js";

describe("Ship Test", () => {
  const patrolBoat = new Ship(2, "Patrol Boat");

  test("Ship Object Created", () => {
    expect(patrolBoat).toBeInstanceOf(Ship);
  });
});

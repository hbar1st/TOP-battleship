import { createHumanPlayer } from "./player.js";
import { Gameboard } from "./gameboard.js";

describe("Human Player Test", () => {
  const human = createHumanPlayer();

  test("Human Player Created", () => {
    expect(human.getBoard()).toBeInstanceOf(Gameboard);
  });
});

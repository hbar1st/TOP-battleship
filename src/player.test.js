import {
  createHumanPlayer,
  createComputerPlayer,
  isPlayerAComputer,
} from "./player.js";
import { Gameboard } from "./gameboard.js";

describe("Human Player Test", () => {
  const human = createHumanPlayer("Hana", "main-player");

  test("Human Player Created", () => {
    expect(human.getBoard()).toBeInstanceOf(Gameboard);
    expect(human.getName()).toBe("Hana");
    expect(human.getId()).toBe("main-player");
  });
});

describe("Computer Player Test", () => {
  const human = createHumanPlayer("Hana", "main-player");
  const computer = createComputerPlayer("opp-player");

  test("Computer Player Created", () => {
    expect(computer.getBoard()).toBeInstanceOf(Gameboard);
    expect(computer.getName()).toBe("The Computer");
    expect(computer.getId()).toBe("opp-player");
  });

  test("Computer Player Found", () => {
    expect(isPlayerAComputer(computer)).toBeTruthy();
  });

  test("Human Player Found", () => {
    expect(isPlayerAComputer(human)).toBeFalsy();
  });
});

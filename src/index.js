import "./styles.css";
import torpedoHit from "./torpedo-hits-ship.gif";
import torpedoMisses from "./torpedo-misses-ship.gif";

import {
  endGame,
  convertGridPairToCartesianPair,
  showElement,
  staggeredShowElement,
  makeShipEl,
} from "./elements.js";

import {
  createHumanPlayer,
  createComputerPlayer,
  isPlayerAComputer,
} from "./player.js";

import { Gameboard } from "./gameboard.js";

const landingDialog = document.querySelector("#landing-dialog");
const form = document.querySelector("form");
const mainPlayerName = document.querySelector("#main-player");
const opponentName = document.querySelector("#opp-name");

mainPlayerName.addEventListener("input", () => {
  if (mainPlayerName.value != "") {
    //shutoff the error popup if user typed something in
    mainPlayerName.setCustomValidity("");
  }
});

opponentName.addEventListener("input", () => {
  if (opponentName.value != "") {
    //shutoff the error popup if user typed something in
    opponentName.setCustomValidity("");
  }
});

const submitBtn = document.querySelector("form button");
submitBtn.addEventListener("click", (event) => {
  event.preventDefault();
  let opponentPlayer;
  //validate the form before commencing the game
  let valid = true;
  if (mainPlayerName.value === "") {
    mainPlayerName.setCustomValidity("Type in your name");
    mainPlayerName.reportValidity();
    valid = false;
  } else {
    mainPlayerName.setCustomValidity("");
  }
  const opponentChoices = form.elements.namedItem("opponent");
  //check which opponent was selected and if form is valid
  let checkedId = 0;
  opponentChoices.forEach((el) => (el.checked ? (checkedId = el.id) : false));
  console.log(checkedId);
  if (checkedId === "the-computer") {
    opponentPlayer = createComputerPlayer("opp-player");
  } else {
    //check name given
    const opponentName = document.querySelector("#opp-name");
    if (opponentName.value === "") {
      opponentName.setCustomValidity("Type in a name");
      opponentName.reportValidity();
      valid = false;
    } else {
      opponentName.setCustomValidity("");
      opponentPlayer = createHumanPlayer(opponentName.value, "opp-player");
    }
  }
  if (valid) {
    //setup the game boards
    const mainPlayer = createHumanPlayer(mainPlayerName.value, "main-player"); //always the human is the main player
    setupPlayerShips(mainPlayer, mainPlayer, opponentPlayer);
  }
});

/**
 *
 * @param {*} currentPlayer whichever player who's turn it is
 * @param {*} mainPlayer this will always be a human
 * @param {*} opponentPlayer this can be a human or a computer
 */
function setupPlayerShips(currentPlayer, mainPlayer, opponentPlayer) {
  const playerGrid = document.querySelector("#current-player-grid");

  const playerGridInstructions = makePlayerGridDisplay(playerGrid);

  const playerGridTitle = `<h1>${currentPlayer.getName()}'s board</h1>`;
  /**
     *         
     * <h1></h1>
        <h2></h2>
        <p>Click "play" to lock the board and start the game.</p>
        <input type="button" id="play" value="play" />
     */
  const playerGridSetupInstructions = `<h2>Let's setup your board! If you like the current random setup, click "play" to continue the game. Otherwise, click on a ship to toggle motion type (move vs. rotate). Use the anchor to drag. Or click the anchor to rotate.</h2>`;
  const playerGridLockParagraph = `<p>Click "play" to lock the board and start the game.</p>`;
  const playerGridLockButton = document.createElement("input");
  playerGridLockButton.setAttribute("type", "button");
  if (currentPlayer === mainPlayer) {
    playerGridLockButton.setAttribute("id", currentPlayer.getId()); //allow opponent to do a ship setup
  } else {
    playerGridLockButton.setAttribute("id", `${mainPlayer.getId()}-turn`); //switch turns
  }
  playerGridLockButton.setAttribute("value", "play");

  function handlePlay(e) {
    play(e, mainPlayer, opponentPlayer);
  }

  if (isPlayerAComputer(opponentPlayer)) {
    playerGridLockButton.addEventListener("click", handlePlay, once);
  } else {
    if (currentPlayer === mainPlayer) {
      // allow the other human opponent to setup their board!
      playerGridLockButton.addEventListener("click", () => {
        playerGrid.classList.remove("show", "pre-show");
        playerGrid.classList.add("hide");
        setTimeout(() => {
          setupPlayerShips(opponentPlayer, mainPlayer, opponentPlayer);
        }, 500);
      });
    } else {
      playerGridLockButton.addEventListener("click", handlePlay, once);
    }
  }
  playerGridInstructions.innerHTML = playerGridTitle;
  playerGridInstructions.innerHTML += playerGridSetupInstructions;
  playerGridInstructions.innerHTML += playerGridLockParagraph;
  playerGridInstructions.appendChild(playerGridLockButton);
  playerGrid.classList.add("pre-show"); //scales the element to hide it
  const gridEl = document.querySelector("#current-player-grid .grid");
  displayShipsGrid(gridEl, currentPlayer);
  landingDialog.classList.add("hide");
  showElement(playerGrid);
}

function makePlayerGridDisplay(parentEl) {
  parentEl.classList.add("pre-show");
  parentEl.classList.remove("show", "hide");
  const instructionsEl = document.createElement("div");
  instructionsEl.classList.add("instructions");
  parentEl.innerHTML = ""; //clear out the old elements
  parentEl.appendChild(instructionsEl);
  addGridEl(parentEl);
  return instructionsEl;
}

function addGridEl(parentEl) {
  const gridEl = document.createElement("div");
  gridEl.classList.add("grid");
  parentEl.appendChild(gridEl);
  return gridEl;
}

/**
 *
 * @param {*} e
 * @param {*} gameboard the target board (of whoever is not the currentPlayer)
 * @param {*} grid the .grid element used for targetting
 * @param {*} handler the listener for torpedos
 */
function torpedo(e, gameboard, grid) {
  const row = e.target.style.gridRow;
  const col = e.target.style.gridColumn;
  if (
    e.target.classList.contains("cell") &&
    !e.target.classList.contains("hit") &&
    !e.target.classList.contains("miss")
  ) {
    const xyPair = convertGridPairToCartesianPair(gameboard, row, col);
    const hitAShip = gameboard.receiveAttack(xyPair.x, xyPair.y);
    if (hitAShip) {
      //show fire emoji in that spot
      e.target.classList.add("hit");
      if (hitAShip.isSunk()) {
        const shipEl = document.querySelector(
          `#current-player-grid .${hitAShip.id}`
        );
        shipEl.classList.add("sunk");
        shipEl.classList.remove("hidden");
      }
    } else {
      //show water emoji in that spot
      e.target.classList.add("miss");
    }

    if (!gameboard.allShipsSunk()) {
      const nextBtn = document.querySelector(".instructions>input");

      nextBtn.classList.remove("hide");
      nextBtn.classList.add("show");
    }
  }
}

function play(e, mainPlayer, oppPlayer) {
  const parentEl = document.querySelector("#current-player-grid");

  const fleetStatusEl = document.querySelector("#fleet-status");
  let currentPlayer;
  if (e.target.id === "main-player") {
    currentPlayer = mainPlayer;
  } else if (e.target.id === "opp-player") {
    currentPlayer = oppPlayer;
  } else if (e.target.id === "main-player-turn") {
    currentPlayer = mainPlayer;
  } else {
    currentPlayer = oppPlayer;
  }
  console.log("e.target.id = ", e.target.id);
  console.log("currentPlayer = ", currentPlayer.getName());

  function throwATorpedo(e) {
    console.log(`${currentPlayer.getName()} throws a torpedo at ?`);

    currentPlayer === mainPlayer
      ? console.log(`${oppPlayer.getName()}`)
      : console.log(`${mainPlayer.getName()}`);

    const targetBoard =
      currentPlayer === mainPlayer
        ? oppPlayer.getBoard()
        : mainPlayer.getBoard();

    const parentEl = document.querySelector("#current-player-grid");
    torpedo(e, targetBoard, parentEl);

    if (targetBoard.allShipsSunk()) {
      endGame(currentPlayer, oppPlayer);
    }
  }

  //we need to let the main player play if id is main-player
  // if opponent is computer we skip some steps
  const computerIsPlaying = isPlayerAComputer(oppPlayer);
  let playerInstructions;
  let nextButton;

  if (e.target.id === "opp-player" && computerIsPlaying) {
    parentEl.classList.remove("show");
    fleetStatusEl.classList.remove("show");
    parentEl.classList.add("hide");
    fleetStatusEl.classList.add("hide");

    // during computer's turn, computer must try to throw a torpedo
    // TODO add some intelligence to the choices the computer makes
    // for now, the torpedos are randomly selected from valid locations
    const gameboard = mainPlayer.getBoard();
    const hitAShip = oppPlayer.computerAttacks(gameboard);

    const computerTurnDialog = document.querySelector("#computer-turn");
    const computerMessageEl = document.querySelector("#computer-message");
    const torpedoGif = document.querySelector("#torpedo-gif");
    const computerTurnButton = document.querySelector("#computer-turn button");
    computerTurnButton.setAttribute("id", "main-player");
    if (hitAShip) {
      if (hitAShip.isSunk()) {
        if (gameboard.allShipsSunk()) {
          endGame(currentPlayer, mainPlayer);
        } else {
          //show sinking ship dialog //TODO test when ship sinks
          const computerSinksBoatDialog = document.querySelector(
            "#computer-sinks-your-boat"
          );
          const computerSinksBoatButton = document.querySelector(
            "#computer-sinks-your-boat button"
          );
          computerSinksBoatButton.addEventListener(
            "click",
            (e) => {
              computerSinksBoatDialog.close();
              humansTurn(e, mainPlayer, oppPlayer);
            },
            once
          );
          computerSinksBoatDialog.show();
        }
      } else {
        //show dialog for hitting a ship
        computerMessageEl.innerText = `The Computer manages to hit your ${hitAShip.name}!`;
        torpedoGif.setAttribute("src", torpedoHit);
        computerTurnButton.addEventListener(
          "click",
          (e) => {
            computerTurnDialog.close();
            humansTurn(e, mainPlayer, oppPlayer);
          },
          once
        );
        computerTurnDialog.showModal();
      }
    } else {
      //show missed ship dialog //TODO test this
      torpedoGif.setAttribute("src", torpedoMisses);
      computerMessageEl.innerText = `The Computer tries but fails to hit any of your ships!`;
      computerTurnButton.addEventListener(
        "click",
        (e) => {
          computerTurnDialog.close();
          humansTurn(e, mainPlayer, oppPlayer);
        },
        once
      );
      computerTurnDialog.showModal();
    }
  } else {
    const instructionsEl = makePlayerGridDisplay(parentEl);
    //gridEl has to always be retrieved after the makePlayerGridDisplay!!! (breakable code!)
    const gridEl = document.querySelector("#current-player-grid .grid");

    if (
      e.target.id !== "main-player-turn" &&
      e.target.id !== "opp-player-turn"
    ) {
      parentEl.classList.add("pre-show"); //scales the element to hide it
      gridEl.addEventListener("click", throwATorpedo, once); //send opponent's board to be targeted
      showElement(parentEl);
      fleetStatusEl.classList.add("pre-show");
      fleetStatusEl.innerHTML = ""; //clear out the old elements
      fleetStatusEl.innerHTML = "<h3>Your Fleet Status</h3>";
      displayShipsGrid(addGridEl(fleetStatusEl), currentPlayer, true);
      showElement(fleetStatusEl);
    } else {
      parentEl.classList.remove("show");
      fleetStatusEl.classList.remove("show");
      parentEl.classList.add("hide");
      fleetStatusEl.classList.add("hide");
    }

    if (
      e.target.id === "main-player" ||
      (e.target.id === "opp-player" && !computerIsPlaying)
    ) {
      playerInstructions = `<h1>${currentPlayer.getName()}'s Target board</h1><details><summary>Instructions</summary><p>Clicking a cell will shoot a torpedo at that location.</p>`;
      if (!computerIsPlaying) {
        playerInstructions += `<p>After you're done click "next", then hand your device over to the other player.</p></details>`;
      } else {
        playerInstructions += `<p>After you're done click "next"</p></details>`;
      }
      nextButton = document.createElement("input");
      nextButton.setAttribute("type", "button");
      if (e.target.id === "main-player") {
        computerIsPlaying
          ? nextButton.setAttribute("id", "opp-player")
          : nextButton.setAttribute("id", "opp-player-turn"); //to show a waiting screen
      } else {
        computerIsPlaying
          ? nextButton.setAttribute("id", "main-player")
          : nextButton.setAttribute("id", "main-player-turn"); //to show a waiting screen
      }
      nextButton.setAttribute("value", "next");
      nextButton.addEventListener("click", (e) => {
        play(e, mainPlayer, oppPlayer);
      });
      currentPlayer === mainPlayer
        ? displayTargetGrid(gridEl, oppPlayer)
        : displayTargetGrid(gridEl, mainPlayer);

      instructionsEl.innerHTML = playerInstructions;
      if (nextButton) {
        nextButton.classList.add("hide");
        nextButton.classList.remove("show", "pre-show");
        instructionsEl.appendChild(nextButton);
      }
    } else if (
      e.target.id === "main-player-turn" ||
      e.target.id === "opp-player-turn"
    ) {
      //display hold page with a button to allow players to hand each other the computer
      //
      //<button type="button">Let's go!</button>
      displayYourTurnPane(currentPlayer, mainPlayer, oppPlayer);
    }
  }
}

const once = {
  once: true,
};

function humansTurn(e, mainPlayer, oppPlayer) {
  play(e, mainPlayer, oppPlayer);
}

function displayYourTurnPane(currentPlayer, mainPlayer, oppPlayer) {
  const yourTurnDialog = document.querySelector("#your-turn-dialog");
  const yourTurnDialogBtn = document.querySelector(
    "#your-turn-dialog>div>button"
  );
  if (e.target.id === "main-player-turn") {
    yourTurnDialogBtn.setAttribute("id", "main-player");
  } else {
    yourTurnDialogBtn.setAttribute("id", "opp-player");
  }
  const playerNameEl = document.querySelector("#player-name");
  playerNameEl.innerText = `${currentPlayer.getName()}`;

  function nextTurn(e) {
    yourTurnDialog.close();
    play(e, mainPlayer, oppPlayer);
  }

  yourTurnDialogBtn.addEventListener("click", nextTurn, once);

  yourTurnDialog.showModal();
  const dialogDivs = document.querySelectorAll("#your-turn-dialog>div>*");
  staggeredShowElement(dialogDivs);
}

function displayTargetGrid(gridEl, oppPlayer) {
  console.log(
    "try to display the ",
    oppPlayer.getName(),
    "'s fleet hits/misses"
  );
  const gameboard = oppPlayer.getBoard();

  let rowLabel = 0;
  let colLabel = "A".charCodeAt(0);
  let gridArr = []; // a grid array of divs

  gameboard.ships.forEach((shipSpot) => {
    const div = makeShipEl(shipSpot, oppPlayer, true);
    if (shipSpot.ship.isSunk()) {
      div.classList.add("sunk");
      div.classList.remove("hidden");
    } else {
      div.classList.add("hidden");
    }
    gridEl.appendChild(div);
  });

  for (let i = 0; i < gameboard.size + 1; i++) {
    const row = [];
    for (let j = 0; j < gameboard.size + 1; j++) {
      const div = document.createElement("div");
      if (i === gameboard.size && j !== 0) {
        div.innerText = rowLabel;
        div.classList.add("label");
        rowLabel++;
      }
      if (j === 0 && i < gameboard.size) {
        div.innerText = String.fromCharCode(colLabel);
        div.classList.add("label");
        colLabel++;
      }
      if (j === 0 && i === gameboard.size) {
        div.classList.add("label");
      }
      if (!div.classList.contains("label")) {
        div.classList.add("cell");
      }
      row.push(div);
    }
    gridArr.push(row);
  }
  let mirrorboard = [];
  for (let i = gameboard.size; i >= 0; i--) {
    mirrorboard.push(gridArr[i]);
  }

  for (let i = 0; i < gameboard.size + 1; i++) {
    for (let j = 0; j < gameboard.size + 1; j++) {
      mirrorboard[i][j].style.gridRow = i + 1;
      mirrorboard[i][j].style.gridColumn = j + 1;

      if (mirrorboard[i][j].classList.contains("cell")) {
        const hits = gameboard.hits;
        const misses = gameboard.misses;
        const xyPair = convertGridPairToCartesianPair(gameboard, i + 1, j + 1);
        const missedPair = misses.filter(
          (el) => el.x === xyPair.x && el.y === xyPair.y
        );

        const hitsPair = hits.filter(
          (el) => el.x === xyPair.x && el.y === xyPair.y
        );

        if (missedPair.length) {
          mirrorboard[i][j].classList.add("miss");
        } else if (hitsPair.length) {
          mirrorboard[i][j].classList.add("hit");
        }
      }
      gridEl.appendChild(mirrorboard[i][j]);
    }
  }
}

/**
 * Displays a grid with the current player's ships on it
 * The ships may be 'responsive' to user interaction or they may not be responsive based on the flag.
 * Responsive ships allow the user to toggle between rotation/move modes and modify the ship locations
 * and direction/alignment
 *
 * @param {*} gridEl the div.grid element
 * @param {*} currentPlayer
 * @param {*} unresponsive set to true if displaying the board after the game has started (setup done earlier)
 */
function displayShipsGrid(gridEl, currentPlayer, unresponsive = false) {
  const gameboard = currentPlayer.getBoard();
  const ships = gameboard.ships;
  let rowLabel = 0;
  let colLabel = "A".charCodeAt(0);
  let gridArr = []; // a grid array of divs

  ships.forEach((shipSpot) => {
    const div = makeShipEl(shipSpot, currentPlayer, unresponsive);
    if (shipSpot.ship.isSunk()) {
      div.classList.add("sunk");
    }
    gridEl.appendChild(div);
  });

  for (let i = 0; i < gameboard.size + 1; i++) {
    const row = [];
    for (let j = 0; j < gameboard.size + 1; j++) {
      const div = document.createElement("div");
      if (i === gameboard.size && j !== 0) {
        div.innerText = rowLabel;
        div.classList.add("label");
        rowLabel++;
      }
      if (j === 0 && i < gameboard.size) {
        div.innerText = String.fromCharCode(colLabel);
        div.classList.add("label");
        colLabel++;
      }
      if (j === 0 && i === gameboard.size) {
        div.classList.add("label");
      }
      if (!div.classList.contains("label")) {
        div.classList.add("cell");
      }
      row.push(div);
    }
    gridArr.push(row);
  }

  let mirrorboard = [];
  for (let i = gameboard.size; i >= 0; i--) {
    mirrorboard.push(gridArr[i]);
  }

  for (let i = 0; i < gameboard.size + 1; i++) {
    for (let j = 0; j < gameboard.size + 1; j++) {
      mirrorboard[i][j].style.gridRow = i + 1;
      mirrorboard[i][j].style.gridColumn = j + 1;

      if (!unresponsive && !mirrorboard[i][j].classList.contains("label")) {
        mirrorboard[i][j].addEventListener("dragenter", (e) => {
          e.preventDefault();
        });
        mirrorboard[i][j].addEventListener("dragover", (e) => {
          e.preventDefault();
        });
        mirrorboard[i][j].addEventListener("drop", (e) => {
          const row = e.target.style.gridRowStart;
          const col = e.target.style.gridColumnStart;
          const id = e.dataTransfer.getData("text/plain");
          const mouseLoc = e.dataTransfer.getData("mouseLoc");
          //find out if the locations we are dropping into are free
          let x1 = Number(col);
          let y1 = Number(row);
          const shipData = gameboard.getShipById(id);
          if (shipData === null) {
            console.log("We have a bug here");
            return;
          }
          if (shipData.dir === Gameboard.horizontal) {
            if (mouseLoc === "center") {
              const delta = Math.floor(shipData.ship.length / 2);
              x1 = x1 - delta;
            } else if (mouseLoc === "right") {
              const delta = Math.floor(shipData.ship.length / 2);
              x1 = x1 - shipData.ship.length + delta;
            }
          } else {
            if (mouseLoc === "center") {
              const delta = Math.floor(shipData.ship.length / 2);
              y1 = y1 + delta;
            } else if (mouseLoc === "top") {
              const delta = Math.floor(shipData.ship.length / 2);
              y1 = y1 + shipData.ship.length - delta;
            }
          }

          const shipEl = document.querySelector(`#${id}`);
          //if spots are free, then update the gridRow & gridColumn of the ship
          if (shipData.dir === Gameboard.horizontal) {
            let placed = false;
            let maxTries = gameboard.size * 2;
            let x = x1 - 2;
            let y = gameboard.size - y1 + 1;
            do {
              maxTries--;
              placed = gameboard.placeShip(
                shipData.ship,
                x,
                y,
                Gameboard.horizontal
              );
              if (!placed) {
                if (x + shipData.ship.length > gameboard.size) {
                  x--;
                }
                if (x < 0) {
                  x++;
                }
              }
            } while (!placed && maxTries > 0);
            if (placed) {
              const col = x + 2;
              const row = gameboard.size - y + 1;
              shipEl.style.gridColumn = `${col} / span ${shipData.ship.length}`;
              shipEl.style.gridRow = row;
              shipEl.setAttribute("data-dir", "hor");
              shipEl.setAttribute("data-x1", x); //0-based col in ship array
              shipEl.setAttribute("data-y1", y); //0-based row in ship array
            }
          } else {
            let placed = false;
            let maxTries = gameboard.size * 2;
            let x = x1 - 2;
            let y = gameboard.size - y1 + 1;
            do {
              maxTries--;
              placed = gameboard.placeShip(
                shipData.ship,
                x,
                y,
                Gameboard.vertical
              );
              if (!placed) {
                if (y + shipData.ship.length > gameboard.size) {
                  y--;
                }
                if (y < 0) {
                  y++;
                }
              }
            } while (!placed && maxTries > 0);
            if (placed) {
              shipData.x1 = x;
              shipData.y1 = y;
              const col = x + 2;
              const row = gameboard.size - y + 2 - shipData.ship.length;
              shipEl.style.gridColumn = col;
              shipEl.style.gridRow = `${row} / span ${shipData.ship.length}`;
              shipEl.setAttribute("data-dir", "ver");
              shipEl.setAttribute("data-x1", x); //0-based col in ship array
              shipEl.setAttribute("data-y1", y); //0-based row in ship array
            }
          }
        });
      }

      if (unresponsive && mirrorboard[i][j].classList.contains("cell")) {
        const hits = gameboard.hits;
        const xyPair = convertGridPairToCartesianPair(gameboard, i + 1, j + 1);

        const hitsPair = hits.filter(
          (el) => el.x === xyPair.x && el.y === xyPair.y
        );
        if (hitsPair.length) {
          mirrorboard[i][j].classList.add("hit");
        }
      }
      gridEl.appendChild(mirrorboard[i][j]);
    }
  }

  //console.log(gameboard.getBoardArray());
}

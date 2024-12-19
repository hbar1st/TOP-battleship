import "./styles.css";
import rotateIcon from "./rotate.svg";
import moveIcon from "./move.svg";

import {
  createHumanPlayer,
  createComputerPlayer,
  isPlayerAComputer,
} from "./player.js";
import { Gameboard } from "./gameboard.js";

//create the main human player

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

function setupPlayerShips(currentPlayer, mainPlayer, opponentPlayer) {
  makePlayerGridDisplay();
  const playerGrid = document.querySelector("#current-player-grid");

  const playerGridInstructions = document.querySelector(
    "#current-player-grid>.instructions"
  );

  const playerGridTitle = `<h1>${currentPlayer.getName()}'s board</h1>`;
  /**
     *         
     * <h1></h1>
        <h2></h2>
        <p>Click "play" to lock the board and start the game.</p>
        <input type="button" id="play" value="play" />
     */
  const playerGridSetupInstructions = `<h2>Let's setup your board! Click on a ship to toggle motion type (move vs. rotate). Use the anchor to drag. Or click the anchor to rotate.</h2>`;
  const playerGridLockParagraph = `<p>Click "play" to lock the board and start the game.</p>`;
  const playerGridLockButton = document.createElement("input");
  playerGridLockButton.setAttribute("type", "button");
  if (currentPlayer === mainPlayer) {
    playerGridLockButton.setAttribute("id", currentPlayer.getId()); //allow opponent to do a ship setup
  } else {
    playerGridLockButton.setAttribute("id", `${mainPlayer.getId()}-turn`); //switch turns
  }
  playerGridLockButton.setAttribute("value", "play");
  if (isPlayerAComputer(opponentPlayer)) {
    playerGridLockButton.addEventListener("click", (e) => {
      play(e, mainPlayer, opponentPlayer);
    });
  } else {
    if (currentPlayer === mainPlayer) {
      // allow the human opponent to setup their board!
      playerGridLockButton.addEventListener("click", () => {
        playerGrid.classList.remove("show");
        playerGrid.classList.add("hide");
        setTimeout(() => {
          setupPlayerShips(opponentPlayer, mainPlayer, opponentPlayer);
        }, 500);
      });
    } else {
      playerGridLockButton.addEventListener("click", (e) => {
        play(e, mainPlayer, opponentPlayer);
      });
    }
  }
  playerGridInstructions.innerHTML = playerGridTitle;
  playerGridInstructions.innerHTML += playerGridSetupInstructions;
  playerGridInstructions.innerHTML += playerGridLockParagraph;
  playerGridInstructions.appendChild(playerGridLockButton);
  playerGrid.classList.add("pre-show"); //scales the element to hide it
  const gridEl = document.querySelector("#current-player-grid>#grid");
  displayShipsGrid(gridEl, currentPlayer);
  landingDialog.classList.add("hide");
  showElement(playerGrid);
}

function showElement(el, timeout = 0) {
  setTimeout(() => {
    el.classList.remove("pre-show");
    el.classList.remove("hide");
    el.classList.add("show");
  }, timeout);
}

function staggeredShowElement(elList) {
  console.log(elList);
  const timedShow = (el, timeout) => {
    setTimeout(() => {
      el.classList.remove("pre-show");
      el.classList.remove("hide");
      el.classList.add("show");
    }, timeout);
  };
  elList.forEach(async (el, i) => {
    await timedShow(el, (i + 2) * 100);
  });
}

function makePlayerGridDisplay() {
  const parentEl = document.querySelector("#current-player-grid");
  const instructionsEl = document.createElement("div");
  instructionsEl.classList.add("instructions");
  const gridEl = document.createElement("div");
  gridEl.setAttribute("id", "grid");
  parentEl.innerHTML = ""; //clear out the old elements
  parentEl.appendChild(instructionsEl);
  parentEl.appendChild(gridEl);
}

function play(e, mainPlayer, oppPlayer) {
  makePlayerGridDisplay();
  const fleetStatusEl = document.querySelector("#fleet-status");
  const currentPlayer = e.target.id === "main-player" ? mainPlayer : oppPlayer;
  const parentEl = document.querySelector("#current-player-grid");
  if (e.target.id !== "main-player-turn" && e.target.id !== "opp-player-turn") {
    parentEl.classList.add("pre-show"); //scales the element to hide it
    showElement(parentEl);

    showElement(fleetStatusEl);
  } else {
    parentEl.classList.remove("show");
    fleetStatusEl.classList.remove("show");
    parentEl.classList.add("hide");
    fleetStatusEl.classList.add("hide");
  }
  const gridEl = document.querySelector("#current-player-grid>#grid");

  const instructionsEl = document.querySelector(
    "#current-player-grid>.instructions"
  );
  console.log(e.target.id);
  //we need to let the main player play if id is main-player
  // if id is main-player-done then we show a splash with a button to allow next player to click and play
  // if id is opp-player-done then we show a splash with a button to allow main player to click and play
  // if opponent is computer we skip some steps
  const computerIsPlaying = isPlayerAComputer(oppPlayer);
  let playerInstructions;
  let nextButton;

  if (
    e.target.id === "main-player" ||
    (e.target.id === "opp-player" && !computerIsPlaying)
  ) {
    playerInstructions = `<h1>${currentPlayer.getName()}'s Target board</h1><p>Clicking a cell will shoot a torpedo at that location.</p>`;
    if (!computerIsPlaying) {
      playerInstructions += `<p>After you're done click "next", then hand your device over to the other player.</p>`;
    } else {
      playerInstructions += `<p>After you're done click "next"</p>`;
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
    displayTargetGrid(gridEl, mainPlayer);
  } else if (e.target.id === "opp-player" && isPlayerAComputer(oppPlayer)) {
    //computer plays
    console.log("Computer's turn!");
  } else if (
    e.target.id === "main-player-turn" ||
    e.target.id === "opp-player-turn"
  ) {
    //display hold page with a button to allow players to hand each other the computer
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
    playerNameEl.innerText = `${mainPlayer.getName()}`;
    yourTurnDialogBtn.addEventListener("click", (e) => {
      yourTurnDialog.close();
      play(e, mainPlayer, oppPlayer);
    });

    yourTurnDialog.showModal();
    const dialogDivs = document.querySelectorAll("#your-turn-dialog>div>*");
    staggeredShowElement(dialogDivs);
  }
  instructionsEl.innerHTML = playerInstructions;
  if (nextButton) {
    instructionsEl.appendChild(nextButton);
  }

  //display a summary of hits against the fleet
}

function displayTargetGrid(gridEl, currentPlayer) {
  const gameboard = currentPlayer.getBoard();

  let rowLabel = 0;
  let colLabel = "A".charCodeAt(0);
  let gridArr = []; // a grid array of divs

  const fireEmoji = "🔥";
  const waterEmoji = "💧";

  //TODO handle misses and hits display!!
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

      gridEl.appendChild(mirrorboard[i][j]);
    }
  }
}

function displayShipsGrid(gridEl, currentPlayer) {
  const gameboard = currentPlayer.getBoard();
  const ships = gameboard.ships;
  let rowLabel = 0;
  let colLabel = "A".charCodeAt(0);
  let gridArr = []; // a grid array of divs

  ships.forEach((shipSpot) => {
    const div = makeShipEl(shipSpot, currentPlayer);
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
      if (!mirrorboard[i][j].classList.contains("label")) {
        mirrorboard[i][j].addEventListener("dragenter", (e) => {
          console.log("dragenter: ", e.target);
          e.preventDefault();
        });
        mirrorboard[i][j].addEventListener("dragover", (e) => {
          console.log("dragover: ", e.target.style.gridArea);
          e.preventDefault();
        });
        mirrorboard[i][j].addEventListener("drop", (e) => {
          console.log("drop: ", e.target);
          const row = e.target.style.gridRowStart;
          const col = e.target.style.gridColumnStart;
          const id = e.dataTransfer.getData("text/plain");
          const mouseLoc = e.dataTransfer.getData("mouseLoc");
          console.log(
            "dataTransfer: ",
            id,
            "mouseLoc: ",
            mouseLoc,
            "target row/col: ",
            row,
            col
          );
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
              console.log("new shipEl: ", shipEl);
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
              console.log("shipData: ", shipData);
              shipData.x1 = x;
              shipData.y1 = y;
              const col = x + 2;
              const row = gameboard.size - y + 2 - shipData.ship.length;
              shipEl.style.gridColumn = col;
              shipEl.style.gridRow = `${row} / span ${shipData.ship.length}`;
              shipEl.setAttribute("data-dir", "ver");
              shipEl.setAttribute("data-x1", x); //0-based col in ship array
              shipEl.setAttribute("data-y1", y); //0-based row in ship array
              console.log("new shipEl: ", shipEl);
            }
          }
          console.log(shipData);
        });
      }
      gridEl.appendChild(mirrorboard[i][j]);
    }
  }

  console.log(gameboard.getBoardArray());
}

function shiftMode(e, currentPlayer) {
  if (e.target.classList.contains("ship")) {
    const child = e.target.children.item(0);
    const shipEl = e.target;

    if (!child || (child && child.id === "rotate-anchor")) {
      shipEl.setAttribute("draggable", "true");
      shipEl.addEventListener("dragstart", (event) => {
        console.log(event.clientX, event.clientY);
        const rect = shipEl.getBoundingClientRect();
        let mouseLoc = "right";
        if (shipEl.getAttribute("data-dir") === Gameboard.horizontal) {
          const center = Math.round(rect.left + rect.width / 2);
          if (event.clientX > center) {
            // user picked up the ship from the right
            mouseLoc = "right";
          } else if (event.clientX === center) {
            //user picked up the ship from the center
            mouseLoc = "center";
          } else {
            //user picked up the ship from the left
            mouseLoc = "left";
          }
        } else {
          //handle vertical ships
          const center = Math.round(rect.top + rect.height / 2);
          if (event.clientY > center) {
            // user picked up the ship from the right
            mouseLoc = "bottom";
          } else if (event.clientY === center) {
            //user picked up the ship from the center
            mouseLoc = "center";
          } else {
            //user picked up the ship from the left
            mouseLoc = "top";
          }
        }
        event.dataTransfer.setData("mouseLoc", mouseLoc);
        event.dataTransfer.setData("text/plain", shipEl.id);
      });
      shipEl.style.cursor = "grab";
      const moveImg = document.createElement("img");
      moveImg.setAttribute("src", `${moveIcon}`);
      moveImg.setAttribute("alt", "move ship");
      moveImg.classList.add("ship-anchor");
      moveImg.setAttribute("id", "move-anchor");
      child
        ? e.target.replaceChild(moveImg, child)
        : e.target.appendChild(moveImg);
    }
    if (child && child.id === "move-anchor") {
      shipEl.setAttribute("draggable", "false");
      shipEl.style.cursor = "pointer";
      const rotateImg = createRotationImg(currentPlayer);
      e.target.replaceChild(rotateImg, child);
    }
  }
}

function createRotationImg(currentPlayer) {
  const rotateImg = document.createElement("img");
  rotateImg.setAttribute("src", `${rotateIcon}`);
  rotateImg.setAttribute("alt", "rotate ship");
  rotateImg.classList.add("ship-anchor");
  rotateImg.setAttribute("id", "rotate-anchor");
  rotateImg.addEventListener("click", (e) => {
    rotateShip(e, currentPlayer);
  });
  return rotateImg;
}

function rotateShip(e, currentPlayer) {
  console.log(e.target);
  console.log(e.target.parentElement);

  const shipEl = e.target.parentElement;
  const dir = shipEl.getAttribute("data-dir");
  const x1 = Number(shipEl.getAttribute("data-x1"));
  const y1 = Number(shipEl.getAttribute("data-y1"));

  const gameboard = currentPlayer.getBoard();
  const rotatedShipObj = gameboard.rotateShip(x1, y1);
  //if the rotated ship is in a different location, then replace the old ship element
  if (
    rotatedShipObj.dir !== dir ||
    rotatedShipObj.x1 !== x1 ||
    rotatedShipObj.y1 !== y1
  ) {
    const rotatedShipEl = makeShipEl(rotatedShipObj, currentPlayer);
    const rotateImg = createRotationImg(currentPlayer);
    rotatedShipEl.appendChild(rotateImg);
    shipEl.parentElement.replaceChild(rotatedShipEl, shipEl);
  }
}

function makeShipEl(shipSpot, currentPlayer) {
  const gameboard = currentPlayer.getBoard();
  const div = document.createElement("div");
  div.classList.add("ship", shipSpot.ship.id);
  div.setAttribute("id", shipSpot.ship.id);
  div.addEventListener("click", (e) => {
    shiftMode(e, currentPlayer);
  });
  if (shipSpot.dir === "hor") {
    div.style.gridColumn = `${shipSpot.x1 + 2} / span ${shipSpot.ship.length}`;
    div.style.gridRow = gameboard.size - shipSpot.y1 + 1;
    div.setAttribute("data-dir", "hor");
    div.setAttribute("data-x1", shipSpot.x1);
    div.setAttribute("data-y1", shipSpot.y1);
    div.classList.add("vmargin");
  } else {
    div.style.gridRow = `${
      gameboard.size - shipSpot.ship.length - shipSpot.y1 + 2
    } / span ${shipSpot.ship.length}`;
    div.style.gridColumn = 2 + shipSpot.x1;
    div.setAttribute("data-dir", "ver");
    div.setAttribute("data-x1", shipSpot.x1);
    div.setAttribute("data-y1", shipSpot.y1);
    div.classList.add("hmargin");
  }
  return div;
}

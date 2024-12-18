import "./styles.css";
import rotateIcon from "./rotate.svg";
import moveIcon from "./move.svg";

import { createHumanPlayer, createComputerPlayer } from "./player.js";
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

const submitBtn = document.querySelector("button");
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
    opponentPlayer = createComputerPlayer();
  } else {
    //check name given
    const opponentName = document.querySelector("#opp-name");
    if (opponentName.value === "") {
      opponentName.setCustomValidity("Type in a name");
      opponentName.reportValidity();
      valid = false;
    } else {
      opponentName.setCustomValidity("");
      opponentPlayer = createHumanPlayer(opponentName.value);
    }
  }
  if (valid) {
    //commence the game
    const mainPlayer = createHumanPlayer(mainPlayerName.value); //always the human is the main player
    const mainPlayerGridTitle = document.querySelector("#main-player-grid>h1");
    mainPlayerGridTitle.innerText = `${mainPlayer.getName()}'s board`;
    const mainPlayerGridInstructions = document.querySelector(
      "#main-player-grid>h2"
    );
    mainPlayerGridInstructions.innerText =
      "Let's setup your board! Click on a ship to toggle motion type (move vs. rotate). Use the anchor to drag. Or click the anchor to rotate.";
    const gridEl = document.querySelector("#main-player-grid>#grid");
    formNewGrid(gridEl, mainPlayer);
    landingDialog.style.display = "none";
    const mainPlayerGrid = document.querySelector("#main-player-grid");

    mainPlayerGrid.style.display = "inline-block";
  }
});

function formNewGrid(gridEl, currentPlayer) {
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
          const id = e.dataTransfer.getData("text/plain");
          console.log("dataTransfer: ", id);
          //find out if the locations we are dropping into are free

          //if spots are free, then update the gridRow & gridColumn of the ship
          const ship = document.querySelector(`#${id}`);
          console.log("shipEl: ", ship);
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

/*
function gridFree(gameboard, row, column, x1, y1, shiplength, shipdir) {
    if (row < 2 || column < 2 || row > gameboard.size +2 || column > gameboard.size +2) {
      return false;
    }
    // compile list of positions to check are free
    const positions = getIndicatedSpots(gameboard, row, column, shiplength, shipdir);
    if (positions === null) {
      return false;
    }
    // iterate over list of ships and compile occupied positions
    const shipPositions = getAllShipSpots(gameboard);

    let found = 0;
    positions.forEach((pos) => {
      const occupiedSpot = shipPositions.find((el) => {
        return el.x === pos.x && el.y === pos.y;
      });
      if (occupiedSpot) {
        found++;
      }
    });
    return found === 0;
}
*/

function getAllShipSpots(gameboard) {
  const shipPositions = [];
  gameboard.ships.forEach((shipPos) => {
    for (let i = 2; i < shipPos.ship.length + 2; i++) {
      shipPos.dir === "hor"
        ? shipPositions.push({ x: shipPos.x1 + i, y: shipPos.y1 })
        : shipPositions.push({ x: shipPos.x1, y: shipPos.y1 + i });
    }
  });
  return shipPositions;
}
// 12, 2 (equiv to 0,0, 0,1) ship lenth 2, dir hor
function getIndicatedSpots(gameboard, row, col, shiplength, shipdir) {
  const positions = [];
  for (let i = 2; i < shiplength + 2; i++) {
    if (shipdir === Gameboard.horizontal) {
      const y2 = col + i;
      if (y2 === gameboard.size) {
        return null; //out of bounds
      }
      positions.push({ x: row, y: y2 });
    } else {
      const x2 = row + i;
      if (x2 === gameboard.size) {
        return null; //out of bounds
      }
      positions.push({ x: x2, y: col });
    }
  }
  return positions;
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

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

  for (let i = 0; i < gameboard.size + 1; i++) {
    const row = [];
    for (let j = 0; j < gameboard.size + 1; j++) {
      const div = document.createElement("div");
      div.classList.add("cell");
      if (i === gameboard.size && j !== 0) {
        div.innerText = rowLabel;
        div.classList.add("label");
        div.classList.remove("cell");
        rowLabel++;
      }
      if (j === 0 && i < gameboard.size) {
        div.innerText = String.fromCharCode(colLabel);
        div.classList.add("label");

        div.classList.remove("cell");
        colLabel++;
      }
      row.push(div);
    }
    gridArr.push(row);
  }

  ships.forEach((shipSpot) => {
    /*
    for (let i = 0; i < shipSpot.ship.length; i++) {
      if (shipSpot.dir === "hor") {
        gridArr[shipSpot.y1][shipSpot.x1 + i].classList.add(
          shipSpot.ship.id,
          "vmargin"
        );

        if (i == 0) {
          gridArr[shipSpot.y1][shipSpot.x1].classList.add("tip");
        }
      } else {
        gridArr[shipSpot.y1 + i][shipSpot.x1].classList.add(
          shipSpot.ship.id,
          "hmargin"
        );
        if (i == 0) {
          gridArr[shipSpot.y1][shipSpot.x1].classList.add("vtip");
        }
      }
    }*/

    const div = makeShipEl(shipSpot, currentPlayer);
    gridEl.appendChild(div);
  });

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

  console.log(gameboard.getBoardArray());
}

function shiftMode(e, currentPlayer) {
  if (e.target.classList.contains("ship")) {
    const child = e.target.children.item(0);

    if (!child || (child && child.id === "rotate-anchor")) {
      const moveImg = document.createElement("img");
      moveImg.setAttribute("src", `${moveIcon}`);
      moveImg.setAttribute("alt", "move ship");
      moveImg.classList.add("ship-anchor");
      moveImg.setAttribute("id", "move-anchor");
      moveImg.addEventListener("mousedown", dragShip);
      child
        ? e.target.replaceChild(moveImg, child)
        : e.target.appendChild(moveImg);
    }
    if (child && child.id === "move-anchor") {
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
function dragShip(e, currentPlayer) {
  console.log(e.target);
  console.log(e.target.parentElement);
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

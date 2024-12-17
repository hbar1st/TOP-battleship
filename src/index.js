import "./styles.css";

import { createHumanPlayer, createComputerPlayer } from "./player.js";

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
    const gridEl = document.querySelector("#main-player-grid>#grid");
    formNewGrid(gridEl, mainPlayer.getBoard());
    landingDialog.style.display = "none";
    const mainPlayerGrid = document.querySelector("#main-player-grid");

    mainPlayerGrid.style.display = "inline-block";
  }
});

function formNewGrid(gridEl, gameboard) {
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

    const div = document.createElement("div");
    div.classList.add("ship", shipSpot.ship.id);
    if (shipSpot.dir === "hor") {
      // (3,2), (3, 3), (3,4) (3, 5) (3,6) row
      div.style.gridColumn = `${shipSpot.x1 + 2} / span ${
        shipSpot.ship.length
      }`;
      div.style.gridRow = gameboard.size - shipSpot.y1 + 1;
      div.classList.add("vmargin");
    } else {
      div.style.gridRow = `${
        gameboard.size - shipSpot.ship.length - shipSpot.y1 + 2
      } / span ${shipSpot.ship.length}`;
      div.style.gridColumn = 2 + shipSpot.x1;
      div.classList.add("hmargin");
    }
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

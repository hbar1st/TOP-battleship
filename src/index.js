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
  
  let gridArr = []; // a grid array of divs

  const div = document.createElement("div");
  div.classList.add("cell");
  for (let i = 0; i < gameboard.size; i++) {
    const row = [];
    for (let j = 0; j < gameboard.size; j++) {
      row.push(div.cloneNode());
    }
    gridArr.push(row);
  }

  ships.forEach((shipSpot) => {
    for (let i = 0; i < shipSpot.ship.length; i++) {
      shipSpot.dir === "hor"
        ? (gridArr[shipSpot.y1][shipSpot.x1 + i].classList.add(shipSpot.ship.name))
        : (gridArr[shipSpot.y1 + i][shipSpot.x1].classList.add(shipSpot.ship.name));
    }
  });

}

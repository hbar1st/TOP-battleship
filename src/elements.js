import rotateIcon from "./rotate.svg";
import moveIcon from "./move.svg";
import { isPlayerAComputer } from "./player.js";

export {
  convertGridPairToCartesianPair,
  showElement,
  staggeredShowElement,
  makeShipEl,
  createRotationImg,
  endGame,
};

import { Gameboard } from "./gameboard.js";

function showElement(el, timeout = 0) {
  setTimeout(() => {
    el.classList.remove("pre-show");
    el.classList.remove("hide");
    el.classList.add("show");
  }, timeout);
}

function staggeredShowElement(elList) {
  elList.forEach((el, i) => {
    showElement(el, (i + 2) * 100);
  });
}

function makeShipEl(shipSpot, currentPlayer, unresponsive) {
  const gameboard = currentPlayer.getBoard();
  //const div = document.createElement("div");
  const div = document.createElement("input");
  div.setAttribute("type", "button");
  div.classList.add("ship", shipSpot.ship.id);
  div.setAttribute("id", shipSpot.ship.id);
  if (!unresponsive) {
    div.addEventListener("click", (e) => {
      shiftMode(e, currentPlayer);
    });
  }
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

function convertGridPairToCartesianPair(gameboard, row, col) {
  let res = { x: 0, y: 0 };
  res.x = col - 2;
  res.y = gameboard.size - row + 1;
  return res;
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

function shiftMode(e, currentPlayer) {
  if (e.target.classList.contains("ship")) {
    const child = e.target.children.item(0);
    const shipEl = e.target;

    if (!child || (child && child.id === "rotate-anchor")) {
      shipEl.setAttribute("draggable", "true");
      shipEl.addEventListener("dragstart", (event) => {
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

function rotateShip(e, currentPlayer) {
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

function endGame(winner, loser) {
  if (isPlayerAComputer(winner)) {
    setTimeout(() => {
      alert(`The Computer has won! Sorry about that ${loser.getName()}!`);
    }, 10);
  } else {
    const winnerDiv = document.querySelector("#end-game");
    const winnerName = document.querySelector("#winner-name");
    const playbutton = document.querySelector("#play-again");
    const hidebutton = document.querySelector("#hide-pane");
    playbutton.addEventListener("click", () => {
      location.reload();
    });
    hidebutton.addEventListener("click", () => {
      winnerDiv.style.display = "none";
    });
    winnerName.innerText = `${winner.getName()}`;
    winnerDiv.style.display = "grid";
  }
}

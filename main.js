function characterSelectAndStartGame() {
  window.location.href = "./game.html";
}

function leftArrowPressed() {
  var element = document.getElementById("character");
  element.style.left = parseInt(element.style.left) - 10 + "px";
}

function rightArrowPressed() {
  var element = document.getElementById("character");
  element.style.left = parseInt(element.style.left) + 10 + "px";
}

function spaceBarPressed() {
  var element = document.getElementById("character");
  element.style.left = parseInt(element.style.left) + 10 + "px";
  element.style.bottom = parseInt(element.style.bottom) + 30 + "px";
}

function moveSelection(event) {
  switch (event.keyCode) {
    case 37:
      leftArrowPressed();
      break;
    case 39:
      rightArrowPressed();
      break;
    case 32:
      spaceBarPressed();
      break;
  }
}

function gameLoop() {
  // change position based on speed
  moveSelection();
  setTimeout("gameLoop()", 10);
  window.onload = function () {
    gameLoop();
  };
}

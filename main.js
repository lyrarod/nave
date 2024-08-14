import { Game } from "./game.js";

window.addEventListener("load", () => {
  let canvas = document.querySelector("canvas");
  let context = canvas.getContext("2d");
  let game = new Game(context);

  startBtn.onclick = () => {
    game.start();
    splash.style.display = "none";
    buttons.style.pointerEvents = "auto";
  };

  playagainbtn.onclick = () => {
    game.reset();
    playagainbtn.style.display = "none";
  };
});

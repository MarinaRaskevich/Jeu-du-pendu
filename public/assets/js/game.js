// Selectors
const wordContainer = document.querySelector("#word");
const lettersContaner = document.querySelector(".letters");
const winMessage = document.querySelector(".winMessage");
const loseMessage = document.querySelector(".loseMessage");
const allCells = document.querySelector("#word").childNodes;

// Initialisation des tentatives de jeu
let remainingAttempts = 10;

game();

// Selectors
const wordContainer = document.querySelector("#word");
const lettersContaner = document.querySelector(".letters");
const winMessage = document.querySelector(".winMessage");
const loseMessage = document.querySelector(".loseMessage");
const allCells = document.querySelector("#word").childNodes;
const gallowsContainer = document.querySelector("#gallows");
const btnNewWord = document.querySelector(".btn-newWord");

// Initialisation des tentatives de jeu
let remainingAttempts = 10;
const word = localStorage.getItem("randomWord");
let hiddenWord = Array(word.length).fill("_");

game();

btnNewWord.addEventListener("click", getNewWord);

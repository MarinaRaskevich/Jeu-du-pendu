// Selectors
const wordContainer = document.querySelector("#word");
const lettersContaner = document.querySelector(".letters");
const allCells = document.querySelector("#word").childNodes;
const gallowsContainer = document.querySelector("#gallows");
const buttonsForGetNewWord = document.querySelectorAll(".btn-replay");
const categoryNameHeading = document.querySelector("#categoryName");

// Initialisation des tentatives de jeu
let remainingAttempts = 10;
let chosenWord = localStorage.getItem("randomWord");
let collectionOfThisCategory = localStorage.getItem("collection");
collectionOfThisCategory = JSON.parse(collectionOfThisCategory);
let newCollection = collectionOfThisCategory;
const categoryName = localStorage.getItem("categoryName");
let hiddenWord = Array(word.length).fill("_");

game();

// Boutons pour obtenir un nouveau mot de cette catégorie
buttonsForGetNewWord.forEach((button) => {
  button.addEventListener("click", getNewWord);
});

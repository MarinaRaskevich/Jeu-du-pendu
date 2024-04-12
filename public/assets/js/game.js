// Selectors
const wordContainer = document.querySelector("#word");
const lettersContaner = document.querySelector(".letters");
const allCells = document.querySelector("#word").childNodes;
const gallowsContainer = document.querySelector("#gallows");
const buttonsForGetNewWord = document.querySelectorAll(".btn-replay");
const categoryNameHeading = document.querySelector("#categoryName");
const wordCounter = document.querySelector("#counter");

// Initialisation des tentatives de jeu
let remainingAttempts = 10;
// Nouveau mot de la catégorie sélectionnée
let chosenWord = localStorage.getItem("randomWord");
const chosenCategory = localStorage.getItem("id");
let userHistory = JSON.parse(localStorage.getItem("userHistory"));
const collectionOfThisCategory = userHistory.find(
  (element) => element.id == chosenCategory
).wordsCollection;
let newCollection = collectionOfThisCategory;
const categoryName = userHistory.find(
  (element) => element.id == chosenCategory
).categoryName;
let hiddenWord = Array(chosenWord.length).fill("_");
let guessedWordsCounter = 15 - newCollection.length;

game();

// Boutons pour obtenir un nouveau mot de cette catégorie
buttonsForGetNewWord.forEach((button) => {
  button.addEventListener("click", getNewWord);
});

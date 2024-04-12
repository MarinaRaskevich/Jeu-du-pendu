//////////// Fonctions pour INDEX.HTML ////////////
// Fonction de téléchargement de mots via API
async function fetchWordsByCategories() {
  const urls = [
    "https://trouve-mot.fr/api/categorie/18/15",
    "https://trouve-mot.fr/api/categorie/19/15",
    "https://trouve-mot.fr/api/categorie/11/15",
    "https://trouve-mot.fr/api/categorie/5/15",
    "https://trouve-mot.fr/api/categorie/10/15",
    "https://trouve-mot.fr/api/categorie/17/15",
  ];

  const fetchPromises = urls.map((url) => fetch(url));

  await Promise.all(fetchPromises)
    .then((responses) =>
      Promise.all(responses.map((response) => response.json()))
    )
    .then((data) => {
      addInCollection(data);
    });
}

// Ajout des mots reçus au tableau
const addInCollection = (data) => {
  for (let index = 0; index < 6; index++) {
    wordsCollection.push({ id: index + 1, words: data[index] });
  }
};

// Obtenir l'ID de catégorie à partir d'un bouton cliqué
const getId = (event) => {
  event.preventDefault();
  const id = event.target.dataset.id;
  const categoryName = event.target.innerText;
  getWordsOfThisCategory(id, categoryName);
};

// Récupération des mots de la catégorie sélectionnée
const getWordsOfThisCategory = (id, categoryName) => {
  let wordsOfThisCategory = wordsCollection.filter((item) => item.id == id);
  wordsOfThisCategory = wordsOfThisCategory[0].words;

  let arrayForRandomWord = [];
  wordsOfThisCategory.forEach((element) => {
    arrayForRandomWord.push(element.name);
  });
  saveInLocalStorage(id, categoryName, arrayForRandomWord);
};

//Mettre les données de l'utilisateur dans LocalStorage
const saveInLocalStorage = (id, categoryName, wordsCollection) => {
  localStorage.setItem("id", id);
  let userHistory = {
    id: id,
    categoryName: categoryName,
    wordsCollection: wordsCollection,
  };

  if (localStorage.getItem("userHistory") !== null) {
    const userData = JSON.parse(localStorage.getItem("userHistory"));
    if (!userData.find((data) => data.id == id)) {
      userData.push(userHistory);
      localStorage.setItem("userHistory", JSON.stringify(userData));
      pickRandomWord(wordsCollection);
    } else {
      pickRandomWord(userData.find((data) => data.id == id).wordsCollection);
    }
  } else {
    const userData = [];
    userData.push(userHistory);
    localStorage.setItem("userHistory", JSON.stringify(userData));
  }
};

// Obtenir un mot aléatoire à partir d'une table de mots
const pickRandomWord = (collection) => {
  let randomWord = collection[Math.floor(Math.random() * collection.length)];
  localStorage.setItem("randomWord", randomWord);
  document.location.href = "./game.html";
};

//////////// Fonctions pour GAME.HTML ////////////
// Création d'un nombre précis de divs égal au nombre de lettres du mot sélectionné
const setupAnswerArray = (word) => {
  let answerArray = [];
  for (let index = 0; index < word.length; index++) {
    let cell = document.createElement("div");
    cell.classList.add("cell");
    cell.textContent = "*";
    cell.setAttribute("data-id", index);
    wordContainer.appendChild(cell);
    answerArray[index] = "_";
  }
};

// Création des lettres de l'alphabet et ajout d'un écouteur à chacune d'elles
const createLetterBouttons = () => {
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  alphabet.split("").forEach((letter) => {
    const letterDiv = document.createElement("div");
    const yesDiv = document.createElement("div");
    yesDiv.classList.add("yesLetter", "d-none");
    const notDiv = document.createElement("div");
    notDiv.classList.add("notLetter", "d-none");
    letterDiv.textContent = letter.toUpperCase();
    letterDiv.classList.add("letter", "text-center");
    letterDiv.appendChild(yesDiv);
    letterDiv.appendChild(notDiv);
    letterDiv.addEventListener("click", getInformationAboutLetter);
    lettersContaner.appendChild(letterDiv);
  });
};

// Obtenir des informations sur la lettre sur laquelle l'utilisateur a cliqué
const getInformationAboutLetter = (e) => {
  const letter = e.target.innerText.toLowerCase();
  const yesMark = e.srcElement.children[0];
  const notMark = e.srcElement.children[1];
  checkLetter(letter, yesMark, notMark);
};

// Vérifier si la lettre sélectionnée est dans un mot (la fonction principale du jeu)
const checkLetter = (letter, yesMark, notMark) => {
  if (remainingAttempts > 0 && hiddenWord.includes("_")) {
    if (removeAccent(chosenWord).includes(letter)) {
      for (let index = 0; index < chosenWord.length; index++) {
        if (removeAccent(chosenWord[index]) === letter) {
          hiddenWord[index] = letter;
          yesMark.classList.remove("d-none");
          yesMark.classList.add("d-block");
          allCells[index].textContent = chosenWord[index].toUpperCase();
        }
      }
      if (!hiddenWord.includes("_")) {
        imageReinitialisation("win", "Vous avez gagne");
        removeGuessedWordFromCollection();
        return;
      }
    } else {
      imageReinitialisation(
        `${remainingAttempts}`,
        `Image du pendu: vous avez encore ${remainingAttempts} coup(s)`
      );
      remainingAttempts--;
      notMark.classList.remove("d-none");
      notMark.classList.add("d-block");
      if (remainingAttempts == 0) {
        imageReinitialisation("lose", "Vous avez perdu");
        wordContainer.previousElementSibling.textContent = `Le mot caché était: ${chosenWord}`;
      }
    }
  } else {
    wordContainer.previousElementSibling.textContent = `Le mot caché était: ${chosenWord}`;
    if (remainingAttempts == 0) {
      imageReinitialisation("lose", "Vous avez perdu");
    }
  }
};

// Supprimer les accents d'un mot ou d'une lettre
const removeAccent = (str) => {
  const normalizedStr = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return normalizedStr;
};

// Démarrage du jeu après avoir chargé la page
const game = () => {
  setupAnswerArray(chosenWord);
  createLetterBouttons();
  categoryNameHeading.textContent = `Catégorie: ${categoryName}`;
};

// Obtenir un nouveau mot après avoir appuyé sur un bouton "Rejouer"
const getNewWord = () => {
  if (newCollection.length == 0) {
    imageReinitialisation(
      "empty",
      "Vous avez déviner tous les mots de cette catégorie"
    );
    return;
  }
  let newRandomWord =
    newCollection[Math.floor(Math.random() * newCollection.length)];
  chosenWord = newRandomWord;
  gameReinitialisation(chosenWord);
};

// Réinitialisation des données du jeu précédent
const gameReinitialisation = (newWord) => {
  hiddenWord = Array(newWord.length).fill("_");
  wordContainer.previousElementSibling.textContent = "";
  lettersContaner.innerHTML = "";
  wordContainer.innerHTML = "";
  gallowsContainer.innerHTML = "";
  remainingAttempts = 10;
  imageReinitialisation("gallows-start");

  setupAnswerArray(newWord);
  createLetterBouttons();
};

// Réinitialisation de l'image
const imageReinitialisation = (image, alt) => {
  gallowsContainer.innerHTML = "";
  const imgGallows = document.createElement("img");
  imgGallows.setAttribute("src", `./public/assets/img/${image}.svg`);
  imgGallows.setAttribute("alt", `${alt}`);
  imgGallows.classList.add("gallows-image", "w-100");
  gallowsContainer.appendChild(imgGallows);
};

//Supprimer le mot déviné
const removeGuessedWordFromCollection = () => {
  newCollection = newCollection.filter((word) => word !== chosenWord);
  userHistory.find((element) => element.id == chosenCategory).wordsCollection =
    newCollection;
  localStorage.setItem("userHistory", JSON.stringify(userHistory));
};

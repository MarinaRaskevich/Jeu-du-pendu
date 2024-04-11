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
  id = event.target.dataset.id;
  getWordsOfThisCategory(id);
};

// Récupération des mots de la catégorie sélectionnée
const getWordsOfThisCategory = (id) => {
  let wordsOfThisCategory = wordsCollection.filter((item) => item.id == id);
  wordsOfThisCategory = wordsOfThisCategory[0].words;

  let arrayForRandomWord = [];
  wordsOfThisCategory.forEach((element) => {
    arrayForRandomWord.push(element.name);
  });
  pickRandomWord(arrayForRandomWord);
};

// Obtenir un mot aléatoire à partir d'une table de mots
const pickRandomWord = (collection) => {
  let randomWord = collection[Math.floor(Math.random() * collection.length)];
  const wordsCollection = JSON.stringify(collection);
  localStorage.setItem("collection", wordsCollection);
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
    letterDiv.classList.add("letter");
    letterDiv.appendChild(yesDiv);
    letterDiv.appendChild(notDiv);
    letterDiv.addEventListener("click", getInformationAboutLetter);
    lettersContaner.appendChild(letterDiv);
  });
};

const getInformationAboutLetter = (e) => {
  const letter = e.target.innerText.toLowerCase();
  const yesMark = e.srcElement.children[0];
  const notMark = e.srcElement.children[1];
  checkLetter(letter, yesMark, notMark);
};

const guessLetter = (e) => {
  const letter = e.target.innerText.toLowerCase();
  const yes = e.srcElement.children[0];
  const not = e.srcElement.children[1];
  if (remainingAttempts > 0 && hiddenWord.includes("_")) {
    if (removeAccent(word).includes(letter)) {
      for (let index = 0; index < word.length; index++) {
        if (removeAccent(word[index]) === letter) {
          hiddenWord[index] = letter;
          yesMark.classList.remove("d-none");
          yesMark.classList.add("d-block");
          allCells[index].textContent = word[index].toUpperCase();
        }
      }
      if (!hiddenWord.includes("_")) {
        winMessage.classList.remove("d-none");
        winMessage.classList.add("d-block");
        return;
      }
    } else {
      const imgGallows = document.createElement("img");
      imgGallows.setAttribute(
        "src",
        `./public/assets/img/${remainingAttempts}.svg`
      );
      imgGallows.setAttribute("alt", "pendu");
      imgGallows.classList.add("gallows-image", "w-100");
      gallowsContainer.innerHTML = "";
      gallowsContainer.appendChild(imgGallows);
      remainingAttempts--;
      notMark.classList.remove("d-none");
      notMark.classList.add("d-block");
      console.log(remainingAttempts);
      if (remainingAttempts == 0) {
        loseMessage.classList.remove("d-none");
        loseMessage.classList.add("d-block");
      }
    }
  } else {
    if (remainingAttempts == 0) {
      loseMessage.classList.remove("d-none");
      loseMessage.classList.add("d-block");
    }
  }
};

const game = () => {
  setupAnswerArray(word);
  createLetterBouttons();
};

const removeAccent = (letter) => {
  const normalizedLetter = letter
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  return normalizedLetter;
};

const getNewWord = () => {
  let collectionOfThisCategory = localStorage.getItem("collection");
  collectionOfThisCategory = JSON.parse(collectionOfThisCategory);
  let randomWord =
    collectionOfThisCategory[
      Math.floor(Math.random() * collectionOfThisCategory.length)
    ];
  console.log(randomWord);
  lettersContaner.innerHTML = "";
  wordContainer.innerHTML = "";
  gallowsContainer.innerHTML = "";
  remainingAttempts = 10;
  const imgGallows = document.createElement("img");
  imgGallows.setAttribute("src", `./public/assets/img/gallows-start.svg`);
  imgGallows.setAttribute("alt", "pendu");
  imgGallows.classList.add("gallows-image", "w-100");
  gallowsContainer.appendChild(imgGallows);

  setupAnswerArray(randomWord);
  createLetterBouttons();
};

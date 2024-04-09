// fetch("https://trouve-mot.fr/api/categorie/10/20")
//   .then((response) => response.json())
//   .then((words) => addInCollection(words));

// fetch("https://trouve-mot.fr/api/categorie/10/20")
//   .then((response) => response.json())
//   .then((words) => addInCollection(words));

let wordsCollection = [];

// const pickWord = (collection) => {
//   return collection[Math.floor(Math.random() * collection.length)];
// };

// async function fetchWordsByCategories() {
//   const [artResponse, agricultureResponse] = await Promise.all([
//     fetch("https://trouve-mot.fr/api/categorie/10/20"),
//     fetch("https://trouve-mot.fr/api/categorie/11/20"),
//   ]);

//   const art = await artResponse.json();
//   const agriculture = await agricultureResponse.json();

//   return [art, agriculture];
// }

async function fetchWordsByCategories() {
  const urls = [
    "https://trouve-mot.fr/api/categorie/10/20",
    "https://trouve-mot.fr/api/categorie/11/20",
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

fetchWordsByCategories();

const addInCollection = (data) => {
  data.forEach((array) => {
    wordsCollection.push(array);
  });
};

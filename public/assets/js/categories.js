// Tableau avec tous les mots de toutes les catégories
let wordsCollection = [];

// Appel d'une fonction pour la récuperation de mots
fetchWordsByCategories();

// Ecouteurs sur les boutons de sélection de catégorie
const buttons = document.querySelectorAll(".btn-theme");
buttons.forEach((button) => {
  button.addEventListener("click", getId);
});

// Sort options
const popularitySortOption = document.querySelector("#popularitySortOption");
const difficultySortOption = document.querySelector("#difficultySortOption");
const publicationDateSortOption = document.querySelector(
  "#publicationDateSortOption",
);
const questionsCountSortOption = document.querySelector(
  "#questionsCountSortOption",
);


  // Set different sorts based on selected oprion
popularitySortOption.addEventListener("click", (e) => {
  addSortToURL("popularity");
});
difficultySortOption.addEventListener("click", (e) => {
  addSortToURL("difficulty");
});
publicationDateSortOption.addEventListener("click", (e) => {
  addSortToURL("publicationDate");
});
questionsCountSortOption.addEventListener("click", (e) => {
  addSortToURL("questionsCount");
});

// Set arrow direction based on sort direction from url
sortArrow.addEventListener("click", (e) => {
  setSortArrow("popularity");
});
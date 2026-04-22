// Sort options
const titleSortOption = document.querySelector("#titleSortOption");
const popularitySortOption = document.querySelector("#popularitySortOption");
const quizzesCountSortOption = document.querySelector(
  "#quizzesCountSortOption",
);

// Set arrow direction based on sort direction from url
sortArrow.addEventListener("click", (e) => {
  setSortArrow("title");
});

// Set different sorts based on selected oprion
titleSortOption.addEventListener("click", (e) => {
  addSortToURL("title");
});
popularitySortOption.addEventListener("click", (e) => {
  addSortToURL("popularity");
});
quizzesCountSortOption.addEventListener("click", (e) => {
  addSortToURL("quizzesCount");
});

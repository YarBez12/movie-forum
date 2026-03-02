"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const sortButton = document.querySelector("#sort-button");
  const sortMenu = document.querySelector("#sort-menu");
  const sortArrow = document.querySelector("#sort-arrow");
  const popularitySortOption = document.querySelector("#popularitySortOption");
  const difficultySortOption = document.querySelector("#difficultySortOption");
  const publicationDateSortOption = document.querySelector("#publicationDateSortOption");
  const questionsCountSortOption = document.querySelector("#questionsCountSortOption");


  sortButton.addEventListener("click", (e) => {
    e.stopPropagation();
    sortMenu.classList.toggle("hidden");
  });
  document.addEventListener("click", (e) => {
    if (!sortMenu.contains(e.target) && e.target !== sortButton) {
      sortMenu.classList.add("hidden");
    }
  });
  sortArrow.addEventListener("click", (e) => {
    const url = new URL(window.location.href);
    const currentDir = url.searchParams.get("dir") || "asc";
    const newDir = currentDir === "asc" ? "desc" : "asc";
    url.searchParams.set("dir", newDir);
    if (!url.searchParams.has("sort")) {
      url.searchParams.set("sort", "popularity");
    }
    window.location.href = url.toString();
  });

   const addSortToURL = (sortOption) => {
    const url = new URL(window.location.href);
    url.searchParams.set("sort", sortOption);
    window.location.href = url.toString();
  };
  popularitySortOption.addEventListener('click', (e) => {
    addSortToURL('popularity')
  });
  difficultySortOption.addEventListener('click', (e) => {
    addSortToURL('difficulty')
  });
  publicationDateSortOption.addEventListener('click', (e) => {
    addSortToURL('publicationDate')
  });
  questionsCountSortOption.addEventListener('click', (e) => {
    addSortToURL('questionsCount')
  });
});

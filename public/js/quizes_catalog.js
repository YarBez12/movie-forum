"use strict";

document.addEventListener("DOMContentLoaded", () => {
  // Elements of sort menu
  const sortButton = document.querySelector("#sort-button");
  const sortMenu = document.querySelector("#sort-menu");
  const sortArrow = document.querySelector("#sort-arrow");
  // Sort options
  const popularitySortOption = document.querySelector("#popularitySortOption");
  const difficultySortOption = document.querySelector("#difficultySortOption");
  const publicationDateSortOption = document.querySelector(
    "#publicationDateSortOption",
  );
  const questionsCountSortOption = document.querySelector(
    "#questionsCountSortOption",
  );

  // Handle click on sort button
  sortButton.addEventListener("click", (e) => {
    e.stopPropagation();
    sortMenu.classList.toggle("hidden");
  });

  // Close sort menu if clicked outside it
  document.addEventListener("click", (e) => {
    if (!sortMenu.contains(e.target) && e.target !== sortButton) {
      sortMenu.classList.add("hidden");
    }
  });

  // Set arrow direction based on sort direction from url
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

  // Set sort option to URL
  const addSortToURL = (sortOption) => {
    const url = new URL(window.location.href);
    url.searchParams.set("sort", sortOption);
    window.location.href = url.toString();
  };

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

  // Filter modal elements
  const filterModal = document.querySelector("#filter-modal");
  const filterForm = document.querySelector("#filter-form");
  const filterOpenButton = document.querySelector("#filter-open");
  const filterCloseButton = document.querySelector("#filter-close");
  const filterResetButton = document.querySelector("#filter-reset");
  const filterOverlay = document.querySelector("#filter-modal-overlay");

  // Open filter modal when clicked on corresponding button
  filterOpenButton.addEventListener("click", () => {
    filterModal.classList.remove("hidden");
    filterModal.classList.add("flex");
  });

  // Close filter modal when clicked on exit button or outside modal
  filterCloseButton.addEventListener("click", () => {
    filterModal.classList.add("hidden");
    filterModal.classList.remove("flex");
  });
  filterOverlay.addEventListener("click", () => {
    filterModal.classList.add("hidden");
    filterModal.classList.remove("flex");
  });

  // Reset all filters with automatic submission then
  filterResetButton.addEventListener("click", () => {
    filterForm
      .querySelectorAll('input[type="checkbox"]')
      .forEach((c) => (c.checked = false));
    filterForm.submit();
  });
});

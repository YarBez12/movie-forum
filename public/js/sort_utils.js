// Elements of sort menu
const sortButton = document.querySelector("#sort-button");
const sortMenu = document.querySelector("#sort-menu");
const sortArrow = document.querySelector("#sort-arrow");

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

// Ser sort arrow for sort direction
const setSortArrow = (defaultSort) => {
  const url = new URL(window.location.href);
  // Update sort direction with inverse of current
  const currentDir = url.searchParams.get("dir") || "asc";
  const newDir = currentDir === "asc" ? "desc" : "asc";
  url.searchParams.set("dir", newDir);
  // If no sort option set, set default
  if (!url.searchParams.has("sort")) {
    url.searchParams.set("sort", defaultSort);
  }
  window.location.replace(url.toString());
};

// Set sort option to URL
const addSortToURL = (sortOption) => {
  const url = new URL(window.location.href);
  url.searchParams.set("sort", sortOption);
  window.location.replace(url.toString());
};

"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const sortButton = document.querySelector("#sort-button");
  const sortMenu = document.querySelector("#sort-menu");
  const sortArrow = document.querySelector("#sort-arrow");
  // Sort options
  const titleSortOption = document.querySelector("#titleSortOption");
  const popularitySortOption = document.querySelector("#popularitySortOption");
  const quizzesCountSortOption = document.querySelector("#quizzesCountSortOption");

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
      url.searchParams.set("sort", "title");
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
  titleSortOption.addEventListener("click", (e) => {
    addSortToURL("title");
  });
  popularitySortOption.addEventListener("click", (e) => {
    addSortToURL("popularity");
  });
  quizzesCountSortOption.addEventListener("click", (e) => {
    addSortToURL("quizzesCount");
  });


  const franchiseForm = document.querySelector("#franchise-form");
  const editFranchiseId = document.querySelector("#edit-franchise-id");
  const franchiseTitleInput = franchiseForm.querySelector(
    'input[name="title"]',
  );
  const franchiseImageInput = franchiseForm.querySelector(
    'input[name="image"]',
  );
  const franchiseSubmitButton = document.querySelector(
    "#franchise-submit-button",
  );
  const franchiseModalTitle = document.querySelector("#franchise-modal-title");
  const addFranchiseModal = document.querySelector("#add-franchise-modal");
  const addFranchiseOverlay = document.querySelector(
    "#add-franchise-modal-overlay",
  );
  const addFranchiseOpenButton = document.querySelector("#add-franchise");
  const addFranchiseCancelButton = document.querySelector(
    "#cancel-add-franchise",
  );

  addFranchiseOpenButton.addEventListener("click", () => {
    addFranchiseModal.classList.remove("hidden");
    addFranchiseModal.classList.add("flex");
    franchiseModalTitle.textContent = "Create New Franchise";
    franchiseSubmitButton.textContent = "Create Franchise";
    franchiseForm.action = "/franchises/addfranchise";
    editFranchiseId.value = "";
    franchiseTitleInput.value = "";
    franchiseImageInput.value = "";
  });

  document.querySelectorAll(".edit-franchise").forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      const id = button.dataset.id;
      const title = button.dataset.title;

      franchiseModalTitle.textContent = "Edit Franchise";
      franchiseSubmitButton.textContent = "Update Franchise";
      franchiseForm.action = `/franchises/editfranchise`;
      editFranchiseId.value = id;
      franchiseTitleInput.value = title;
      // franchiseImageInput.value = button.dataset.image;

      addFranchiseModal.classList.remove("hidden");
      addFranchiseModal.classList.add("flex");
    });
  });

  const closeAddFranchise = () => {
    addFranchiseModal.classList.add("hidden");
    addFranchiseModal.classList.remove("flex");
  };

  addFranchiseOverlay.addEventListener("click", closeAddFranchise);
  addFranchiseCancelButton.addEventListener("click", closeAddFranchise);

  const typeButtons = document.querySelectorAll(".type-link");
  typeButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      const url = new URL(window.location.href);
      url.searchParams.set("type", button.dataset.type);
      window.location.href = url.toString();
    });
  });

  const deleteConfirmModal = document.querySelector("#delete-confirm-modal");
  const deleteConfirmOverlay = document.querySelector(
    "#delete-confirm-overlay",
  );
  let deleteFranchise = null;

  document.querySelectorAll(".delete-franchise").forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      deleteFranchise = button.dataset.id;
      deleteConfirmModal.classList.remove("hidden");
      deleteConfirmModal.classList.add("flex");
    });
  });

  const closeDeleteConfirmModal = () => {
    deleteConfirmModal.classList.add("hidden");
    deleteConfirmModal.classList.remove("flex");
    deleteFranchise = null;
  };
  document
    .querySelector("#cancel-delete")
    .addEventListener("click", closeDeleteConfirmModal);
  deleteConfirmOverlay.addEventListener("click", closeDeleteConfirmModal);

  document.querySelector("#confirm-delete").addEventListener("click", (e) => {
    window.location.href = `/franchises/deletefranchise/${deleteFranchise}`;
  });
});

"use strict";

document.addEventListener("DOMContentLoaded", () => {
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

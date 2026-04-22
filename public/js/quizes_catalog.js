"use strict";

document.addEventListener("DOMContentLoaded", () => {
  // sort_utils.js

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
  // Additional quiz modal elements
  const franchiseInput = document.getElementById("franchise-input");
  const franchiseLabel = document.getElementById("franchise-label");

  // Open edit quiz modal
  const editQuizOpenButtons = document.querySelectorAll(".edit-quiz");
  editQuizOpenButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Set redirect URL and franchise form elements
      setQuizEditWindow("/quizzes/editquiz", button, franchiseInput, franchiseLabel);
    });
  });

  // Open add quiz modal
  const addQuizOpenButton = document.querySelector("#add-quiz");
  addQuizOpenButton.addEventListener("click", () => {
    // Set redirect URL and franchise form elements
    setQuizAddWindow("/quizzes/addquiz", franchiseInput, franchiseLabel);
  });

  // Setup dropdown for franchise
  setupSelect(
    "franchise-select",
    "franchise-menu",
    "franchise-input",
    "franchise-label",
  );


  // Setup deletion process with confirmation
  handleDeleteProcess(".delete-quiz", (e, deleteItem) => {
    // Set redirect URL
    window.location.href = `/quizzes/deletequiz/${deleteItem}`;
  });
});

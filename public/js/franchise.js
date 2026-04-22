"use strict";

document.addEventListener("DOMContentLoaded", () => {
  // Open edit quiz modal
  const editQuizOpenButtons = document.querySelectorAll(".edit-quiz");
  editQuizOpenButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const quizFranchiseId = button.dataset.franchiseId;
      // Set redirect URL
      setQuizEditWindow(`/franchises/${quizFranchiseId}/editquiz`, button);
    });
  });

  // Open add quiz modal
  const addQuizOpenButton = document.querySelector("#add-quiz");
  addQuizOpenButton.addEventListener("click", (e) => {
    const quizFranchiseId = e.currentTarget.dataset.franchiseId;
    // Set redirect URL
    setQuizAddWindow(`/franchises/${quizFranchiseId}/addquiz`);
  });


  // Setup deletion process with confirmation
  handleDeleteProcess(".delete-quiz", (e, deleteItem) => {
    const franchise = e.currentTarget.dataset.slug;
    // Set redirect URL
    window.location.href = `/franchises/${franchise}/deletequiz/${deleteItem}`;
  });
});

"use strict";

document.addEventListener("DOMContentLoaded", () => {
  // Open add franchise modal
  const addFranchiseOpenButton = document.querySelector("#add-franchise");
  addFranchiseOpenButton.addEventListener("click", () => {
    // Set redirect URL
    setFranchiseAddWindow("/franchises/addfranchise");
  });

  // Open edit franchise modal
  document.querySelectorAll(".edit-franchise").forEach((button) => {
    button.addEventListener("click", (e) => {
      // Set redirect URL
      setFranchiseEditWindow(e, `/franchises/editfranchise`, button);
    });
  });
  // Setup deletion process with confirmation
  handleDeleteProcess(".delete-franchise", (e, deleteItem) => {
    // Set redirect URL
    window.location.href = `/franchises/deletefranchise/${deleteItem}`;
  });
});

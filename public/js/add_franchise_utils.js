// Entire franchise form in modal
const franchiseForm = document.querySelector("#franchise-form");
// Franchise id that will be passed to controller during editing
const editFranchiseId = document.querySelector("#edit-franchise-id");
// Franchise form elements
const franchiseTitleInput = franchiseForm.querySelector('input[name="title"]');
const franchiseImageInput = franchiseForm.querySelector('input[name="image"]');
const franchiseImagePreviewContainer = document.querySelector(
  "#franchise-image-preview-container",
);
const franchiseImagePreview = document.querySelector(
  "#franchise-image-preview",
);
const franchiseSubmitButton = document.querySelector(
  "#franchise-submit-button",
);
const franchiseModalTitle = document.querySelector("#franchise-modal-title");
// Entire modal and overlay
const addFranchiseModal = document.querySelector("#add-franchise-modal");
const addFranchiseOverlay = document.querySelector(
  "#add-franchise-modal-overlay",
);
const addFranchiseCancelButton = document.querySelector(
  "#cancel-add-franchise",
);
// Modal window setup for adding a new franchise
// All elements will be reset
const setFranchiseAddWindow = (action) => {
  addFranchiseModal.classList.remove("hidden");
  addFranchiseModal.classList.add("flex");
  franchiseModalTitle.textContent = "Create New Franchise";
  franchiseSubmitButton.textContent = "Create Franchise";
  franchiseForm.action = action;
  editFranchiseId.value = "";
  franchiseTitleInput.value = "";
  franchiseImageInput.value = "";
  // Hide image preview during adding
  franchiseImagePreviewContainer.classList.add("hidden");
  franchiseImagePreview.src = "";
};

// Modal window setup for editing a franchise
// Set up data in all elements
const setFranchiseEditWindow = (e, action, button) => {
    e.preventDefault();
    e.stopPropagation();

    // Get franchise data from button
    const id = button.dataset.id;
    const title = button.dataset.title;

    franchiseModalTitle.textContent = "Edit Franchise";
    franchiseSubmitButton.textContent = "Update Franchise";
    franchiseForm.action = action;
    editFranchiseId.value = id;
    franchiseTitleInput.value = title;
    // Setup current image preview
    if (button.dataset.image) {
      franchiseImagePreviewContainer.classList.remove("hidden");
      franchiseImagePreview.src = button.dataset.image;
    } else {
      franchiseImagePreviewContainer.classList.add("hidden");
      franchiseImagePreview.src = "";
    }
    franchiseImageInput.value = "";

    addFranchiseModal.classList.remove("hidden");
    addFranchiseModal.classList.add("flex");
}

// Close modal window
const closeAddFranchise = () => {
  addFranchiseModal.classList.add("hidden");
  addFranchiseModal.classList.remove("flex");
};
addFranchiseOverlay.addEventListener("click", closeAddFranchise);
addFranchiseCancelButton.addEventListener("click", closeAddFranchise);

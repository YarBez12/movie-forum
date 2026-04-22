// General deletion method for quizzes and franchises
const handleDeleteProcess = (deleteButtons, deleteAction, selectors = {}) => {
  // Set selectors from input or use defaults
  const modalSelector = selectors.modal || "#delete-confirm-modal";
  const overlaySelector = selectors.overlay || "#delete-confirm-overlay";
  const cancelSelector = selectors.cancel || "#cancel-delete";
  const confirmSelector = selectors.confirm || "#confirm-delete";
  // Get modal and overlay
  const deleteConfirmModal = document.querySelector(modalSelector);
  const deleteConfirmOverlay = document.querySelector(
    overlaySelector,
  );
  // Set delete item
  let deleteItem = null;

  // Handle click on delete button
  document.querySelectorAll(deleteButtons).forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      // Set delete item
      deleteItem = button.dataset.id;
      // Show confirmation modal
      deleteConfirmModal.classList.remove("hidden");
      deleteConfirmModal.classList.add("flex");
    });
  });

  // Close confirmation modal
  const closeDeleteConfirmModal = () => {
    // Hide confirmation modal
    deleteConfirmModal.classList.add("hidden");
    deleteConfirmModal.classList.remove("flex");
    // Reset delete item
    deleteItem = null;
  };
  document
    .querySelector(cancelSelector)
    .addEventListener("click", closeDeleteConfirmModal);
  deleteConfirmOverlay.addEventListener("click", closeDeleteConfirmModal);

  // Handle click on confirm button
  document
    .querySelector(confirmSelector)
    .addEventListener("click", (e) => deleteAction(e, deleteItem));
};

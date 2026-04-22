document.addEventListener("DOMContentLoaded", () => {
  // Edit profile modal elements
  const editProfileButton = document.querySelector("#edit-profile-button");
  const editProfileModal = document.querySelector("#edit-profile-modal");
  const editProfileOverlay = document.querySelector("#edit-profile-overlay");
  const cancelEditButton = document.querySelector("#cancel-edit-profile");

  // Toggle edit profile modal (open/close)
  const toggleModal = () => {
    editProfileModal.classList.toggle("hidden");
    editProfileModal.classList.toggle("flex");
  };

  editProfileButton.addEventListener("click", () => {
    toggleModal();
  });
  cancelEditButton.addEventListener("click", () => {
    toggleModal();
  });
  editProfileOverlay.addEventListener("click", () => {
    toggleModal();
  });

  // Additional quiz modal elements
  const franchiseInput = document.getElementById("franchise-input");
  const franchiseLabel = document.getElementById("franchise-label");

  // Open edit quiz modal
  const editQuizOpenButtons = document.querySelectorAll(".edit-quiz");
  editQuizOpenButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Set redirect URL and franchise form elements
      setQuizEditWindow(
        "/profile/editquiz",
        button,
        franchiseInput,
        franchiseLabel,
      );
    });
  });

  // Open add quiz modal
  const addQuizOpenButton = document.querySelector("#add-quiz");
  addQuizOpenButton.addEventListener("click", () => {
    // Set redirect URL and franchise form elements
    setQuizAddWindow("/profile/addquiz", franchiseInput, franchiseLabel);
  });

  // Setup dropdown for franchise
  setupSelect(
    "franchise-select",
    "franchise-menu",
    "franchise-input",
    "franchise-label",
  );

  // Setup deletion process with confirmation for quizzes
  handleDeleteProcess(
    ".delete-quiz",
    (e, deleteItem) => {
      // Set redirect URL
      window.location.href = `/profile/deletequiz/${deleteItem}`;
    },
    // Set not default selectors
    {
      modal: "#quiz-delete-confirm-modal",
      overlay: "#quiz-delete-confirm-overlay",
      cancel: "#quiz-cancel-delete",
      confirm: "#quiz-confirm-delete",
    },
  );

  // Open add franchise modal
  const addFranchiseOpenButton = document.querySelector("#add-franchise");

  addFranchiseOpenButton.addEventListener("click", () => {
    // Set redirect URL
    setFranchiseAddWindow("/profile/addfranchise");
  });

  // Open edit franchise modal
  document.querySelectorAll(".edit-franchise").forEach((button) => {
    button.addEventListener("click", (e) => {
      // Set redirect URL
      setFranchiseEditWindow(e, "/profile/editfranchise", button);
    });
  });

  // Setup deletion process with confirmation for franchises
  handleDeleteProcess(
    ".delete-franchise",
    // Set redirect URL
    (e, deleteItem) => {
      window.location.href = `/profile/deletefranchise/${deleteItem}`;
    },
    // Set not default selectors
    {
      modal: "#franchise-delete-confirm-modal",
      overlay: "#franchise-delete-confirm-overlay",
      cancel: "#franchise-cancel-delete",
      confirm: "#franchise-confirm-delete",
    },
  );
});

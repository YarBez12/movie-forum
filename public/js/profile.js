document.addEventListener("DOMContentLoaded", () => {
  const editProfileButton = document.querySelector("#edit-profile-button");
  const editProfileModal = document.querySelector("#edit-profile-modal");
  const editProfileOverlay = document.querySelector("#edit-profile-overlay");
  const cancelEditButton = document.querySelector("#cancel-edit-profile");

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

  const addQuizModal = document.querySelector("#add-quiz-modal");
  const addQuizOverlay = document.querySelector("#add-quiz-modal-overlay");
  const addQuizOpenButton = document.querySelector("#add-quiz");
  const addQuizCancelButton = document.querySelector("#cancel-add-quiz");
  const quizModalTitle = document.querySelector("#quiz-modal-title");
  const quizForm = document.querySelector("#quiz-form");
  const editQuizId = document.querySelector("#edit-quiz-id");
  const submitButton = quizForm.querySelector('button[type="submit"]');
  const quizTitleInput = quizForm.querySelector('input[name="title"]');
  const quizImageInput = quizForm.querySelector('input[name="image"]');
  const quizImagePreviewContainer = document.querySelector(
    "#quiz-image-preview-container",
  );
  const quizImagePreview = document.querySelector(
    "#quiz-image-preview",
  );
  const quizCountInput = quizForm.querySelector(
    'input[name="countOfQuestions"]',
  );
  const quizDescriptionInput = quizForm.querySelector(
    'textarea[name="description"]',
  );
  const difficultyInput = document.getElementById("difficulty-input");
  const difficultyLabel = document.getElementById("difficulty-label");
  const franchiseInput = document.getElementById("franchise-input");
  const franchiseLabel = document.getElementById("franchise-label");

  const editQuizOpenButtons = document.querySelectorAll(".edit-quiz");
  editQuizOpenButtons.forEach((button) => {
    button.addEventListener("click", () => {
      quizModalTitle.textContent = "Edit Quiz";
      submitButton.textContent = "Save Changes";
      quizForm.action = "/profile/editquiz";
      const quizId = button.dataset.id;
      const quizTitle = button.dataset.title;
      const quizDescription = button.dataset.description;
      const quizDifficulty = button.dataset.difficulty;
      const quizFranchiseId = button.dataset.franchiseId;
      const quizFranchiseTitle = button.dataset.franchiseTitle;
      const quizCountOfQuestions = button.dataset.countOfQuestions;
      const quizImage = button.dataset.image;

      quizTitleInput.value = quizTitle;
      quizDescriptionInput.value = quizDescription;
      quizCountInput.value = quizCountOfQuestions;

      if (quizDifficulty) {
        difficultyInput.value = quizDifficulty;
        difficultyLabel.textContent = quizDifficulty;
        difficultyLabel.classList.remove("text-white/40");
      } else {
        difficultyInput.value = "";
        difficultyLabel.textContent = "Select Difficulty";
        difficultyLabel.classList.add("text-white/40");
      }

      if (quizFranchiseId) {
        franchiseInput.value = quizFranchiseId;
        franchiseLabel.textContent = quizFranchiseTitle;
        franchiseLabel.classList.remove("text-white/40");
      } else {
        franchiseInput.value = "";
        franchiseLabel.textContent = "Select Franchise";
        franchiseLabel.classList.add("text-white/40");
      }

      if (quizImage) {
        quizImagePreviewContainer.classList.remove("hidden");
        quizImagePreview.src = quizImage;
      } else {
        quizImagePreviewContainer.classList.add("hidden");
        quizImagePreview.src = "";
      }
      quizImageInput.value = "";

      editQuizId.value = quizId;
      console.log(button.dataset);
      questionContainer.innerHTML = "";
      const questions = JSON.parse(button.dataset.questions || "[]");
      if (questions.length === 0) {
        renderQuestion(0);
      } else {
        questions.forEach((question, index) => {
          renderQuestion(index, question);
        });
      }

      addQuizModal.classList.remove("hidden");
      addQuizModal.classList.add("flex");
    });
  });

  addQuizOpenButton.addEventListener("click", () => {
    quizModalTitle.textContent = "Create New Quiz";
    submitButton.textContent = "Create Quiz";
    quizForm.action = "/profile/addquiz";
    quizForm.reset();
    editQuizId.value = "";
    difficultyInput.value = "";
    difficultyLabel.textContent = "Select Difficulty";
    difficultyLabel.classList.add("text-white/40");
    franchiseInput.value = "";
    franchiseLabel.textContent = "Select Franchise";
    franchiseLabel.classList.add("text-white/40");
    franchiseLabel.classList.add("text-white/40")
    quizImagePreviewContainer.classList.add("hidden");
    quizImagePreview.src = "";
    quizImageInput.value = "";
    questionContainer.innerHTML = "";
    renderQuestion(0);
    addQuizModal.classList.remove("hidden");
    addQuizModal.classList.add("flex");
  });

  const closeAddQuiz = () => {
    addQuizModal.classList.add("hidden");
    addQuizModal.classList.remove("flex");
  };

  addQuizOverlay.addEventListener("click", closeAddQuiz);
  addQuizCancelButton.addEventListener("click", closeAddQuiz);

  function setupSelect(buttonId, menuId, inputId, labelId) {
    const button = document.getElementById(buttonId);
    const menu = document.getElementById(menuId);
    const input = document.getElementById(inputId);
    const label = document.getElementById(labelId);

    button.addEventListener("click", (e) => {
      e.stopPropagation();
      document.querySelectorAll(".menu").forEach((m) => {
        if (m != menu) {
          m.classList.add("hidden");
        }
      });
      menu.classList.toggle("hidden");
    });

    menu.querySelectorAll("button").forEach((optionButton) => {
      optionButton.addEventListener("click", () => {
        input.value = optionButton.dataset.value;
        label.textContent = optionButton.textContent;
        label.classList.remove("text-white/40");
        menu.classList.add("hidden");
      });
    });
    document.addEventListener("click", (e) => {
      if (!menu.contains(e.target) && e.target !== button) {
        menu.classList.add("hidden");
      }
    });
  }

  setupSelect(
    "difficulty-select",
    "difficulty-menu",
    "difficulty-input",
    "difficulty-label",
  );
  setupSelect(
    "franchise-select",
    "franchise-menu",
    "franchise-input",
    "franchise-label",
  );

  Handlebars.registerHelper("indexFromOne", (index) => parseInt(index) + 1);
  const questionTemplate = Handlebars.compile(
    document.querySelector("#question-template").innerHTML,
  );

  const questionContainer = document.querySelector("#questions-container");
  const addQuestionButton = document.querySelector("#add-question");

  function renderQuestion(index, question = null) {
    questionContainer.insertAdjacentHTML(
      "beforeend",
      questionTemplate({
        questionIndex: index,
      }),
    );
    if (question) {
      const lastQuestionBlock = questionContainer.lastElementChild;
      const questionTextInput = lastQuestionBlock.querySelector(
        `input[name="questions[${index}][questionText]"]`,
      );
      questionTextInput.value = question.questionText;
      const explanationInput = lastQuestionBlock.querySelector(
        `textarea[name="questions[${index}][explanation]"]`,
      );
      if (question.explanation) {
        explanationInput.value = question.explanation;
      }
      const optionInputs = lastQuestionBlock.querySelectorAll(
        `input[name^="questions[${index}][options]"]`,
      );
      const options = question.options || [];
      optionInputs.forEach((optionText, optionIndex) => {
        if (options[optionIndex]) {
          optionText.value = options[optionIndex];
        }
      });

      const correctIndex = question.correctIndex;
      const correctIndexRadio = lastQuestionBlock.querySelector(
        `input[value="${correctIndex}"]`,
      );
      if (correctIndexRadio) correctIndexRadio.checked = true;
    }
  }

  addQuestionButton.addEventListener("click", (e) => {
    renderQuestion(questionContainer.children.length);
  });

  questionContainer.addEventListener("click", (e) => {
    if (e.target.closest(".remove-question")) {
      const allQuestionBlocks =
        questionContainer.querySelectorAll(".question-block");
      e.target.closest(".question-block").remove();
      allQuestionBlocks.forEach((questionBlock, index) => {
        questionBlock.querySelector(".question-label").textContent =
          `Question ${index + 1}`;
        questionBlock.querySelectorAll("input, textarea").forEach((input) => {
          input.setAttribute(
            "name",
            input
              .getAttribute("name")
              .replace(/questions\[\d+\]/, `questions[${index}]`),
          );
        });
      });
    }
  });

  renderQuestion(0);

  const quizDeleteConfirmModal = document.querySelector("#quiz-delete-confirm-modal");
  const quizDeleteConfirmOverlay = document.querySelector(
    "#quiz-delete-confirm-overlay",
  );
  let deleteQuiz = null;

  document.querySelectorAll(".delete-quiz").forEach((button) => {
    button.addEventListener("click", (e) => {
      deleteQuiz = button.dataset.id;
      quizDeleteConfirmModal.classList.remove("hidden");
      quizDeleteConfirmModal.classList.add("flex");
    });
  });

  const closeDeleteConfirmQuizModal = () => {
    quizDeleteConfirmModal.classList.add("hidden");
    quizDeleteConfirmModal.classList.remove("flex");
    deleteQuiz = null;
  };
  document
    .querySelector("#quiz-cancel-delete")
    .addEventListener("click", closeDeleteConfirmQuizModal);
  quizDeleteConfirmOverlay.addEventListener("click", closeDeleteConfirmQuizModal);

  document.querySelector("#quiz-confirm-delete").addEventListener("click", (e) => {
    window.location.href = `/profile/deletequiz/${deleteQuiz}`;
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
  const franchiseImagePreviewContainer = document.querySelector(
    "#franchise-image-preview-container",
  );
  const franchiseImagePreview = document.querySelector(
    "#franchise-image-preview",
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
    franchiseForm.action = "/profile/addfranchise";
    editFranchiseId.value = "";
    franchiseTitleInput.value = "";
    franchiseImageInput.value = "";
    franchiseImagePreviewContainer.classList.add("hidden");
    franchiseImagePreview.src = "";
  });

  document.querySelectorAll(".edit-franchise").forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      const id = button.dataset.id;
      const title = button.dataset.title;

      franchiseModalTitle.textContent = "Edit Franchise";
      franchiseSubmitButton.textContent = "Update Franchise";
      franchiseForm.action = `/profile/editfranchise`;
      editFranchiseId.value = id;
      franchiseTitleInput.value = title;
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
    });
  });

  const closeAddFranchise = () => {
    addFranchiseModal.classList.add("hidden");
    addFranchiseModal.classList.remove("flex");
  };

  addFranchiseOverlay.addEventListener("click", closeAddFranchise);
  addFranchiseCancelButton.addEventListener("click", closeAddFranchise);

  const franchiseDeleteConfirmModal = document.querySelector("#franchise-delete-confirm-modal");
  const franchiseDeleteConfirmOverlay = document.querySelector(
    "#franchise-delete-confirm-overlay",
  );
  let deleteFranchise = null;

  document.querySelectorAll(".delete-franchise").forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      deleteFranchise = button.dataset.id;
      franchiseDeleteConfirmModal.classList.remove("hidden");
      franchiseDeleteConfirmModal.classList.add("flex");
    });
  });

  const closeDeleteConfirmFranchiseModal = () => {
    franchiseDeleteConfirmModal.classList.add("hidden");
    franchiseDeleteConfirmModal.classList.remove("flex");
    deleteFranchise = null;
  };
  document
    .querySelector("#franchise-cancel-delete")
    .addEventListener("click", closeDeleteConfirmFranchiseModal);
  franchiseDeleteConfirmOverlay.addEventListener("click", closeDeleteConfirmFranchiseModal);

  document.querySelector("#franchise-confirm-delete").addEventListener("click", (e) => {
    window.location.href = `/profile/deletefranchise/${deleteFranchise}`;
  });
});

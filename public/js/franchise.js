"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const sortButton = document.querySelector("#sort-button");
  const sortMenu = document.querySelector("#sort-menu");
  const sortArrow = document.querySelector("#sort-arrow");
  // Sort options
  const popularitySortOption = document.querySelector("#popularitySortOption");
  const difficultySortOption = document.querySelector("#difficultySortOption");
  const publicationDateSortOption = document.querySelector("#publicationDateSortOption");
  const questionsCountSortOption = document.querySelector("#questionsCountSortOption");

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
      url.searchParams.set("sort", "popularity");
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
  popularitySortOption.addEventListener("click", (e) => {
    addSortToURL("popularity");
  });
  difficultySortOption.addEventListener("click", (e) => {
    addSortToURL("difficulty");
  });
  publicationDateSortOption.addEventListener("click", (e) => {
    addSortToURL("publicationDate");
  });
  questionsCountSortOption.addEventListener("click", (e) => {
    addSortToURL("questionsCount");
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
  const quizCountInput = quizForm.querySelector(
    'input[name="countOfQuestions"]',
  );
  const quizDescriptionInput = quizForm.querySelector(
    'textarea[name="description"]',
  );
  const difficultyInput = document.getElementById("difficulty-input");
  const difficultyLabel = document.getElementById("difficulty-label");

  const editQuizOpenButtons = document.querySelectorAll(".edit-quiz");
  editQuizOpenButtons.forEach((button) => {
    button.addEventListener("click", () => {
      quizModalTitle.textContent = "Edit Quiz";
      submitButton.textContent = "Save Changes";
      const quizFranchiseId = button.dataset.franchiseId;
      quizForm.action = `/franchises/${quizFranchiseId}/editquiz`;
      const quizId = button.dataset.id;
      const quizTitle = button.dataset.title;
      const quizDescription = button.dataset.description;
      const quizDifficulty = button.dataset.difficulty;
      const quizCountOfQuestions = button.dataset.countOfQuestions;
      const quizImage = button.dataset.image;

      quizTitleInput.value = quizTitle;
      quizDescriptionInput.value = quizDescription;
      quizCountInput.value = quizCountOfQuestions;
      quizImageInput.value = quizImage;

      if (quizDifficulty) {
        difficultyInput.value = quizDifficulty;
        difficultyLabel.textContent = quizDifficulty;
        difficultyLabel.classList.remove("text-white/40");
      } else {
        difficultyInput.value = "";
        difficultyLabel.textContent = "Select Difficulty";
        difficultyLabel.classList.add("text-white/40");
      }

      editQuizId.value = quizId;
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

  addQuizOpenButton.addEventListener("click", (e) => {
    quizModalTitle.textContent = "Create New Quiz";
    submitButton.textContent = "Create Quiz";
    const quizFranchiseId = e.currentTarget.dataset.franchiseId;
    quizForm.action = `/franchises/${quizFranchiseId}/addquiz`;
    quizForm.reset();
    editQuizId.value = "";
    difficultyInput.value = "";
    difficultyLabel.textContent = "Select Difficulty";
    difficultyLabel.classList.add("text-white/40");
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
        `input[name="questions[${index}][options][]"]`,
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
      e.target.closest(".question-block").remove();

      const allQuestionBlocks =
        questionContainer.querySelectorAll(".question-block");
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

  const typeButtons = document.querySelectorAll(".type-link");
  typeButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      const url = new URL(window.location.href);
      url.searchParams.set("type", button.dataset.type);
      window.location.href = url.toString();
    });
  });

  renderQuestion(0);

  const deleteConfirmModal = document.querySelector("#delete-confirm-modal");
  const deleteConfirmOverlay = document.querySelector(
    "#delete-confirm-overlay",
  );
  let deleteQuiz = null;

  document.querySelectorAll(".delete-quiz").forEach((button) => {
    button.addEventListener("click", (e) => {
      deleteQuiz = button.dataset.id;
      deleteConfirmModal.classList.remove("hidden");
      deleteConfirmModal.classList.add("flex");
    });
  });

  const closeDeleteConfirmModal = () => {
    deleteConfirmModal.classList.add("hidden");
    deleteConfirmModal.classList.remove("flex");
    deleteQuiz = null;
  };
  document
    .querySelector("#cancel-delete")
    .addEventListener("click", closeDeleteConfirmModal);
  deleteConfirmOverlay.addEventListener("click", closeDeleteConfirmModal);

  document.querySelector("#confirm-delete").addEventListener("click", (e) => {
    const franchise = e.currentTarget.dataset.slug;
    window.location.href = `/franchises/${franchise}/deletequiz/${deleteQuiz}`;
  });
});

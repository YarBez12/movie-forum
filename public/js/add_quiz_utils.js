// Entire modal and overlay
const addQuizModal = document.querySelector("#add-quiz-modal");
const addQuizOverlay = document.querySelector("#add-quiz-modal-overlay");
const quizModalTitle = document.querySelector("#quiz-modal-title");
// Entire quiz form in modal
const quizForm = document.querySelector("#quiz-form");
// Quiz id that will be passed to controller during editing
const editQuizId = document.querySelector("#edit-quiz-id");
// Quiz form elements
const submitButton = quizForm.querySelector('button[type="submit"]');
const quizTitleInput = quizForm.querySelector('input[name="title"]');
const quizImageInput = quizForm.querySelector('input[name="image"]');
const quizImagePreviewContainer = document.querySelector(
  "#quiz-image-preview-container",
);
const quizImagePreview = document.querySelector("#quiz-image-preview");
const quizCountInput = quizForm.querySelector('input[name="countOfQuestions"]');
const quizDescriptionInput = quizForm.querySelector(
  'textarea[name="description"]',
);
const difficultyInput = document.getElementById("difficulty-input");
const difficultyLabel = document.getElementById("difficulty-label");
const questionContainer = document.querySelector("#questions-container");
const addQuestionButton = document.querySelector("#add-question");
const addQuizCancelButton = document.querySelector("#cancel-add-quiz");

// Modal window setup for editing a quiz
// Set up data in all elements
const setQuizEditWindow = (action, button, franchiseInput = null, franchiseLabel = null) => {
  quizModalTitle.textContent = "Edit Quiz";
  submitButton.textContent = "Save Changes";
  quizForm.action = action;
  const quizId = button.dataset.id;
  const quizTitle = button.dataset.title;
  const quizDescription = button.dataset.description;
  const quizDifficulty = button.dataset.difficulty;
  const quizCountOfQuestions = button.dataset.countOfQuestions;
  const quizImage = button.dataset.image;

  const quizFranchiseId = button.dataset.franchiseId;
  const quizFranchiseTitle = button.dataset.franchiseTitle;

  quizTitleInput.value = quizTitle;
  quizDescriptionInput.value = quizDescription;
  quizCountInput.value = quizCountOfQuestions;
  // Setup current image preview
  if (quizImage) {
    quizImagePreviewContainer.classList.remove("hidden");
    quizImagePreview.src = quizImage;
  } else {
    quizImagePreviewContainer.classList.add("hidden");
    quizImagePreview.src = "";
  }
  quizImageInput.value = "";

  // Setup current difficulty or leave empty
  if (quizDifficulty) {
    difficultyInput.value = quizDifficulty;
    difficultyLabel.textContent = quizDifficulty;
    difficultyLabel.classList.remove("text-white/40");
  } else {
    difficultyInput.value = "";
    difficultyLabel.textContent = "Select Difficulty";
    difficultyLabel.classList.add("text-white/40");
  }

  // For general quizzes catalog setup selected franchise
  // For franchise page they will be selected in form and disabled
  if (franchiseInput && quizFranchiseId) {
    franchiseInput.value = quizFranchiseId;
    franchiseLabel.textContent = quizFranchiseTitle;
    franchiseLabel.classList.remove("text-white/40");
  } else if (franchiseInput) {
    franchiseInput.value = "";
    franchiseLabel.textContent = "Select Franchise";
    franchiseLabel.classList.add("text-white/40");
  }

  editQuizId.value = quizId;
  // Reset question container
  questionContainer.innerHTML = "";
  // Render questions list
  const questions = JSON.parse(button.dataset.questions || "[]");
  // If no questions for this quiz, render empty question sector
  if (questions.length === 0) {
    renderQuestion(0);
  } else {
    // Else render all questions
    questions.forEach((question, index) => {
      renderQuestion(index, question);
    });
  }

  addQuizModal.classList.remove("hidden");
  addQuizModal.classList.add("flex");
};

// Modal window setup for adding a new quiz
// All elements will be reset
const setQuizAddWindow = (action, franchiseInput = null, franchiseLabel = null) => {
  quizModalTitle.textContent = "Create New Quiz";
  submitButton.textContent = "Create Quiz";
  quizForm.action = action;
  quizForm.reset();
  editQuizId.value = "";
  difficultyInput.value = "";
  difficultyLabel.textContent = "Select Difficulty";
  difficultyLabel.classList.add("text-white/40");
  // Reset franchise only if it is not a franchise page
  if (franchiseLabel) {
    franchiseInput.value = "";
    franchiseLabel.textContent = "Select Franchise";
    franchiseLabel.classList.add("text-white/40");
  }
  quizImagePreviewContainer.classList.add("hidden");
  quizImagePreview.src = "";
  quizImageInput.value = "";
  // Reset question container and render empty question
  questionContainer.innerHTML = "";
  renderQuestion(0);
  addQuizModal.classList.remove("hidden");
  addQuizModal.classList.add("flex");
};

// Close modal window
const closeAddQuiz = () => {
  addQuizModal.classList.add("hidden");
  addQuizModal.classList.remove("flex");
};

addQuizOverlay.addEventListener("click", closeAddQuiz);
addQuizCancelButton.addEventListener("click", closeAddQuiz);

// General setup method for dropdown menu
function setupSelect(buttonId, menuId, inputId, labelId) {
  const button = document.getElementById(buttonId);
  const menu = document.getElementById(menuId);
  const input = document.getElementById(inputId);
  const label = document.getElementById(labelId);

  // Click on button to show/hide menu
  button.addEventListener("click", (e) => {
    e.stopPropagation();
    document.querySelectorAll(".menu").forEach((m) => {
      if (m != menu) {
        m.classList.add("hidden");
      }
    });
    menu.classList.toggle("hidden");
  });

  // Click on option to select it
  menu.querySelectorAll("button").forEach((optionButton) => {
    optionButton.addEventListener("click", () => {
      input.value = optionButton.dataset.value;
      label.textContent = optionButton.textContent;
      label.classList.remove("text-white/40");
      menu.classList.add("hidden");
    });
  });
  // Close menu if clicked outside
  document.addEventListener("click", (e) => {
    if (!menu.contains(e.target) && e.target !== button) {
      menu.classList.add("hidden");
    }
  });
}

// Setup dropdown for difficulty
setupSelect(
  "difficulty-select",
  "difficulty-menu",
  "difficulty-input",
  "difficulty-label",
);

// Register handlebars helper
// Helper for incrementing question index 
Handlebars.registerHelper("indexFromOne", (index) => parseInt(index) + 1);

// Get question template from DOM
const questionTemplate = Handlebars.compile(
  document.querySelector("#question-template").innerHTML,
);

// Render one question
function renderQuestion(index, question = null) {
  questionContainer.insertAdjacentHTML(
    "beforeend",
    // Render template with question index
    questionTemplate({
      questionIndex: index,
    }),
  );
  // If question is provided, fill it
  if (question) {
    // Get last question
    const lastQuestionBlock = questionContainer.lastElementChild;
    // Set question text
    const questionTextInput = lastQuestionBlock.querySelector(
      `input[name="questions[${index}][questionText]"]`,
    );
    questionTextInput.value = question.questionText;
    // Set question explanation
    const explanationInput = lastQuestionBlock.querySelector(
      `textarea[name="questions[${index}][explanation]"]`,
    );
    if (question.explanation) {
      explanationInput.value = question.explanation;
    }
    // Set all question options
    const optionInputs = lastQuestionBlock.querySelectorAll(
      `input[name^="questions[${index}][options]"]`,
    );
    const options = question.options || [];
    optionInputs.forEach((optionText, optionIndex) => {
      if (options[optionIndex]) {
        optionText.value = options[optionIndex];
      }
    });

    // Select correct option
    const correctIndex = question.correctIndex;
    const correctIndexRadio = lastQuestionBlock.querySelector(
      `input[value="${correctIndex}"]`,
    );
    if (correctIndexRadio) correctIndexRadio.checked = true;
  }
}

// Handle add new empty question
addQuestionButton.addEventListener("click", (e) => {
  renderQuestion(questionContainer.children.length);
});

// Handle remove question when click on remove button
questionContainer.addEventListener("click", (e) => {
  if (e.target.closest(".remove-question")) {
    // Remove question block from DOM
    e.target.closest(".question-block").remove();
    // Get all question blocks after removed
    const allQuestionBlocks =
      questionContainer.querySelectorAll(".question-block");
    // Update questions indexes
    allQuestionBlocks.forEach((questionBlock, index) => {
      // Update question title with correct number
      questionBlock.querySelector(".question-label").textContent =
        `Question ${index + 1}`;
        // Update all input names to match new index
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

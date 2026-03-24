"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const addQuizModal = document.querySelector("#add-quiz-modal");
  const addQuizOverlay = document.querySelector("#add-quiz-modal-overlay");
  const addQuizOpenButton = document.querySelector("#add-quiz");
  const addQuizCancelButton = document.querySelector("#cancel-add-quiz");

  addQuizOpenButton.addEventListener("click", () => {
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

  function renderQuestion(index) {
    questionContainer.insertAdjacentHTML(
      "beforeend",
      questionTemplate({
        questionIndex: index,
      }),
    );
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
        questionBlock.querySelectorAll("input").forEach((input) => {
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

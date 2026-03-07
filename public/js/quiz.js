"use strict";

document.addEventListener("DOMContentLoaded", () => {
  // Current score
  const scoreCount = document.querySelector("#score-count");
  let score = 0;
  // IDs of already answered questions
  let selected = new Set();
  // All buttons that contain answer options to questions
  const answerButtons = document.querySelectorAll(".answer-button");
  // Total number of questions
  const totalQuestions = document.querySelectorAll(".question-section").length;

  // Modal window elements
  const modal = document.querySelector("#finish-quiz-modal");
  const modalTitle = document.querySelector("#finish-quiz-modal-title");
  const modalSubtitle = document.querySelector("#finish-quiz-modal-subtitle");
  const modalMessage = document.querySelector("#finish-quiz-modal-message");
  const modalOverlay = document.querySelector("#finish-quiz-modal-overlay");

  // Modal window buttons
  const actionModalButton = document.querySelector("#finish-quiz-modal-action");
  const exitModalButton = document.querySelector("#finish-quiz-modal-exit");
  const closeModalButton = document.querySelector("#finish-quiz-modal-close");

  // Show modal window with quiz results
  const openModal = () => {
    modal.classList.remove("hidden");
    modal.classList.add("flex");
  };

  // Close modal window with quiz results
  const closeModal = () => {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  };

  // Close modal when click on button or outside modal
  modalOverlay.addEventListener("click", closeModal);
  closeModalButton.addEventListener("click", closeModal);

  // Handle answer option selection
  answerButtons.forEach((btn) =>
    btn.addEventListener("click", (e) => {
      // Find corresponding question
      const questionSection = btn.closest(".question-section");
      const questionId = questionSection.dataset.questionId;
      
      // If question is already answered, return
      if (selected.has(questionId)) return;
      selected.add(questionId);
      
      // Indexes to check if user right
      const selectedIndex = btn.dataset.selectedIndex;
      const correctIndex = questionSection.dataset.correctIndex;

      // Elements that show feedback to user
      const actionText = questionSection.querySelector(".action-text");
      const allQuestionOptions =
        questionSection.querySelectorAll(".answer-button");

      const comment = questionSection.querySelector(".comment");
      const commentTitle = comment.querySelector(".comment-title");
      const commentIcon = comment.querySelector(".comment-icon");
      const commentHeading = comment.querySelector(".comment-heading");

      // Show comment with explanation
      comment.classList.remove("hidden");

      // Handle right answer
      if (selectedIndex === correctIndex) {
        btn.classList.add("is-button-correct");
        actionText.textContent = "You answered correctly.";
        scoreCount.textContent = ++score;
        comment.classList.add("comment-correct-border", "comment-correct");
        commentTitle.classList.add("text-emerald-300");
        commentIcon.classList.add("bg-emerald-400/20");
        commentIcon.textContent = "✓";
        commentHeading.textContent = "Correct answer";
      } 
      // Handle wrong answer
      else {
        btn.classList.add("is-button-wrong");
        actionText.textContent = "You answered incorrectly.";
        const correctButton = allQuestionOptions[correctIndex];
        correctButton.classList.add("is-button-correct");
        comment.classList.add("comment-wrong-border", "comment-wrong");
        commentTitle.classList.add("text-red-300");
        commentIcon.classList.add("bg-red-400/20");
        commentIcon.textContent = "✕";
        commentHeading.textContent = "Incorrect answer";
      }

      // Deativate all buttons with answer options for this question
      allQuestionOptions.forEach((b) => {
        b.disabled = true;
        b.classList.remove(
          "cursor-pointer",
          "hover:bg-white/10",
          "hover:ring-white/40",
          "hover:ring-2",
        );
        b.classList.add("opacity-75");
      });
    }),
  );

  // Handle finish quiz selection
  const finishButton = document.querySelector("#finish-button");
  finishButton.addEventListener("click", () => {
    const answeredQuestions = selected.size;

    // Quiz is not finished
    // Not all questions are answered
    if (answeredQuestions < totalQuestions) {
      modalTitle.textContent = "You can’t finish yet";
      modalSubtitle.textContent = "Answer all questions first.";
      modalMessage.textContent = `You answered ${answeredQuestions} of ${totalQuestions}.`;

      exitModalButton.classList.add("hidden");
      actionModalButton.textContent = "OK";
      actionModalButton.onclick = closeModal;
    } 
    // Quiz is finished
    else {
      modalTitle.textContent = "Quiz completed!";
      modalSubtitle.textContent = "Here’s your result.";
      modalMessage.textContent = `Your score: ${score} / ${totalQuestions}`;

      // Restart updates current page
      actionModalButton.textContent = "Restart";
      actionModalButton.onclick = () => window.location.reload();

      // Exit returns to previous page
      exitModalButton.classList.remove("hidden");
      exitModalButton.textContent = "Exit";
      exitModalButton.onclick = () => (window.location.href = "/franchises");
    }

    openModal();
  });
});

"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const scoreCount = document.querySelector("#score-count");
    let score = 0;
    let selected = new Set();
    const answerButtons = document.querySelectorAll(".answer-button")
    answerButtons.forEach((btn) => btn.addEventListener("click", (e) => {
        const questionSection = btn.closest(".question-section");
        const questionId = questionSection.dataset.questionId;
        if (selected.has(questionId)) return;
        selected.add(questionId);
        
        const selectedIndex = btn.dataset.selectedIndex;
        const correctIndex = questionSection.dataset.correctIndex;
        
        console.log(selectedIndex);
        console.log(correctIndex);

        const actionText = questionSection.querySelector(".action-text");
        const allQuestionOptions = questionSection.querySelectorAll(".answer-button");

        const comment = questionSection.querySelector(".comment");
        const commentTitle = comment.querySelector(".comment-title");
        const commentIcon = comment.querySelector(".comment-icon");
        const commentHeading = comment.querySelector(".comment-heading");


        comment.classList.remove("hidden");

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

        


        allQuestionOptions.forEach(b => {
            b.disabled = true;
            b.classList.remove("cursor-pointer", "hover:bg-white/10", "hover:ring-white/40", "hover:ring-2");
            b.classList.add("opacity-75");
        });
        

    }));
});
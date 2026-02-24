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

        if (selectedIndex === correctIndex) {
            actionText.textContent = "You answered correctly.";
            scoreCount.textContent = ++score;
        }
        else {
            actionText.textContent = "You answered incorrectly.";
        }

        const allQuestionOptions = questionSection.querySelectorAll(".answer-button")

        allQuestionOptions.forEach(b => {
            b.disabled = true;
            b.classList.remove("cursor-pointer", "hover:bg-white/10", "hover:ring-white/40", "hover:ring-2");
            b.classList.add("opacity-75");
        });
        

    }));
});
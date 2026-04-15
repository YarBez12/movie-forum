"use strict";

import quiz from "../controllers/quiz.js";
import JsonStore from "./json-store.js";

// Get n random elements from array
// Used to get random questions from full pool of quiz questions
const randomElementsFromArray = ([...arr], n = 1) => {
  let m = arr.length;
  while (m) {
    const i = Math.floor(Math.random() * m--);
    [arr[m], arr[i]] = [arr[i], arr[m]];
  }

  return arr.slice(0, n);
};

const quizStore = {
  // Storage of all questions with corresponding quiz id
  questionsStore: new JsonStore("./models/questions-store.json", { info: {} }),
  // Storage of all quizzes with corresponding franchise id
  quizzesStore: new JsonStore("./models/quizzes-store.json", { info: {} }),
  questionsCollection: "questions",
  quizzesCollection: "quizzes",

  // Get quiz info by slug
  // Returns quiz and its questions
  getQuiz(slug) {
    const allQuestions = this.questionsStore.findAll(this.questionsCollection);
    const allQuizzes = this.quizzesStore.findAll(this.quizzesCollection);

    // Find quiz by slug
    const selectedQuiz = allQuizzes.find((quiz) => quiz.slug === slug);

    // Get questions of the found quiz
    const filteredQuestions = allQuestions.filter(
      (question) => question.quizId === selectedQuiz.id,
    );

    // Select random question from pool
    const randomQuestions = randomElementsFromArray(
      filteredQuestions,
      selectedQuiz.countOfQuestions,
    );

    return {
      quiz: selectedQuiz,
      questions: randomQuestions,
    };
  },
  incrementQuizViews(quizId) {
    const quiz = this.quizzesStore.findOneBy(this.quizzesCollection, (quiz) => quiz.id === quizId);
    if (quiz) {
      quiz.views = (quiz.views || 0) + 1;
      this.quizzesStore.editCollection(this.quizzesCollection, quiz.id, quiz);
    }
  },
};

export default quizStore;

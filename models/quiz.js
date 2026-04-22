"use strict";

import quiz from "../controllers/quiz.js";
import JsonStore from "./json-store.js";

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
    const randomQuestions = utils.randomElementsFromArray(
      filteredQuestions,
      selectedQuiz.countOfQuestions,
    );

    return {
      quiz: selectedQuiz,
      questions: randomQuestions,
    };
  },
  // Increment quiz views for certain quiz (after completing quiz)
  incrementQuizViews(quizId) {
    // Get quiz
    const quiz = this.quizzesStore.findOneBy(
      this.quizzesCollection,
      (quiz) => quiz.id === quizId,
    );
    if (quiz) {
      // Increment views
      quiz.views = (quiz.views || 0) + 1;
      // Save
      this.quizzesStore.editCollection(this.quizzesCollection, quiz.id, quiz);
    }
  },
};

export default quizStore;

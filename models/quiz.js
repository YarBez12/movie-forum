"use strict";

import JsonStore from "./json-store.js";

const randomElementsFromArray = ([...arr], n = 1) => {
  let m = arr.length;
  while (m) {
    const i = Math.floor(Math.random() * m--);
    [arr[m], arr[i]] = [arr[i], arr[m]];
  }

  return arr.slice(0, n);
};

const quizeStore = {
  store: new JsonStore("./models/app-store.json", { info: {} }),
  questionsCollection: "questions",
  quizesCollection: "quizes",

  getQuizesInfo(slug) {
    const allQuestions = this.store.findAll(this.questionsCollection);
    const allQuizes = this.store.findAll(this.quizesCollection);

    const selectedQuiz = allQuizes.find((quiz) => quiz.slug === slug);

    const filteredQuestions = allQuestions.filter(
      (question) => question.quizId === selectedQuiz.id,
    );

    const randomQuestions = randomElementsFromArray(filteredQuestions, selectedQuiz.countOfQuestions);

    return {
      quiz: selectedQuiz,
      questions: randomQuestions,
    };
  },
};

export default quizeStore;

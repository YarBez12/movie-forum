"use strict";

import JsonStore from "./json-store.js";
import { v4 as uuidv4 } from "uuid";

const questionsStore = {
  // Storage of all questions with corresponding quiz id
  store: new JsonStore("./models/questions-store.json", {
    info: {},
  }),
  collection: "questions",
  // Add questions to storage based on quiz id
  addQuestions(questions, newQuiz) {
    questions.forEach((question) => {
      const newQuestion = {
        ...question,
        // Generate unique id
        id: uuidv4(),
        quizId: newQuiz.id,
      };
      this.store.addCollection(this.collection, newQuestion);
    });
  },

  // Remove questions from storage for given quiz
  removeQuestions(quiz) {
    // Find questions for given quiz
    const oldQuestions = this.store.findBy(
      this.collection,
      (question) => question.quizId === quiz.id,
    );
    oldQuestions.forEach((question) => {
      this.store.removeCollection(this.collection, question);
    });
  },
};

export default questionsStore;

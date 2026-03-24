"use strict";

import JsonStore from "./json-store.js";
import slugify from "slugify";
import { v4 as uuidv4 } from "uuid";

const franchiseDetailsStore = {
  // Storage of all franchises
  franchisesStore: new JsonStore("./models/franchises-store.json", {
    info: {},
  }),
  // Storage of all quizzes with corresponding franchise id
  quizzesStore: new JsonStore("./models/quizzes-store.json", { info: {} }),
  questionsStore: new JsonStore("./models/questions-store.json", {
    info: {},
  }),
  questionsCollection: "questions",
  franchisesCollection: "franchises",
  quizzesCollection: "quizzes",

  // Get franchise info by its slug
  // Returns franchise and all its quizzes (based on search criteria)
  getFranchise(slug, q = "", type = null) {
    const query = q.trim().toLowerCase();
    const franchises = this.franchisesStore.findAll(this.franchisesCollection);
    const quizzes = this.quizzesStore.findAll(this.quizzesCollection);

    // Find franchise by slug
    const selectedFranchise = franchises.find(
      (franchise) => franchise.slug === slug,
    );
    // Get quizzes of the found franchise (based on search criteria)
    const filteredQuizzes = quizzes.filter((quiz) => {
      if (type === "official" && quiz.userId !== "-1") return false;
      if (type === "community" && quiz.userId === "-1") return false;
      return (
        quiz.franchiseId === selectedFranchise.id &&
        (!query ||
          quiz.title.toLowerCase().includes(query) ||
          quiz.description.toLowerCase().includes(query))
      );
    });

    return {
      franchise: selectedFranchise,
      quizzes: filteredQuizzes,
    };
  },

  addQuiz(
    title,
    franchiseId,
    questions,
    countOfQuestions = null,
    description = null,
    difficulty = null,
  ) {
    const slug = slugify(title, {
      lower: true,
      strict: true,
    });

    const newQuiz = {
      id: uuidv4(),
      title,
      slug,
      description,
      countOfQuestions:
        countOfQuestions && countOfQuestions <= questions.length
          ? countOfQuestions
          : questions.length,
      difficulty,
      image: "/img/img_placeholder.png",
      franchiseId: franchiseId,
      views: 0,
      createdAt: new Date().toISOString().split("T")[0],
      userId: 1,
    };
    this.quizzesStore.addCollection(this.quizzesCollection, newQuiz);

    questions.forEach((question) => {
      const newQuestion = {
        ...question,
        id: uuidv4(),
        quizId: newQuiz.id,
      };
      this.questionsStore.addCollection(this.questionsCollection, newQuestion);
    });
  },

  deleteQuiz(id) {
    const quiz = this.quizzesStore.findOneBy(
      this.quizzesCollection,
      (quiz) => quiz.id === id,
    );
    this.quizzesStore.removeCollection(this.quizzesCollection, quiz);
    const questions = this.questionsStore.findBy(
      this.questionsCollection,
      (question) => question.quizId === quiz.id,
    );
    questions.forEach((question) => {
      this.questionsStore.removeCollection(this.questionsCollection, question);
    });
  },
};
export default franchiseDetailsStore;

"use strict";

import JsonStore from "./json-store.js";

const franchisesStore = {
  // Storage of all franchises
  franchisesStore: new JsonStore("./models/franchises-store.json", {
    info: {},
  }),
  // Storage of all quizzes with corresponding franchise id
  quizzesStore: new JsonStore("./models/quizzes-store.json", { info: {} }),
  franchisesCollection: "franchises",
  quizzesCollection: "quizzes",

  // Get all franchises in the system
  // Returns list of franchises (based on search criteria), each has number of quizzes inside
  getFranchises(q = "") {
    const query = q.trim().toLowerCase();
    const franchises = this.franchisesStore.findBy(
      this.franchisesCollection,
      (franchise) => franchise.title.toLowerCase().includes(query),
    );
    const quizzes = this.quizzesStore.findAll(this.quizzesCollection);

    // Count amount of quizzes for each franchise
    const countOfQuizzes = {};
    for (const quiz of quizzes) {
      const franchiseId = quiz.franchiseId;
      countOfQuizzes[franchiseId] = countOfQuizzes[franchiseId]
        ? countOfQuizzes[franchiseId] + 1
        : 1;
    }

    // Adds additional atribute - number of quizzes
    return franchises.map((franchise) => ({
      ...franchise,
      numberOfQuizzes: countOfQuizzes[franchise.id] ?? 0,
    }));
  },
};

export default franchisesStore;

"use strict";

import JsonStore from "./json-store.js";

const franchiseDetailsStore = {
  // Storage of all franchises
  franchisesStore: new JsonStore("./models/franchises-store.json", {
    info: {},
  }),
  // Storage of all quizzes with corresponding franchise id
  quizzesStore: new JsonStore("./models/quizzes-store.json", { info: {} }),
  franchisesCollection: "franchises",
  quizzesCollection: "quizzes",

  // Get franchise info by its slug
  // Returns franchise and all its quizzes
  getFranchise(slug) {
    const franchises = this.franchisesStore.findAll(this.franchisesCollection);
    const quizzes = this.quizzesStore.findAll(this.quizzesCollection);

    // Find franchise by slug
    const selectedFranchise = franchises.find(
      (franchise) => franchise.slug === slug,
    );
    // Get quizzes of the found franchise
    const filteredQuizzes = quizzes.filter(
      (quiz) => quiz.franchiseId === selectedFranchise.id,
    );

    return {
      franchise: selectedFranchise,
      quizzes: filteredQuizzes,
    };
  },
};
export default franchiseDetailsStore;

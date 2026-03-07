"use strict";

import JsonStore from "./json-store.js";

const quizzesStore = {
      // Storage of all quizzes with corresponding franchise id
  quizzesStore: new JsonStore("./models/quizzes-store.json", { info: {} }),
    // Storage of all franchises
    franchisesStore: new JsonStore("./models/franchises-store.json", { info: {} }),
  quizzesCollection: "quizzes",
  franchisesCollection: "franchises",

  // Get all quizzes in the system
  // Returns quizzes based on search, filter and sort criteria
  // Also returns list of titles of all franchises (for filtering options on the page)
  getQuizzesInfo(q = "", filters = {}, sortOption = null, sortDirection = null) {
    const query = q.trim().toLowerCase();
    const difficulties = filters.difficulty;

    // Get list of franchise IDs based on list of their slugs
    const allFranchises = this.franchisesStore.findAll(this.franchisesCollection);
    const franchiseSlugs = filters.franchise;
    // Filters based on which slugs were provided
    const franchiseIds = franchiseSlugs
      ? allFranchises
          .filter((f) => franchiseSlugs.includes(f.slug))
          .map((f) => f.id)
      : null;

      // Performs search by query and filtering by difficulties and franchises
    let results = this.quizzesStore.findBy(this.quizzesCollection, (quiz) => {
      if (
        query &&
        !quiz.title.toLowerCase().includes(query) &&
        !quiz.description.toLowerCase().includes(query)
      )
        return false;

      if (difficulties && !difficulties.includes(quiz.difficulty.toLowerCase()))
        return false;

      if (franchiseIds && !franchiseIds.includes(quiz.franchiseId))
        return false;

      return true;
    });

    // Performs sort by provided sort option
    // Sets comparable values, then compare based on order direction
    results.sort((a, b) => {
      let value1, value2;
      switch (sortOption) {
        case "difficulty":
          const difficulties = {
            Easy: 1,
            Medium: 2,
            Hard: 3,
          };
          value1 = difficulties[a.difficulty];
          value2 = difficulties[b.difficulty];
          break;
        case "publicationDate":
          value1 = new Date(a.createdAt).getTime();
          value2 = new Date(b.createdAt).getTime();
          break;
        case "questionsCount":
          value1 = a.countOfQuestions;
          value2 = b.countOfQuestions;
          break;
          // Default sort by popularity
        default:
          value1 = a.views;
          value2 = b.views;
      }

      // Sort based on direction
      if (sortDirection === "desc") {
        return value1 > value2 ? -1 : 1;
      } else {
        return value1 > value2 ? 1 : -1;
      }
    });

    // All franchises title and corresponding slugs (to provide them into the link)
    const allFranchisesTitles = allFranchises.map((f) => ({
      title: f.title,
      slug: f.slug,
    }));

    return {
      quizzes: results,
      franchises: allFranchisesTitles,
    };
  },
};

export default quizzesStore;

"use strict";

import quizzesStore from "../models/quizes-store.js";

// Refactor filters got from request into array
// In particular puts single filter into array
const filtersToArray = (filters) => {
  if (!filters) return null;
  if (!Array.isArray(filters)) return [filters];
  return filters;
};

// Controller for all quizzes
const allQuizzes = {
  createView(request, response) {
    // Get search query from request
    const q = request.query.q ? request.query.q : "";
    // Get filters from request
    const filters = {
      difficulty: filtersToArray(request.query.difficulty),
      franchise: filtersToArray(request.query.franchise),
    };
    // Get sort option from request
    const sortOption = request.query.sort || "popularity";
    const sortOptions = {
      popularity: "Popularity",
      difficulty: "Difficulty",
      publicationDate: "Publication Date",
      questionsCount: "Questions Count",
    };
    // Get sort direction from request
    const sortDirection = request.query.dir;
    // Get data from models based on got search, filter and sort options
    const { quizzes, franchises } = quizzesStore.getQuizzesInfo(
      q,
      filters,
      sortOption,
      sortDirection,
    );
    const viewData = {
      title: "Quizzes Catalog",
      // For left main menu selection
      activeMainNav: "quizzes",
      // All quizzes
      quizzes,
      // Search, filter and sort criteria to remember it in further requests
      query: q,
      selectedFilters: filters,
      sortSlug: sortOption,
      sortDirection,
      // Sort option that will be displayed on page for the user
      sortOption: sortOptions[sortOption],
      // Franchises that will be displayed in filter menu
      franchises,
      // Static js file with interaction
      script: "quizes_catalog.js"
    };
    response.render("quizzes_catalog", viewData);
  },
};

export default allQuizzes;

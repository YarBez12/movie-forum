"use strict";

import quizzesStore from "../models/quizes-store.js";
import accounts from "./accounts.js";

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
    const user = accounts.getCurrentUser(request);
    if (!user) {
      return response.redirect("/");
    } else {
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

      const type = request.query.type ? request.query.type : "all";
      // Get data from models based on got search, filter and sort options
      const { quizzes, franchises } = quizzesStore.getQuizzesInfo(
        q,
        filters,
        sortOption,
        sortDirection,
        type,
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
        type,
        // Sort option that will be displayed on page for the user
        sortOption: sortOptions[sortOption],
        // Franchises that will be displayed in filter menu
        franchises,
        // Static js file with interaction
        script: "quizes_catalog.js",
        user,
      };
      response.render("quizzes_catalog", viewData);
    }
  },
  async addQuiz(request, response) {
    const {
      title,
      franchiseId,
      description,
      difficulty,
      countOfQuestions,
      questions,
    } = request.body;
    const image = request.files ? request.files.image : null;
    const user = accounts.getCurrentUser(request);
    await quizzesStore.addQuiz(
      title,
      franchiseId,
      questions,
      user.id,
      countOfQuestions,
      description,
      difficulty,
      image,
    );
    response.redirect("/quizzes");
  },
  async updateQuiz(request, response) {
    const {
      quizId,
      title,
      franchiseId,
      description,
      difficulty,
      countOfQuestions,
      questions,
    } = request.body;
    const image = request.files ? request.files.image : null;
    console.log(request.body);
    console.log("Image:", image);
    await quizzesStore.updateQuiz(
      quizId,
      title,
      franchiseId,
      questions,
      countOfQuestions,
      description,
      difficulty,
      image
    );
    response.redirect("/quizzes");
  },
  async deleteQuiz(request, response) {
    const quizId = request.params.id;
    await quizzesStore.deleteQuiz(quizId);
    response.redirect("/quizzes");
  },
};

export default allQuizzes;

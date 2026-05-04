"use strict";

import franchiseDetailsStore from "../models/quizes-franshises-detail-store.js";
import utils from "../utils/controller/utils.js";
import logger from "../utils/logger.js";

// Controller for single franchise page with all quizzes
const franchise = {
  createView(request, response) {
    // Check if user is logged in and get user data, if not redirect to home login page
    const user = utils.getUserAndRedirect(request, response);
    if (!user) {
      return;
    } else {
      // Get slug from request parameters
      const slug = request.params.slug;
      logger.info("Slug", slug);
      // Get search query from request
      const q = request.query.q ? request.query.q : "";

      // Get sort option from request
      const sortOption = request.query.sort || "popularity";
      // Define sort options for display on page
      const sortOptions = {
        popularity: "Popularity",
        difficulty: "Difficulty",
        publicationDate: "Publication Date",
        questionsCount: "Questions Count",
      };
      // Get sort direction from request
      const sortDirection = request.query.dir || "asc";

      // Get type of quizzes to display (all, comunity, official)
      const type = request.query.type ? request.query.type : "all";
      // Get data from model using slug
      const franchiseDetails = franchiseDetailsStore.getFranchise(
        slug,
        q,
        sortOption,
        sortDirection,
        type,
      );
      logger.info("Franchise details", franchiseDetails);
      const viewData = {
        title: `${franchiseDetails.franchise.title} quizzes`,
        // For left main menu selection
        activeMainNav: "franchises",
        //   Franchise info
        franchise: franchiseDetails.franchise,
        //   Franchise quizzes
        quizzes: franchiseDetails.quizzes,
        // Sort data for display on page
        sortSlug: sortOption,
        sortDirection,
        sortOption: sortOptions[sortOption],
        // Background image custom for every franchise
        backgroundImg: franchiseDetails.franchise.image.url,
        // Search criteria
        query: q,
        // Type of quizzes to display
        type,
        // Static js file with interaction
        scripts: [
          "add_quiz_utils.js",
          "delete_utils.js",
          "sort_utils.js",
          "sort_quizzes.js",
          "type_utils.js",
          "franchise.js",
        ],
        user,
      };
      response.render("franchise_detail", viewData);
    }
  },

  // Add quiz to specific franchise
  async addQuiz(request, response) {
    await utils.addQuiz(
      request,
      response,
      franchiseDetailsStore,
      "/franchises/" + request.body.franchiseSlug,
    );
  },

  // Update quiz in specific franchise
  async updateQuiz(request, response) {
    await utils.updateQuiz(
      request,
      response,
      franchiseDetailsStore,
      "/franchises/" + request.body.franchiseSlug,
    );
  },

  // Delete quiz from specific franchise
  async deleteQuiz(request, response) {
    await utils.deleteQuiz(
      request,
      response,
      franchiseDetailsStore,
      `/franchises/${request.params.slug}`,
    );
  },
};

export default franchise;

"use strict";

import franchiseDetailsStore from "../models/quizes-franshises-detail-store.js";

// Controller for single franchise page with all quizzes
const franchise = {
  createView(request, response) {
    // Get slug from request parameters
    const slug = request.params.slug;
    // Get search query from request
    const q = request.query.q ? request.query.q : "";
    // Get data from model using slug
    const franchiseDetails = franchiseDetailsStore.getFranchise(slug, q);
    const viewData = {
      title: `${franchiseDetails.franchise.title} quizzes`,
      // For left main menu selection
      activeMainNav: "quizzes",
      //   Franchise info
      franchise: franchiseDetails.franchise,
      //   Franchise quizzes
      quizzes: franchiseDetails.quizzes,
      // Background image custom for every franchise
      backgroundImg: franchiseDetails.franchise.image,
      // Search criteria
      query: q,
    };
    response.render("franchise_detail", viewData);
  },
};

export default franchise;

"use strict";

import franchisesStore from "../models/quizes-franshises-store.js";

// Controller for all franchises
const allFranchises = {
  createView(request, response) {
    // Get search query from request
    const q = request.query.q ? request.query.q : "";

    const viewData = {
      title: "Franchises",
      // For left main menu selection
      activeMainNav: "quizzes",
      //   Get info from model
      franchises: franchisesStore.getFranchises(q),
      // Search criteria
      query: q
    };
    response.render("franchises", viewData);
  },
};

export default allFranchises;

"use strict";

import franchisesStore from "../models/quizes-franshises-store.js";

// Controller for all franchises
const allFranchises = {
  createView(request, response) {
    const viewData = {
      title: "Franchises",
      // For left main menu selection
      activeMainNav: "quizzes",
      //   Get info from model
      franchises: franchisesStore.getFranchises(),
    };
    response.render("franchises", viewData);
  },
};

export default allFranchises;

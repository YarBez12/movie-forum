"use strict";

import franchisesStore from "../models/quizes-franshises-store.js";
import accounts from "./accounts.js";

// Controller for all franchises
const allFranchises = {
  createView(request, response) {
        const user = accounts.getCurrentUser(request);
    if (!user) {
      return response.redirect("/");
    } else {
    // Get search query from request
    const q = request.query.q ? request.query.q : "";
    const type = request.query.type ? request.query.type : "all";

    const viewData = {
      title: "Franchises",
      // For left main menu selection
      activeMainNav: "franchises",
      //   Get info from model
      franchises: franchisesStore.getFranchises(q, type),
      // Search criteria
      query: q,
      type,
      script: "franchises.js",
      user,
    };
    response.render("franchises", viewData);
  }
  },

  addFranchise(request, response) {
    const title = request.body.title;
    franchisesStore.addFranchise(title);
    response.redirect("/franchises");
  },
  editFranchise(request, response) {
    const title = request.body.title;
    franchisesStore.editFranchise(request.params.id, title);
    response.redirect("/franchises");
  },

  deleteFranchise(request, response) {
    const franchiseId = request.params.id;
    franchisesStore.deleteFranchise(franchiseId);
    response.redirect("/franchises");
  },
};

export default allFranchises;

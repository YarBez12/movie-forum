"use strict";

import franchisesStore from "../models/quizes-franshises-store.js";
import utils from "../utils/controller/utils.js";

// Controller for all franchises
const allFranchises = {
    // Check if user is logged in and get user data, if not redirect to home login page
  createView(request, response) {
        const user = utils.getUserAndRedirect(request, response);
    if (!user) {
      return;
    } else {
    // Get search query from request
    const q = request.query.q ? request.query.q : "";
    // Get type of quizzes to display (all, comunity, official)
    const type = request.query.type ? request.query.type : "all";
    // Get sort option from request
    const sortOption = request.query.sort || "title";
    // Define sort options for display on page
    const sortOptions = {
      title: "Title",
      popularity: "Popularity",
      quizzesCount: "Quizzes Count",
    };
    // Get sort direction from request
    const sortDirection = request.query.dir || "asc"; 

    // Get data from model based on got search and sort options
    const franchises = franchisesStore.getFranchises(q, sortOption, sortDirection, type);

    const viewData = {
      title: "Franchises",
      // For left main menu selection
      activeMainNav: "franchises",
      //   Get info from model
      franchises: franchises,
      // Sort data for display on page
      sortSlug: sortOption,
      sortDirection,
      sortOption: sortOptions[sortOption],
      // Search criteria
      query: q,
      // Type of franchises to display
      type,
      // Static js file with interaction
      script: "franchises.js",
      user,
    };
    response.render("franchises", viewData);
  }
  },

  async addFranchise(request, response) {
    const title = request.body.title;
    const image = request.files ? request.files.image : null;
    const user = utils.getCurrentUser(request);
    await franchisesStore.addFranchise(title, user.id, image);
    response.redirect("/franchises");
  },

  async deleteFranchise(request, response) {
    const franchiseId = request.params.id;
    franchisesStore.deleteFranchise(franchiseId);
    response.redirect("/franchises");
  },

  async updateFranchise(request, response) {
    const {
      franchiseId,
      title,
    } = request.body;
    const image = request.files ? request.files.image : null;
    await franchisesStore.updateFranchise(
      franchiseId,
      title,
      image,
    );
    response.redirect("/franchises");
  },
};

export default allFranchises;

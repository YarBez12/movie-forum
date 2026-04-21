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
    const sortOption = request.query.sort || "title";
    const sortOptions = {
      title: "Title",
      popularity: "Popularity",
      quizzesCount: "Quizzes Count",
    };
    // Get sort direction from request
    const sortDirection = request.query.dir || "asc"; 

    const franchises = franchisesStore.getFranchises(q, sortOption, sortDirection, type);

    const viewData = {
      title: "Franchises",
      // For left main menu selection
      activeMainNav: "franchises",
      //   Get info from model
      franchises: franchises,
      sortSlug: sortOption,
      sortDirection,
      sortOption: sortOptions[sortOption],
      // Search criteria
      query: q,
      type,
      script: "franchises.js",
      user,
    };
    response.render("franchises", viewData);
  }
  },

  async addFranchise(request, response) {
    const title = request.body.title;
    const image = request.files ? request.files.image : null;
    const user = accounts.getCurrentUser(request);
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

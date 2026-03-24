"use strict";

import franchiseDetailsStore from "../models/quizes-franshises-detail-store.js";

// Controller for single franchise page with all quizzes
const franchise = {
  createView(request, response) {
    // Get slug from request parameters
    const slug = request.params.slug;
    // Get search query from request
    const q = request.query.q ? request.query.q : "";
    const type = request.query.type ? request.query.type : "all";
    // Get data from model using slug
    const franchiseDetails = franchiseDetailsStore.getFranchise(slug, q, type);
    const viewData = {
      title: `${franchiseDetails.franchise.title} quizzes`,
      // For left main menu selection
      activeMainNav: "franchises",
      //   Franchise info
      franchise: franchiseDetails.franchise,
      //   Franchise quizzes
      quizzes: franchiseDetails.quizzes,
      // Background image custom for every franchise
      backgroundImg: franchiseDetails.franchise.image,
      // Search criteria
      query: q,
      type,
      script: "franchise.js",
    };
    response.render("franchise_detail", viewData);
  },

  addQuiz(request, response) {
    const {
      title,
      description,
      difficulty,
      countOfQuestions,
      questions,
      franchiseSlug,
    } = request.body;
    console.log(request.body);
    console.log(request.params);
    console.log(request.params.id);
    franchiseDetailsStore.addQuiz(
      title,
      request.params.id,
      questions,
      countOfQuestions,
      description,
      difficulty,
    );
    response.redirect("/franchises/" + franchiseSlug);
  },

  deleteQuiz(request, response) {
    const quizId = request.params.id;
    const franchise = request.params.slug;
    franchiseDetailsStore.deleteQuiz(quizId);
    response.redirect(`/franchises/${franchise}`);
  },
};

export default franchise;

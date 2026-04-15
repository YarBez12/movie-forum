"use strict";

import franchiseDetailsStore from "../models/quizes-franshises-detail-store.js";
import accounts from "./accounts.js";

// Controller for single franchise page with all quizzes
const franchise = {
  createView(request, response) {
        const user = accounts.getCurrentUser(request);
    if (!user) {
      return response.redirect("/");
    } else {
    // Get slug from request parameters
    const slug = request.params.slug;
    // Get search query from request
    const q = request.query.q ? request.query.q : "";

    // Get sort option from request
    const sortOption = request.query.sort || "popularity";
    const sortOptions = {
      popularity: "Popularity",
      difficulty: "Difficulty",
      publicationDate: "Publication Date",
      questionsCount: "Questions Count",
    };
    // Get sort direction from request
    const sortDirection = request.query.dir || "asc";


    const type = request.query.type ? request.query.type : "all";
    // Get data from model using slug
    const franchiseDetails = franchiseDetailsStore.getFranchise(slug, q, sortOption, sortDirection, type);
    const viewData = {
      title: `${franchiseDetails.franchise.title} quizzes`,
      // For left main menu selection
      activeMainNav: "franchises",
      //   Franchise info
      franchise: franchiseDetails.franchise,
      //   Franchise quizzes
      quizzes: franchiseDetails.quizzes,
      sortSlug: sortOption,
      sortDirection,
      sortOption: sortOptions[sortOption],
      // Background image custom for every franchise
      backgroundImg: franchiseDetails.franchise.image,
      // Search criteria
      query: q,
      type,
      script: "franchise.js",
      user,
    };
    response.render("franchise_detail", viewData);
  }
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
    const user = accounts.getCurrentUser(request);
    franchiseDetailsStore.addQuiz(
      title,
      request.params.id,
      questions,
      user.id,
      countOfQuestions,
      description,
      difficulty,
    );
    response.redirect("/franchises/" + franchiseSlug);
  },
  updateQuiz(request, response) {
    const {
      quizId,
      title,
      franchiseSlug,
      description,
      difficulty,
      countOfQuestions,
      questions,
    } = request.body;
    franchiseDetailsStore.updateQuiz(
      quizId,
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

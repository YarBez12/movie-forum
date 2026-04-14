"use strict";

import quizStore from "../models/quiz.js";
import accounts from "./accounts.js";

// Controller for single quiz page with all questions
const quiz = {
  createView(request, response) {
        const user = accounts.getCurrentUser(request);
    if (!user) {
      return response.redirect("/");
    } else {
    // Get slug from request parameters
    const slug = request.params.slug;
    // Get data from model using slug
    const quizDetails = quizStore.getQuiz(slug);
    console.log(quizDetails);
    const viewData = {
      title: quizDetails.quiz.title,
      //   For left main menu selection
      activeMainNav: "quizzes",
      // Quiz info
      quiz: quizDetails.quiz,
      // Randomly selected questions
      questions: quizDetails.questions,
      // Background image custom for every quiz
      backgroundImg: quizDetails.quiz.image,
      // Static js file with interaction
      script: "quiz.js",
      user,
    };
    response.render("quiz", viewData);
  }
  },
};

export default quiz;

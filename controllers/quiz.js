"use strict";

import playsStore from "../models/plays-store.js";
import quizStore from "../models/quiz.js";
import utils from "../utils/controller/utils.js";

// Controller for single quiz page with all questions
const quiz = {
  createView(request, response) {
    // Check if user is logged in and get user data, if not redirect to home login page
    const user = utils.getUserAndRedirect(request, response);
    if (!user) {
      return;
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
        backgroundImg: quizDetails.quiz.image.url,
        // Static js file with interaction
        scripts: ["quiz.js"],
        user,
      };
      response.render("quiz", viewData);
    }
  },
  // Handle quiz completion
  exitQuiz(request, response) {
    const user = utils.getCurrentUser(request);
    // Get quiz id, score and total questions from request body
    const quizId = request.params.id;
    const correctAnswers = request.body.score;
    const totalQuestions = request.body.totalQuestions;
    // Get next URL to redirect after processing quiz results
    const nextURL = request.body.nextURL;
    // Increment quiz views for quiz
    quizStore.incrementQuizViews(quizId);
    // Add play to model, then redirect to next URL
    playsStore.addPlay(user.id, quizId, correctAnswers, totalQuestions);
    response.redirect(nextURL);
  },
};

export default quiz;

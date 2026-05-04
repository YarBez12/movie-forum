"use strict";

import usersStore from "../../models/users-store.js";
import logger from "../utils/logger.js";


// General utils for controllers
const utils = {
  // Get current user and redirect to home login page if not logged in
  getUserAndRedirect(request, response) {
    const user = this.getCurrentUser(request);
    if (!user) {
      response.redirect("/");
      return null;
    } else {
      // Return user if logged in
      return user;
    }
  },

  // Get current user from cookie and return user object
  getCurrentUser(request) {
    const userId = request.cookies.user;
    return usersStore.getUserById(userId);
  },

    // Check if username or email is already taken by another user
  checkUniqueUsenameEmail(username, email, currentUserId = null) {
    // Get existing user with the same username or email
    const existingUsername = usersStore.getUserByNickname(username);
    const existingEmail = usersStore.getUserByEmail(email);

    // If there is an existing user with the same username or email and it's not the current user, return error message
    if (existingUsername && existingUsername.id !== currentUserId) {
      return "Username is already taken.";
    }
    if (existingEmail && existingEmail.id !== currentUserId) {
      return "Email is already registered.";
    }

    return null;
  },

  // Add Quiz at different pages
  async addQuiz(request, response, store, redirectPath) {
    // Get quiz data and image from request
    const {
      title,
      description,
      difficulty,
      countOfQuestions,
      questions,
    } = request.body;
    logger.info("Questions", questions);
    const franchiseId = request.params.id || request.body.franchiseId;
    const image = request.files ? request.files.image : null;
    // Get user from session
    const user = utils.getCurrentUser(request);
    // Add quiz to model and redirect to given page
    await store.addQuiz(
      title,
      franchiseId,
      questions,
      user.id,
      countOfQuestions,
      description,
      difficulty,
      image,
    );
    response.redirect(redirectPath);
  },
  // Update quiz at different pages
  async updateQuiz(request, response, store, redirectPath) {
    // Get quiz data and image from request
    const {
      quizId,
      title,
      description,
      difficulty,
      countOfQuestions,
      questions,
    } = request.body;
    const franchiseId = request.params.id || request.body.franchiseId;
    const image = request.files ? request.files.image : null;
    // Update quiz and redirect to given page
    await store.updateQuiz(
      quizId,
      title,
      franchiseId,
      questions,
      countOfQuestions,
      description,
      difficulty,
      image
    );
    response.redirect(redirectPath);
  },
  // Delete quiz at different pages
  async deleteQuiz(request, response, store, redirectPath) {
    // Get quiz id from request and delete quiz from model, then redirect to given page
    const quizId = request.params.id;
    await store.deleteQuiz(quizId);
    response.redirect(redirectPath);
  }
};

export default utils;

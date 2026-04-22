"use strict";

import accounts from "./accounts.js";
import quizzesStore from "../models/quizes-store.js";
import playsStore from "../models/plays-store.js";
import usersStore from "../models/users-store.js";
import franchisesStore from "../models/quizes-franshises-store.js";
import franchise from "./quizes_franshises_details.js";
import utils from "../utils/controller/utils.js";

const profile = {
  // Get all data for profile page
  getData(user) {
    // Get all quizzes created by user and add additional data to them (questions, franchise title)
    const quizzes = quizzesStore.getQuizzesForUser(user.id);
    const updtatedQuizzes = quizzesStore.addDataToQuizzes(quizzes);
    // Get total number of plays for all quizzes created by user
    const totalPlays = quizzes.reduce((total, quiz) => total + quiz.views, 0);
    // Get total number of completed quizzes by user
    const completedQuizzes = playsStore.getQuizzIdsForUser(user.id).length;
    // Get accuracy for user across all completed quizzes
    const accuracy = playsStore.getAccuracyForUser(user.id) + "%";
    // Get date of first quiz created by user
    const firstQuizDate = quizzesStore.getFirstQuizDateForUser(user.id);
    // Get all franchises for dropdown in quiz creation form
    const allFranchises = franchisesStore.getAllFranchises();
    // Get franchises created by user
    const userFranchises = franchisesStore.getFranchisesForUser(user.id);
    return {
      title: "Profile: " + user.username,
      activeMainNav: "profile",
      user,
      totalPlays,
      completedQuizzes,
      accuracy,
      firstQuizDate,
      quizzes: updtatedQuizzes,
      scripts: [
        "add_franchise_utils.js",
        "add_quiz_utils.js",
        "delete_utils.js",
        "profile.js",
      ],
      franchises: allFranchises,
      userFranchises,
    };
  },
  // Create view for profile page with all user info, quizzes and franchises
  createView(request, response) {
    // Check if user is logged in and get user data, if not redirect to home login page
    const user = utils.getUserAndRedirect(request, response);
    if (!user) {
      return;
    } else {
      // Get all data for profile page and render view
      const viewData = profile.getData(user);
      response.render("profile", viewData);
    }
  },
  // Edit user profile info and avatar
  async editProfile(request, response) {
    // Check if user is logged in and get user data, if not redirect to home login page
    const user = utils.getUserAndRedirect(request, response);
    if (!user) {
      return;
    } else {
      // Get updated profile info and avatar
      const { username, email } = request.body;
      const avatar = request.files ? request.files.image : null;
      // Check if username or email is already taken by another user
      const error = utils.checkUniqueUsenameEmail(username, email, user.id);

      // If there are validation errors, re-render profile page with error message and previous input
      if (error) {
        const viewData = {
          ...profile.getData(user),
          error: error,
        };
        response.render("profile", viewData);
        return;
      }
      // Update user profile in model and redirect to profile page
      await usersStore.updateProfile(user.id, username, email, avatar);
      response.redirect("/profile");
    }
  },
  // Add quiz created by user
  async addQuiz(request, response) {
    await utils.addQuiz(request, response, quizzesStore, "/profile");
  },
  // Edit quiz created by user
  async updateQuiz(request, response) {
    await utils.updateQuiz(request, response, quizzesStore, "/profile");
  },
  // Delete quiz created by user
  async deleteQuiz(request, response) {
    await utils.deleteQuiz(request, response, quizzesStore, "/profile");
  },

  // Add franchise created by user
  async addFranchise(request, response) {
    // Get franchise title and image from request
    const title = request.body.title;
    const user = utils.getCurrentUser(request);
    const image = request.files ? request.files.image : null;
    // Add franchise to model and redirect to profile page
    await franchisesStore.addFranchise(title, user.id, image);
    response.redirect("/profile");
  },

  // Delete franchise created by user
  async deleteFranchise(request, response) {
    // Get franchise id from request and delete franchise from model, then redirect to profile page
    const franchiseId = request.params.id;
    await franchisesStore.deleteFranchise(franchiseId);
    response.redirect("/profile");
  },

  // Edit franchise created by user
  async updateFranchise(request, response) {
    // Get franchise data and image from request
    const { franchiseId, title } = request.body;
    const image = request.files ? request.files.image : null;
    // Update franchise in model and redirect to profile page
    await franchisesStore.updateFranchise(franchiseId, title, image);
    response.redirect("/profile");
  },
};

export default profile;

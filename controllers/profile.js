"use strict";

import accounts from "./accounts.js";
import quizzesStore from "../models/quizes-store.js";
import playsStore from "../models/plays-store.js";
import usersStore from "../models/users-store.js";
import franchisesStore from "../models/quizes-franshises-store.js";
import franchise from "./quizes_franshises_details.js";

const profile = {
  createView(request, response) {
    const user = accounts.getCurrentUser(request);
    if (!user) {
      return response.redirect("/");
    } else {
        // const userQuizzes = quizzesStore.getQuizIdsForUser(user.id);
        // const totalPlays = playsStore.getPlaysForQuizzes(userQuizzes).length;
        const quizzes = quizzesStore.getQuizzesForUser(user.id);
        const updtatedQuizzes = quizzesStore.addDataToQuizzes(quizzes);
        const totalPlays = quizzes.reduce((total, quiz) => total + quiz.views, 0);
        const completedQuizzes = playsStore.getQuizzIdsForUser(user.id).length;
        const accuracy = playsStore.getAccuracyForUser(user.id) + "%";
        const firstQuizDate = quizzesStore.getFirstQuizDateForUser(user.id);
        const allFranchises = franchisesStore.getAllFranchises();
        const userFranchises = franchisesStore.getFranchisesForUser(user.id);
      const viewData = {
        title: "Profile: " + user.username,
        activeMainNav: "profile",
        user,
        totalPlays,
        completedQuizzes,
        accuracy,
        firstQuizDate,
        quizzes: updtatedQuizzes,
        script: "profile.js",
        franchises: allFranchises,
        userFranchises,
      };
      response.render("profile", viewData);
    }
  },
  editProfile(request, response) {
    const user = accounts.getCurrentUser(request);
    if (!user) {
      return response.redirect("/");
    } else {
      const userId = user.id;
      const newUsername = request.body.username;
      const newEmail = request.body.email;
      usersStore.updateProfile(userId, newUsername, newEmail);
      response.redirect("/profile");
    }
  },
  addQuiz(request, response) {
    const {
      title,
      franchiseId,
      description,
      difficulty,
      countOfQuestions,
      questions,
    } = request.body;
    const user = accounts.getCurrentUser(request);
    quizzesStore.addQuiz(
      title,
      franchiseId,
      questions,
      user.id,
      countOfQuestions,
      description,
      difficulty,
    );
    response.redirect("/profile");
  },
  updateQuiz(request, response) {
    const {
      quizId,
      title,
      franchiseId,
      description,
      difficulty,
      countOfQuestions,
      questions,
    } = request.body;
    quizzesStore.updateQuiz(
      quizId,
      title,
      franchiseId,
      questions,
      countOfQuestions,
      description,
      difficulty,
    );
    response.redirect("/profile");
  },
  deleteQuiz(request, response) {
    const quizId = request.params.id;
    quizzesStore.deleteQuiz(quizId);
    response.redirect("/profile");
  },


  addFranchise(request, response) {
    const title = request.body.title;
    const user = accounts.getCurrentUser(request);
    franchisesStore.addFranchise(title, user.id);
    response.redirect("/profile");
  },

  deleteFranchise(request, response) {
    const franchiseId = request.params.id;
    franchisesStore.deleteFranchise(franchiseId);
    response.redirect("/profile");
  },

  updateFranchise(request, response) {
    const {
      franchiseId,
      title,
    } = request.body;
    franchisesStore.updateFranchise(
      franchiseId,
      title
    );
    response.redirect("/profile");
  },
};

export default profile;

"use strict";

import accounts from "./accounts.js";
import quizzesStore from "../models/quizes-store.js";
import playsStore from "../models/plays-store.js";
import usersStore from "../models/users-store.js";
import franchisesStore from "../models/quizes-franshises-store.js";
import franchise from "./quizes_franshises_details.js";

const profile = {
  getData(user) {
    const quizzes = quizzesStore.getQuizzesForUser(user.id);
    const updtatedQuizzes = quizzesStore.addDataToQuizzes(quizzes);
    const totalPlays = quizzes.reduce((total, quiz) => total + quiz.views, 0);
    const completedQuizzes = playsStore.getQuizzIdsForUser(user.id).length;
    const accuracy = playsStore.getAccuracyForUser(user.id) + "%";
    const firstQuizDate = quizzesStore.getFirstQuizDateForUser(user.id);
    const allFranchises = franchisesStore.getAllFranchises();
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
      script: "profile.js",
      franchises: allFranchises,
      userFranchises,
    };
  },
  createView(request, response) {
    const user = accounts.getCurrentUser(request);
    if (!user) {
      return response.redirect("/");
    } else {
      const viewData = profile.getData(user);
      response.render("profile", viewData);
    }
  },
  async editProfile(request, response) {
    const user = accounts.getCurrentUser(request);
    if (!user) {
      return response.redirect("/");
    } else {
      const { username, email } = request.body;
      const avatar = request.files ? request.files.image : null;
      let error = "";
      const existingUsername = usersStore.getUserByNickname(username);
      const existingEmail = usersStore.getUserByEmail(email);
      if (existingUsername && existingUsername.id !== user.id) {
        error = "Username is already taken.";
      } else if (existingEmail && existingEmail.id !== user.id) {
        error = "Email is already registered.";
      }
      
      if (error) {
          const viewData = {
              ...profile.getData(user),
              error: error,
          };
          response.render("profile", viewData);
          return;
      }
      await usersStore.updateProfile(user.id, username, email, avatar);
      response.redirect("/profile");
    }
  },
  async addQuiz(request, response) {
    const {
      title,
      franchiseId,
      description,
      difficulty,
      countOfQuestions,
      questions,
    } = request.body;
    const user = accounts.getCurrentUser(request);
    const image = request.files ? request.files.image : null;
    await quizzesStore.addQuiz(
      title,
      franchiseId,
      questions,
      user.id,
      countOfQuestions,
      description,
      difficulty,
      image,
    );
    response.redirect("/profile");
  },
  async updateQuiz(request, response) {
    const {
      quizId,
      title,
      franchiseId,
      description,
      difficulty,
      countOfQuestions,
      questions,
    } = request.body;
    const image = request.files ? request.files.image : null;
    await quizzesStore.updateQuiz(
      quizId,
      title,
      franchiseId,
      questions,
      countOfQuestions,
      description,
      difficulty,
      image
    );
    response.redirect("/profile");
  },
  async deleteQuiz(request, response) {
    const quizId = request.params.id;
    await quizzesStore.deleteQuiz(quizId);
    response.redirect("/profile");
  },

  async addFranchise(request, response) {
    const title = request.body.title;
    const user = accounts.getCurrentUser(request);
    const image = request.files ? request.files.image : null;
    await franchisesStore.addFranchise(title, user.id, image);
    response.redirect("/profile");
  },

  async deleteFranchise(request, response) {
    const franchiseId = request.params.id;
    await franchisesStore.deleteFranchise(franchiseId);
    response.redirect("/profile");
  },

  async updateFranchise(request, response) {
    const { franchiseId, title } = request.body;
    const image = request.files ? request.files.image : null;
    await franchisesStore.updateFranchise(franchiseId, title, image);
    response.redirect("/profile");
  },
};

export default profile;

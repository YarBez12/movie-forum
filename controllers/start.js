"use strict";

import appInfoStore from "../models/app-info.js";
import utils from "../utils/controller/utils.js";
import franchisesStore from "../models/quizes-franshises-store.js";
import usersStore from "../models/users-store.js";
import quizzesStore from "../models/quizes-store.js";
import playsStore from "../models/plays-store.js";

// Controller for start page
const start = {
  createView(request, response) {
    // Check if user is logged in and get user data, if not redirect to home login page
    const user = utils.getUserAndRedirect(request, response);
    if (!user) {
      return;
    } else {
      // Get franchises with most quizzes (number and list)
      const franchisesWithMostQuizzes =
        franchisesStore.getFranchisesWithMostQuizzes();
      // Get users with most completed quizzes (number and list)
      const usersWithMostCompletedQuizzes =
        usersStore.getUsersWithMostCompletedQuizzes();
      // Get number of active users (creators)
      const numberOfActiveUsers = usersStore.getNumberOfActiveUsers();
      // Get total number of quizzes in the system
      const totalNumberOfQuizzes = quizzesStore.getTotalNumberOfQuizzes();
      // Get hardest quizzes (list and accuracy)
      const hardestQuizzes = quizzesStore.getHardestQuiz();
      // Get most popular quizzes for current month (list and number of plays)
      const popularMonthQuizzes = quizzesStore.getMostPopularMonthQuiz();
      // Get average accuracy across all quizzes
      const averageAccuracy = playsStore.getAverageAccuracy() + "%";
      // Get total number of answers given across all quizzes
      const totalAnswers = playsStore.getTotalNumberOfAnswers();
      const viewData = {
        title: "Movie Forum",
        //   For left main menu selection
        activeMainNav: "main",
        //   Get info from model
        info: appInfoStore.getAppInfo(),
        user,
        popularFranchises: franchisesWithMostQuizzes.franchises,
        highestFranchiseQuizCount: franchisesWithMostQuizzes.quizCount,
        topUsers: usersWithMostCompletedQuizzes.users,
        highestCompletedQuizCount: usersWithMostCompletedQuizzes.quizCount,
        numberOfActiveUsers,
        totalNumberOfQuizzes,
        hardestQuizzes: hardestQuizzes.hardestQuizzes,
        hardestQuizzesAccuracy: hardestQuizzes.accuracy + "%",
        popularMonthQuizzes: popularMonthQuizzes.quizzes,
        popularMonthPlays: popularMonthQuizzes.plays,
        averageAccuracy,
        totalAnswers,
      };
      response.render("start", viewData);
    }
  },
};

export default start;

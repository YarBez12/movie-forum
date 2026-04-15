"use strict";

import appInfoStore from "../models/app-info.js";
import accounts from "./accounts.js";
import franchisesStore from "../models/quizes-franshises-store.js";
import usersStore from "../models/users-store.js";
import quizzesStore from "../models/quizes-store.js";
import playsStore from "../models/plays-store.js";

// Controller for start page
const start = {
  createView(request, response) {
    const user = accounts.getCurrentUser(request);
    if (!user) {
      return response.redirect("/");
    } else {
      const franchisesWithMostQuizzes = franchisesStore.getFranchisesWithMostQuizzes();
      const usersWithMostCompletedQuizzes = usersStore.getUsersWithMostCompletedQuizzes();
      const numberOfActiveUsers = usersStore.getNumberOfActiveUsers();
      const totalNumberOfQuizzes = quizzesStore.getTotalNumberOfQuizzes();
      const hardestQuizzes = quizzesStore.getHardestQuiz();
      const popularMonthQuizzes = quizzesStore.getMostPopularMonthQuiz();
      const averageAccuracy = playsStore.getAverageAccuracy() + "%";
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

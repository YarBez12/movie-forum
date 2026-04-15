"use strict";

import accounts from "./accounts.js";
import quizzesStore from "../models/quizes-store.js";
import playsStore from "../models/plays-store.js";

const profile = {
  createView(request, response) {
    const user = accounts.getCurrentUser(request);
    if (!user) {
      return response.redirect("/");
    } else {
        // const userQuizzes = quizzesStore.getQuizIdsForUser(user.id);
        // const totalPlays = playsStore.getPlaysForQuizzes(userQuizzes).length;
        const quizzes = quizzesStore.getQuizzesForUser(user.id);
        const totalPlays = quizzes.reduce((total, quiz) => total + quiz.views, 0);
        const completedQuizzes = playsStore.getQuizzIdsForUser(user.id).length;
        const accuracy = playsStore.getAccuracyForUser(user.id);
        const firstQuizDate = quizzesStore.getFirstQuizDateForUser(user.id);
      const viewData = {
        title: "Profile: " + user.username,
        activeMainNav: "profile",
        user,
        totalPlays,
        completedQuizzes,
        accuracy,
        firstQuizDate,
        quizzes
      };
      response.render("profile", viewData);
    }
  },
};

export default profile;

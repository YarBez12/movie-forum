"use strict";

import JsonStore from "./json-store.js";

const playsStore = {
  store: new JsonStore("./models/plays-store.json", { plays: [] }),
  collection: "plays",

  // Get all plays
  getAllPlays() {
    return this.store.findAll(this.collection);
  },
  getPlaysForQuizzes(quizIds) {
    return this.store.findBy(this.collection, (play) =>
      quizIds.includes(play.quizId),
    );
  },
  getQuizzIdsForUser(userId) {
    const userPlays = this.store.findBy(
      this.collection,
      (play) => play.userId === userId,
    );
    const uniqueQuizIds = new Set(userPlays.map((play) => play.quizId));
    return Array.from(uniqueQuizIds);
  },
  getAccuracyForUser(userId) {
    const userPlays = this.store.findBy(
      this.collection,
      (play) => play.userId === userId,
    );
    if (userPlays.length === 0) return 0;
    const totalQuestions = userPlays.reduce(
      (sum, play) => sum + play.totalQuestions,
      0,
    );
    const correctAnswers = userPlays.reduce(
      (sum, play) => sum + play.correctAnswers,
      0,
    );
    return totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
  },
  addPlay(userId, quizId, correctAnswers, totalQuestions) {
    const play = {
      userId,
      quizId,
      correctAnswers,
      totalQuestions,
      time: new Date().toISOString(),
    };
    this.store.addCollection(this.collection, play);
  }
};

export default playsStore;

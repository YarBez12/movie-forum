"use strict";

import JsonStore from "./json-store.js";
import utils from "../utils/models/utils.js";

const playsStore = {
  // Storage of all plays with corresponding quiz id and user id
  store: new JsonStore("./models/plays-store.json", { plays: [] }),
  collection: "plays",

  // Get all plays
  getAllPlays() {
    return this.store.findAll(this.collection);
  },
  // Get quizzes for certain quiz id
  getPlaysForQuizzes(quizIds) {
    return this.store.findBy(this.collection, (play) =>
      quizIds.includes(play.quizId),
    );
  },
  // Get quiz ids which certain user played
  getQuizzIdsForUser(userId) {
    // Get all plays for user
    const userPlays = this.getUserPlays(userId);
    // Get unique ids
    const uniqueQuizIds = new Set(userPlays.map((play) => play.quizId));
    return Array.from(uniqueQuizIds);
  },
  // Get percentage of correct answers of all quizzes done by user
  getAccuracyForUser(userId) {
    // Get all plays for user
    const userPlays = this.getUserPlays(userId);
    return utils.calculateQuizzesAccuracy(userPlays);
  },
  // Add play
  addPlay(userId, quizId, correctAnswers, totalQuestions) {
    // Create play and add to storage
    const play = {
      userId,
      quizId,
      correctAnswers,
      totalQuestions,
      time: new Date().toISOString(),
    };
    this.store.addCollection(this.collection, play);
  },
  // Get average accuracy for all users
  getAverageAccuracy() {
    // Get all plays
    const allPlays = this.getAllPlays();
    return utils.calculateQuizzesAccuracy(allPlays);
  },
  // Get total number of answers by all users
  getTotalNumberOfAnswers() {
    // Get all plays
    const allPlays = this.getAllPlays();
    // Calculate total number of questions answered by all users
    return allPlays.reduce(
      (sum, play) => sum + parseInt(play.totalQuestions),
      0,
    );
  },

  getUserPlays(userId) {
    return this.store.findBy(this.collection, (play) => play.userId === userId);
  },
};

export default playsStore;

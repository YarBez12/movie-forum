"use strict";

import JsonStore from "./json-store.js";
import slugify from "slugify";
import { v4 as uuidv4 } from "uuid";
import utils from "../utils/models/utils.js";
import quizzesStore from "./quizes-store.js";

const franchiseDetailsStore = {
  // Storage of all franchises
  franchisesStore: new JsonStore("./models/franchises-store.json", {
    info: {},
  }),
  // Storage of all quizzes with corresponding franchise id
  quizzesStore: new JsonStore("./models/quizzes-store.json", { info: {} }),
  questionsStore: new JsonStore("./models/questions-store.json", {
    info: {},
  }),
  questionsCollection: "questions",
  franchisesCollection: "franchises",
  quizzesCollection: "quizzes",

  // Get franchise info by its slug
  // Returns franchise and all its quizzes (based on search criteria)
  getFranchise(
    slug,
    q = "",
    sortOption = null,
    sortDirection = null,
    type = null,
  ) {
    // Normalize search query
    const query = q.trim().toLowerCase();
    const franchises = this.franchisesStore.findAll(this.franchisesCollection);
    const quizzes = this.quizzesStore.findAll(this.quizzesCollection);

    // Find franchise by slug
    const selectedFranchise = franchises.find(
      (franchise) => franchise.slug === slug,
    );
    // Get quizzes of the found franchise (based on search criteria)
    const filteredQuizzes = quizzes.filter((quiz) => {
      // Checks if quiz matches search and type criteria
      if (!utils.checkTypeAndSearch(type, query, quiz)) return false;
      return quiz.franchiseId === selectedFranchise.id;
    });
    // Performs sort by provided sort option
    filteredQuizzes = utils.sortQuizzes(
      filteredQuizzes,
      sortOption,
      sortDirection,
    );
    // Add questions and franchise title to each quiz
    const quizzesWithQuestions = quizzesStore.addDataToQuizzes(filteredQuizzes);

    return {
      franchise: selectedFranchise,
      quizzes: quizzesWithQuestions,
    };
  },

  // Add new quiz to franchise
  async addQuiz(
    title,
    franchiseId,
    questions,
    userId,
    countOfQuestions = null,
    description = null,
    difficulty = null,
    imageFile = null,
  ) {
    await quizzesStore.addQuiz(
      title,
      franchiseId,
      questions,
      userId,
      countOfQuestions,
      description,
      difficulty,
      imageFile,
    );
  },

  // Update existing quiz in franchise
  async updateQuiz(
    id,
    newTitle,
    newFranchiseId,
    newQuestions,
    newCountOfQuestions = null,
    newDescription = null,
    newDifficulty = null,
    newImageFile = null,
  ) {
    await quizzesStore.updateQuiz(
      id,
      newTitle,
      newFranchiseId,
      newQuestions,
      newCountOfQuestions,
      newDescription,
      newDifficulty,
      newImageFile,
    );
  },

  // Delete existing quiz from franchise
  async deleteQuiz(id) {
    await quizzesStore.deleteQuiz(id);
  },
};
export default franchiseDetailsStore;

"use strict";

import JsonStore from "./json-store.js";
import slugify from "slugify";
import { v4 as uuidv4 } from "uuid";
import playsStore from "./plays-store.js";
import utils from "../utils/models/utils.js";
import questionsStore from "./questions-store.js";
import logger from "../utils/logger.js";


const quizzesStore = {
  // Storage of all quizzes with corresponding franchise id
  quizzesStore: new JsonStore("./models/quizzes-store.json", { info: {} }),
  // Storage of all franchises
  franchisesStore: new JsonStore("./models/franchises-store.json", {
    info: {},
  }),
  questionsStore: new JsonStore("./models/questions-store.json", {
    info: {},
  }),
  // Storage of all plays with corrsponding quiz id and user id
  playsStore: new JsonStore("./models/plays-store.json", { info: {} }),
  playsCollection: "plays",
  quizzesCollection: "quizzes",
  franchisesCollection: "franchises",
  questionsCollection: "questions",

  // Get all quizzes in the system
  // Returns quizzes based on search, filter and sort criteria
  // Also returns list of titles of all franchises (for filtering options on the page)
  getQuizzesInfo(
    q = "",
    filters = {},
    sortOption = null,
    sortDirection = null,
    type = null,
  ) {
    // Normalize search query
    const query = q.trim().toLowerCase();
    const difficulties = filters.difficulty;

    // Get list of franchise IDs based on list of their slugs
    const allFranchises = this.franchisesStore.findAll(
      this.franchisesCollection,
    );
    const franchiseSlugs = filters.franchise;
    // Filters based on which slugs were provided
    const franchiseIds = franchiseSlugs
      ? allFranchises
          .filter((f) => franchiseSlugs.includes(f.slug))
          .map((f) => f.id)
      : null;

    // Performs search by query and filtering by difficulties and franchises
    let results = this.quizzesStore.findBy(this.quizzesCollection, (quiz) => {
      // Checks if quiz matches search and type criteria
      if (!utils.checkTypeAndSearch(type, query, quiz)) return false;

      // Check if quiz matches filtering criteria
      if (difficulties && !difficulties.includes(quiz.difficulty.toLowerCase()))
        return false;

      if (franchiseIds && !franchiseIds.includes(quiz.franchiseId))
        return false;

      return true;
    });

    // Performs sort by provided sort option
    results = utils.sortQuizzes(results, sortOption, sortDirection);

    // Add questions and franchise title to each quiz
    const quizzes = this.addDataToQuizzes(results);

    // All franchises title and corresponding slugs (to provide them into the link)
    const allFranchisesTitles = allFranchises.map((f) => ({
      id: f.id,
      title: f.title,
      slug: f.slug,
    }));

    return {
      quizzes,
      franchises: allFranchisesTitles,
    };
  },

  // Add new quiz
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
    try {
      // Generate slug
      const slug = utils.getSlug(title);

      const newQuiz = {
        // Generate unique id
        id: uuidv4(),
        title,
        slug,
        description,
        // Set count of questions based on the number of questions given in the list
        countOfQuestions:
          countOfQuestions && countOfQuestions <= questions.length
            ? countOfQuestions
            : questions.length,
        difficulty,
        // Add image to cloudinary or set default
        image: await utils.addImageToCloudinary(imageFile, this.quizzesStore),
        franchiseId: franchiseId,
        views: 0,
        // Set date in right format
        createdAt: new Date().toISOString().split("T")[0],
        userId: userId,
      };
      logger.info("New quiz", newQuiz);
      this.quizzesStore.addCollection(this.quizzesCollection, newQuiz);

      // Add all questions with corresponding quiz id
      questionsStore.addQuestions(questions, newQuiz);
    } catch (error) {
      console.log("Error");
    }
  },

  // Update existing quiz
  async updateQuiz(
    id,
    newTitle,
    newFranchiseId,
    newQuestions,
    newCountOfQuestions = null,
    newDescription = null,
    newDifficulty = null,
    newImage = null,
  ) {
    // Get new slug
    const slug = utils.getSlug(newTitle);

    // Find quiz by id
    const quiz = this.quizzesStore.findOneBy(
      this.quizzesCollection,
      (quiz) => quiz.id === id,
    );

    const editedQuiz = {
      // Id is the same
      id: quiz.id,
      title: newTitle,
      slug,
      description: newDescription,
      countOfQuestions:
        newCountOfQuestions && newCountOfQuestions <= newQuestions.length
          ? newCountOfQuestions
          : newQuestions.length,
      difficulty: newDifficulty,
      // Add new image to cloudinary or don't change if no image provided
      image: await utils.addImageToCloudinary(
        newImage,
        this.quizzesStore,
        quiz.image,
      ),
      franchiseId: newFranchiseId,
      views: quiz.views,
      createdAt: quiz.createdAt,
      userId: quiz.userId,
    };
    // If new image provided, delete old one
    if (newImage) {
      await utils.deleteImageFromCloudinary(quiz.image, this.quizzesStore);
    }
    this.quizzesStore.editCollection(this.quizzesCollection, id, editedQuiz);

    // Remove old questions
    questionsStore.removeQuestions(quiz);
    // Add new questions with corresponding quiz id
    questionsStore.addQuestions(newQuestions, editedQuiz);
  },

  // Delete existing quiz
  async deleteQuiz(id) {
    // Find quiz by id
    const quiz = this.quizzesStore.findOneBy(
      this.quizzesCollection,
      (quiz) => quiz.id === id,
    );
    // Delete image from cloudinary
    await utils.deleteImageFromCloudinary(quiz.image, this.quizzesStore);
    this.quizzesStore.removeCollection(this.quizzesCollection, quiz);
    // Remove all quiz questions
    questionsStore.removeQuestions(quiz);
  },
  // Get all quiz id for certain user id
  getQuizIdsForUser(userId) {
    const quizzes = this.getQuizzesForUser(userId);
    // Get onlu quiz ids
    const quizIds = quizzes.map((quiz) => quiz.id);
    return quizIds;
  },

  // Get all quizzes for certain user
  getQuizzesForUser(userId) {
    return this.quizzesStore.findBy(
      this.quizzesCollection,
      (quiz) => quiz.userId === userId,
    );
  },

  // Get date when user created first quiz
  getFirstQuizDateForUser(userId) {
    // Get all quizzes for user
    const quizzes = this.getQuizzesForUser(userId);
    if (quizzes.length === 0) return null;
    // Sort based on creation date
    const sortedQuizzes = quizzes.sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    );
    // Return first creation date
    return sortedQuizzes[0].createdAt;
  },

  // Add questions and franchise to quizzes
  addDataToQuizzes(quizzes) {
    const allFranchises = this.franchisesStore.findAll(
      this.franchisesCollection,
    );
    const updatedQuizzes = quizzes.map((quiz) => {
      // Find questions for each quiz
      const questions = this.questionsStore.findBy(
        this.questionsCollection,
        (question) => question.quizId === quiz.id,
      );
      // Find franchise title for each quiz
      const franchiseTitle = allFranchises.find(
        (f) => f.id === quiz.franchiseId,
      )?.title;
      return { ...quiz, questions, franchiseTitle };
    });
    return updatedQuizzes;
  },
  // Get total number of quizzes in the system
  getTotalNumberOfQuizzes() {
    return this.quizzesStore.findAll(this.quizzesCollection).length;
  },

  // Get quizzes with lowest accuracy
  getHardestQuiz(n = 3) {
    const allQuizzes = this.quizzesStore.findAll(this.quizzesCollection);
    logger.info("All quizzes", allQuizzes.length);
    const allPlays = this.playsStore.findAll(this.playsCollection);
    logger.info("All plays", allPlays.length);

    // Set accuracy for each quiz
    const quizzesWithAccuracy = allQuizzes.map((quiz) => {
      // Get plays for certain quiz
      const playsForQuiz = allPlays.filter((play) => play.quizId === quiz.id);
      // Calculate accuracy or set high if no plays
      const accuracy =
        playsForQuiz.length > 0
          ? utils.calculateQuizzesAccuracy(playsForQuiz)
          : 10000;
      return { ...quiz, accuracy };
    });
    logger.info("Quizzes with accuracy", quizzesWithAccuracy.map((q) => { q.title, q.accuracy }));
    // Get lowest accuracy
    const lowestAccuracy = Math.min(
      ...quizzesWithAccuracy.map((q) => q.accuracy),
    );
    logger.info("Lowest accuracy", lowestAccuracy);
    // Get quizzes with lowest accuracy
    let hardestQuizzes = quizzesWithAccuracy.filter(
      (q) => q.accuracy === lowestAccuracy,
    );
    hardestQuizzes = hardestQuizzes.map((quiz) => quiz.title);

    return {
      // Return only n hardest quizzes
      hardestQuizzes: hardestQuizzes.slice(0, n),
      accuracy: lowestAccuracy,
    };
  },

  // Get most popular quizzes for current month
  getMostPopularMonthQuiz(n = 3) {
    const allQuizzes = this.quizzesStore.findAll(this.quizzesCollection);
    logger.info("All quizzes", allQuizzes.length);
    // Get date of month ago
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    logger.info("Month ago date", monthAgo);

    // Get quizzes which were created in last month
    const quizzesLastMonth = allQuizzes.filter(
      (quiz) => new Date(quiz.createdAt) >= monthAgo,
    );
    logger.info("Quizzes last month", quizzesLastMonth);
    // Get highest plays of found quizzes
    const highestViews = Math.max(...quizzesLastMonth.map((q) => q.views), 0);
    logger.info("Highest views", highestViews);
    // Get quizzes with highest plays
    let mostPopularQuizzes = quizzesLastMonth.filter(
      (q) => q.views === highestViews,
    );
    mostPopularQuizzes = mostPopularQuizzes.map((quiz) => quiz.title);
    return {
      // Return only n most popular quizzes
      quizzes: mostPopularQuizzes.slice(0, n),
      plays: highestViews,
    };
  },
};

export default quizzesStore;

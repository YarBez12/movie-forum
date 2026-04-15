"use strict";

import JsonStore from "./json-store.js";
import slugify from "slugify";
import { v4 as uuidv4 } from "uuid";

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
      if (type === "official" && quiz.userId !== "-1") return false;
      if (type === "community" && quiz.userId === "-1") return false;

      if (
        query &&
        !quiz.title.toLowerCase().includes(query) &&
        !quiz.description.toLowerCase().includes(query)
      )
        return false;

      if (difficulties && !difficulties.includes(quiz.difficulty.toLowerCase()))
        return false;

      if (franchiseIds && !franchiseIds.includes(quiz.franchiseId))
        return false;

      return true;
    });

    // Performs sort by provided sort option
    // Sets comparable values, then compare based on order direction
    results.sort((a, b) => {
      let value1, value2;
      switch (sortOption) {
        case "difficulty":
          const difficulties = {
            Easy: 1,
            Medium: 2,
            Hard: 3,
          };
          value1 = difficulties[a.difficulty];
          value2 = difficulties[b.difficulty];
          break;
        case "publicationDate":
          value1 = new Date(a.createdAt).getTime();
          value2 = new Date(b.createdAt).getTime();
          break;
        case "questionsCount":
          value1 = a.countOfQuestions;
          value2 = b.countOfQuestions;
          break;
        // Default sort by popularity
        default:
          value1 = a.views;
          value2 = b.views;
      }

      // Sort based on direction
      if (sortDirection === "desc") {
        return value1 > value2 ? -1 : 1;
      } else {
        return value1 > value2 ? 1 : -1;
      }
    });

    const quizzes = results.map((quiz) => {
      const questions = this.questionsStore.findBy(
        this.questionsCollection,
        (question) => question.quizId === quiz.id,
      );
      const franchiseTitle = allFranchises.find((f) => f.id === quiz.franchiseId)?.title;
      return { ...quiz, questions, franchiseTitle };
    });

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
  addQuiz(
    title,
    franchiseId,
    questions,
    userId,
    countOfQuestions = null,
    description = null,
    difficulty = null,
  ) {
    const slug = slugify(title, {
      lower: true,
      strict: true,
    });

    const newQuiz = {
      id: uuidv4(),
      title,
      slug,
      description,
      countOfQuestions:
        countOfQuestions && countOfQuestions <= questions.length
          ? countOfQuestions
          : questions.length,
      difficulty,
      image: "/img/img_placeholder.png",
      franchiseId: franchiseId,
      views: 0,
      createdAt: new Date().toISOString().split("T")[0],
      userId: userId,
    };
    this.quizzesStore.addCollection(this.quizzesCollection, newQuiz);

    questions.forEach((question) => {
      const newQuestion = {
        ...question,
        id: uuidv4(),
        quizId: newQuiz.id,
      };
      this.questionsStore.addCollection(this.questionsCollection, newQuestion);
    });
  },
  updateQuiz(
    id,
    newTitle,
    newFranchiseId,
    newQuestions,
    newCountOfQuestions = null,
    newDescription = null,
    newDifficulty = null,
  ) {
    const slug = slugify(newTitle, {
      lower: true,
      strict: true,
    });

    const quiz = this.quizzesStore.findOneBy(
      this.quizzesCollection,
      (quiz) => quiz.id === id,
    );

    const editedQuiz = {
      id: quiz.id,
      title: newTitle,
      slug,
      description: newDescription,
      countOfQuestions:
        newCountOfQuestions && newCountOfQuestions <= newQuestions.length
          ? newCountOfQuestions
          : newQuestions.length,
      difficulty: newDifficulty,
      image: "/img/img_placeholder.png",
      franchiseId: newFranchiseId,
      views: quiz.views,
      createdAt: quiz.createdAt,
      userId: quiz.userId,
    };
    this.quizzesStore.editCollection(this.quizzesCollection, id, editedQuiz);

    const oldQuestions = this.questionsStore.findBy(
      this.questionsCollection,
      (question) => question.quizId === quiz.id,
    );
    oldQuestions.forEach((question) => {
      this.questionsStore.removeCollection(this.questionsCollection, question);
    });

    newQuestions.forEach((question) => {
      const newQuestion = {
        ...question,
        id: uuidv4(),
        quizId: editedQuiz.id,
      };
      this.questionsStore.addCollection(this.questionsCollection, newQuestion);
    });
  },
  deleteQuiz(id) {
    const quiz = this.quizzesStore.findOneBy(
      this.quizzesCollection,
      (quiz) => quiz.id === id,
    );
    this.quizzesStore.removeCollection(this.quizzesCollection, quiz);
    const questions = this.questionsStore.findBy(
      this.questionsCollection,
      (question) => question.quizId === quiz.id,
    );
    questions.forEach((question) => {
      this.questionsStore.removeCollection(this.questionsCollection, question);
    });
  },
  getQuizIdsForUser(userId) {
    const quizzes = this.quizzesStore.findBy(
      this.quizzesCollection,
      (quiz) => quiz.userId === userId,
    );
    const quizIds = quizzes.map((quiz) => quiz.id);
    return quizIds;
  },
  getQuizzesForUser(userId) {
    return this.quizzesStore.findBy(
      this.quizzesCollection,
      (quiz) => quiz.userId === userId,
    );
  },
  getFirstQuizDateForUser(userId) {
    const quizzes = this.quizzesStore.findBy(
      this.quizzesCollection,
      (quiz) => quiz.userId === userId,
    );
    if (quizzes.length === 0) return null;
    const sortedQuizzes = quizzes.sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    );
    return sortedQuizzes[0].createdAt; 
  },
};

export default quizzesStore;

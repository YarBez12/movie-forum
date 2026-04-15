"use strict";

import JsonStore from "./json-store.js";
import slugify from "slugify";
import { v4 as uuidv4 } from "uuid";

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
  getFranchise(slug, q = "", sortOption = null, sortDirection = null, type = null) {
    const query = q.trim().toLowerCase();
    const franchises = this.franchisesStore.findAll(this.franchisesCollection);
    const quizzes = this.quizzesStore.findAll(this.quizzesCollection);
    const allFranchises = this.franchisesStore.findAll(
      this.franchisesCollection,
    );

    // Find franchise by slug
    const selectedFranchise = franchises.find(
      (franchise) => franchise.slug === slug,
    );
    // Get quizzes of the found franchise (based on search criteria)
    const filteredQuizzes = quizzes.filter((quiz) => {
      if (type === "official" && quiz.userId !== "-1") return false;
      if (type === "community" && quiz.userId === "-1") return false;
      return (
        quiz.franchiseId === selectedFranchise.id &&
        (!query ||
          quiz.title.toLowerCase().includes(query) ||
          quiz.description.toLowerCase().includes(query))
      );
    });
    filteredQuizzes.sort((a, b) => {
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
    const quizzesWithQuestions = filteredQuizzes.map((quiz) => {
      const questions = this.questionsStore.findBy(
        this.questionsCollection,
        (question) => question.quizId === quiz.id,
      );
      const franchiseTitle = allFranchises.find((f) => f.id === quiz.franchiseId)?.title;
      return { ...quiz, questions, franchiseTitle };
    });

    return {
      franchise: selectedFranchise,
      quizzes: quizzesWithQuestions,
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
        image: quiz.image,
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
};
export default franchiseDetailsStore;

"use strict";

import JsonStore from "./json-store.js";
import slugify from "slugify";
import { v4 as uuidv4 } from "uuid";

const franchisesStore = {
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

  // Get all franchises in the system
  // Returns list of franchises (based on search criteria), each has number of quizzes inside
  getFranchises(q = "", type = null) {
    const query = q.trim().toLowerCase();
    const franchises = this.franchisesStore.findBy(
      this.franchisesCollection,
      (franchise) => {
        if (type === "official" && franchise.userId !== "-1") return false;
        if (type === "community" && franchise.userId === "-1") return false;
        return franchise.title.toLowerCase().includes(query);
      },
    );
    const quizzes = this.quizzesStore.findAll(this.quizzesCollection);

    // Count amount of quizzes for each franchise
    const countOfQuizzes = {};
    for (const quiz of quizzes) {
      const franchiseId = quiz.franchiseId;
      countOfQuizzes[franchiseId] = countOfQuizzes[franchiseId]
        ? countOfQuizzes[franchiseId] + 1
        : 1;
    }

    // Adds additional atribute - number of quizzes
    return franchises.map((franchise) => ({
      ...franchise,
      numberOfQuizzes: countOfQuizzes[franchise.id] ?? 0,
    }));
  },
  addFranchise(title) {
    const slug = slugify(title, {
      lower: true,
      strict: true,
    });

    const newFranchise = {
      id: uuidv4(),
      title,
      slug,
      image: "/img/img_placeholder.png",
      userId: 1,
    };
    this.franchisesStore.addCollection(this.franchisesCollection, newFranchise);
  },
  editFranchise(id, title) {
    const slug = slugify(title, {
      lower: true,
      strict: true,
    });

    const franchise = this.franchisesStore.findOneBy(
      this.franchisesCollection,
      (franchise) => franchise.id === id,
    );
    const updatedFranchise = {
      id,
      title,
      slug,
      image: franchise.image,
      userId: franchise.userId,
    };
    this.franchisesStore.updateCollection(
      this.franchisesCollection,
      updatedFranchise,
    );
  },
  deleteFranchise(id) {
    const franchise = this.franchisesStore.findOneBy(
      this.franchisesCollection,
      (franchise) => franchise.id === id,
    );
    this.franchisesStore.removeCollection(this.franchisesCollection, franchise);

    const quizzes = this.quizzesStore.findBy(
      this.quizzesCollection,
      (quiz) => quiz.franchiseId === id,
    );
    quizzes.forEach((quiz) => {
      this.quizzesStore.removeCollection(this.quizzesCollection, quiz);

      const questions = this.questionsStore.findBy(
        this.questionsCollection,
        (question) => question.quizId === quiz.id,
      );
      questions.forEach((question) => {
        this.questionsStore.removeCollection(
          this.questionsCollection,
          question,
        );
      });
    });
  },
  getAllFranchises() {
    const allFranchises = this.franchisesStore.findAll(
      this.franchisesCollection,
    );
    const allFranchisesTitles = allFranchises.map((f) => ({
      id: f.id,
      title: f.title,
      slug: f.slug,
    }));
    return allFranchisesTitles;
  },
  getFranchisesWithMostQuizzes(n = 3) {
    const franchises = this.franchisesStore.findAll(this.franchisesCollection);
    const quizzes = this.quizzesStore.findAll(this.quizzesCollection);

    const countOfQuizzes = {};
    for (const quiz of quizzes) {
      const franchiseId = quiz.franchiseId;
      countOfQuizzes[franchiseId] = countOfQuizzes[franchiseId]
        ? countOfQuizzes[franchiseId] + 1
        : 1;
    }
    const highestQuizCount = Math.max(...Object.values(countOfQuizzes), 0);
    if (highestQuizCount === 0) {
      return [];
    }
    const franchisesWithHighestQuizCount = franchises.filter(
      (franchise) => countOfQuizzes[franchise.id] === highestQuizCount,
    );
    return {
      franchises: franchisesWithHighestQuizCount.map((franchise) => franchise.title).slice(0, n),
      quizCount: highestQuizCount,
    };
  },
};

export default franchisesStore;

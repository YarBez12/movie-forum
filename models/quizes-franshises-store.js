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
  getFranchises(q = "", sortOption = null, sortDirection = null, type = null) {
    const query = q.trim().toLowerCase();
    const foundfranchises = this.franchisesStore.findBy(
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
    const totalPopularity = {};
    for (const quiz of quizzes) {
      const franchiseId = quiz.franchiseId;
      countOfQuizzes[franchiseId] = countOfQuizzes[franchiseId]
        ? countOfQuizzes[franchiseId] + 1
        : 1;
      totalPopularity[franchiseId] = totalPopularity[franchiseId]
        ? totalPopularity[franchiseId] + (quiz.views || 0)
        : quiz.views || 0;
    }
    let franchises = foundfranchises.map((franchise) => ({
      ...franchise,
      numberOfQuizzes: countOfQuizzes[franchise.id] ?? 0,
      popularity: totalPopularity[franchise.id] ?? 0,
    }));
    if (sortOption) {
      franchises.sort((a, b) => {
        if (sortOption === "title") {
          return a.title.localeCompare(b.title);
        } else if (sortOption === "popularity") {
          return a.popularity - b.popularity;
        } else if (sortOption === "quizzesCount") {
          return a.numberOfQuizzes - b.numberOfQuizzes;
        }
        return 0;
      });
      if (sortDirection === "desc") {
        franchises.reverse();
      }
    }


    // Adds additional atribute - number of quizzes
    return franchises;
  },
  addFranchise(title, userId) {
    const slug = slugify(title, {
      lower: true,
      strict: true,
    });

    const newFranchise = {
      id: uuidv4(),
      title,
      slug,
      image: "/img/img_placeholder.png",
      userId: userId,
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
  updateFranchise(id, newTitle) {
    const slug = slugify(newTitle, {
      lower: true,
      strict: true,
    });

    const franchise = this.franchisesStore.findOneBy(
      this.franchisesCollection,
      (franchise) => franchise.id === id,
    );

    const editedFranchise = {
      id: franchise.id,
      title: newTitle,
      slug,
      image: franchise.image,
      userId: franchise.userId,
    };
    this.franchisesStore.editCollection(
      this.franchisesCollection,
      id,
      editedFranchise,
    );
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
      franchises: franchisesWithHighestQuizCount
        .map((franchise) => franchise.title)
        .slice(0, n),
      quizCount: highestQuizCount,
    };
  },
};

export default franchisesStore;

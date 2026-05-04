"use strict";

import JsonStore from "./json-store.js";
import slugify from "slugify";
import { v4 as uuidv4 } from "uuid";
import utils from "../utils/models/utils.js";
import questionsStore from "./questions-store.js";
import logger from "../utils/logger.js";

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
    // Normalize search query
    const query = q.trim().toLowerCase();
    const foundfranchises = this.franchisesStore.findBy(
      this.franchisesCollection,
      (franchise) => {
        // Checks if franchise matches search and type criteria
        return utils.checkTypeAndSearch(type, query, franchise);
      },
    );
    const quizzes = this.quizzesStore.findAll(this.quizzesCollection);

    // Count amount of quizzes and total plays for each franchise
    const { countOfQuizzes, totalPopularity } = this.getFranchiseStats(quizzes);

    // Set number of quizzes and total plays for each franchise
    let franchises = foundfranchises.map((franchise) => ({
      ...franchise,
      numberOfQuizzes: countOfQuizzes[franchise.id] ?? 0,
      popularity: totalPopularity[franchise.id] ?? 0,
    }));
    // Return sorted franchises
    return utils.sortFranchises(franchises, sortOption, sortDirection);
  },

  // Add new franchise
  async addFranchise(title, userId, imageFile) {
    try {
      // Generate slug based on title
      const slug = utils.getSlug(title);

      const newFranchise = {
        // Generate unique id
        id: uuidv4(),
        title,
        slug,
        // Add image to cloudinary or set default
        image: await utils.addImageToCloudinary(
          imageFile,
          this.franchisesStore,
        ),
        userId: userId,
      };
      this.franchisesStore.addCollection(
        this.franchisesCollection,
        newFranchise,
      );
    } catch (err) {
      console.error("Error adding franchise:", err);
    }
  },

  // Delete franchise and associated quizzes with questions
  async deleteFranchise(id) {
    // Find franchise by id to delete
    const franchise = this.franchisesStore.findOneBy(
      this.franchisesCollection,
      (franchise) => franchise.id === id,
    );
    // Delete franchise image from cloudinary
    await utils.deleteImageFromCloudinary(
      franchise.image,
      this.franchisesStore,
    );
    this.franchisesStore.removeCollection(this.franchisesCollection, franchise);

    // Find quizzes for franchise
    const quizzes = this.quizzesStore.findBy(
      this.quizzesCollection,
      (quiz) => quiz.franchiseId === id,
    );
    quizzes.forEach((quiz) => {
      // Remove quiz
      this.quizzesStore.removeCollection(this.quizzesCollection, quiz);
      // Remove all quiz questions
      questionsStore.removeQuestions(quiz);
    });
  },
  async updateFranchise(id, newTitle, newImageFile) {
    try {
      // Generate slug based on title
      const slug = utils.getSlug(newTitle);

      // Find franchise by id
      const franchise = this.franchisesStore.findOneBy(
        this.franchisesCollection,
        (franchise) => franchise.id === id,
      );

      const editedFranchise = {
        // Id is the same
        id: franchise.id,
        title: newTitle,
        slug,
        // Add image to cloudinary or leave the same
        image: await utils.addImageToCloudinary(
          newImageFile,
          this.franchisesStore,
          franchise.image,
        ),
        userId: franchise.userId,
      };
      // If new image is given, delete old image
      if (newImageFile) {
        await utils.deleteImageFromCloudinary(
          franchise.image,
          this.franchisesStore,
        );
      }
      this.franchisesStore.editCollection(
        this.franchisesCollection,
        id,
        editedFranchise,
      );
    } catch (err) {
      console.error("Error updating franchise:", err);
    }
  },
  // Get list of all franchises
  getAllFranchises() {
    // Get all franchises
    const allFranchises = this.franchisesStore.findAll(
      this.franchisesCollection,
    );
    // Return id, title and slug for each franchise
    const allFranchisesTitles = allFranchises.map((f) => ({
      id: f.id,
      title: f.title,
      slug: f.slug,
    }));
    return allFranchisesTitles;
  },
  // Get franchises that have most quizzes
  getFranchisesWithMostQuizzes(n = 3) {
    const franchises = this.franchisesStore.findAll(this.franchisesCollection);
    const quizzes = this.quizzesStore.findAll(this.quizzesCollection);
    logger.info("All franchises", franchises.length);
    logger.info("All quizzes", quizzes.length);

    // Count number of quizzes for each franchise
    const { countOfQuizzes } = this.getFranchiseStats(quizzes);

    // Find highest number of quizzes
    const highestQuizCount = Math.max(...Object.values(countOfQuizzes), 0);
    if (highestQuizCount === 0) {
      return [];
    }
    logger.info("Highest quiz count", highestQuizCount);
    // Filter franchises with highest number of quizzes
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
  // Get franchises created by certain user
  getFranchisesForUser(userId) {
    let userFranchises = this.franchisesStore.findBy(
      this.franchisesCollection,
      (franchise) => franchise.userId === userId,
    );
    const quizzes = this.quizzesStore.findAll(this.quizzesCollection);

    // Get amount of quizzes for each franchise
    const { countOfQuizzes } = this.getFranchiseStats(quizzes);

    // Set number of quizzes for each franchise
    let franchises = userFranchises.map((franchise) => ({
      ...franchise,
      numberOfQuizzes: countOfQuizzes[franchise.id] ?? 0,
    }));
    return franchises;
  },

  // Get amount of quizzes and total plays for each franchise
  getFranchiseStats(quizzes) {
    // Count amount of quizzes for each franchise
    const countOfQuizzes = {};
    // Count amount of total plays for each franchise
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
    return {
      countOfQuizzes,
      totalPopularity,
    };
  },
};

export default franchisesStore;

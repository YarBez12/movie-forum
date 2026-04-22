"use strict";
import slugify from "slugify";
import { v4 as uuidv4 } from "uuid";

const utils = {
  calculateQuizzesAccuracy(plays) {
    if (plays.length === 0) return null;
    // Calculate total number of questions answered
    const totalQuestions = plays.reduce(
      (sum, play) => sum + parseInt(play.totalQuestions),
      0,
    );
    // Calculate total number of correct answers
    const correctAnswers = plays.reduce(
      (sum, play) => sum + parseInt(play.correctAnswers),
      0,
    );
    return totalQuestions > 0
      ? Math.round((correctAnswers / totalQuestions) * 100)
      : 0;
  },
  // Get n random elements from array
  // Used to get random questions from full pool of quiz questions
  randomElementsFromArray([...arr], n = 1) {
    let m = arr.length;
    while (m) {
      const i = Math.floor(Math.random() * m--);
      [arr[m], arr[i]] = [arr[i], arr[m]];
    }

    return arr.slice(0, n);
  },

  // Checks if item (quiz or franchise) matches search and type criteria
  checkTypeAndSearch(type, query, item) {
    // Official quizzes and franchises have userId as "-1"
    if (type === "official" && item.userId !== "-1") return false;
    if (type === "community" && item.userId === "-1") return false;

    if (
      query &&
      !item.title.toLowerCase().includes(query) &&
      // If item is franchise, it doesn't have description
      (!item.description || !item.description.toLowerCase().includes(query))
    )
      return false;

    return true;
  },

  // Sort franchises by provided sort option
  sortFranchises(franchises, sortOption, sortDirection) {
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
      // If order is descending, reverse
      if (sortDirection === "desc") {
        franchises.reverse();
      }
    }
    return franchises;
  },

  // Performs sort by provided sort option
  // Sets comparable values, then compare based on order direction
  sortQuizzes(quizzes, sortOption, sortDirection) {
    quizzes.sort((a, b) => {
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
    return quizzes;
  },
  // Generate slug based on title
  getSlug(title) {
    return slugify(title, {
      lower: true,
      strict: true,
    });
  },

  // Add image to cloudinary
  async addImageToCloudinary(file, store, defaultImage = null) {
    return file
      ? await store.addToCloudinary(file)
      : defaultImage
        ? defaultImage
        : { url: "/img/img_placeholder.png" };
  },

  // Delete image from cloudinary
  async deleteImageFromCloudinary(item, store) {
    if (item && item.public_id) {
      try {
        await store.deleteFromCloudinary(item.public_id);
      } catch (err) {
        console.error("Error deleting old image from Cloudinary:", err);
      }
    }
  },
};

export default utils;

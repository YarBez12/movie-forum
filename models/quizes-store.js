"use strict";

import JsonStore from "./json-store.js";

const quizesStore = {
  store: new JsonStore("./models/app-store.json", { info: {} }),
  quizesCollection: "quizes",
  franshisesCollection: "franshises",

  getQuizesInfo(q = "", filters = {}, sortOption = null, sortDirection = null) {
    const query = q.trim().toLowerCase();
    const difficulties = filters.difficulty;

    const allFranshises = this.store.findAll(this.franshisesCollection);
    const franshiseSlugs = filters.franshise;
    const franshiseIds = franshiseSlugs
      ? allFranshises
          .filter((f) => franshiseSlugs.includes(f.slug))
          .map((f) => f.id)
      : null;

    let results = this.store.findBy(this.quizesCollection, (quiz) => {
      if (
        query &&
        !quiz.title.toLowerCase().includes(query) &&
        !quiz.description.toLowerCase().includes(query)
      )
        return false;

      if (difficulties && !difficulties.includes(quiz.difficulty.toLowerCase()))
        return false;

      if (franshiseIds && !franshiseIds.includes(quiz.franshiseId))
        return false;

      return true;
    });

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
        default:
          value1 = a.views;
          value2 = b.views;
      }

      if (sortDirection === "desc") {
        return value1 > value2 ? -1 : 1;
      } else {
        return value1 > value2 ? 1 : -1;
      }
    });
    const allFranshisesTitles = allFranshises.map((f) => ({
      title: f.title,
      slug: f.slug,
    }));

    return {
      quizes: results,
      franshises: allFranshisesTitles,
    };
  },
};

export default quizesStore;

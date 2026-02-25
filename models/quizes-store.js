"use strict";

import JsonStore from "./json-store.js";

const quizesStore = {
  store: new JsonStore("./models/app-store.json", { info: {} }),
  quizesCollection: "quizes",
  franshisesCollection: "franshises",

  getQuizesInfo(q = "", filters = {}) {
    const query = q.trim().toLowerCase();
    const difficulties = filters.difficulty;

    const allFranshises = this.store.findAll(this.franshisesCollection);
    const franshiseSlugs = filters.franshise;
    const franshiseIds = franshiseSlugs
      ? allFranshises
          .filter((f) => franshiseSlugs.includes(f.slug))
          .map((f) => f.id)
      : null;

    return this.store.findBy(this.quizesCollection, (quiz) => {
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
  },
};

export default quizesStore;

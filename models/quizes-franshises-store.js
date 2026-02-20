"use strict";

import JsonStore from "./json-store.js";

const quizesFranshisesStore = {
  store: new JsonStore("./models/app-store.json", { info: {} }),
  franshisesCollection: "franshises",
  quizesCollection: "quizes",

  getFranshisesInfo() {
    const franshises = this.store.findAll(this.franshisesCollection);
    const quizes = this.store.findAll(this.quizesCollection);

    const countOfQuizes = {}
    for (const quiz of quizes) {
        const franshiseId = quiz.franshiseId;
        countOfQuizes[franshiseId] = countOfQuizes[franshiseId] ? countOfQuizes[franshiseId] + 1 : 1
    }
    return franshises.map((franshise) => ({
      ...franshise,
      numberOfQuizes: countOfQuizes[franshise.id] ?? 0,
    }));
  },
};

export default quizesFranshisesStore;

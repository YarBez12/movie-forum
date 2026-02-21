"use strict";

import JsonStore from "./json-store.js";

const quizesFranshisesDetailStore = {
  store: new JsonStore("./models/app-store.json", { info: {} }),
  franshisesCollection: "franshises",
  quizesCollection: "quizes",

  getFranshiseDetail(slug) {
    const franshises = this.store.findAll(this.franshisesCollection);
    const quizes = this.store.findAll(this.quizesCollection);

    const selectedFranshise = franshises.find(
      (franshise) => franshise.slug === slug,
    );
    const filteredQuizes = quizes.filter(
      (quiz) => quiz.franshiseId === selectedFranshise.id,
    );
    console.log(1111)
    console.log(selectedFranshise);
    console.log(filteredQuizes);

    return {
      franshise: selectedFranshise,
      quizes: filteredQuizes,
    };
  },
};
export default quizesFranshisesDetailStore;

"use strict";

import JsonStore from "./json-store.js";

const quizesStore = {
  store: new JsonStore("./models/app-store.json", { info: {} }),
  collection: "quizes",

  getQuizesInfo(q = "") {
    const query = q.trim().toLowerCase();
    if (!query) return this.store.findAll(this.collection);
    return this.store.findBy(this.collection, (quiz) => {
      return quiz.title.toLowerCase().includes(query) || quiz.description.toLowerCase().includes(query);
    });
  },
};

export default quizesStore;

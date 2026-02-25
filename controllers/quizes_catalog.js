"use strict";

import quizesStore from "../models/quizes-store.js";

const filtersToArray = (filters) => {
  if (!filters) return null;
  if (!Array.isArray(filters)) return [filters];
  return filters;
};

const quizes_catalog = {
  createView(request, response) {
    const q = request.query.q ? request.query.q : "";
    const filters = {
      difficulty: filtersToArray(request.query.difficulty),
      franshise: filtersToArray(request.query.franshise),
    };
    const viewData = {
      title: "Quizes Catalog",
      activeMainNav: "quizes",
      quizes: quizesStore.getQuizesInfo(q, filters),
      query: q,
      filters,
    };
    response.render("quizes_catalog", viewData);
  },
};

export default quizes_catalog;

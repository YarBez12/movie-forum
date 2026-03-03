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
    const sortOption = request.query.sort || "popularity";
    const sortOptions = {"popularity": "Popularity", "difficulty": "Difficulty", "publicationDate": "Publication Date", "questionsCount": "Questions Count"}
    const sortDirection = request.query.dir;
    const { quizes, franshises } = quizesStore.getQuizesInfo(q, filters, sortOption, sortDirection);
    const viewData = {
      title: "Quizes Catalog",
      activeMainNav: "quizes",
      quizes,
      query: q,
      sortSlug: sortOption,
      sortOption: sortOptions[sortOption],
      sortDirection,
      franshises,
      selectedFilters: filters

    };
    response.render("quizes_catalog", viewData);
    
  },
};

export default quizes_catalog;

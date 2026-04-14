"use strict";

import appInfoStore from "../models/app-info.js";

// Controller for start page
const start = {
  createView(request, response) {
    const viewData = {
      title: "Movie Forum",
      //   For left main menu selection
      activeMainNav: "main",
      //   Get info from model
      info: appInfoStore.getAppInfo(),
    };
    response.render("register", viewData);
  },
};

export default start;

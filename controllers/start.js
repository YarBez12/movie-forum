"use strict";

import appInfoStore from "../models/app-info.js";
import accounts from "./accounts.js";

// Controller for start page
const start = {
  createView(request, response) {
    const user = accounts.getCurrentUser(request);
    if (!user) {
      return response.redirect("/");
    } else {
      console.log(accounts.getCurrentUser(request));
      const viewData = {
        title: "Movie Forum",
        //   For left main menu selection
        activeMainNav: "main",
        //   Get info from model
        info: appInfoStore.getAppInfo(),
        user,
      };
      response.render("start", viewData);
    }
  },
};

export default start;

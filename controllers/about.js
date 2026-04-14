"use strict";

import appAboutStore from "../models/app-about.js";
import accounts from "./accounts.js";

// Controller for about page
const about = {
  createView(request, response) {
    const user = accounts.getCurrentUser(request);
    if (!user) {
      return response.redirect("/");
    } else {
      const viewData = {
        title: "About Movie Forum",
        //   For left main menu selection
        activeMainNav: "about",
        //   Get info from model
        info: appAboutStore.getAboutInfo(),
        user,
      };
      response.render("about", viewData);
    }
  },
};

export default about;

"use strict";

import appAboutStore from "../models/app-about.js";
import accounts from "./accounts.js";

// Controller for about page
const about = {
  // Create view for about page
  createView(request, response) {
    // Get current logged-in user
    const user = accounts.getCurrentUser(request);
    // If no user is logged in, redirect to home login page
    if (!user) {
      return response.redirect("/");
    } else {
      const viewData = {
        title: "About Movie Forum",
        //   For left main menu selection
        activeMainNav: "about",
        //   Get info from model
        info: appAboutStore.getAboutInfo(),
        // Current user info
        user,
      };
      response.render("about", viewData);
    }
  },
};

export default about;

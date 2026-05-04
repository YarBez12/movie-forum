"use strict";

import appAboutStore from "../models/app-about.js";
import accounts from "./accounts.js";
import utils from "../utils/controller/utils.js";
import logger from "../utils/logger.js";


// Controller for about page
const about = {
  // Create view for about page
  createView(request, response) {
    // Get current logged-in user
    const user = utils.getUserAndRedirect(request, response);
    // If no user is logged in, redirect to home login page
    if (!user) {
      return;
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
      logger.info("Rendering about page with data: ", viewData);
      response.render("about", viewData);
    }
  },
};

export default about;

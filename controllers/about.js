"use strict";

import appAboutStore from "../models/app-about.js";

// Controller for about page
const about = {
  createView(request, response) {
    const viewData = {
      title: "About Movie Forum",
      //   For left main menu selection
      activeMainNav: "about",
      //   Get info from model
      info: appAboutStore.getAboutInfo(),
    };
    response.render("about", viewData);
  },
};

export default about;

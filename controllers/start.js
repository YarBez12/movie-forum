"use strict";

import appInfo from "../models/app-info.js";

const start = {
  createView(request, response) {
    const viewData = {
      title: "Movie Forum",
      activeMainNav: "main",
      info: appInfo.getAppInfo(),
    };
    response.render("start", viewData);
  },
};

export default start;

"use strict";

import JsonStore from "./json-store.js";

const appAbout = {
  store: new JsonStore("./models/app-about-store.json", { info: {} }),
  collection: "info",

  getAppAboutInfo() {
    return this.store.findAll(this.collection);
  },
};

export default appAbout;

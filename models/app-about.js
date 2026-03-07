"use strict";

import JsonStore from "./json-store.js";

const appAboutStore = {
  // Storage of app and app creator information
  store: new JsonStore("./models/app-about-store.json", { info: {} }),
  collection: "info",

//   Get general app and creator info
  getAboutInfo() {
    return this.store.findAll(this.collection);
  },
};

export default appAboutStore;

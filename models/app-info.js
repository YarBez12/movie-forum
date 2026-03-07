"use strict";

import JsonStore from "./json-store.js";

const appInfoStore = {
  // Storage of app title and short description
  store: new JsonStore("./models/app-store.json", { info: {} }),
  collection: "info",

  // Get title and short description
  getAppInfo() {
    return this.store.findAll(this.collection);
  },
};

export default appInfoStore;

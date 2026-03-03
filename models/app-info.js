"use strict";

import JsonStore from "./json-store.js";

const appInfo = {
  store: new JsonStore("./models/app-info-store.json", { info: {} }),
  collection: "info",

  getAppInfo() {
    return this.store.findAll(this.collection);
  },
};

export default appInfo;

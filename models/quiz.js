'use strict'

import JsonStore from "./json-store.js"

const quizeStore = {
    store: new JsonStore('./models/app-store.json', { info: {} }),
    collection: 'questions',

    getQuizesInfo() {
        return null;
    }

};

export default quizeStore;
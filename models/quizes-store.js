'use strict'

import JsonStore from "./json-store.js"

const quizesStore = {
    store: new JsonStore('./models/app-store.json', { info: {} }),
    collection: 'quizes',

    getQuizesInfo() {
        return this.store.findAll(this.collection);
    }

};

export default quizesStore;
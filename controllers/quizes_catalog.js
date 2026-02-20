'use strict'

import quizesStore from "../models/quizes-store.js";

const quizes_catalog = {
    createView(request, response) {
        const viewData = {
            title: "Quizes Catalog",
            activeMainNav: "quizes",
            quizes: quizesStore.getQuizesInfo()
        }
        response.render('quizes_catalog', viewData)
    }
};

export default quizes_catalog;
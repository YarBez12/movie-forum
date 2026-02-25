'use strict'

import quizesStore from "../models/quizes-store.js";

const quizes_catalog = {
    createView(request, response) {
        const q = request.query.q ? request.query.q : "";
        const viewData = {
            title: "Quizes Catalog",
            activeMainNav: "quizes",
            quizes: quizesStore.getQuizesInfo(q),
            query: q
        }
        response.render('quizes_catalog', viewData)
    }
};

export default quizes_catalog;
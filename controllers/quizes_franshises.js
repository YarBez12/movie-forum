'use strict'

import quizesFranshisesStore from "../models/quizes-franshises-store.js";

const quizes_franshises = {
    createView(request, response) {
        const viewData = {
            title: "Quizes Franshises",
            activeMainNav: "quizes",
            franshises: quizesFranshisesStore.getFranshisesInfo()
        }
        response.render('quizes_franshises', viewData)
    }
};

export default quizes_franshises;
'use strict'

const quizes_catalog = {
    createView(request, response) {
        const viewData = {
            title: "Quizes Catalog",
            activeMainNav: "quizes"
        }
        response.render('quizes_catalog', viewData)
    }
};

export default quizes_catalog;
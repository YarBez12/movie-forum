'use strict'

const start = {
    createView(request, response) {
        const viewData = {
            title: "Movie Forum",
            activeMainNav: "main"
        }
        response.render('start', viewData)
    }
};

export default start;
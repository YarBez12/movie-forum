'use strict'

const about = {
    createView(request, response) {
        const viewData = {
            title: "About Page",
            activeMainNav: "about"
        }
        response.render('about', viewData)
    }
};

export default about;
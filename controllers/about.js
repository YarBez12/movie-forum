'use strict'

import appAbout from "../models/app-about.js";

const about = {
    createView(request, response) {
        const viewData = {
            title: "About Movie Forum",
            activeMainNav: "about",
            info: appAbout.getAppAboutInfo()
        }
        response.render('about', viewData)
    }
};

export default about;
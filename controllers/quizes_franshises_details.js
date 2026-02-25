'use strict'

import quizesFranshisesDetailStore from "../models/quizes-franshises-detail-store.js";

const quizes_franshises_detail = {
    createView(request, response) {
        const slug = request.params.slug;
        const franshiseDetails = quizesFranshisesDetailStore.getFranshiseDetail(slug)
        const viewData = {
            title: `${franshiseDetails.franshise.title} quizes`,
            activeMainNav: "quizes",
            franshise: franshiseDetails.franshise,
            quizes: franshiseDetails.quizes,
            backgroundImg: franshiseDetails.franshise.image
        };
        response.render('quizes_franshise_detail', viewData)
    }
};

export default quizes_franshises_detail;
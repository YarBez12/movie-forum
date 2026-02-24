'use strict'

const quiz_detail = {
    createView(request, response) {
        const viewData = {
            title: "Quiz Details",
            activeMainNav: "quizes"
        }
        response.render('quiz', viewData)
    }
};

export default quiz_detail;
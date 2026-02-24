'use strict'


import quizeStore from "../models/quiz.js";


const quiz_detail = {
    createView(request, response) {
        const slug = request.params.slug;
        const quizDetails = quizeStore.getQuizesInfo(slug);
        const viewData = {
            title: "Quiz Details",
            activeMainNav: "quizes",
            quiz: quizDetails.quiz,
            questions: quizDetails.questions
        }
        response.render('quiz', viewData)
    }
};

export default quiz_detail;
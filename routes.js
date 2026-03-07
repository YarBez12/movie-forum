'use strict'
import express from 'express'

import allQuizzes from './controllers/quizes_catalog.js'
import start from './controllers/start.js'
import about from './controllers/about.js'
import allFranchises from './controllers/quizes_franshises.js'
import franchise from './controllers/quizes_franshises_details.js'
import quiz from './controllers/quiz.js'

const router = express.Router()

router.get("/", start.createView);
router.get("/quizzes", allQuizzes.createView);
router.get("/about", about.createView);
router.get("/franchises", allFranchises.createView);
router.get("/franchises/:slug", franchise.createView);
router.get("/quiz/:slug", quiz.createView);


export default router;
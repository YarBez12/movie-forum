"use strict";
import express from "express";

import allQuizzes from "./controllers/quizes_catalog.js";
import start from "./controllers/start.js";
import about from "./controllers/about.js";
import allFranchises from "./controllers/quizes_franshises.js";
import franchise from "./controllers/quizes_franshises_details.js";
import quiz from "./controllers/quiz.js";
import accounts from "./controllers/accounts.js";
import profile from "./controllers/profile.js";

const router = express.Router();

router.get("/start", start.createView);
router.get("/quizzes", allQuizzes.createView);
router.get("/about", about.createView);
router.get("/franchises", allFranchises.createView);
router.get("/franchises/:slug", franchise.createView);
router.get("/quiz/:slug", quiz.createView);
router.get("/profile", profile.createView);

router.post("/quizzes/addquiz", allQuizzes.addQuiz);
router.post("/profile/addquiz", profile.addQuiz);
router.post("/franchises/:id/addquiz", franchise.addQuiz);
router.post("/franchises/addfranchise", allFranchises.addFranchise);
router.post("/quizzes/editquiz", allQuizzes.updateQuiz);
router.post("/franchises/:id/editquiz", franchise.updateQuiz);

router.get("/quizzes/deletequiz/:id", allQuizzes.deleteQuiz);
router.get("/profile/deletequiz/:id", profile.deleteQuiz);
router.get("/franchises/:slug/deletequiz/:id", franchise.deleteQuiz);
router.get("/franchises/deletefranchise/:id", allFranchises.deleteFranchise);

router.get("/", accounts.login);
router.get("/signup", accounts.signup);
router.get("/logout", accounts.logout);
router.post("/register", accounts.register);
router.post("/authenticate", accounts.authenticate);

router.post("/quiz/exit/:id", quiz.exitQuiz);
router.post("/profile/edit", profile.editProfile);

export default router;

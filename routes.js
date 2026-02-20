'use strict'
import express from 'express'

import quizes_catalog from './controllers/quizes_catalog.js'
import start from './controllers/start.js'
import about from './controllers/about.js'

const router = express.Router()

router.get("/", start.createView);
router.get("/quizes", quizes_catalog.createView);
router.get("/about", about.createView);

export default router;
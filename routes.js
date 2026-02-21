'use strict'
import express from 'express'

import quizes_catalog from './controllers/quizes_catalog.js'
import start from './controllers/start.js'
import about from './controllers/about.js'
import quizes_franshises from './controllers/quizes_franshises.js'
import quizes_franshise_detail from './controllers/quizes_franshises_details.js'

const router = express.Router()

router.get("/", start.createView);
router.get("/quizes", quizes_catalog.createView);
router.get("/about", about.createView);
router.get("/franshises", quizes_franshises.createView);
router.get("/franshises/:slug", quizes_franshise_detail.createView);


export default router;
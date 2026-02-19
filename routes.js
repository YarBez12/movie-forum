'use strict'
import express from 'express'

import quizes_catalog from './controllers/quizes_catalog.js'

const router = express.Router()

router.get("/", quizes_catalog.createView);

export default router;
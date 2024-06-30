import express from "express"

import { getRanap } from "../controllers/ranap.js";


const router = express.Router()

// router.post("/register", register)

router.get("/", getRanap)


export default router;
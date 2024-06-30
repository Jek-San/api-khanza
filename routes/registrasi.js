import express from "express"

import { getRegistrasi } from "../controllers/regis.js";


const router = express.Router()

// router.post("/register", register)

router.get("/", getRegistrasi)


export default router;
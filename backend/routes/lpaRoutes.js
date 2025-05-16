import express from "express";
import { getAllLPAs } from "../controllers/lpaController.js";
import visdakSesamModule from "visdak-sesam";

const router = express.Router();
const { middleware } = visdakSesamModule();
const { protect } = middleware;

router.get("/", protect, getAllLPAs);

export default router;

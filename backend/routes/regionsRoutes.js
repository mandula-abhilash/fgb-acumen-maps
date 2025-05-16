import express from "express";
import {
  getAllRegions,
  getDefaultRegions,
  createCustomRegion,
  updateCustomRegion,
  deleteCustomRegion,
} from "../controllers/regionsController.js";
import visdakSesamModule from "visdak-sesam";

const router = express.Router();
const { middleware } = visdakSesamModule();
const { protect } = middleware;

// Public routes
router.get("/", protect, getAllRegions); // Get all regions (default + user's custom if authenticated)
router.get("/default", protect, getDefaultRegions); // Get only default regions

// Protected routes
router.post("/", protect, createCustomRegion);
router.put("/:id", protect, updateCustomRegion);
router.delete("/:id", protect, deleteCustomRegion);

export default router;

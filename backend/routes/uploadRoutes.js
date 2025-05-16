import express from "express";
import {
  getPresignedUrl,
  deleteFile,
} from "../controllers/uploadController.js";
import visdakSesamModule from "visdak-sesam";

const router = express.Router();
const { middleware } = visdakSesamModule();
const { protect } = middleware;

router.post("/presigned-url", protect, getPresignedUrl);
router.delete("/delete/:key", protect, deleteFile);

export default router;

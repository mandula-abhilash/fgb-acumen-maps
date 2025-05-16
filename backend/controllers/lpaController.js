import asyncHandler from "express-async-handler";
import db from "../config/db.js";

// @desc    Get all LPAs
// @route   GET /api/lpas
// @access  Public
export const getAllLPAs = asyncHandler(async (req, res) => {
  const lpas = await db.any(
    `
    SELECT 
      lpa22cd as value,
      lpa22nm as label
    FROM local_planning_authorities
    ORDER BY label ASC
  `
  );

  res.json({
    success: true,
    data: lpas,
  });
});

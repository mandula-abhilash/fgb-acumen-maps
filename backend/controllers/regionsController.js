import asyncHandler from "express-async-handler";
import db from "../config/db.js";

// @desc    Get all regions (default and user's custom if authenticated)
// @route   GET /api/regions
// @access  Public
export const getAllRegions = asyncHandler(async (req, res) => {
  const userId = req.user?.userId; // Optional user ID for authenticated users

  const regions = await db.any(
    `
    SELECT 
      id as value,
      name as label,
      description,
      is_default,
      user_id,
      created_at,
      updated_at
    FROM custom_regions
    WHERE is_default = true 
    OR user_id = $1
    ORDER BY 
      is_default DESC,
      name ASC
  `,
    [userId]
  );

  res.json({
    success: true,
    data: regions,
  });
});

// @desc    Get only default regions
// @route   GET /api/regions/default
// @access  Public
export const getDefaultRegions = asyncHandler(async (req, res) => {
  const regions = await db.any(`
    SELECT 
      id as value,
      name as label,
      description,
      created_at,
      updated_at
    FROM custom_regions
    WHERE is_default = true
    ORDER BY name ASC
  `);

  res.json({
    success: true,
    data: regions,
  });
});

// @desc    Create a custom region
// @route   POST /api/regions
// @access  Private
export const createCustomRegion = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    res.status(400);
    throw new Error("Name is required");
  }

  // Check if user already has a region with this name
  const existingRegion = await db.oneOrNone(
    `
    SELECT id FROM custom_regions
    WHERE user_id = $1 AND name = $2
  `,
    [req.user.userId, name]
  );

  if (existingRegion) {
    res.status(400);
    throw new Error("You already have a region with this name");
  }

  const region = await db.one(
    `
    INSERT INTO custom_regions (
      name,
      description,
      user_id,
      is_default
    ) VALUES (
      $1, $2, $3, false
    )
    RETURNING 
      id as value,
      name as label,
      description,
      is_default,
      user_id,
      created_at
  `,
    [name, description, req.user.userId]
  );

  res.status(201).json({
    success: true,
    data: region,
  });
});

// @desc    Update a custom region
// @route   PUT /api/regions/:id
// @access  Private
export const updateCustomRegion = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    res.status(400);
    throw new Error("Name is required");
  }

  // Check if region exists and belongs to user
  const existingRegion = await db.oneOrNone(
    `
    SELECT id FROM custom_regions
    WHERE id = $1 AND user_id = $2 AND is_default = false
  `,
    [req.params.id, req.user.userId]
  );

  if (!existingRegion) {
    res.status(404);
    throw new Error("Region not found or cannot be modified");
  }

  // Check if new name conflicts with another region
  if (name) {
    const nameConflict = await db.oneOrNone(
      `
      SELECT id FROM custom_regions
      WHERE user_id = $1 AND name = $2 AND id != $3
    `,
      [req.user.userId, name, req.params.id]
    );

    if (nameConflict) {
      res.status(400);
      throw new Error("You already have a region with this name");
    }
  }

  const region = await db.one(
    `
    UPDATE custom_regions
    SET 
      name = $1,
      description = $2,
      updated_at = now()
    WHERE id = $3 AND user_id = $4 AND is_default = false
    RETURNING 
      id as value,
      name as label,
      description,
      is_default,
      user_id,
      updated_at
  `,
    [name, description, req.params.id, req.user.userId]
  );

  res.json({
    success: true,
    data: region,
  });
});

// @desc    Delete a custom region
// @route   DELETE /api/regions/:id
// @access  Private
export const deleteCustomRegion = asyncHandler(async (req, res) => {
  // Check if region exists and belongs to user
  const region = await db.oneOrNone(
    `
    SELECT id FROM custom_regions
    WHERE id = $1 AND user_id = $2 AND is_default = false
  `,
    [req.params.id, req.user.userId]
  );

  if (!region) {
    res.status(404);
    throw new Error("Region not found or cannot be deleted");
  }

  await db.none(
    `
    DELETE FROM custom_regions
    WHERE id = $1 AND user_id = $2 AND is_default = false
  `,
    [req.params.id, req.user.userId]
  );

  res.json({
    success: true,
    data: {},
  });
});

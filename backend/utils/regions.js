import db from "../config/db.js";

/**
 * Get all regions for a user (including default regions)
 * @param {string} [userId] - Optional user ID for custom regions
 * @returns {Promise<Array>} Array of regions
 */
export async function getRegions(userId = null) {
  try {
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
    return regions;
  } catch (error) {
    console.error("Error fetching regions:", error);
    throw error;
  }
}

/**
 * Create a custom region
 * @param {string} userId - The user's ID
 * @param {Object} regionData - The region data
 * @returns {Promise<Object>} The created region
 */
export async function createRegion(userId, { name, description }) {
  try {
    const region = await db.one(
      `
      INSERT INTO custom_regions (
        name, description, user_id, is_default
      ) VALUES (
        $1, $2, $3, false
      )
      RETURNING 
        id as value,
        name as label,
        description,
        is_default,
        created_at
    `,
      [name, description, userId]
    );
    return region;
  } catch (error) {
    console.error("Error creating region:", error);
    throw error;
  }
}

/**
 * Update a custom region
 * @param {string} userId - The user's ID
 * @param {string} regionId - The region's ID
 * @param {Object} regionData - The updated region data
 * @returns {Promise<Object>} The updated region
 */
export async function updateRegion(userId, regionId, { name, description }) {
  try {
    const region = await db.one(
      `
      UPDATE custom_regions
      SET 
        name = $1,
        description = $2,
        updated_at = now()
      WHERE id = $3 
      AND user_id = $4 
      AND is_default = false
      RETURNING 
        id as value,
        name as label,
        description,
        is_default,
        updated_at
    `,
      [name, description, regionId, userId]
    );
    return region;
  } catch (error) {
    console.error("Error updating region:", error);
    throw error;
  }
}

/**
 * Delete a custom region
 * @param {string} userId - The user's ID
 * @param {string} regionId - The region's ID
 * @returns {Promise<void>}
 */
export async function deleteRegion(userId, regionId) {
  try {
    await db.none(
      `
      DELETE FROM custom_regions
      WHERE id = $1 
      AND user_id = $2 
      AND is_default = false
    `,
      [regionId, userId]
    );
  } catch (error) {
    console.error("Error deleting region:", error);
    throw error;
  }
}

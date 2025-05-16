import api from "@/visdak-auth/src/api/axiosInstance";

/**
 * Get all regions (default + user's custom regions if authenticated)
 */
export async function getRegions() {
  try {
    const response = await api.get("/api/regions");
    return response.data.data;
  } catch (error) {
    console.error("Error fetching regions:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch regions");
  }
}

/**
 * Get only default regions
 */
export async function getDefaultRegions() {
  try {
    const response = await api.get("/api/regions/default");
    return response.data.data;
  } catch (error) {
    console.error("Error fetching default regions:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch default regions"
    );
  }
}

/**
 * Create a custom region
 * @param {Object} regionData - Region data to create
 * @param {string} regionData.name - Name of the region
 * @param {string} regionData.description - Description of the region
 */
export async function createCustomRegion(regionData) {
  try {
    const response = await api.post("/api/regions", regionData);
    return response.data.data;
  } catch (error) {
    console.error("Error creating custom region:", error);
    throw new Error(
      error.response?.data?.message || "Failed to create custom region"
    );
  }
}

/**
 * Update a custom region
 * @param {string} regionId - ID of the region to update
 * @param {Object} regionData - Updated region data
 * @param {string} regionData.name - Updated name of the region
 * @param {string} regionData.description - Updated description of the region
 */
export async function updateCustomRegion(regionId, regionData) {
  try {
    const response = await api.put(`/api/regions/${regionId}`, regionData);
    return response.data.data;
  } catch (error) {
    console.error("Error updating custom region:", error);
    throw new Error(
      error.response?.data?.message || "Failed to update custom region"
    );
  }
}

/**
 * Delete a custom region
 * @param {string} regionId - ID of the region to delete
 */
export async function deleteCustomRegion(regionId) {
  try {
    const response = await api.delete(`/api/regions/${regionId}`);
    return response.data.data;
  } catch (error) {
    console.error("Error deleting custom region:", error);
    throw new Error(
      error.response?.data?.message || "Failed to delete custom region"
    );
  }
}

import api from "@/visdak-auth/src/api/axiosInstance";

/**
 * Get all Local Planning Authorities
 */
export async function getLPAs() {
  try {
    const response = await api.get("/api/lpas");
    return response.data.data;
  } catch (error) {
    console.error("Error fetching LPAs:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch LPAs");
  }
}

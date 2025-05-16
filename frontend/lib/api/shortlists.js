import api from "@/visdak-auth/src/api/axiosInstance";

export async function addToShortlist(opportunityId) {
  try {
    const response = await api.post("/api/shortlists", { opportunityId });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to add to shortlist"
    );
  }
}

export async function removeFromShortlist(opportunityId) {
  try {
    const response = await api.delete(`/api/shortlists/${opportunityId}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to remove from shortlist"
    );
  }
}

export async function getShortlistedOpportunities() {
  try {
    const response = await api.get("/api/shortlists");
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        "Failed to fetch shortlisted opportunities"
    );
  }
}

export async function checkShortlistStatus(opportunityId) {
  try {
    const response = await api.get(`/api/shortlists/${opportunityId}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to check shortlist status"
    );
  }
}

import api from "@/visdak-auth/src/api/axiosInstance";

export async function createAssistedSite(siteData) {
  try {
    const response = await api.post("/api/assisted-sites", siteData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to create assisted site request"
    );
  }
}

export async function getMyAssistedSites() {
  try {
    const response = await api.get("/api/assisted-sites/my-sites");
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch assisted sites"
    );
  }
}

export async function getAssistedSite(id) {
  try {
    const response = await api.get(`/api/assisted-sites/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch assisted site"
    );
  }
}

export async function deleteAssistedSite(id) {
  try {
    const response = await api.delete(`/api/assisted-sites/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to delete assisted site"
    );
  }
}

import api from "@/visdak-auth/src/api/axiosInstance";

/**
 * Get a presigned URL for uploading a file to S3
 * @param {string} fileType - MIME type of the file
 * @param {string} folder - Folder path in S3 bucket
 * @param {Object} options - Additional options
 * @param {string} options.parentId - Parent UUID for grouping related files
 * @param {string} options.fileCategory - Category/type of the file
 * @returns {Promise<Object>} - Object containing upload URL and file key
 */
export const getPresignedUrl = async (
  fileType,
  folder = "uploads",
  options = {}
) => {
  try {
    const { parentId, fileCategory } = options;
    if (!parentId) {
      throw new Error("Parent ID is required for file organization");
    }

    // Get file extension from MIME type
    const fileExtension = fileType.split("/")[1] || "";

    // Structure: users/{userId}/{opportunityId}/{filename}.{extension}
    // Example: users/123/456/site-plan.pdf
    const key = `users/${options.userId}/${parentId}/${fileCategory}.${fileExtension}`;

    const response = await api.post("/api/upload/presigned-url", {
      fileType,
      folder,
      parentId,
      fileCategory,
      key,
    });

    return response.data.data;
  } catch (error) {
    console.error("Error getting presigned URL:", error);
    throw error;
  }
};

/**
 * Upload a file to S3 using a presigned URL
 * @param {File} file - File to upload
 * @param {string} uploadURL - Presigned URL for uploading
 * @returns {Promise<void>}
 */
export const uploadFileToS3 = async (file, uploadURL) => {
  try {
    await api.put(uploadURL, file, {
      headers: {
        "Content-Type": file.type,
      },
      baseURL: "",
      withCredentials: false,
    });
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    throw error;
  }
};

/**
 * Delete a file from S3
 * @param {string} key - S3 object key
 * @returns {Promise<void>}
 */
export const deleteFileFromS3 = async (key) => {
  try {
    await api.delete(`/api/upload/delete/${encodeURIComponent(key)}`);
  } catch (error) {
    console.error("Error deleting file from S3:", error);
    throw error;
  }
};

/**
 * Upload a file to S3 (get presigned URL and upload)
 * @param {File} file - File to upload
 * @param {string} folder - Folder path in S3 bucket
 * @param {Object} options - Additional options
 * @param {string} options.parentId - Parent UUID for grouping related files
 * @param {string} options.fileCategory - Category/type of the file
 * @returns {Promise<Object>} - Object containing file URL and key
 */
export const uploadFile = async (file, folder = "uploads", options = {}) => {
  try {
    const { uploadURL, key, fileUrl, fileId, parentId } = await getPresignedUrl(
      file.type,
      folder,
      options
    );

    await uploadFileToS3(file, uploadURL);

    return { key, fileUrl, fileId, parentId };
  } catch (error) {
    console.error("Error in uploadFile:", error);
    throw error;
  }
};

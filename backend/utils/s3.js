import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Bucket name from environment variables
const bucketName = process.env.AWS_S3_BUCKET_NAME;

/**
 * Generate a presigned URL for uploading a file to S3
 * @param {string} fileType - MIME type of the file
 * @param {string} folder - Folder path in S3 bucket
 * @param {string} userId - User ID for organizing files
 * @param {Object} options - Additional options
 * @param {string} options.parentId - Parent UUID for grouping related files
 * @param {string} options.fileCategory - Category/type of the file (e.g., 'sitePlan', 'specification')
 * @returns {Object} - Object containing upload URL and file key
 */
export const generateUploadURL = async (
  fileType,
  folder = "uploads",
  userId,
  options = {}
) => {
  try {
    if (!bucketName) {
      throw new Error("AWS S3 bucket name not configured");
    }

    if (!userId) {
      throw new Error("User ID is required for file organization");
    }

    // Generate or use provided parent ID
    const parentId = options.parentId || uuidv4();
    const fileId = uuidv4();
    const fileExtension = fileType.split("/")[1] || "";
    const fileCategory = options.fileCategory || "misc";

    // Structure: users/{userId}/{parentId}/{fileCategory}/{fileId}.{extension}
    const key = `users/${userId}/${parentId}/${fileCategory}/${fileId}.${fileExtension}`;

    const putObjectParams = {
      Bucket: bucketName,
      Key: key,
      ContentType: fileType,
    };

    const command = new PutObjectCommand(putObjectParams);
    const uploadURL = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    });

    return {
      uploadURL,
      key,
      fileUrl: `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
      fileId,
      parentId,
    };
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    throw error;
  }
};

/**
 * Generate a presigned URL for downloading a file from S3
 * @param {string} key - S3 object key
 * @returns {string} - Presigned URL for downloading
 */
export const generateDownloadURL = async (key) => {
  try {
    if (!bucketName) {
      throw new Error("AWS S3 bucket name not configured");
    }

    const getObjectParams = {
      Bucket: bucketName,
      Key: key,
    };

    const command = new GetObjectCommand(getObjectParams);
    const downloadURL = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    });

    return downloadURL;
  } catch (error) {
    console.error("Error generating download URL:", error);
    throw error;
  }
};

/**
 * Get the public URL for a file in S3
 * @param {string} key - S3 object key
 * @returns {string} - Public URL
 */
export const getPublicUrl = (key) => {
  if (!bucketName) {
    throw new Error("AWS S3 bucket name not configured");
  }
  return `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
};

/**
 * Delete a file from S3
 * @param {string} key - S3 object key
 * @returns {Promise<void>}
 */
export const deleteFileFromS3 = async (key) => {
  try {
    if (!bucketName) {
      throw new Error("AWS S3 bucket name not configured");
    }

    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: decodeURIComponent(key),
    });

    await s3Client.send(command);
  } catch (error) {
    console.error("Error deleting file from S3:", error);
    throw error;
  }
};

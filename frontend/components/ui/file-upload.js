"use client";

import { useRef, useState } from "react";
import {
  AlertCircle,
  Check,
  FileIcon,
  FileText,
  Image,
  Upload,
  X,
} from "lucide-react";

import { deleteFileFromS3, uploadFile } from "@/lib/upload";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { fileTypes, maxFileSizes } from "@/components/sites/form-constants";

export function FileUpload({
  onUploadComplete,
  onUploadError,
  acceptedFileTypes = fileTypes.document,
  maxFileSize = maxFileSizes.document,
  folder = "documents",
  className,
  label = "Upload a file",
  description = "Drag and drop or click to upload",
  fileType = "document", // document, image, or mixed
  parentId = null,
  fileCategory = null,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");
  const [uploadComplete, setUploadComplete] = useState(false);
  const [uploadedFileKey, setUploadedFileKey] = useState(null);
  const fileInputRef = useRef(null);

  // Determine accepted file types based on fileType
  let acceptedTypesArray = acceptedFileTypes;
  let maxSizeValue = maxFileSize;
  let fileTypeDescription = "file";

  if (fileType === "image") {
    acceptedTypesArray = fileTypes.image;
    maxSizeValue = maxFileSizes.image;
    fileTypeDescription = "image";
  } else if (fileType === "document") {
    acceptedTypesArray = fileTypes.document;
    maxSizeValue = maxFileSizes.document;
    fileTypeDescription = "document";
  } else if (fileType === "mixed") {
    fileTypeDescription = "file";
  }

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const validateFile = (file) => {
    if (!file) return "No file selected";
    if (!acceptedTypesArray.includes(file.type)) {
      return `File type not supported. Accepted formats: ${acceptedTypesArray
        .map((type) => type.split("/")[1].toUpperCase())
        .join(", ")}`;
    }
    if (file.size > maxSizeValue) {
      return `File size exceeds the maximum limit of ${
        maxSizeValue / (1024 * 1024)
      }MB.`;
    }
    return null;
  };

  const handleFileSelect = async (selectedFile) => {
    setError("");
    setUploadComplete(false);

    const validationError = validateFile(selectedFile);
    if (validationError) {
      setError(validationError);
      return;
    }

    setFile(selectedFile);

    try {
      setUploading(true);

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          const newProgress = prev + 5;
          return newProgress >= 90 ? 90 : newProgress;
        });
      }, 100);

      const uploadOptions = {
        ...(parentId && { parentId }),
        ...(fileCategory && { fileCategory }),
      };

      const result = await uploadFile(selectedFile, folder, uploadOptions);

      clearInterval(progressInterval);
      setUploadProgress(100);
      setUploadComplete(true);
      setUploadedFileKey(result.key);

      if (onUploadComplete) {
        onUploadComplete(result.fileUrl, selectedFile, result);
      }
    } catch (error) {
      setError("Failed to upload file. Please try again.");
      if (onUploadError) {
        onUploadError(error);
      }
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  const handleFileInputChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = async () => {
    if (uploadedFileKey) {
      try {
        await deleteFileFromS3(uploadedFileKey);
        if (onUploadComplete) {
          onUploadComplete(null, null, null); // Clear the file URL from parent component
        }
      } catch (error) {
        console.error("Error deleting file:", error);
        setError("Failed to delete file. Please try again.");
        return;
      }
    }

    setFile(null);
    setUploadProgress(0);
    setUploadComplete(false);
    setError("");
    setUploadedFileKey(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

  // Determine the icon to display based on file type
  const getFileIcon = () => {
    if (!file) {
      if (fileType === "image")
        return <Image className="h-10 w-10 text-muted-foreground" />;
      if (fileType === "document")
        return <FileText className="h-10 w-10 text-muted-foreground" />;
      return <Upload className="h-10 w-10 text-muted-foreground" />;
    }

    // For uploaded file
    if (file.type.startsWith("image/")) {
      return <Image className="h-8 w-8 text-primary" />;
    } else if (file.type === "application/pdf") {
      return <FileIcon className="h-8 w-8 text-primary" />;
    } else {
      return <FileText className="h-8 w-8 text-primary" />;
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept={acceptedTypesArray.join(",")}
        className="hidden"
      />

      {!file ? (
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-primary/50",
            error && "border-destructive"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleButtonClick}
        >
          <div className="flex flex-col items-center justify-center space-y-2">
            {error ? (
              <AlertCircle className="h-10 w-10 text-destructive" />
            ) : (
              getFileIcon()
            )}
            <div className="space-y-1">
              <p className="text-sm font-medium">{label}</p>
              <p className="text-xs text-muted-foreground">{description}</p>
              {error && <p className="text-xs text-destructive">{error}</p>}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={(e) => {
                e.stopPropagation();
                handleButtonClick();
              }}
            >
              <Upload className="h-4 w-4 mr-2" />
              Select File
            </Button>
          </div>
        </div>
      ) : (
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getFileIcon()}
              <div>
                <p className="text-sm font-medium truncate max-w-[200px]">
                  {file.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(file.size)}
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleRemoveFile}
              disabled={uploading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {uploading || uploadComplete ? (
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {uploadComplete ? "Upload complete" : "Uploading..."}
                </span>
                {uploadComplete && <Check className="h-4 w-4 text-green-500" />}
              </div>
              <Progress value={uploadProgress} className="h-1" />
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

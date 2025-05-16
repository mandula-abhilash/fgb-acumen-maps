"use client";

import { useRef, useState } from "react";
import { FileText, Plus, Trash2, Upload, X } from "lucide-react";

import { deleteFileFromS3, uploadFile } from "@/lib/upload";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";

export function MultiFileUpload({
  files = [],
  onFilesChange,
  onFileDelete,
  acceptedFileTypes = [],
  maxFileSize = 10 * 1024 * 1024,
  folder = "documents",
  fileCategory = "document",
  parentId,
  maxFiles = 12,
  label = "Upload Files",
  description = "Drag and drop or click to upload",
}) {
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const [currentUpload, setCurrentUpload] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [documentTitle, setDocumentTitle] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const validateFile = (file) => {
    if (!file) return "No file selected";
    if (
      acceptedFileTypes.length > 0 &&
      !acceptedFileTypes.includes(file.type)
    ) {
      return `File type not supported. Accepted formats: ${acceptedFileTypes
        .map((type) => type.split("/")[1].toUpperCase())
        .join(", ")}`;
    }
    if (file.size > maxFileSize) {
      return `File size exceeds the maximum limit of ${
        maxFileSize / (1024 * 1024)
      }MB.`;
    }
    return null;
  };

  const handleFileSelect = async (selectedFile) => {
    if (files.length >= maxFiles) {
      toast({
        variant: "destructive",
        title: "Maximum Files Reached",
        description: `You can only upload up to ${maxFiles} files.`,
      });
      return;
    }

    setError("");
    const validationError = validateFile(selectedFile);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setCurrentUpload(selectedFile);
      setUploadProgress(0);

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

      // Store the uploaded file temporarily
      setUploadedFile({
        name: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type,
        url: result.fileUrl,
        key: result.key,
      });

      // Open the dialog to get the document title
      setDocumentTitle(selectedFile.name);
      setIsDialogOpen(true);

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Upload error:", error);
      setError("Failed to upload file. Please try again.");
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: "Failed to upload file. Please try again.",
      });
    } finally {
      // Reset upload state
      setTimeout(() => {
        setCurrentUpload(null);
        setUploadProgress(0);
      }, 1000);
    }
  };

  const handleSaveDocument = () => {
    if (!documentTitle.trim()) {
      toast({
        variant: "destructive",
        title: "Title Required",
        description: "Please provide a title for the document.",
      });
      return;
    }

    // Add the new file to the list with the custom title
    const newFile = {
      ...uploadedFile,
      name: documentTitle.trim(),
    };

    onFilesChange([...files, newFile]);
    setIsDialogOpen(false);
    setDocumentTitle("");
    setUploadedFile(null);
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

  const handleDeleteFile = async (index, e) => {
    // Prevent the event from bubbling up to any parent forms
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (onFileDelete) {
      await onFileDelete(index);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return "Unknown size";
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

  return (
    <>
      <div className="space-y-4">
        {/* File List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 border rounded-lg bg-muted/50"
            >
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium truncate max-w-[200px]">
                    {file.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  View
                </a>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive/90"
                  onClick={(e) => handleDeleteFile(index, e)}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete file</span>
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Upload Area */}
        {files.length < maxFiles && (
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInputChange}
              accept={acceptedFileTypes.join(",")}
              className="hidden"
            />

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
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="flex flex-col items-center justify-center space-y-2">
                <Upload className="h-10 w-10 text-muted-foreground" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">
                    {label} ({files.length}/{maxFiles})
                  </p>
                  <p className="text-xs text-muted-foreground">{description}</p>
                  {error && <p className="text-xs text-destructive">{error}</p>}
                </div>

                {currentUpload && (
                  <div className="w-full max-w-xs mt-4 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        Uploading {currentUpload.name}...
                      </span>
                      <span className="text-muted-foreground">
                        {uploadProgress}%
                      </span>
                    </div>
                    <Progress value={uploadProgress} className="h-1" />
                  </div>
                )}

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Select File
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Document Title Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Document Details</DialogTitle>
            <DialogDescription>
              Please provide a title for this document
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="documentTitle">Document Title</Label>
              <Input
                id="documentTitle"
                value={documentTitle}
                onChange={(e) => setDocumentTitle(e.target.value)}
                placeholder="Enter document title"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDialogOpen(false);
                setDocumentTitle("");
                setUploadedFile(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveDocument}
              className="bg-web-orange hover:bg-web-orange/90 text-white"
            >
              Save Document
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

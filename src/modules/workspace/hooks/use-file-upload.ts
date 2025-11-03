"use client";

import { useState, useCallback, useRef } from "react";
import { toast } from "sonner";

export function useFileUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadFile = useCallback(
    async (file: File, workspaceId: string) => {
      setIsUploading(true);
      setUploadProgress(0);

      try {
        // Validate file
        const maxSize = 50 * 1024 * 1024; // 50MB
        if (file.size > maxSize) {
          toast.error("File too large. Maximum size is 50MB");
          return null;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("workspaceId", workspaceId);

        // Upload with progress tracking
        const xhr = new XMLHttpRequest();

        return new Promise<{
          url: string;
          fileName: string;
          fileType: string;
          fileSize: number;
        } | null>((resolve, reject) => {
          xhr.upload.addEventListener("progress", (e) => {
            if (e.lengthComputable) {
              const progress = Math.round((e.loaded / e.total) * 100);
              setUploadProgress(progress);
            }
          });

          xhr.addEventListener("load", () => {
            setIsUploading(false);
            if (xhr.status === 200) {
              const response = JSON.parse(xhr.responseText);
              toast.success("File uploaded successfully");
              resolve(response);
            } else {
              toast.error("Upload failed");
              reject(new Error("Upload failed"));
            }
          });

          xhr.addEventListener("error", () => {
            setIsUploading(false);
            toast.error("Upload failed");
            reject(new Error("Upload failed"));
          });

          xhr.open("POST", "/api/upload");
          xhr.send(formData);
        });
      } catch (error) {
        console.error("Upload error:", error);
        toast.error("Failed to upload file");
        setIsUploading(false);
        return null;
      }
    },
    []
  );

  return {
    uploadFile,
    isUploading,
    uploadProgress,
  };
}

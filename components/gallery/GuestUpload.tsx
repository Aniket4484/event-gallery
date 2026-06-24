"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, Check, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CATEGORIES } from "@/lib/utils";
import toast from "react-hot-toast";
import axios from "axios";

interface GuestUploadProps {
  eventId: string;
  onSuccess?: () => void;
}

interface FilePreview {
  file: File;
  preview: string;
  status: "pending" | "uploading" | "done" | "error";
}

export function GuestUpload({ eventId, onSuccess }: GuestUploadProps) {
  const [files, setFiles] = useState<FilePreview[]>([]);
  const [category, setCategory] = useState("WEDDING");
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      status: "pending" as const,
    }));
    setFiles((prev) => [...prev, ...newFiles].slice(0, 10));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp", ".heic"] },
    maxFiles: 10,
    maxSize: 20 * 1024 * 1024,
  });

  const removeFile = (index: number) => {
    setFiles((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    setIsUploading(true);

    const formData = new FormData();
    formData.append("eventId", eventId);
    formData.append("category", category);
    formData.append("isGuestUpload", "true");
    files.forEach((f) => formData.append("files", f.file));

    try {
      await axios.post("/api/upload", formData);
      toast.success("Photos uploaded! They'll appear after review.");
      setFiles([]);
      onSuccess?.();
    } catch {
      toast.error("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${
          isDragActive
            ? "border-rose-400 bg-rose-50 dark:bg-rose-900/20"
            : "border-gray-300 dark:border-gray-600 hover:border-rose-300 dark:hover:border-rose-700"
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="w-10 h-10 text-rose-400 mx-auto mb-3" />
        <p className="text-gray-700 dark:text-gray-300 font-medium">
          {isDragActive ? "Drop photos here..." : "Drag & drop or click to upload"}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Up to 10 photos, max 20MB each
        </p>
      </div>

      {files.length > 0 && (
        <>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            <AnimatePresence>
              {files.map((f, i) => (
                <motion.div
                  key={f.preview}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative aspect-square rounded-lg overflow-hidden group"
                >
                  <img src={f.preview} alt="" className="w-full h-full object-cover" />
                  {f.status === "done" && (
                    <div className="absolute inset-0 bg-green-500/50 flex items-center justify-center">
                      <Check className="w-6 h-6 text-white" />
                    </div>
                  )}
                  {f.status === "pending" && (
                    <button
                      onClick={() => removeFile(i)}
                      className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3 text-white" />
                    </button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.filter((c) => c.value !== "ALL").map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setCategory(cat.value)}
                  className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                    category === cat.value
                      ? "bg-rose-500 text-white border-rose-500"
                      : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-rose-300"
                  }`}
                >
                  {cat.emoji} {cat.label}
                </button>
              ))}
            </div>
          </div>

          <Button onClick={handleUpload} loading={isUploading} className="w-full">
            <ImageIcon className="w-4 h-4" />
            Upload {files.length} Photo{files.length !== 1 ? "s" : ""}
          </Button>
        </>
      )}
    </div>
  );
}

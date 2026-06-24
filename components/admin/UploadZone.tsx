"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, CheckCircle, AlertCircle, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CATEGORIES, formatBytes } from "@/lib/utils";
import { Category } from "@/types";
import Image from "next/image";
import toast from "react-hot-toast";
import axios from "axios";

interface UploadZoneProps {
  eventId: string;
  onUploadSuccess?: () => void;
}

interface FileItem {
  file: File;
  preview: string;
  status: "pending" | "uploading" | "done" | "error";
  error?: string;
}

export function UploadZone({ eventId, onUploadSuccess }: UploadZoneProps) {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [category, setCategory] = useState<Category>("WEDDING");
  const [isUploading, setIsUploading] = useState(false);
  const [batchSize] = useState(5);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newItems: FileItem[] = acceptedFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      status: "pending",
    }));
    setFiles((prev) => [...prev, ...newItems]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpg", ".jpeg", ".png", ".webp", ".heic", ".heif", ".tiff"],
    },
    maxSize: 20 * 1024 * 1024,
    multiple: true,
  });

  const removeFile = (index: number) => {
    setFiles((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const clearAll = () => {
    files.forEach((f) => URL.revokeObjectURL(f.preview));
    setFiles([]);
  };

  const handleUpload = async () => {
    const pendingFiles = files.filter((f) => f.status === "pending");
    if (pendingFiles.length === 0) return;

    setIsUploading(true);

    for (let i = 0; i < pendingFiles.length; i += batchSize) {
      const batch = pendingFiles.slice(i, i + batchSize);
      const formData = new FormData();
      formData.append("eventId", eventId);
      formData.append("category", category);
      batch.forEach((item) => formData.append("files", item.file));

      setFiles((prev) =>
        prev.map((f) =>
          batch.find((b) => b.file === f.file) ? { ...f, status: "uploading" } : f
        )
      );

      try {
        const res = await axios.post("/api/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        setFiles((prev) =>
          prev.map((f) =>
            batch.find((b) => b.file === f.file) ? { ...f, status: "done" } : f
          )
        );

        if (res.data.errors?.length > 0) {
          res.data.errors.forEach((e: { filename: string; error: string }) =>
            toast.error(`${e.filename}: ${e.error}`)
          );
        }
      } catch {
        setFiles((prev) =>
          prev.map((f) =>
            batch.find((b) => b.file === f.file)
              ? { ...f, status: "error", error: "Upload failed" }
              : f
          )
        );
        toast.error(`Batch ${Math.floor(i / batchSize) + 1} failed`);
      }
    }

    setIsUploading(false);
    toast.success("Upload complete!");
    onUploadSuccess?.();
  };

  const pendingCount = files.filter((f) => f.status === "pending").length;
  const doneCount = files.filter((f) => f.status === "done").length;
  const totalSize = files.reduce((acc, f) => acc + f.file.size, 0);

  return (
    <div className="space-y-5">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-300 group ${
          isDragActive
            ? "border-rose-400 bg-rose-50 dark:bg-rose-900/20 scale-[1.02]"
            : "border-gray-200 dark:border-gray-700 hover:border-rose-300 dark:hover:border-rose-700 hover:bg-rose-50/50 dark:hover:bg-rose-900/10"
        }`}
      >
        <input {...getInputProps()} />
        <motion.div
          animate={isDragActive ? { scale: 1.1 } : { scale: 1 }}
          className="flex flex-col items-center gap-3"
        >
          <div className="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center group-hover:bg-rose-200 dark:group-hover:bg-rose-900/50 transition-colors">
            <Upload className="w-8 h-8 text-rose-500" />
          </div>
          <div>
            <p className="text-gray-700 dark:text-gray-300 font-semibold text-lg">
              {isDragActive ? "Drop photos here!" : "Drag & drop wedding photos"}
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
              or click to browse — JPG, PNG, WebP, HEIC up to 20MB
            </p>
          </div>
        </motion.div>
      </div>

      {/* Category selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Category
        </label>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.filter((c) => c.value !== "ALL").map((cat) => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value as Category)}
              className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                category === cat.value
                  ? "bg-rose-500 text-white border-rose-500 shadow-romantic"
                  : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-rose-300"
              }`}
            >
              {cat.emoji} {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {files.length} file{files.length !== 1 ? "s" : ""} • {formatBytes(totalSize)}
              {doneCount > 0 && (
                <span className="ml-2 text-green-500">✓ {doneCount} uploaded</span>
              )}
            </p>
            <button
              onClick={clearAll}
              className="text-xs text-gray-400 hover:text-red-400 transition-colors"
            >
              Clear all
            </button>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 max-h-60 overflow-y-auto">
            <AnimatePresence>
              {files.map((item, i) => (
                <motion.div
                  key={item.preview}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 group"
                >
                  <Image
                    src={item.preview}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                  {item.status === "uploading" && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                  {item.status === "done" && (
                    <div className="absolute inset-0 bg-green-500/40 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                  )}
                  {item.status === "error" && (
                    <div className="absolute inset-0 bg-red-500/40 flex items-center justify-center">
                      <AlertCircle className="w-5 h-5 text-white" />
                    </div>
                  )}
                  {item.status === "pending" && (
                    <button
                      onClick={() => removeFile(i)}
                      className="absolute top-0.5 right-0.5 w-4 h-4 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-2.5 h-2.5 text-white" />
                    </button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <Button
            onClick={handleUpload}
            loading={isUploading}
            disabled={pendingCount === 0}
            className="w-full"
            size="lg"
          >
            <ImageIcon className="w-5 h-5" />
            Upload {pendingCount} Photo{pendingCount !== 1 ? "s" : ""}
          </Button>
        </div>
      )}
    </div>
  );
}

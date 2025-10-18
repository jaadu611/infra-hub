"use client";

import { useState } from "react";
import { Upload } from "lucide-react";
import { uploadAvatar } from "@/actions/profile";
import Image from "next/image";

interface AvatarUploadProps {
  currentImage?: string;
  name: string;
}

export function AvatarUpload({ currentImage, name }: AvatarUploadProps) {
  const [preview, setPreview] = useState<string | undefined>(currentImage);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    await uploadAvatar(formData);

    // Show preview immediately
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-white shadow-xl">
          {preview ? (
            <Image
              src={preview}
              alt="Avatar"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full w-full bg-gradient-to-br from-blue-500 to-purple-600 text-white text-3xl">
              {getInitials(name)}
            </div>
          )}
        </div>
        <label className="absolute -bottom-2 -right-2 cursor-pointer bg-blue-400/30! rounded-full p-2 shadow-lg hover:bg-indigo-400/40! transition-colors">
          <Upload className="w-4 h-4 text-gray-600 dark:text-white" />
          <input type="file" className="hidden" onChange={handleChange} />
        </label>
      </div>
    </div>
  );
}

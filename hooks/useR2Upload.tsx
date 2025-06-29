import { useState } from 'react';

interface UploadResult {
  url: string;
  key: string;
  bucket: string;
  size: number;
  name: string;
}

export function useR2Upload() {
  const [isUploading, setIsUploading] = useState(false);

  const uploadToR2 = async (file: File): Promise<UploadResult> => {
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/r2-upload', {
        method: 'POST',
        body: formData,
        cache: 'no-store',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      const result = await response.json();
      return result;
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadToR2, isUploading };
}

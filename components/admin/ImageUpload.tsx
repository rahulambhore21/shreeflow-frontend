"use client";

import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  disabled?: boolean;
}

export default function ImageUpload({ value, onChange, label = "Image", disabled = false }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image size must be less than 5MB');
      return;
    }

    setUploadError('');
    setIsUploading(true);

    try {
      // Get Cloudinary credentials from environment variables
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

      if (!cloudName || !uploadPreset) {
        throw new Error('Cloudinary configuration is missing. Please set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET in your environment variables.');
      }

      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);

      // Upload to Cloudinary
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      onChange(data.secure_url);
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(error instanceof Error ? error.message : 'Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      
      <div className="space-y-4">
        {/* Preview */}
        {value && (
          <div className="relative w-full h-64 rounded-lg border-2 border-border overflow-hidden bg-muted">
            <Image
              src={value}
              alt="Upload preview"
              fill
              className="object-contain"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={handleRemove}
              disabled={disabled}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Upload button */}
        {!value && (
          <div
            onClick={!disabled && !isUploading ? handleClick : undefined}
            className={`
              relative w-full h-64 rounded-lg border-2 border-dashed border-border
              flex flex-col items-center justify-center gap-4
              transition-colors
              ${!disabled && !isUploading ? 'cursor-pointer hover:border-primary hover:bg-muted/50' : 'cursor-not-allowed opacity-50'}
            `}
          >
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
                <p className="text-sm text-muted-foreground">Uploading...</p>
              </>
            ) : (
              <>
                <div className="p-4 rounded-full bg-primary/10">
                  <ImageIcon className="h-8 w-8 text-primary" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">Click to upload image</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PNG, JPG, GIF up to 5MB
                  </p>
                </div>
                <Upload className="h-5 w-5 text-muted-foreground" />
              </>
            )}
          </div>
        )}

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          disabled={disabled || isUploading}
          className="hidden"
        />

        {/* Error message */}
        {uploadError && (
          <p className="text-sm text-destructive">{uploadError}</p>
        )}

        {/* URL input fallback */}
        <div className="space-y-2">
          <label className="text-xs text-muted-foreground">Or enter image URL directly:</label>
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://example.com/image.jpg"
            disabled={disabled}
            className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>
    </div>
  );
}

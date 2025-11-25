/**
 * Image compression and processing utilities
 */

export interface CompressedImage {
  base64: string;
  originalSize: number;
  compressedSize: number;
  mimeType: string;
}

/**
 * Compress an image file using Canvas API
 * @param file - The image file to compress
 * @param quality - JPEG quality (0-1), default 0.8
 * @param maxWidth - Maximum width in pixels, default 1200
 */
export async function compressImage(
  file: File,
  quality = 0.8,
  maxWidth = 1200
): Promise<CompressedImage> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        // Create canvas and draw resized image
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        // Draw with white background (for transparent images)
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to JPEG
        const base64 = canvas.toDataURL('image/jpeg', quality);

        resolve({
          base64,
          originalSize: file.size,
          compressedSize: getBase64Size(base64),
          mimeType: 'image/jpeg',
        });
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };

      img.src = event.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Get the size in bytes of a base64 string
 */
export function getBase64Size(base64: string): number {
  // Remove data URL prefix if present
  const base64Data = base64.split(',')[1] || base64;
  // Calculate size: base64 encodes 3 bytes into 4 characters
  const padding = (base64Data.match(/=/g) || []).length;
  return Math.floor((base64Data.length * 3) / 4) - padding;
}

/**
 * Format bytes to human readable string
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Check if file is a valid image type
 */
export function isValidImageType(file: File): boolean {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
  return validTypes.includes(file.type.toLowerCase());
}

/**
 * Check if file size is within limit (default 10MB)
 */
export function isWithinSizeLimit(file: File, maxSizeMB = 10): boolean {
  return file.size <= maxSizeMB * 1024 * 1024;
}

/**
 * Extract document type ID from field ID
 * e.g., "doc_aadhaar_wife" -> "aadhaar_wife"
 */
export function getDocumentTypeFromFieldId(fieldId: string): string {
  return fieldId.replace(/^doc_/, '');
}

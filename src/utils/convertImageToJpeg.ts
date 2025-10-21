/**
 * Converts JFIF and WebP images to JPEG format
 * @param file - The file to convert
 * @returns Promise<File> - The converted file or original if no conversion needed
 */
export const convertImageToJpeg = async (file: File): Promise<File> => {
  const extension = file.name.toLowerCase().split('.').pop();
  
  // Only convert JFIF and WebP files
  if (extension !== 'jfif' && extension !== 'webp') {
    return file;
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = document.createElement('img');
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }
        
        ctx.drawImage(img, 0, 0);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              // Replace .jfif or .webp extension with .jpg
              const newFileName = file.name.replace(/\.(jfif|webp)$/i, '.jpg');
              const newFile = new File([blob], newFileName, { 
                type: 'image/jpeg',
                lastModified: Date.now()
              });
              resolve(newFile);
            } else {
              reject(new Error('Failed to convert image to blob'));
            }
          },
          'image/jpeg',
          0.95 // Quality (0-1)
        );
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      
      img.src = e.target?.result as string;
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(file);
  });
};

/**
 * Batch converts multiple images
 * @param files - Array of files to convert
 * @returns Promise<File[]> - Array of converted files
 */
export const convertImagesToJpeg = async (files: File[]): Promise<File[]> => {
  return Promise.all(
    files.map(file => convertImageToJpeg(file))
  );
};
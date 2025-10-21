export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result);
    };
    reader.onerror = (error) => reject(error);
  });
};

export const getBlobType = (file: File): 'Image' | 'File' => {
  if (file.type.startsWith('image/')) {
    return 'Image'; // Assuming 1 is for images
  }
  return 'File'; // Default type
};

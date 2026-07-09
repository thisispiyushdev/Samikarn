import imageCompression from 'browser-image-compression';

/**
 * Compresses an image file and returns a Base64 string.
 * @param {File} file - The image file to compress
 * @param {Object} options - Custom compression options
 * @returns {Promise<string>} - The base64 string of the compressed image
 */
export const compressAndConvertToBase64 = async (file, options = {}) => {
  const defaultOptions = {
    maxSizeMB: 1.5,           // generous size limit for high quality
    maxWidthOrHeight: 1920,   // Full HD resolution max
    useWebWorker: true,
    initialQuality: 0.9,      // High quality preservation
    ...options
  };

  try {
    const compressedFile = await imageCompression(file, defaultOptions);
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(compressedFile);
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  } catch (error) {
    console.error('Error during image compression:', error);
    throw error;
  }
};

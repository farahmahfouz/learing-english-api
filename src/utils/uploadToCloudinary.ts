import cloudinary from './cloudinary';

export const uploadAudio = async (fileBuffer: Buffer) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        resource_type: 'video', // مهم للصوت 🎤
        folder: 'shadowing-audios',
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    ).end(fileBuffer);
  });
};
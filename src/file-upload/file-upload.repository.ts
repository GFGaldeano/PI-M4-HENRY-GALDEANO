import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import toStream from 'buffer-to-stream';

@Injectable()
export class FileUploadRepository {
  async uploadImage(file: Express.Multer.File) {
    const upload = () =>
      new Promise<UploadApiResponse>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: 'auto',
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          },
        );
        toStream(file.buffer).pipe(uploadStream);
      });

    return await upload();
  }
}
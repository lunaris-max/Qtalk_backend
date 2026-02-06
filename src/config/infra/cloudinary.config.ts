import { get } from 'env-var';

export const cloudinaryConfig = {
  url: get('CLOUDINARY_URL').required().asString(),
} as const;

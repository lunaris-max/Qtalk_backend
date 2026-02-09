export type UploadResult = {
  resource_type: string;
  format: string;
  bytes: number;
  public_id: string;
  url: string;
  secure_url: string;
};

export type MediaCreateInput = {
  originalName?: string;
  resourceType: string;
  format: string;
  bytes: number;
  publicId: string;
  url: string;
  secureUrl: string;
};

import { config } from "../config/index.js";

export const getS3Pragmas = (imgId) => ({
  Bucket: config.aws.bucketName,
  Key: imgId,
});

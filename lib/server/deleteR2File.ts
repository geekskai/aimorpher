import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { r2Client, R2_BUCKET_NAME } from './r2Client';

export const deleteR2File = async ({ key }: { key: string }) => {
  const command = new DeleteObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
  });

  await r2Client.send(command);

  return { success: true };
};

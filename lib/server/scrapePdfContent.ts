

import { pdfToText } from 'pdf-ts';
import AWS from 'aws-sdk';

// Configure AWS (reuse the same configuration as deleteS3File.ts)
AWS.config.update({
  region: process.env.S3_UPLOAD_REGION!!,
  credentials: {
    accessKeyId: process.env.S3_UPLOAD_KEY!!,
    secretAccessKey: process.env.S3_UPLOAD_SECRET!!,
  },
});

export async function scrapePdfContent(pdfUrl: string) {
  try {
    // Extract bucket and key from the S3 URL
    const urlParts = pdfUrl.match(
      /https:\/\/(.+?)\.s3\.(.+?)\.amazonaws\.com\/(.+)/
    );
    if (!urlParts) {
      throw new Error('Invalid S3 URL format');
    }

    const bucket = urlParts[1];
    const key = decodeURIComponent(urlParts[3]);

    // Create S3 instance
    const s3 = new AWS.S3();

    // Generate presigned URL for temporary access (expires in 1 hour)
    const presignedUrl = s3.getSignedUrl('getObject', {
      Bucket: bucket,
      Key: key,
      Expires: 3600, // 1 hour
    });

    // Fetch the PDF using the presigned URL
    const pdfFetch = await fetch(presignedUrl);

    if (!pdfFetch.ok) {
      throw new Error(
        `Failed to fetch PDF: ${pdfFetch.status} ${pdfFetch.statusText}`
      );
    }

    const pdf = await pdfFetch.arrayBuffer();
    const text = await pdfToText(new Uint8Array(pdf));

    return text;
  } catch (error) {
    console.error('Error scraping PDF content:', error);
    throw error;
  }
}

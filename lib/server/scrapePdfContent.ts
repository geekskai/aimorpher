import { pdfToText } from 'pdf-ts';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { r2Client } from './r2Client';

export async function scrapePdfContent(pdfUrl: string) {
  try {
    // 从R2 URL中提取key
    const urlParts = pdfUrl.match(
      /https:\/\/(.+?)\.r2\.cloudflarestorage\.com\/(.+)/
    );
    if (!urlParts) {
      throw new Error('Invalid R2 URL format');
    }

    const key = decodeURIComponent(urlParts[2]);

    // 创建预签名URL用于临时访问（1小时过期）
    const command = new GetObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: key,
    });

    const presignedUrl = await getSignedUrl(r2Client, command, {
      expiresIn: 3600, // 1小时
    });

    // 使用预签名URL获取PDF
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

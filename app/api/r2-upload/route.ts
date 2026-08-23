import { NextRequest, NextResponse } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { r2Client, R2_BUCKET_NAME } from '@/lib/server/r2Client';
import { auth } from '@clerk/nextjs/server';
import {
  validatePdfSignature,
  validatePdfUploadMetadata,
} from '@/lib/server/uploadValidation';
import { storeResume } from '@/lib/server/redisActions';
import { deleteR2File } from '@/lib/server/deleteR2File';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const metadataValidation = validatePdfUploadMetadata(file);
    if (!metadataValidation.valid) {
      return NextResponse.json(
        { error: metadataValidation.error },
        { status: 400 },
      );
    }

    const bytes = new Uint8Array(await file.arrayBuffer());
    const signatureValidation = validatePdfSignature(bytes);
    if (!signatureValidation.valid) {
      return NextResponse.json(
        { error: signatureValidation.error },
        { status: 400 },
      );
    }

    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const key = `uploads/${userId}/${timestamp}-${randomString}.pdf`;

    const buffer = Buffer.from(bytes);

    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: 'application/pdf',
    });

    await r2Client.send(command);

    const url = `${process.env.R2_ENDPOINT}/${key}`;

    try {
      await storeResume(userId, {
        status: 'draft',
        file: {
          url,
          key,
          bucket: R2_BUCKET_NAME,
          size: file.size,
          name: file.name,
        },
      });
    } catch (error) {
      await deleteR2File({ key });
      throw error;
    }

    return NextResponse.json({
      url,
      key,
      bucket: R2_BUCKET_NAME,
      size: file.size,
      name: file.name,
    });
  } catch (error) {
    console.error('R2 upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}

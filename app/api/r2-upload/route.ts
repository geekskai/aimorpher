import { NextRequest, NextResponse } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { r2Client, R2_BUCKET_NAME } from '@/lib/server/r2Client';
import { auth } from '@clerk/nextjs/server';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // 生成唯一的文件名
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const key = `uploads/${userId}/${timestamp}-${randomString}-${file.name}`;

    // 转换文件为Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 上传到R2
    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    });

    await r2Client.send(command);

    // 构建文件URL
    const url = `${process.env.R2_ENDPOINT}/${key}`;

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

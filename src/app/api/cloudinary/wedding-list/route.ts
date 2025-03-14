import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  timeout: 60000, // Increase timeout to 60 seconds
});

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

async function fetchWithRetry(retryCount = 0) {
  try {
    const result = await cloudinary.search
      .expression('folder:andreagsfoto/wedding-stories AND resource_type:image')
      .with_field('context')
      .with_field('metadata')
      .sort_by('created_at', 'desc')
      .max_results(500)
      .execute();

    return result;
  } catch (error) {
    if (retryCount < MAX_RETRIES && (error as { code?: string }).code === 'ECONNRESET' || (error as { code?: string }).code === 'ETIMEDOUT') {
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (retryCount + 1)));
      return fetchWithRetry(retryCount + 1);
    }
    throw error;
  }
}

export async function GET() {
  try {
    const result = await fetchWithRetry();

    if (!result?.resources || !Array.isArray(result.resources)) {
      console.error('Invalid response format from Cloudinary');
      return Response.json([]);
    }

    const photos = result.resources.map((resource: any) => ({
      _id: resource.asset_id,
      title: resource.filename || resource.public_id.split('/').pop(),
      public_id: resource.public_id,
      url: resource.secure_url,
      width: resource.width,
      height: resource.height,
      alt: resource.filename || resource.public_id.split('/').pop(),
      uploadDate: resource.created_at,
      context: resource.context || {},
      metadata: resource.metadata || {}
    }));

    return Response.json(photos);
  } catch (error) {
    console.error('Error fetching wedding images:', error);
    return Response.json([], { status: 200 }); // Return empty array instead of error
  }
}
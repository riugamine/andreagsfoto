import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
  try {
    const result = await cloudinary.search
      .expression('resource_type:image')
      .sort_by('created_at', 'desc')
      .max_results(500)
      .execute();

    const photos = result.resources.map((resource: any) => ({
      _id: resource.asset_id,
      title: resource.filename,
      public_id: resource.public_id,
      url: resource.secure_url,
      width: resource.width,
      height: resource.height,
      alt: resource.filename,
      uploadDate: resource.created_at
    }));

    return Response.json(photos);
  } catch (error) {
    console.error('Error fetching images:', error);
    return Response.json({ error: 'Error fetching images' }, { status: 500 });
  }
}
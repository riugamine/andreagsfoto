import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "@/sanity/schemaTypes";

interface SanityDocument {
  _type: string;
  image?: {
    asset?: {
      _ref: string;
    };
  };
  public_id?: string;
}

const config = defineConfig({
  basePath: "/studio",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  plugins: [deskTool(), visionTool()],
  schema: {
    types: schemaTypes,
  },
  document: {
    productionUrl: async (prev, context) => {
      const { document } = context as { document: SanityDocument };
      
      if (document._type === "photo" && document.image?.asset?._ref) {
        try {
          const formData = new FormData();
          const imageResponse = await fetch(
            `https://cdn.sanity.io/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/${process.env.NEXT_PUBLIC_SANITY_DATASET}/${document.image.asset._ref}.jpg`
          );
          const imageBlob = await imageResponse.blob();

          formData.append("file", imageBlob);
          formData.append("upload_preset", "andreagsfoto");

          const cloudinaryRes = await fetch(
            `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
            {
              method: "POST",
              body: formData,
            }
          ).then((res) => res.json());

          if (cloudinaryRes.public_id) {
            document.public_id = cloudinaryRes.public_id;
          }
        } catch (error) {
          console.error("Error uploading to Cloudinary:", error);
        }
      }
      return prev;
    },
  },
});

export default config;
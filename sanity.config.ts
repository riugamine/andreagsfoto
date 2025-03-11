import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "@/sanity/schemaTypes";

export default defineConfig({
  basePath: "/studio",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  plugins: [deskTool(), visionTool()],
  schema: {
    types: schemaTypes,
  },
  document: {
    hooks: {
      async beforeCreate(params) {
        const { document } = params;
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
              return document;
            }
          } catch (error) {
            console.error("Error uploading to Cloudinary:", error);
          }
        }
        return document;
      },
      async beforeDelete(params) {
        const { document } = params;
        if (document._type === "photo" && document.public_id) {
          try {
            const response = await fetch("/api/cloudinary/delete", {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ public_id: document.public_id }),
            });

            if (!response.ok) {
              console.error("Failed to delete image from Cloudinary");
            }
          } catch (error) {
            console.error("Error deleting from Cloudinary:", error);
          }
        }
      },
    },
  },
});

import { createUploadthing, type FileRouter } from "uploadthing/next";
import { cookies } from "next/headers";
import { TOKEN_COOKIE_NAME } from "../apollo/model/const";

const f = createUploadthing();

export const uploadRouter = {
  companyLogo: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      // Check if user is authenticated
      const cookieStore = await cookies();
      const token = cookieStore.get(TOKEN_COOKIE_NAME)?.value;

      if (!token) {
        throw new Error("Unauthorized");
      }

      // Return metadata that will be available in onUploadComplete
      return { token };
    })
    .onUploadComplete(async ({ file }) => {
      // This code runs on your server after upload
      // Return the file key to the client
      return { fileKey: file.key };
    }),

  chatImage: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 5,
    },
  })
    .middleware(async () => {
      const cookieStore = await cookies();
      const token = cookieStore.get(TOKEN_COOKIE_NAME)?.value;

      if (!token) {
        throw new Error("Unauthorized");
      }

      return { token };
    })
    .onUploadComplete(async ({ file }) => {
      return { fileKey: file.key };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof uploadRouter;

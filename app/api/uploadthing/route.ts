import { createRouteHandler } from "uploadthing/next";
import { uploadRouter } from "@shared/api/uploadthing/core";

export const { GET, POST } = createRouteHandler({
  router: uploadRouter,
});

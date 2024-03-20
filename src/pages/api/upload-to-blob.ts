/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-misused-promises */
// pages/api/upload.ts
import { type NextApiRequest, type NextApiResponse } from "next";
import { BlobServiceClient } from "@azure/storage-blob";
import { v4 as uuidv4 } from "uuid";
import type formidable from "formidable";
import { IncomingForm } from "formidable";
import { env } from "~/env";
import fs from "fs";
import util from "util";
export const config = {
  api: {
    bodyParser: false, // Disable Next.js's built-in body parser
  },
};
const readFile = util.promisify(fs.readFile);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const form = new IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).json({ error: "Error parsing the form" });
      }

      const file = files.file![0] as unknown as formidable.File; // Assuming the file field name is 'file'
      if (!file) {
        const file = files.file; // Assuming 'file' is the field name for the file upload
        if (!file) {
          return res
            .status(400)
            .json({ error: "No file uploaded or file path is undefined" });
        }
      }


      // Create a blob service client
      const blobServiceClient = BlobServiceClient.fromConnectionString(
        env.AZURE_STORAGE_CONNECTION_STRING,
      );

      // Get a reference to a container
      const containerClient = blobServiceClient.getContainerClient(
        !fields.revise  ? env.AZURE_CONTAINER_NAME : env.AZURE_TRANSLATOR_CONTAINER_NAME,
      );

      // Create the container if it does not exist
      await containerClient.createIfNotExists();

      // Generate a UUID for the blob name
      const blobName = `${fields?.id![0]}`;

      // Get a block blob client
      const blockBlobClient = containerClient.getBlockBlobClient(`${blobName}.${file.originalFilename?.split(".")[file.originalFilename?.split(".").length - 1]}`);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const fileData = await readFile(file.filepath);
      // Upload the file
      console.log(file.filepath);
      const uploadBlobResponse = await blockBlobClient.uploadData(fileData, {
        blobHTTPHeaders: {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          blobContentType: file.mimetype ?? "application/octet-stream", // Use the file's MIME type if available, otherwise default to 'application/octet-stream'
        },
      });
      console.log(
        `Upload block blob ${blobName} successfully`,
        uploadBlobResponse.requestId,
        blockBlobClient.url,
      );

      // Return the URL of the uploaded file
      res
        .status(200)
        .json({
          url: blockBlobClient.url,
          name: `${blobName}.${file.originalFilename?.split(".")[file.originalFilename?.split(".").length - 1]}`,
        });
    });
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}

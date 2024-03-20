/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  BlobSASPermissions,
  BlobServiceClient,
  ContainerSASPermissions,
  StorageSharedKeyCredential,
  generateBlobSASQueryParameters,
} from "@azure/storage-blob";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { env } from "~/env"; // Ensure you have an env module or replace with your actual environment variables

// Function to upload a file to Azure Blob Storage
export async function uploadFileToBlob(
  file: ArrayBuffer,
  type: string,
): Promise<string> {
  const blobServiceClient = BlobServiceClient.fromConnectionString(
    env.AZURE_STORAGE_CONNECTION_STRING,
  );
  const containerClient = blobServiceClient.getContainerClient(
    env.AZURE_CONTAINER_NAME,
  );
  await containerClient.createIfNotExists();
  const blockBlobClient = containerClient.getBlockBlobClient(uuidv4());
  await blockBlobClient.uploadData(file, {
    blobHTTPHeaders: { blobContentType: type },
  });
  return blockBlobClient.url;
}

// Function to translate a document
async function translateDocument(
  sourceUrl: string,
  targetLanguage: string,
  blobName: string,
): Promise<string> {
  const headers = {
    "Ocp-Apim-Subscription-Key": env.AZURE_TRANSLATOR_KEY,
    "Content-type": "application/json",
  };
  const source = await generateBlobSasUrl(env.AZURE_CONTAINER_NAME, blobName);
 
  const target = await generateContainerSasUrl(
    env.AZURE_TRANSLATOR_CONTAINER_NAME,
  );
  const body = {
    inputs: [
      {
        source: {
          sourceUrl: source,
        },
        targets: [
          {
            language: targetLanguage,
            targetUrl: target,
          },
        ],
        storageType: "File",
      },
    ],
    options: {
      experimental: true,
    },
  };

  const url = `${env.AZURE_TRANSLATOR_URL}/translator/text/batch/v1.1/batches`;
  try {
    const response = await axios.post(url, body, { headers });
    // Assuming the response contains the URL of the translated document
    // You might need to adjust this based on the actual response structure
    return response.data;
  } catch (error: any) {
    console.log(error.response);
    return "a";
  }
}

// Function to translate a document and upload the translated content back to Azure Blob Storage
export async function translateAndUploadBlob(
  blobName: string,
  targetLanguages: string,
  blobLink: string,
): Promise<any> {
  // Upload the document to Blob Storage
 
    const translatedDocumentUrl = await translateDocument(
      blobLink,
      targetLanguages,
      blobName,
    );
    console.log(`Translated document URL: ${translatedDocumentUrl}`);
    // Optionally, download and process the translated document
  }

// Example usage

async function generateBlobSasUrl(
  containerName: string,
  blobName: string,
): Promise<string> {
  const account = env.AZURE_ACCOUNT_NAME;
  const accountKey = env.AZURE_ACCOUNT_KEY;
  const sharedKeyCredential = new StorageSharedKeyCredential(
    account,
    accountKey,
  );
  const blobServiceClient = BlobServiceClient.fromConnectionString(
    env.AZURE_STORAGE_CONNECTION_STRING,
  );

  const containerClient = blobServiceClient.getContainerClient(containerName);

  const blobClient = containerClient.getBlobClient(blobName);

  const expiresOn = new Date();
  expiresOn.setMinutes(expiresOn.getMinutes() + 60);
  const a = generateBlobSASQueryParameters(
    {
      containerName: containerClient.containerName,
      blobName: blobName,
      expiresOn: new Date(new Date().valueOf() + 86400 * 1000), // 1 day expiry
      permissions: BlobSASPermissions.parse("r"),
    },
    sharedKeyCredential,
  );

  return `${blobClient.url}?${a.toString()}`;
}

async function generateContainerSasUrl(containerName: string): Promise<string> {
  const account = env.AZURE_ACCOUNT_NAME;
  const accountKey = env.AZURE_ACCOUNT_KEY;
  const sharedKeyCredential = new StorageSharedKeyCredential(
    account,
    accountKey,
  );
  const blobServiceClient = BlobServiceClient.fromConnectionString(
    env.AZURE_STORAGE_CONNECTION_STRING,
  );

  const containerClient = blobServiceClient.getContainerClient(containerName);
  //   console.log(containerClient)

  const a = generateBlobSASQueryParameters(
    {
      containerName: containerClient.containerName,
      expiresOn: new Date(new Date().valueOf() + 86400 * 1000), // 1 day expiry
      permissions: ContainerSASPermissions.parse("wl"),
    },
    sharedKeyCredential,
  );

  return `${containerClient.url}?${a.toString()}`;
}

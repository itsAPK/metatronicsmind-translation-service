import * as pdfjs from "pdfjs-dist";
import { TextContent, TextItem } from "pdfjs-dist/types/src/display/api";
import { array } from "zod";

export const extractPdfText = async (
  arrayBuffer: ArrayBuffer,
): Promise<string> => {
  const pdf = await pdfjs.getDocument(arrayBuffer).promise;
  let pdfText = "";
  for (let i = 0; i < pdf.numPages; i++) {
    const page = await pdf.getPage(i + 1);
    const content = await page.getTextContent();
    content.items.forEach((item) => {
      const i = item as unknown as TextItem;
      pdfText += i.str + " ";
    });
  }
  return pdfText;
};

export const countWords = (text: string): number => {
  return text.split(/\s+/).length;
};
export function dataURItoBlob(dataURI: string): {
  blob: Blob;
  arrayBuffer: ArrayBuffer;
} {
  // convert base64 to raw binary data held in a string
  // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
  const byteString = atob(dataURI.split(",")[1]!);

  // separate out the mime component
  const mimeString = dataURI.split(",")[0]!.split(":")[1]!.split(";")[0];

  // write the bytes of the string to an ArrayBuffer
  const ab = new ArrayBuffer(byteString.length);

  // create a view into the buffer
  const ia = new Uint8Array(ab);

  // set the bytes of the buffer to the correct values
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  // write the ArrayBuffer to a blob, and you're done
  const blob = new Blob([ab], { type: mimeString });
  return { blob: blob, arrayBuffer: ab };
}

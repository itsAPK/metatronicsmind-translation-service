/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Button, Card, Flex, Grid, Text } from "@radix-ui/themes";
import Dropzone, { DropzoneRef } from "react-dropzone";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import React, { createRef, useState } from "react";
import { api } from "~/utils/api";
import { MultiSelect } from "react-multi-select-component";
import { toast } from "sonner";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { v4 } from "uuid";
import { useRouter } from "next/router";

export default function Revise() {
  const dropzoneRef: React.LegacyRef<DropzoneRef> = createRef();
  const openDialog = () => {
    if (dropzoneRef.current) {
      dropzoneRef.current.open();
    }
  };
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const [file, setFile] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const q = router.query;
  const revise = api.misc.revise.useMutation();

  return (
    <Flex py={"9"} justify={"center"} align={"center"} direction={"column"}>
      <Card size="2" style={{ width: 800 }}>
        <Flex
          pt={"9"}
          pb={"4"}
          justify={"center"}
          align={"center"}
          direction={"column"}
        >
          <Dropzone
            ref={dropzoneRef}
            noClick
            noKeyboard
            multiple={false}
            accept={{ "application/pdf": [".pdf", ".docx"] }}
            onDrop={async (e) => {
              setFile(e);
            }}
          >
            {({ getRootProps, getInputProps, acceptedFiles }) => {
              return (
                <div className="">
                  <div
                    {...getRootProps({
                      className:
                        "dropzone border border-dashed border-gray-700 rounded bg-white bg-opacity-5 w-[600px] flex flex-col justify-center items-center space-y-10 h-[250px]",
                    })}
                  >
                    <input {...getInputProps()} />

                    <p className="text-center text-base font-bold text-gray-300 ">
                      Drag and Drop file here or Click the Button to select{" "}
                    </p>

                    <Button
                      radius="full"
                      size={"4"}
                      style={{
                        padding: "3px 100px",
                      }}
                      onClick={openDialog}
                    >
                      Choose Files
                    </Button>
                    <ul>
                      {file.map((file) => (
                        <li
                          className="text-center text-xs font-semibold"
                          key={file.name}
                        >
                          <p>
                            {file.name} - {(file.size / 1024).toFixed(2)} KB{" "}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            }}
          </Dropzone>{" "}
        </Flex>

        <Flex justify={"center"} pb={"7"} pt={"4"}>
          <Button
            size={"3"}
            style={{
              padding: "3px 100px",
            }}
            onClick={async () => {
              if (file.length < 1) {
                toast.error("No File selected");
                return;
              }

              setLoading(true);

              // eslint-disable-next-line @typescript-eslint/no-floating-promises

              const formData = new FormData();
              formData.append("file", file[0]!);
              formData.append("id", v4());
              formData.append("revise", "true");

              try {
                const response = await fetch("/api/upload-to-blob", {
                  method: "POST",
                  body: formData,
                });

                if (!response.ok) {
                  toast.error("Network response was not ok");
                }
            
                const data = await response.json();
            
                await revise.mutateAsync({
                  token: q.file as string,
                  file: data.url,
                });

                setLoading(false)
                toast.success('File Modified Successfully')
                await router.push('/')
              } catch (error: any) {
                toast.error(`Error uploading file: ${error}`);
                return null;
              }
            }}
          >
            {!loading ? "Upload Revised File" : "Processing"}
          </Button>
        </Flex>
      </Card>
    </Flex>
  );
}

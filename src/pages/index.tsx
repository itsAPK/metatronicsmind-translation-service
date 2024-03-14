/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Button, Flex } from "@radix-ui/themes";
import Dropzone, { DropzoneRef } from "react-dropzone";
import React, { createRef } from "react";
import { api } from "~/utils/api";
export default function Home() {
  const dropzoneRef: React.LegacyRef<DropzoneRef> = createRef();
  const openDialog = () => {
    // Note that the ref is set async,
    // so it might be null at some point
    if (dropzoneRef.current) {
      dropzoneRef.current.open();
    }
  };
  const forgotPassword = api.user.forgotPassword.useMutation()
  return (
    <Flex py={"9"} justify={"center"} align={"center"}>
      <Dropzone
        ref={dropzoneRef}
        noClick
        noKeyboard
        multiple={false}
        accept={{ 'application/pdf': [".pdf", ".docx"]}}
      >
        {({ getRootProps, getInputProps, acceptedFiles }) => {
          return (
            <div className="">
              <div
                {...getRootProps({
                  className:
                    "dropzone border border-dashed border-gray-700 rounded bg-white bg-opacity-5 w-[600px] flex flex-col justify-center items-center space-y-10 h-[300px]",
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
                <aside>
               
                <ul>
                  {acceptedFiles.map((file) => (
                    <li className="text-xs font-semibold" key={file.name}>
                      {file.name} - {(file.size / (1024)).toFixed(2)} KB
                    </li>
                  ))}
                </ul>
              </aside>
              </div>
              
            </div>
          );
        }}
      </Dropzone>
     
    </Flex>
  );
}

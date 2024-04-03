/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Button, Card, Flex, Grid, Text } from "@radix-ui/themes";
import Dropzone, { DropzoneRef } from "react-dropzone";
import React, { createRef, useEffect, useState } from "react";
import { api } from "~/utils/api";
import { MultiSelect } from "react-multi-select-component";
import { toast } from "sonner";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { v4 } from "uuid";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function Home() {
  const dropzoneRef: React.LegacyRef<DropzoneRef> = createRef();
  const openDialog = () => {
    if (dropzoneRef.current) {
      dropzoneRef.current.open();
    }
  };
  api.admin.addLanguages.useQuery()
  const lang = api.misc.getLanguages.useQuery();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const [selected, setSelected] = useState<any[]>([]);
  const [file, setFile] = useState<File[]>([]);
  const [pages, setPages] = useState(0);
  const [words, setWords] = useState(0);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const { status } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
      toast.error("Session Expired.");
    }
  }, [router, status]);
  const getCount = useMutation({
    mutationKey: ["get-count"],
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      if (file.type === "application/pdf") {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_WORD_COUNT_API}/analyze-pdf`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            onUploadProgress: (progressEvent) => {
              if (progressEvent.total) {
                setProgress(
                  Math.round(
                    (progressEvent.loaded * 100) / progressEvent.total,
                  ),
                );
              }
            },
          },
        );

        setPages(res.data.pages);
        setWords(res.data.words);
        return res.data;
      } else if (
        file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_WORD_COUNT_API}/analyze-docx`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            onUploadProgress: (progressEvent) => {
              if (progressEvent.total) {
                setProgress(
                  Math.round(
                    (progressEvent.loaded * 100) / progressEvent.total,
                  ),
                );
              }
            },
          },
        );
        setPages(res.data.pages);
        setWords(res.data.words);

        return res.data;
      }
    },
  });

  const uploadFile = useMutation({
    mutationKey: ["upload-to-blob"],
    mutationFn: async () => {
      if (file.length < 1) {
        toast.error("No File selected");
        return;
      }

      if (selected.length < 1) {
        toast.error("No Translation Languages are selected");
        return;
      }
      const formData = new FormData();
      formData.append("file", file[0]!);
      formData.append("id", v4());

      try {
        const response = await fetch("/api/upload-to-blob", {
          method: "POST",
          body: formData,
        });

        console.log(response);
        if (!response.ok) {
          toast.error("Network response was not ok");
        }

        const data = await response.json();
        return data; // Assuming the API returns the URL of the uploaded file
      } catch (error: any) {
        toast.error(`Error uploading file: ${error}`);
        return null;
      }
    },
  });

  const translate = api.misc.translate.useMutation();

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
          <Grid pb={"6"} gap="1">
            <Text as="div" weight="bold" size="2" mx="1">
              Select Translation Languages
            </Text>
            <MultiSelect
              className="w-[600px] bg-black font-medium text-black"
              options={
                lang.data
                  ? lang.data?.map((i) => ({
                      value: i.code,
                      label: `${i.name} (₹${i.pricePerWord * words})`,
                    }))
                  : []
              }
              hasSelectAll={false}
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              value={selected}
              onChange={setSelected}
              labelledBy="Select"
            />
          </Grid>
          <Dropzone
            ref={dropzoneRef}
            noClick
            noKeyboard
            multiple={false}
            accept={{ "application/pdf": [".pdf", ".docx"] }}
            onDrop={async (e) => {
              setFile(e);
              getCount.mutate(e[0]!);
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
                      disabled={progress > 0 && progress < 100}
                    >
                      {progress > 0 && progress < 100
                        ? `Uploading (${progress}%)`
                        : "Choose Files"}
                    </Button>
                    <aside>
                      <ul>
                        {file.map((file) => (
                          <li
                            className="text-center text-xs font-semibold"
                            key={file.name}
                          >
                            <p>
                              {file.name} - {(file.size / 1024).toFixed(2)} KB{" "}
                            </p>
                            <p className=" py-3 text-base uppercase">
                              Total Words Count - {words}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </aside>
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

              if (selected.length < 1) {
                toast.error("No Translation Languages are selected");
                return;
              }

              setLoading(true);
              toast.success('Your file is translating it may take few minutes')
              const files: {
                blobName: string;
                blobUrl: string;
                language: string;
              }[] = [];
              // eslint-disable-next-line @typescript-eslint/no-floating-promises
              for (const i of selected) {
                const formData = new FormData();
                formData.append("file", file[0]!);
                formData.append("id", v4());

                try {
                  const response = await fetch("/api/upload-to-blob", {
                    method: "POST",
                    body: formData,
                  });

                  console.log(response);
                  if (!response.ok) {
                    toast.error("Network response was not ok");
                  }

                  const data = await response.json();

                  files.push({
                    blobName: data.name,
                    blobUrl: data.url,
                    language: i.value,
                  });
                } catch (error: any) {
                  toast.error(`Error uploading file: ${error}`);
                  return null;
                }
              }
              const selectedLanguageCodes = selected.map(
                (language) => language.value,
              );

              // Filter lang.data to include only selected languages
              const selectedLanguages = lang.data?.filter((language) =>
                selectedLanguageCodes.includes(language.code),
              );

              // Calculate total sum and create array of objects for selected languages
              const totalSum = selectedLanguages!.reduce((sum, language) => {
                // Calculate the price per word for the current language
                const pricePerWord = language.pricePerWord || 0;

                // Calculate the total price for this language
                const totalPrice = pricePerWord * words;

                // Add the total price to the sum
                return sum + totalPrice;
              }, 0);

              await translate.mutateAsync({
                input: files,
                fileName: file[0]!.name,
                totalWords: words,
                blobUrl: files[0]?.blobUrl ?? "",
                totalAmount: totalSum,
              });

              if (!translate.isLoading) {
                toast.success(
                  "Files Submitted to Review. Once it approved you notify through mail",
                );
                setFile([]);
                setSelected([]);
                setLoading(false);
                setWords(0);
              }
            }}
          >
            {!loading ? "Start Translation" : "Processing"}
          </Button>
        </Flex>
      </Card>
    </Flex>
  );
}

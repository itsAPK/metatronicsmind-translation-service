/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import {
  Badge,
  Box,
  Button,
  Dialog,
  Flex,
  Grid,
  ScrollArea,
  Table,
  Text,
} from "@radix-ui/themes";
import { api } from "~/utils/api";
import { Loader } from "../utils/Loader";
import * as Accordion from "@radix-ui/react-accordion";
import {
  ChevronDownIcon,
  DownloadIcon,
  EnterIcon,
  ExitIcon,
  LockClosedIcon,
  StopIcon,
} from "@radix-ui/react-icons";
import { TranslationInfo } from "@prisma/client";

import cuid from "cuid";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import { env } from "~/env";
import { toast } from "sonner";
import useRazorpay from "~/hook/useRazorpay";
import Link from "next/link";

export const RecentTranslation = () => {
  const recentTranslation = api.admin.getRecentFiles.useQuery();
  const approve = api.admin.approve.useMutation();
  const reject = api.admin.reject.useMutation();
  return (
    <ScrollArea type="scroll" scrollbars="both" style={{ height: "80vh" }}>
      {!recentTranslation.isLoading ? (
        <>
          {recentTranslation!.data!.length > 0 ? (
            <>
              {recentTranslation!.data!.map((i) => (
                <Accordion.Root
                  className="my-3 w-full rounded-md border border-zinc-600 p-4 shadow shadow-zinc-700"
                  type="single"
                  key={i.id}
                  collapsible
                >
                  <Accordion.Item value={i.id}>
                    <Accordion.Trigger>
                      <Flex justify={"between"} gap={"9"} width={"100%"}>
                        <Box>
                          <Grid>
                            <Text
                              size="2"
                              weight={"bold"}
                              color="gray"
                              align={"left"}
                            >
                              Requested By
                            </Text>
                            <Text size="1" weight={"bold"} align={"center"}>
                              {i.user.name}
                            </Text>
                          </Grid>
                        </Box>
                        <Box width={"auto"} style={{ width: "200px" }}>
                          <Grid>
                            <Text
                              size="2"
                              weight={"bold"}
                              color="gray"
                              align={"left"}
                            >
                              File Name
                            </Text>
                            <Text
                              size="1"
                              weight={"bold"}
                              align={"left"}
                              trim={"end"}
                            >
                              {i.fileName}
                            </Text>
                          </Grid>
                        </Box>
                        <Box>
                          <Grid>
                            <Text
                              size="2"
                              weight={"bold"}
                              color="gray"
                              align={"left"}
                            >
                              Languages
                            </Text>
                            <Text size="1" weight={"bold"} align={"center"}>
                              {i.TranslatedFiles.length}
                            </Text>
                          </Grid>
                        </Box>
                        <Box>
                          <Grid>
                            <Text
                              size="2"
                              weight={"bold"}
                              color="gray"
                              align={"left"}
                            >
                              Total Words
                            </Text>
                            <Text size="1" weight={"bold"} align={"center"}>
                              {i.totalWords}
                            </Text>
                          </Grid>
                        </Box>
                        <Box>
                          <Grid>
                            <Text
                              size="2"
                              weight={"bold"}
                              color="gray"
                              align={"left"}
                            >
                              Total Amount
                            </Text>
                            <Text size="1" weight={"bold"} align={"center"}>
                              ₹{i.totalAmount}
                            </Text>
                          </Grid>
                        </Box>{" "}
                        <Box>
                          <Grid>
                            <Text
                              size="2"
                              weight={"bold"}
                              color="gray"
                              align={"left"}
                            >
                              Requested At
                            </Text>
                            <Text size="1" weight={"bold"}>
                              {i.createdAt?.toLocaleString("en-US", {
                               timeZone: "UTC"  // Indian Standard Time (IST) timezone
                              })} UTC
                            </Text>
                          </Grid>
                        </Box>
                        <Box>
                          <Grid>
                            <Text
                              size="2"
                              weight={"bold"}
                              color="gray"
                              align={"left"}
                            >
                              Status
                            </Text>
                            <Text size="1" weight={"bold"}>
                              <Badge
                                size="1"
                                variant="surface"
                                radius={"full"}
                                color={
                                  i.status === "UNDER_REVIEW"
                                    ? "amber"
                                    : i.status === "APPROVED"
                                      ? "green"
                                      : "red"
                                }
                              >
                                {" "}
                                <Text className="text-xs">
                                  {i.status === "UNDER_REVIEW"
                                    ? "UNDER REVIEW"
                                    : i.status}
                                </Text>
                              </Badge>
                            </Text>
                          </Grid>
                        </Box>
                      </Flex>
                    </Accordion.Trigger>
                    <Accordion.Content className="mt-5  border-t border-zinc-700 py-3">
                      <Text
                        weight={"bold"}
                        className="uppercase"
                        color={"gray"}
                        size={"2"}
                      >
                        Translations Details
                      </Text>
                      <Table.Root
                        size={"2"}
                        variant="surface"
                        style={{ margin: "10px 0" }}
                      >
                        <Table.Header>
                          <Table.Row>
                            <Table.ColumnHeaderCell justify={"center"}>
                              Ref ID
                            </Table.ColumnHeaderCell>

                            <Table.ColumnHeaderCell justify={"center"}>
                              Language
                            </Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell justify={"center"}>
                              Code
                            </Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell justify={"center"}>
                              Price Per Word
                            </Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell justify={"center"}>
                              Total Amount
                            </Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell
                              justify={"center"}
                            ></Table.ColumnHeaderCell>
                          </Table.Row>
                        </Table.Header>

                        <Table.Body>
                          <>
                            {i.TranslatedFiles.map((data) => (
                              <Table.Row key={data.id}>
                                <Table.RowHeaderCell justify={"center"}>
                                  {data.id}
                                </Table.RowHeaderCell>
                                <Table.RowHeaderCell justify={"center"}>
                                  {data.language.name}
                                </Table.RowHeaderCell>
                                <Table.Cell justify={"center"}>
                                  {data.language.code}
                                </Table.Cell>
                                <Table.Cell justify={"center"}>
                                  ₹{data.language.pricePerWord}
                                </Table.Cell>
                                <Table.Cell justify={"center"}>
                                  ₹
                                  {data.totalWords * data.language.pricePerWord}
                                </Table.Cell>
                                <Table.Cell justify={"center"}>
                                  <Flex justify={"center"} gap={"3"}>
                                    <Dialog.Root>
                                      <Dialog.Trigger>
                                        <button className="rounded border border-gray-600 px-2 py-[2px] text-xs">
                                          Preview
                                        </button>
                                      </Dialog.Trigger>
                                      <Dialog.Content
                                        style={{ maxWidth: "90%" }}
                                      >
                                        <DocViewer
                                          prefetchMethod="GET" // for remote fetch
                                          documents={[
                                            {
                                              uri: data.file, // for remote file"      // uri: "/demo.docx", // for local file
                                              fileType:
                                                data.file.split(".")[
                                                  data.file.split(".").length -
                                                    1
                                                ],
                                            },
                                          ]}
                                          pluginRenderers={DocViewerRenderers}
                                          style={{ height: "100vh" }} //custom style
                                          // config={{
                                          //   loadingRenderer: {
                                          //     overrideComponent: MyLoadingRenderer,
                                          //   },
                                          // }}
                                        />
                                      </Dialog.Content>
                                    </Dialog.Root>

                                    <Link href={data.file} target="_blank">
                                      {" "}
                                      <Button size={"1"} variant="soft">
                                        Download
                                      </Button>
                                    </Link>
                                  </Flex>
                                </Table.Cell>
                              </Table.Row>
                            ))}{" "}
                          </>
                        </Table.Body>
                      </Table.Root>
                      <Flex justify={"end"} py={"3"} gap={"5"}>
                        <Link href={i.blobLink} target="_blank">
                          {" "}
                          <Button size={"2"} variant="surface">
                            <DownloadIcon /> Download Original File
                          </Button>
                        </Link>
                        {i.status === "UNDER_REVIEW" ? (
                          <>
                            <Button
                              size={"2"}
                              color={"green"}
                              variant="surface"
                              onClick={async () => {
                                await approve.mutateAsync({
                                  translationId: i.id,
                                });
                                toast.success("Translation Approved");
                                await recentTranslation.refetch();
                              }}
                            >
                              <EnterIcon /> Approve
                            </Button>
                            <Button
                              size={"2"}
                              variant="surface"
                              color="red"
                              onClick={async () => {
                                await reject.mutateAsync({
                                  translationId: i.id,
                                });
                                toast.success("Translaion Rejected");
                                await recentTranslation.refetch();
                              }}
                            >
                              <ExitIcon /> Reject
                            </Button>
                          </>
                        ) : null}
                      </Flex>
                    </Accordion.Content>
                  </Accordion.Item>
                </Accordion.Root>
              ))}
            </>
          ) : (
            <Text align={"center"} size="2" weight={"bold"}>
              No Translation Found...
            </Text>
          )}
        </>
      ) : (
        <>
          {" "}
          <>
            <Loader />
          </>
        </>
      )}
    </ScrollArea>
  );
};

/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { Button, ScrollArea, Table, Text } from "@radix-ui/themes";
import { api } from "~/utils/api";
import { Loader } from "../utils/Loader";
import Link from "next/link";

export const UnderReviewTranslation = () => {
  const underReviewTranslation = api.user.getUnderReviewFiles.useQuery();

  return (
    <ScrollArea type="scroll" scrollbars="both" style={{ height: "80vh" }}>
      {!underReviewTranslation.isLoading ? (
        <>
          {underReviewTranslation!.data!.length > 0 ? (
            <Table.Root variant="surface">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell justify={"center"}>
                    Ref ID
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell justify={"center"}>
                    File Name
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell justify={"center"}>
                    No. of Languages
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell justify={"center"}>
                    Total Words
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell justify={"center"}>
                    Total Amount
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell justify={"center"}>
                    Requested At
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell justify={"center"}>
                    Actions
                  </Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                <>
                  {underReviewTranslation!.data!.map((data) => (
                    <Table.Row key={data.id}>
                      <Table.RowHeaderCell justify={"center"}>
                        {data.id}
                      </Table.RowHeaderCell>
                      <Table.RowHeaderCell justify={"center"}>
                        {data.fileName}
                      </Table.RowHeaderCell>
                      <Table.Cell justify={"center"}>
                        {data._count.TranslatedFiles}
                      </Table.Cell>
                      <Table.Cell justify={"center"}>
                        {data.totalWords}
                      </Table.Cell>
                      <Table.Cell justify={"center"}>
                        ₹{data.totalAmount}
                      </Table.Cell>
                      <Table.Cell justify={"center"}>
                      {data.createdAt?.toLocaleString("en-US", {
                               timeZone: "UTC"  // Indian Standard Time (IST) timezone
                              })} UTC
                      </Table.Cell>
                      <Table.Cell justify={"center"}>
                        <Link href={data.blobLink} target="_blank">
                          {" "}
                          <Button size={"1"} variant="soft">
                            Download Original File
                          </Button>
                        </Link>
                      </Table.Cell>
                    </Table.Row>
                  ))}{" "}
                </>
              </Table.Body>
            </Table.Root>
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

/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  ScrollArea,
  Table,
  Text,
  Button,
  Dialog,
  Flex,
  TextField,
} from "@radix-ui/themes";
import Link from "next/link";
import { Loader } from "../utils/Loader";
import { api } from "~/utils/api";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { toast } from "sonner";
import { useState } from "react";

export const Organizations = () => {
  const users = api.admin.getOrganizations.useQuery();
  const giveDiscount = api.admin.giveDiscount.useMutation();
  const [discount, setDiscount] = useState(0);
  return (
    <>
      <ScrollArea type="scroll" scrollbars="both" style={{ height: "80vh" }}>
        {!users.isLoading ? (
          <>
            {users.data!.length > 0 ? (
              <Table.Root variant="surface">
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeaderCell justify={"center"}>
                      Name
                    </Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell justify={"center"}>
                      E-mail
                    </Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell justify={"center"}>
                      Joined At
                    </Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell justify={"center"}>
                      Approved Translations
                    </Table.ColumnHeaderCell>

                    <Table.ColumnHeaderCell justify={"center"}>
                      Rejected Translations
                    </Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell justify={"center"}>
                      Total Translations
                    </Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell justify={"center"}>
                      Discount (in %)
                    </Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell
                      justify={"center"}
                    ></Table.ColumnHeaderCell>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  <>
                    {users.data.map((data: any) => (
                      <Table.Row key={data.id}>
                        <Table.RowHeaderCell justify={"center"}>
                          {data.name}
                        </Table.RowHeaderCell>
                        <Table.Cell justify={"center"}>{data.email}</Table.Cell>
                        <Table.Cell justify={"center"}>
                          {data.createAt?.toDateString()}
                        </Table.Cell>
                        <Table.Cell justify={"center"}>
                          {Number(data.approvedCount)}
                        </Table.Cell>
                        <Table.Cell justify={"center"}>
                          {Number(data.rejectedCount)}
                        </Table.Cell>
                        <Table.Cell justify={"center"}>
                          {Number(data.totalTranslationCount)}
                        </Table.Cell>
                        <Table.Cell justify={"center"}>
                          {Number(data.discount)}
                        </Table.Cell>
                        <Table.Cell justify={"center"}>
                          <Dialog.Root>
                            <Dialog.Trigger className="bg-purple-700/25">
                              <Button size={"1"} variant="soft">
                                Manage Discount
                              </Button>
                            </Dialog.Trigger>

                            <Dialog.Content style={{ maxWidth: 450 }}>
                              <Dialog.Title>
                                Edit Discount for {data.name}
                              </Dialog.Title>

                              <Flex direction="column" gap="3">
                                <TextField.Input
                                  type="number"
                                  placeholder="Enter Discount"
                                  onChange={(e) => {
                                    setDiscount(Number(e.target.value));
                                  }}
                                />
                              </Flex>

                              <Flex gap="3" mt="6" justify="center">
                                <Dialog.Close className="bg-purple-700/15">
                                  <Button
                                    onClick={async () => {
                                      if (discount > 0) {
                                        if(discount > 100){
                                          toast.error('Discount should be lesser than 100')
                                          return
                                        }
                                        try {
                                          await giveDiscount.mutateAsync({
                                            id: data.id,
                                            discount: discount,
                                          });
                                          setDiscount(0);
                                          await users.refetch();
                                          toast.success(
                                            `For ${data.name} Discount updated`,
                                          );
                                        } catch (err: any) {
                                          toast.success(err);
                                        }
                                      }
                                    }}
                                    variant="soft"
                                  >
                                    Submit
                                  </Button>
                                </Dialog.Close>
                              </Flex>
                            </Dialog.Content>
                          </Dialog.Root>
                        </Table.Cell>
                      </Table.Row>
                    ))}{" "}
                  </>
                </Table.Body>
              </Table.Root>
            ) : (
              <Text align={"center"} size="2" weight={"bold"}>
                No Organizations Found...
              </Text>
            )}
          </>
        ) : (
          <>
            <Loader />
          </>
        )}
      </ScrollArea>
    </>
  );
};

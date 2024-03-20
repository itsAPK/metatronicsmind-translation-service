/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ScrollArea,
  Table,
  Text,
  Button,
  Dialog,
  Flex,
  TextField,
} from "@radix-ui/themes";
import { Loader } from "../utils/Loader";
import { api } from "~/utils/api";
import { useState } from "react";
import { toast } from "sonner";

export const Languages = () => {
  const languages = api.admin.getLanguages.useQuery();
  const editPrice = api.admin.editLanguagePrice.useMutation();
  const [price, setPrice] = useState(0);
  return (
    <>
      <ScrollArea type="scroll" scrollbars="both" style={{ height: "80vh" }}>
        {!languages.isLoading ? (
          <>
            {languages.data!.length > 0 ? (
              <Table.Root variant="surface">
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeaderCell justify={"center"}>
                      Code
                    </Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell justify={"center"}>
                      Name
                    </Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell justify={"center"}>
                      Word Price
                    </Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell justify={"center"}>
                      Total Translations
                    </Table.ColumnHeaderCell>

                    <Table.ColumnHeaderCell justify={"center"}>
                      Actions
                    </Table.ColumnHeaderCell>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  <>
                    {languages.data!.map((data) => (
                      <Table.Row key={data.id}>
                        <Table.RowHeaderCell justify={"center"}>
                          {data.code}
                        </Table.RowHeaderCell>
                        <Table.Cell justify={"center"}>{data.name}</Table.Cell>
                        <Table.Cell justify={"center"}>
                          ₹{data.pricePerWord}
                        </Table.Cell>
                        <Table.Cell justify={"center"}>
                          {data._count.TranslatedFiles}
                        </Table.Cell>

                        <Table.Cell justify={"center"}>
                          <Dialog.Root>
                            <Dialog.Trigger className="bg-purple-700/25">
                              <Button size={"1"} variant="soft">
                                Edit Price
                              </Button>
                            </Dialog.Trigger>

                            <Dialog.Content style={{ maxWidth: 450 }}>
                              <Dialog.Title>
                                Edit Price for {data.name}
                              </Dialog.Title>

                              <Flex direction="column" gap="3">
                                <TextField.Input
                                  type="number"
                                  placeholder="Enter Price"
                              
                                  onChange={(e) => {
                                    setPrice(Number(e.target.value));
                                  }}
                                />
                              </Flex>

                              <Flex gap="3" mt="6" justify="center">
                                <Dialog.Close className="bg-purple-700/15">
                                  <Button
                                    onClick={async () => {
                                      if (price > 0) {
                                        try{
                                        await editPrice.mutateAsync({
                                          id: data.id,
                                          price: price,
                                        });
                                        setPrice(0)
                                        await languages.refetch()
                                        toast.success(`${data.name} Price updated`)
                                      
                                      }catch(err : any){
                                        toast.success(err)
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
                No Languages Found...
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

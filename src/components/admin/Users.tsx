/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ScrollArea, Table,Text,Button } from "@radix-ui/themes"
import Link from "next/link"
import { Loader } from "../utils/Loader"
import { api } from "~/utils/api"
import { Pencil1Icon } from "@radix-ui/react-icons"

export const Users = () => {
    const users = api.admin.getUsers.useQuery()

    return (<>
    


 
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
                </Table.Row>
              </Table.Header>

              <Table.Body>
                <>
                  {users.data.map((data : any) => (
                    <Table.Row key={data.id}>
                        
                      <Table.RowHeaderCell justify={"center"}>
                        {data.name}
                      </Table.RowHeaderCell>
                      <Table.Cell justify={"center"}>
                        {data.email}
                      </Table.Cell>
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
                    </Table.Row>
                  ))}{" "}
                </>
              </Table.Body>
            </Table.Root>
          ) : (
            <Text align={'center'} size="2" weight={'bold'}>No users Found...</Text>
          )}
        </>
      ) : (
        <><Loader/></>
      )}
    </ScrollArea>
    </>)
}
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Html,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";
import { Tailwind } from "@react-email/tailwind";
import { TranslatedFiles, TranslationInfo, User } from "@prisma/client";

interface ReviewFilesProps {
  user?: User;
  info?: TranslationInfo;
  files?: any[];
  approveLink: string;
  rejectLink: string;
}

const baseUrl = "http://localhost:3000";
export const ReviewFilesEmail = ({
  user,
  info,
  files,
  approveLink,
  rejectLink,
}: ReviewFilesProps) => {
  return (
    <Html>
      <Head />
      <Preview>Translation Files</Preview>
      <Tailwind>
        <Body style={main}>
          <Container style={container}>
            <Text className="text-3xl font-bold uppercase hover:cursor-pointer hover:text-gray-400">
              Metatronicmind
            </Text>
            <Section>
              <Text style={text}>
                {user?.name} Submitted for Translation for Review
              </Text>
              <Section style={informationTable}>
                <Row style={informationTableRow}>
                  <Column colSpan={2}>
                    <Section>
                      <Row>
                        <Column style={informationTableColumn}>
                          <Text style={informationTableLabel}>Email</Text>
                          <Link
                            style={{
                              ...informationTableValue,
                              color: "#15c",
                              textDecoration: "underline",
                            }}
                          >
                            {user?.email}
                          </Link>
                        </Column>
                        <Column style={informationTableColumn}>
                          <Text style={informationTableLabel}>
                            Requested Date
                          </Text>
                          <Text style={informationTableValue}>
                            {new Date().toUTCString()}
                          </Text>
                        </Column>
                      </Row>

                      <Row>
                        <Column style={informationTableColumn}>
                          <Text style={informationTableLabel}>
                            Reference ID
                          </Text>
                          <Text style={informationTableValue}>
                            {info?.id.toUpperCase()}
                          </Text>
                        </Column>
                        <Column style={informationTableColumn}>
                          <Text style={informationTableLabel}>User Type.</Text>
                          <Text style={informationTableValue}>
                            {user?.role}
                          </Text>
                        </Column>
                      </Row>
                    </Section>
                  </Column>
                  <Row>
                    <Column style={informationTableColumn} colSpan={2}>
                      <Text style={informationTableLabel}>Total Words</Text>
                      <Text style={informationTableValue}>
                        {info?.totalWords}
                      </Text>
                    </Column>
                    <Column style={informationTableColumn} colSpan={2}>
                      <Text style={informationTableLabel}>Total Amount</Text>
                      <Text style={informationTableValue}>
                        ₹{info?.totalAmount}
                      </Text>
                    </Column>
                    <Column style={informationTableColumn} colSpan={2}>
                      <Text style={informationTableLabel}>
                        No. of Languages
                      </Text>
                      <Text style={informationTableValue}>{files?.length}</Text>
                    </Column>
                  </Row>
                  <Row className="pr-3">
                    <Column style={informationTableColumn} className="w-full">
                      {" "}
                      <Text style={informationTableLabel}>
                        Original File Name
                      </Text>
                      <Text style={informationTableValue}>
                        {info?.fileName}
                      </Text>
                    </Column>
                    <Column style={informationTableColumn}>
                      <Button style={button} href={info?.blobLink}>
                        Download Original File
                      </Button>
                    </Column>
                  </Row>
                </Row>
              </Section>
              <Section style={informationTable} className="my-5">
                <Row style={informationTableRow}>
                  <Column colSpan={2}>
                    <Section>
                      <Row className="border">
                        <Column style={informationTableColumn}>
                          <Text
                            style={informationTableLabel}
                            className="text-sm font-bold uppercase"
                          >
                            Translated Files
                          </Text>
                        </Column>
                      </Row>
                    </Section>
                  </Column>
                  {files?.map((i) => (
                    <Row className="pr-3" key={i.language.code}>
                      <Column style={informationTableColumn} className="w-full">
                        {" "}
                        <Text
                          style={informationTableValue}
                          className="text-sm font-bold"
                        >
                          {i?.language.name}
                        </Text>
                      </Column>
                      <Column style={informationTableColumn}>
                        <Button style={button} href={i?.file}>
                          Download
                        </Button>
                      </Column>
                      <Column style={informationTableColumn}>
                        <Button
                          style={button}
                          href={`${baseUrl}/admin/revise?file=${i.reviseToken}`}
                        >
                          Revise
                        </Button>
                      </Column>
                    </Row>
                  ))}
                </Row>
                <Section className="py-2 ">
                  <Column>
                    <Button
                      className="w-[200px] rounded bg-[#5753C6] px-2 py-3 text-center font-serif text-sm   uppercase text-white"
                      href={approveLink}
                    >
                      Approve Translation
                    </Button>
                  </Column>
                  <Column>
                    <Button
                      className="w-[200px] rounded bg-[#d84949] px-2 py-3 text-center font-serif text-sm  uppercase text-white"
                      href={rejectLink}
                    >
                      Reject Translation
                    </Button>
                  </Column>
                </Section>
              </Section>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

ReviewFilesEmail.PreviewProps = {
  user: {
    id: "jjjjj",
    name: "Apoorva Kumar",
    role: "INDIVIDUAL",
    email: "apk@mai.com",
    gstin: "",
    password: "string",
    createAt: new Date(),
  },
  info: {
    fileName: "File.pdf",
    createdAt: new Date(),
    totalAmount: 4000,
    totalWords: 10000,
    userId: "sssss",
    blobLink:
      "https://metatronicminf.blob.core.windows.net/translatedfiles/c892d22b-864c-40ba-88ce-a3553005063f.docx",
    id: "clttymawy000510hmi01bks71",
    isApproved: false,
    status: "UNDER_REVIEW",
  },
  files: [
    {
      file: "https://metatronicminf.blob.core.windows.net/translatedfiles/c892d22b-864c-40ba-88ce-a3553005063f.docx",
      language: {
        code: "kn",
        name: "Kannada",
      },
    },
    {
      file: "https://metatronicminf.blob.core.windows.net/translatedfiles/c892d22b-864c-40ba-88ce-a3553005063f.docx",
      language: {
        code: "ar",
        name: "Arabic",
      },
    },
  ],
} as ReviewFilesProps;

export default ReviewFilesEmail;

const main = {
  backgroundColor: "#f6f9fc",
  padding: "10px 0",
};

const container = {
  backgroundColor: "#ffffff",
  border: "1px solid #f0f0f0",
  padding: "45px",
};

const text = {
  fontSize: "16px",
  fontFamily:
    "'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif",
  fontWeight: "300",
  color: "#404040",
  lineHeight: "26px",
};

const button = {
  backgroundColor: "#5753C6",
  borderRadius: "4px",
  color: "#fff",
  fontFamily: "'Open Sans', 'Helvetica Neue', Arial",
  fontSize: "12px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "100px",
  padding: "7px 7px",
};

const anchor = {
  textDecoration: "underline",
};

const informationTable = {
  borderCollapse: "collapse" as const,
  borderSpacing: "0px",
  color: "rgb(51,51,51)",
  backgroundColor: "rgb(250,250,250)",
  borderRadius: "3px",
  fontSize: "12px",
};

const informationTableRow = {
  height: "46px",
};

const informationTableColumn = {
  paddingLeft: "20px",
  borderStyle: "solid",
  borderColor: "white",
  borderWidth: "0px 1px 1px 0px",
  height: "44px",
};

const resetText = {
  margin: "0",
  padding: "0",
  lineHeight: 1.4,
};

const informationTableLabel = {
  ...resetText,
  color: "rgb(102,102,102)",
  fontSize: "10px",
};

const informationTableValue = {
  fontSize: "12px",
  margin: "0",
  padding: "0",
  lineHeight: 1.4,
};

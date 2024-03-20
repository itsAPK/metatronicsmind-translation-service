import {
    Body,
    Button,
    Container,
    Head,
    Html,
    Link,
    Preview,
    Section,
    Text,
  } from "@react-email/components";
  import * as React from "react";
  import { Tailwind } from "@react-email/tailwind";

  interface ApproveEmailProps {
    userFirstname?: string;
    link : string,
    fileName : string
  }
  
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "";
  
  export const ApproveEmail = ({
    userFirstname,
    link,
    fileName
  }: ApproveEmailProps) => {
    return (
      <Html>
        <Head />
        <Preview>Metatronicmind Translation Request Approved</Preview>
        <Tailwind>

        <Body style={main}>
          <Container style={container}>
          <Text className="text-3xl font-bold uppercase hover:cursor-pointer hover:text-gray-400">
            Metatronicmind
          </Text>
            <Section>
              <Text style={text}>Hi {userFirstname},</Text>
              <Text style={text}>
              {`We're pleased to inform you that your translation request for the file ${fileName} has been approved.`}              </Text>
              <Text style={text}>  To view Translation result   <Link href="http://localhost:3000/history">go to this link.</Link></Text>
              <Button style={button} href={link}>
                Download {fileName}
              </Button>
              <Text style={text} className="py-10">
              Thank you for using our translation services.
              </Text>
              
            </Section>
          </Container>
        </Body>
        </Tailwind>
      </Html>
    );
  };
  
  ApproveEmail.PreviewProps = {
    userFirstname: "Alan",
    link: "https://dropbox.com",
    fileName : "Alumin Poratal.pdf"
  } as ApproveEmailProps;
  
  export default ApproveEmail;
  
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
    fontSize: "15px",
    textDecoration: "none",
    textAlign: "center" as const,
    display: "block",
    width: "full",
    padding: "14px 7px",
  };
  
  const anchor = {
    textDecoration: "underline",
  };
  
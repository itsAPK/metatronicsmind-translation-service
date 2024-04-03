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

  interface DropboxResetPasswordEmailProps {
    userFirstname?: string;
    resetPasswordLink?: string;
  }
  
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "";
  
  export const ResetPasswordEmail = ({
    userFirstname,
    resetPasswordLink,
  }: DropboxResetPasswordEmailProps) => {
    return (
      <Html>
        <Head />
        <Preview>Metatronicmind reset your password</Preview>
        <Tailwind>

        <Body style={main}>
          <Container style={container}>
          <Text className="text-3xl font-bold uppercase hover:cursor-pointer hover:text-gray-400">
            Metatronicmind
          </Text>
            <Section>
              <Text style={text}>Hi {userFirstname},</Text>
              <Text style={text}>
                Someone recently requested a password change for your Metatronicmind Translation Service
                account. If this was you, you can set a new password here:
              </Text>
              <Button style={button} href={resetPasswordLink}>
                Reset password
              </Button>
              <Text style={text}>
                If you don&apos;t want to change your password or didn&apos;t
                request this, just ignore and delete this message.
              </Text>
              <Text style={text}>
                To keep your account secure, please don&apos;t forward this email
                to anyone. See our Help Center for{" "}
                <Link style={anchor} href="https://metatronicmind.ai/contact-us">
                  more security tips.
                </Link>
              </Text>
            </Section>
          </Container>
        </Body>
        </Tailwind>
      </Html>
    );
  };
  
  ResetPasswordEmail.PreviewProps = {
    userFirstname: "Alan",
    resetPasswordLink: "https://dropbox.com",
  } as DropboxResetPasswordEmailProps;
  
  export default ResetPasswordEmail;
  
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
    width: "210px",
    padding: "14px 7px",
  };
  
  const anchor = {
    textDecoration: "underline",
  };
  
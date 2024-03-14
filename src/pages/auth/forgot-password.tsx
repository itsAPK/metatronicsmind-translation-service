import { Flex, Card } from "@radix-ui/themes";
import { ForgotPasswordForm } from "~/components/auth/FogotPasswordForm";
import { LoginForm } from "~/components/auth/LoginForm";

export default function ForgotPassword() {
  return (
    <Flex py={"9"} justify={"center"} align={"center"}>
      <Card size="2" style={{ width: 400 }}>
        <ForgotPasswordForm />
      </Card>
    </Flex>
  );
}
import { Flex, Card } from "@radix-ui/themes";
import { ResetPasswordForm } from "~/components/auth/ResetPassword";

export default function ResetPassword() {
  return (
    <Flex py={"9"} justify={"center"} align={"center"}>
      <Card size="2" style={{ width: 400 }}>
        <ResetPasswordForm />
      </Card>
    </Flex>
  );
}
import { Flex, Card } from "@radix-ui/themes";
import { LoginForm } from "~/components/auth/LoginForm";

export default function Login() {
  return (
    <Flex py={"9"} justify={"center"} align={"center"}>
      <Card size="2" style={{ width: 400 }}>
        <LoginForm />
      </Card>
    </Flex>
  );
}

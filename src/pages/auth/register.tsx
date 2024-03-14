import {
    Flex,
    Text,
    Card,
    Tabs,
  } from "@radix-ui/themes";
  import { SignupForm } from "~/components/auth/SignupForm";
  
  
  export default function Register() {
  
    return (
      <Flex py={"9"} justify={"center"} align={"center"}>
        <Card size="2" style={{ width: 600 }}>
          <Tabs.Root defaultValue="individual">
            <Tabs.List
              style={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
              }}
            >
              <Tabs.Trigger value="individual">
                {" "}
                <Text
                  as="div"
                  weight="bold"
                  size="3"
                  mx="1"
                  className="uppercase"
                >
                  Individual
                </Text>
              </Tabs.Trigger>
              <Tabs.Trigger value="organization">
                {" "}
                <Text
                  as="div"
                  weight="bold"
                  size="3"
                  mx="1"
                  className="uppercase"
                >
                  ORGANIZATION
                </Text>
              </Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="individual">
              <SignupForm role="INDIVIDUAL" />
            </Tabs.Content>
            <Tabs.Content value="organization">
              <SignupForm role="ORGANIZATION" />
            </Tabs.Content>
          </Tabs.Root>
        </Card>
      </Flex>
    );
  }
  
import { Box, Button, Flex, Grid, Text } from "@radix-ui/themes";
import Link from "next/link";
import { EnterIcon, ExitIcon } from "@radix-ui/react-icons";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/router";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface HeaderProps {}

const items = [
  {
    name: "Home",
    link: "/",
  },
  {
    name: "About Us",
    link: "/",
  },
  {
    name: "Product",
    link: "/",
  },
  {
    name: "Contact Us",
    link: "/",
  },
];

export const Header: React.FC<HeaderProps> = () => {
  const { status } = useSession();
  const router = useRouter();

  return (
    <Flex
      align={"center"}
      justify={"between"}
      gap="2"
      className="h-20 w-full  rounded  bg-white bg-opacity-[0.03] px-4 drop-shadow-md backdrop-blur-md"
    >
      <Box>
        <Link href="/">
          <Text className="font-league-spartans text-3xl font-bold uppercase hover:cursor-pointer hover:text-gray-400">
            Metatronicmind
          </Text>
        </Link>
      </Box>
      <Box className="uppercase">
        <Flex gap="3" align={"center"}>
          {items.map((item) => (
            <Box key={item.name} className="py-1">
              <Link
                href={item.link}
                className="text- rounded-lg  border-0  px-4 py-2 font-semibold  hover:text-[#b0aae4ff]"
              >
                {item.name}
              </Link>
            </Box>
          ))}{" "}
          <Box>
            {status != "authenticated" ? (
              <>
                {" "}
                {router.pathname !== "/auth/login" ? (
                  <Button
                    onClick={() => router.push("/auth/login")}
                    size={"2"}
                    variant="surface"
                    className="cursor-pointer px-6 uppercase "
                  >
                    {" "}
                    <EnterIcon />
                    <Text align={"center"}>Login</Text>
                  </Button>
                ) : (
                  <Button
                    onClick={() => router.push("/auth/login")}
                    size={"2"}
                    variant="surface"
                    className="cursor-pointer px-6 uppercase "
                  >
                    {" "}
                    <EnterIcon />
                    <Text align={"center"}>Register</Text>
                  </Button>
                )}
              </>
            ) : (
              <Button
                size={"2"}
                variant="surface"
                className="cursor-pointer px-6 uppercase "
              >
                {" "}
                <ExitIcon />
                <Text align={"center"}>Logout</Text>
              </Button>
            )}{" "}
          </Box>
        </Flex>
      </Box>
    </Flex>
  );
};

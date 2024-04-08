import { Box, Button, Flex, Grid, Text,Avatar } from "@radix-ui/themes";
import Link from "next/link";
import { EnterIcon, ExitIcon } from "@radix-ui/react-icons";
import { signOut, useSession } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/router";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface HeaderProps {}

const items = [
  {
    name: "Home",
    link: "https://metatronicmind.ai",
  },
  {
    name: "Translations",
    link: "/translations",
  },
  {
    name: "About Us",
    link: "https://metatronicmind.ai/about-us",
  },
  {
    name: "Contact Us",
    link: "https://metatronicmind.ai/contact-us",
  },
];

export const Header: React.FC<HeaderProps> = () => {
  const { status, data: session } = useSession();
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
          <div className="flex space-x-3 items-center">
            <div>
              <Avatar src="/logo.png" size={'5'} alt='logo' width={80} height={10} fallback={""}/>
            </div>
          <div className="grid"> 
          <Text className="font-league-spartans text-xl font-bold uppercase hover:cursor-pointer hover:text-gray-400">
          Metatronicminds
          </Text>
          <Text className="font-league-spartans -mt-2 text-lg font-bold uppercase hover:cursor-pointer hover:text-gray-400">
        AI Translator
          </Text>
          </div>
          </div>
         
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
          {session && session.user.role === "ADMIN" ? (
            <Link
              href={"/admin"}
              className="text- rounded-lg  border-0  px-4 py-2 font-semibold  hover:text-[#b0aae4ff]"
            >
              Admin Panel
            </Link>
          ) : null}
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
                    onClick={() => router.push("/auth/register")}
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
                onClick={async () => {
                  await signOut({
                    redirect: true,
                    callbackUrl: "/auth/login",
                  });
                  await router.push("/auth/login");
                }}
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

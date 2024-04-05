import { Flex, Grid, TextField, Button, Text } from "@radix-ui/themes";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { api } from "~/utils/api";
import { toast } from "sonner";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface LoginFormProps {}

interface LoginUser {
  email: string;
  password: string;
}

const schema = z.object({
  email: z
    .string({ required_error: "Email Should not be empty" })
    .email("Invalid E-mail"),
  password: z
    .string({ required_error: "Password required" })
    .min(8, "Password must contain at least 8 character(s)"),
  gstin: z.string().optional(),
});

export const LoginForm: React.FC<LoginFormProps> = ({}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginUser>({
    mode: "onTouched",
    resolver: zodResolver(schema),
  });

  const router = useRouter();

  const onSubmit: SubmitHandler<LoginUser> = async (data) => {
    const a = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect : false

    });
    console.log(a)

    if (!a?.error) {
      await router.push("/");
      toast.success("Login Successfull");
    } else {
        console.log(a.error)
      if (a.error === "CredentialsSignin") {
        toast.error("Invalid Credentials");
      }
    }
  };

  return (
    <Flex direction="column" justify={"center"} gap="3"  pt={'4'}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid pb={"6"} gap="1">
          <Text as="div" weight="bold" size="2" mx="1">
            E-mail
          </Text>
          <TextField.Input
            size={"3"}
            variant="classic"
            type="email"
            placeholder="email@email.com"
            className="focus:outline-none"
            {...register("email")}
          />
          {errors.email && (
            <p className="mb-2 px-1 text-xs italic text-red-500">
              {errors.email?.message?.toString()}
            </p>
          )}
        </Grid>
        <Grid pb={"5"} gap="1">
          <Text as="div" weight="bold" size="2" mx="1">
            Password
          </Text>
          <TextField.Input
            size={"3"}
            variant="classic"
            type="password"
            placeholder="**********"
            className="focus:outline-none"
            {...register("password")}
          />
          {errors.password && (
            <p className="mb-2 px-1 text-xs italic text-red-500">
              {errors.password?.message?.toString()}
            </p>
          )}
          <Flex justify={"end"} className="pb-6">
            <Link href="/auth/forgot-password">
              <Text as="div" size="1" mx="1" color="gray">
                Forgot Password?
              </Text>
            </Link>
          </Flex>
        </Grid>

        <Flex justify={"center"}>
          <Button className="uppercase" size="3" style={{ padding: "0 45px" }}>
            Login
          </Button>
        </Flex>
      </form>
      <hr className="mt-4 border-gray-800 pt-3"></hr>
      <Flex justify={"center"}>
        <Text as="div" size="2" mx="1" color="gray">
          Not a member?{" "}
          <Link href="/auth/register">
            <Text as="span" weight="bold">
              Signup
            </Text>
          </Link>
        </Text>
      </Flex>
    </Flex>
  );
};

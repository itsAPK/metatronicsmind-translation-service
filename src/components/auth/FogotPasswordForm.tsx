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
interface ForgotPasswordFormProps {}

interface ForgotPassword {
  email: string;
}

const schema = z.object({
  email: z
    .string({ required_error: "Email Should not be empty" })
    .email("Invalid E-mail"),
});

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPassword>({
    mode: "onTouched",
    resolver: zodResolver(schema),
  });

  const router = useRouter();
  const forgotPassword = api.user.forgotPassword.useMutation();

  const onSubmit: SubmitHandler<ForgotPassword> = async (data) => {
    try {
      await forgotPassword.mutateAsync({
        email: data.email,
      });

      toast.success("Reset Password sent to your email");
      await router.push("/auth/login");
    } catch (e) {
      toast.error(forgotPassword.error?.message);
    }
  };

  return (
    <Flex direction="column" justify={"center"} gap="3" pt={'4'}>
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

        <Flex justify={"center"}>
          <Button className="uppercase" size="3" style={{ padding: "0 45px" }}>
            Get Reset Password Link
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

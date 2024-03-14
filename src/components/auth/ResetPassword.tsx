import { Flex, Grid, TextField, Button, Text } from "@radix-ui/themes";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { api } from "~/utils/api";
import { toast } from "sonner";
import { useRouter } from "next/router";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ResetPasswordFormProps {}

interface ResetPassword {
  password: string;
  confirmPassword: string;
}

const schema = z
  .object({
    password: z
      .string({ required_error: "Password required" })
      .min(8, "Password must contain at least 8 character(s)"),
    confirmPassword: z.string({
      required_error: '"Confirm Password should not be empty"',
    }),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        path: ["confirmPassword"],
        message: "The passwords did not match",
      });
    }
  });

export const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPassword>({
    mode: "onTouched",
    resolver: zodResolver(schema),
  });

  const router = useRouter();

  const { token } = router.query;

  const resetPassword = api.user.resetPassword.useMutation();

  const onSubmit: SubmitHandler<ResetPassword> = async (data) => {
    try {
      if (!token) {
        toast.error("Reset Token not found");
        return;
      }
      await resetPassword.mutateAsync({
        password: data.password,
        token: token as string,
      });

      toast.success("Reset Password Successfull");
      await router.push("/auth/login");
    } catch (e) {
      toast.error(resetPassword.error?.message);
    }
  };

  return (
    <Flex direction="column" justify={"center"} gap="3" pt={"4"}>
      <form onSubmit={handleSubmit(onSubmit)}>
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
        </Grid>
        <Grid pb={"5"} gap="1">
          <Text as="div" weight="bold" size="2" mx="1">
            Confirm Password
          </Text>
          <TextField.Input
            size={"3"}
            variant="classic"
            type="password"
            placeholder="**********"
            className="focus:outline-none"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="mb-2 px-1 text-xs italic text-red-500">
              {errors.confirmPassword?.message?.toString()}
            </p>
          )}
        </Grid>

        <Flex justify={"center"}>
          <Button className="uppercase" size="3" style={{ padding: "0 45px" }}>
            Reset Password
          </Button>
        </Flex>
      </form>
    </Flex>
  );
};

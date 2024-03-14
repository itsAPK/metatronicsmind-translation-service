import { Flex, Grid, TextField, Button, Text } from "@radix-ui/themes";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { api } from "~/utils/api";
import { toast } from "sonner";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";

interface SignupFormProps {
  role: "INDIVIDUAL" | "ORGANIZATION";
}

interface AddUser {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  gstin: string;
}

const schema = z
  .object({
    name: z.string({ required_error: "Name should not be empty" }),
    email: z
      .string({ required_error: "Email Should not be empty" })
      .email("Invalid E-mail"),
    password: z
      .string({ required_error: "Password required" })
      .min(8, "Password must contain at least 8 character(s)"),
    gstin: z.string().optional(),
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

export const SignupForm: React.FC<SignupFormProps> = ({
  role = "INDIVIDUAL",
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddUser>({
    mode: "onTouched",
    resolver: zodResolver(schema),
  });

  const router = useRouter();

  const createUser = api.user.create.useMutation();

  const onSubmit: SubmitHandler<AddUser> = async (data) => {
    try {
      await createUser.mutateAsync({
        email: data.email,
        name: data.name,
        password: data.password,
        role: role,
        gstin: data.gstin,
      });

      toast.success("Registration Successfull");
      await router.push("/login");
    } catch (e) {
      if (createUser.error?.message.split(" ").includes("(`email`)")) {
        toast.error("E-mail Already Exists");
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <Flex direction="column" justify={"center"} gap="3">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid gap="1" py={"4"}>
          <Text as="div" weight="bold" size="2" mx="1">
            {role === "INDIVIDUAL" ? "Name" : "Organization's Name"}
          </Text>
          <TextField.Input
            variant="classic"
            size={"3"}
            type="text"
            placeholder="Jhon Smith"
            className="focus:outline-none"
            {...register("name")}
          />
          {errors.name && (
            <p className="mb-2 text-xs italic text-red-500">
              {errors.name?.message?.toString()}
            </p>
          )}
        </Grid>
        <Grid pb={"4"} gap="1">
          <Text as="div" weight="bold" size="2" mx="1">
            E-mail
          </Text>
          <TextField.Input
            size={"3"}
            variant="classic"
            type="email"
            placeholder="email@metatronicminds.com"
            className="focus:outline-none"
            {...register("email")}
          />
          {errors.email && (
            <p className="mb-2 px-1 text-xs italic text-red-500">
              {errors.email?.message?.toString()}
            </p>
          )}
        </Grid>
        <Grid pb={"4"} gap="1">
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
        <Grid pb={"4"} gap="1">
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
        {role === "ORGANIZATION" ? (
          <Grid pb={"4"} gap="1">
            <Text as="div" weight="bold" size="2" mx="1">
              GSTIN (Optional)
            </Text>
            <TextField.Input
              size={"3"}
              variant="classic"
              type="text"
              placeholder="GSTIN0000000"
              className="focus:outline-none"
              {...register("gstin")}
            />
            {errors.gstin && (
              <p className="mb-2 px-1 text-xs italic text-red-500">
                {errors.gstin?.message?.toString()}
              </p>
            )}
          </Grid>
        ) : null}
        <Flex justify={"center"}>
          <Button className="uppercase" size="3" style={{ padding: "0 45px" }}>
            Signup
          </Button>
        </Flex>
      </form>
    </Flex>
  );
};

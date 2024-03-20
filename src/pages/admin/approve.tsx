/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Flex, Text } from "@radix-ui/themes";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { toast } from "sonner";
import { api } from "~/utils/api";
export default function Approve() {
  const approve = api.misc.approve.useMutation();
  const router = useRouter();
  const q: any = router.query;

  useEffect(() => {
    if (router.isReady) {
      if (!q.token) {
        toast.error("Token Not found");
        return;
      }

      try {
        // Run the mutation only once when the component mounts
        approve.mutate({ token: q.token });
        toast.success("Translation Approved");
        router.push("/");
      } catch (e: any) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        toast.error(e);
      }
    }
  }, [q]); // Empty dependency array to run the effect only once

  return (
    <Flex justify={"center"} align={"center"} py={"9"}>
      <Text>Redirecting...</Text>
    </Flex>
  );
}

/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Box, Card, Flex, Tabs, Text } from "@radix-ui/themes";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { toast } from "sonner";
import { Languages } from "~/components/admin/Languages";
import { Organizations } from "~/components/admin/Organizations";
import { Users } from "~/components/admin/Users";
import { ApprovedTranslation } from "~/components/translations/ApproveTranslations";
import { ExpiredTranslation } from "~/components/translations/ExpiredTranslation";
import { RecentTranslation } from "~/components/translations/RecentTranslations";
import { RejectedTranslation } from "~/components/translations/RejectedTranslation";
import { UnderReviewTranslation } from "~/components/translations/UnderReviewTranslation";
import { api } from "~/utils/api";

export default function Reject() {
  const router = useRouter();
  const q: any = router.query;
  const { data: session, status }: any = useSession();


  useEffect(() => {
    if (router.isReady) {
      if (status === "unauthenticated") {
        toast.error("Unauthorized");
        return;
      }

      if (status !== "loading" && session.user.role !== "ADMIN") {
        toast.error("Unauthorized");
        router.push("/auth/login");
        return;
      }
    }
  }, [q, session]); // Empty dependency array to run the effect only once

  return (
    <Card
      variant="surface"
      style={{
        padding: "20px",
        margin: "20px",
      }}
    >
      <Tabs.Root defaultValue="languages">
        <Tabs.List>
          <Tabs.Trigger value="languages">Languages</Tabs.Trigger>
          <Tabs.Trigger value="individual-users">Individual Users</Tabs.Trigger>
          <Tabs.Trigger value="organizations">Organizations</Tabs.Trigger>
          <Tabs.Trigger value="recent">Recent Translations</Tabs.Trigger>
        </Tabs.List>

        <Box px="4" pt="3" pb="2">
          <Tabs.Content value="languages"><Languages/></Tabs.Content>

          <Tabs.Content value="individual-users"><Users></Users></Tabs.Content>

          <Tabs.Content value="organizations"><Organizations/></Tabs.Content>
          <Tabs.Content value="recent"><RecentTranslation/></Tabs.Content>
        </Box>
      </Tabs.Root>
    </Card>
  );
}

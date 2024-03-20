/* eslint-disable @typescript-eslint/no-floating-promises */
import { Box, Card, Tabs, Text } from "@radix-ui/themes";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { toast } from "sonner";
import { ApprovedTranslation } from "~/components/translations/ApproveTranslations";
import { ExpiredTranslation } from "~/components/translations/ExpiredTranslation";
import { RejectedTranslation } from "~/components/translations/RejectedTranslation";
import { UnderReviewTranslation } from "~/components/translations/UnderReviewTranslation";

export default function Translation() {
  const { status } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
      toast.error("Session Expired.");
    }
  }, [router, status]);
  return (
    <Card
      variant="surface"
      style={{
        padding: "20px",
        margin: "20px",
      }}
    >
      <Tabs.Root defaultValue="approved">
        <Tabs.List>
          <Tabs.Trigger value="approved">Approved Translations</Tabs.Trigger>
          <Tabs.Trigger value="rejected">Rejected Translations</Tabs.Trigger>
          <Tabs.Trigger value="underReview">
            Under Review Translations
          </Tabs.Trigger>
          <Tabs.Trigger value="expired">Expired Translations</Tabs.Trigger>
        </Tabs.List>

        <Box px="4" pt="3" pb="2">
          <Tabs.Content value="approved">
            <ApprovedTranslation />{" "}
          </Tabs.Content>

          <Tabs.Content value="rejected">
            <RejectedTranslation />
          </Tabs.Content>

          <Tabs.Content value="underReview">
            <UnderReviewTranslation />{" "}
          </Tabs.Content>
          <Tabs.Content value="expired">
            <ExpiredTranslation />
          </Tabs.Content>
        </Box>
      </Tabs.Root>
    </Card>
  );
}

import React from "react";
import { type StructureBuilder } from "sanity/desk";
import { Box, Button, Card, Dialog, Flex, Stack, Text } from "@sanity/ui";
import DeletePane from "./components/DeletePane";

const PublishPane = (props: any) => {
  const [dialog, setDialog] = React.useState<{ title: string; message: string; tone?: "critical" | "positive" } | null>(null);
  const doc = props?.document?.displayed ?? {};
  const rawId: string | undefined = doc?._id || props.documentId;
  if (!rawId) return React.createElement("div", null, "No document id available.");

  const siteUrl = (typeof window !== "undefined" && window.location.origin)
    || (typeof process !== "undefined" && process.env.NEXT_PUBLIC_SITE_URL)
    || "http://localhost:3000";

  function computeRedirectPath(document: any) {
    const type = document?._type;
    const slug = document?.slug?.current ?? document?.slug_current ?? null;

    switch (type) {
      case "homePage":
      case "siteSettings":
        return "/";
      case "project":
        return slug ? `/projects/${slug}` : "/projects";
      case "service":
        return slug ? `/services/${slug}` : "/services";
      case "aboutPage":
        return "/about";
      case "author":
        return "/about";
      default:
        return "/";
    }
  }

  const redirectPath = computeRedirectPath(doc);

  const refreshPublished = async () => {
    try {
      const base = siteUrl.replace(/\/$/, "");
      const tokenRes = await fetch(`${base}/api/studio/revalidate/token`, { method: "GET", credentials: "include" });
      const ct = tokenRes.headers.get("content-type") || "";
      if (!tokenRes.ok) {
        const text = await tokenRes.text().catch(() => "");
        let hint = "";
        try {
          const errBody = JSON.parse(text) as { error?: string };
          if (errBody?.error === "server_secret_missing") {
            hint =
              "\n\nThe server needs SANITY_WEBHOOK_SECRET or SANITY_PREVIEW_SECRET in production (e.g. Vercel → Environment Variables), then redeploy. Use the same value as your Sanity webhook secret.";
          } else if (errBody?.error === "origin_not_allowed") {
            hint =
              "\n\nSet NEXT_PUBLIC_SITE_URL to your live URL (e.g. https://www.gtekeng.com), redeploy, and open Studio from that domain.";
          }
        } catch {
          /* not JSON */
        }
        setDialog({
          title: "Refresh failed",
          message: `Could not obtain revalidation token: ${tokenRes.status} ${text}${hint}`,
          tone: "critical",
        });
        return;
      }
      if (!ct.includes("application/json")) {
        const text = await tokenRes.text().catch(() => "<no body>");
        setDialog({
          title: "Refresh failed",
          message: `Token endpoint did not return JSON: ${text}`,
          tone: "critical",
        });
        return;
      }
      const tokenJson = await tokenRes.json();
      const token = tokenJson?.token as string;
      if (!token) {
        setDialog({
          title: "Refresh failed",
          message: `Token endpoint returned no token: ${JSON.stringify(tokenJson)}`,
          tone: "critical",
        });
        return;
      }

      const res = await fetch(`${base}/api/studio/revalidate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, path: redirectPath || "/" }),
      });
      const ctype = res.headers.get("content-type") || "";
      if (!ctype.includes("application/json")) {
        const text = await res.text().catch(() => "<no body>");
        setDialog({
          title: "Refresh failed",
          message: `Revalidation endpoint returned non-JSON: ${text}`,
          tone: "critical",
        });
        return;
      }
      const json = await res.json();
      if (res.ok && json?.ok) {
        setDialog({
          title: "Refresh completed",
          message: "Cache cleared — refresh the live site tab to see published content.",
          tone: "positive",
        });
      } else {
        setDialog({
          title: "Refresh failed",
          message: `Revalidation failed: ${json?.error || res.status}`,
          tone: "critical",
        });
      }
    } catch (err) {
      setDialog({
        title: "Refresh failed",
        message: `Revalidation error: ${String(err)}`,
        tone: "critical",
      });
    }
  };

  return (
    <>
      <Card padding={4}>
        <Stack space={4}>
          <Text size={2} weight="semibold">
            Published Content
          </Text>
          <Text size={1} muted>
            Preview mode has been removed. Use this button to clear cache and refresh published pages.
          </Text>
          <Flex>
            <Button text="Refresh Published" tone="primary" onClick={refreshPublished} />
          </Flex>
        </Stack>
      </Card>

      {dialog ? (
        <Dialog id="publish-pane-result" header={dialog.title} onClose={() => setDialog(null)} width={1}>
          <Box padding={4}>
            <Stack space={4}>
              <Text size={1}>{dialog.message}</Text>
              <Flex justify="flex-end">
                <Button
                  text="Close"
                  tone={dialog.tone === "critical" ? "critical" : "positive"}
                  onClick={() => setDialog(null)}
                />
              </Flex>
            </Stack>
          </Box>
        </Dialog>
      ) : null}
    </>
  );
};

const previewViews = (S: StructureBuilder) => [
  S.view.form(),
  S.view.component(PublishPane).title("Publish") as any,
];

export const deskStructure = (S: StructureBuilder) =>
  S.list()
    .title("GTek Content")
    .items([
      S.listItem()
        .id("contacts")
        .title("Contacts")
        .child(
          S.list()
            .id("contacts-list")
            .title("Contacts")
            .items([
              S.listItem()
                .id("shortcut-contact-details")
                .title("Contact Details")
                .child(
                  S.document().schemaType("siteSettings").documentId("siteSettings").views(previewViews(S))
                ),
            ]),
        ),
      S.listItem()
        .id("site-settings")
        .title("Site Settings")
        .child(S.document().schemaType("siteSettings").documentId("siteSettings").views(previewViews(S))),
      S.listItem()
        .id("home-page")
        .title("Home Page")
        .child(S.document().schemaType("homePage").documentId("homePage").views(previewViews(S))),
      S.listItem()
        .id("about-page")
        .title("About Page")
        .child(S.document().schemaType("aboutPage").documentId("aboutPage").views(previewViews(S))),
      S.divider(),
      S.listItem()
        .id("projects")
        .title("Projects")
        .schemaType("project")
        .child(
          S.documentTypeList("project")
            .title("Projects")
            .defaultOrdering([{ field: "title", direction: "asc" }])
            .child((docId) =>
              S.document()
                .schemaType("project")
                .documentId(docId)
                .views([S.view.form(), S.view.component(PublishPane).title("Publish") as any, S.view.component(DeletePane).title("Delete") as any])
            )
        ),
      S.listItem()
        .id("service-groups")
        .title("Service Groups")
        .schemaType("service")
        .child(
          S.documentTypeList("service")
            .title("Service Groups")
            .defaultOrdering([{ field: "title", direction: "asc" }])
            .child((docId) =>
              S.document()
                .schemaType("service")
                .documentId(docId)
                .views([S.view.form(), S.view.component(PublishPane).title("Publish") as any, S.view.component(DeletePane).title("Delete") as any])
            )
        ),
      S.listItem()
        .id("author-bio")
        .title("Author / Bio")
        .schemaType("author")
        .child(
          S.documentTypeList("author")
            .title("Author / Bio")
            .defaultOrdering([{ field: "name", direction: "asc" }])
        ),
      S.divider(),
      ...S.documentTypeListItems().filter((item) => {
        const id = item.getId();
        return (
          id !== "siteSettings" &&
          id !== "homePage" &&
          id !== "aboutPage" &&
          id !== "project" &&
          id !== "service" &&
          id !== "author"
        );
      }),
    ]);

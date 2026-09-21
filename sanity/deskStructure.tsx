import React from "react";
import { type StructureBuilder } from "sanity/desk";
import {
  HomeIcon,
  UsersIcon,
  DocumentsIcon,
  CogIcon,
  ComponentIcon,
  EarthGlobeIcon,
  BlockElementIcon,
  EnvelopeIcon,
} from "@sanity/icons";
import { Box, Button, Card, Dialog, Flex, Stack, Text } from "@sanity/ui";
import DeletePane from "./components/DeletePane";

const PublishPane = (props: any) => {
  const [dialog, setDialog] = React.useState<{ title: string; message: string; tone?: "critical" | "positive" } | null>(
    null,
  );
  const doc = props?.document?.displayed ?? {};
  const rawId: string | undefined = doc?._id || props.documentId;
  if (!rawId) return React.createElement("div", null, "No document id available.");

  const siteUrl =
    (typeof window !== "undefined" && window.location.origin) ||
    (typeof process !== "undefined" && process.env.NEXT_PUBLIC_SITE_URL) ||
    "http://localhost:3000";

  function computeRedirectPath(document: any) {
    const type = document?._type;
    const slug = document?.slug?.current ?? document?.slug_current ?? null;

    switch (type) {
      case "homePage":
      case "siteSettings":
        return "/";
      case "project":
      case "projectsPage":
        return slug ? `/projects/${slug}` : "/projects";
      case "service":
      case "servicesPage":
        return slug ? `/services/${slug}` : "/services";
      case "aboutPage":
        return "/about";
      case "contactPage":
        return "/contact";
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
      <Card padding={4} radius={3} shadow={1} tone="transparent">
        <Stack space={4}>
          <Text size={2} weight="semibold">
            Publish to live site
          </Text>
          <Text size={1} muted>
            After saving and publishing your changes, use this button to clear the site cache so visitors see the latest
            content immediately.
          </Text>
          <Flex>
            <Button text="Refresh published site" tone="primary" onClick={refreshPublished} />
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

const collectionViews = (S: StructureBuilder) => [
  S.view.form(),
  S.view.component(PublishPane).title("Publish") as any,
  S.view.component(DeletePane).title("Delete") as any,
];

function singleton(
  S: StructureBuilder,
  opts: {
    id: string;
    documentId: string;
    schemaType: string;
    title: string;
    icon?: React.ComponentType;
  },
) {
  return S.listItem()
    .id(opts.id)
    .title(opts.title)
    .icon(opts.icon)
    .child(S.document().schemaType(opts.schemaType).documentId(opts.documentId).views(previewViews(S)));
}

export const deskStructure = (S: StructureBuilder) =>
  S.list()
    .title("GTek Studio")
    .items([
      singleton(S, {
        id: "home-page",
        documentId: "homePage",
        schemaType: "homePage",
        title: "Home",
        icon: HomeIcon,
      }),
      singleton(S, {
        id: "about-page",
        documentId: "aboutPage",
        schemaType: "aboutPage",
        title: "About",
        icon: UsersIcon,
      }),
      S.listItem()
        .id("services")
        .title("Services")
        .icon(BlockElementIcon)
        .child(
          S.list()
            .title("Services")
            .items([
              singleton(S, {
                id: "services-page",
                documentId: "servicesPage",
                schemaType: "servicesPage",
                title: "Page text & images",
                icon: DocumentsIcon,
              }),
              S.listItem()
                .id("service-groups")
                .title("Service groups")
                .icon(ComponentIcon)
                .schemaType("service")
                .child(
                  S.documentTypeList("service")
                    .title("Service groups")
                    .defaultOrdering([{ field: "title", direction: "asc" }])
                    .child((docId) =>
                      S.document().schemaType("service").documentId(docId).views(collectionViews(S)),
                    ),
                ),
            ]),
        ),
      S.listItem()
        .id("projects")
        .title("Projects")
        .icon(EarthGlobeIcon)
        .child(
          S.list()
            .title("Projects")
            .items([
              singleton(S, {
                id: "projects-page",
                documentId: "projectsPage",
                schemaType: "projectsPage",
                title: "Page text & layout",
                icon: DocumentsIcon,
              }),
              S.listItem()
                .id("project-cards")
                .title("Project cards")
                .icon(EarthGlobeIcon)
                .schemaType("project")
                .child(
                  S.documentTypeList("project")
                    .title("Project cards")
                    .defaultOrdering([{ field: "sector", direction: "asc" }, { field: "title", direction: "asc" }])
                    .child((docId) =>
                      S.document().schemaType("project").documentId(docId).views(collectionViews(S)),
                    ),
                ),
            ]),
        ),
      singleton(S, {
        id: "contact-page",
        documentId: "contactPage",
        schemaType: "contactPage",
        title: "Contact",
        icon: EnvelopeIcon,
      }),
      S.divider(),
      singleton(S, {
        id: "site-settings",
        documentId: "siteSettings",
        schemaType: "siteSettings",
        title: "Site settings",
        icon: CogIcon,
      }),
    ]);

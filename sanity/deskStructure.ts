import React from "react";
import { type StructureBuilder } from "sanity/desk";

const PublishPane = (props: any) => {
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
        // authors currently map to about page; change if you have author pages
        return "/about";
      default:
        // fallback to listing or root
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
        // eslint-disable-next-line no-alert
        alert(`Could not obtain revalidation token: ${tokenRes.status} ${text}`);
        return;
      }
      if (!ct.includes("application/json")) {
        const text = await tokenRes.text().catch(() => "<no body>");
        // eslint-disable-next-line no-alert
        alert(`Token endpoint did not return JSON: ${text}`);
        return;
      }
      const tokenJson = await tokenRes.json();
      const token = tokenJson?.token as string;
      if (!token) {
        // eslint-disable-next-line no-alert
        alert(`Token endpoint returned no token: ${JSON.stringify(tokenJson)}`);
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
        // eslint-disable-next-line no-alert
        alert(`Revalidation endpoint returned non-JSON: ${text}`);
        return;
      }
      const json = await res.json();
      if (res.ok && json?.ok) {
        // eslint-disable-next-line no-alert
        alert("Cache cleared — refresh the live site tab to see published content.");
      } else {
        // eslint-disable-next-line no-alert
        alert(`Revalidation failed: ${json?.error || res.status}`);
      }
    } catch (err) {
      // eslint-disable-next-line no-alert
      alert(`Revalidation error: ${String(err)}`);
    }
  };

  return React.createElement(
    "div",
    { style: { padding: 12 } },
    React.createElement("p", null, React.createElement("strong", null, "Published Content")),
    React.createElement(
      "p",
      null,
      "Preview mode has been removed. Use this button to clear cache and refresh published pages."
    ),
    React.createElement(
      "button",
      { onClick: refreshPublished, style: { padding: "8px 12px", cursor: "pointer" } },
      "Refresh Published"
    )
  );
};

const previewViews = (S: StructureBuilder, schemaType: string) => [
  S.view.form(),
  S.view.component(PublishPane).title("Publish") as any,
];

export const deskStructure = (S: StructureBuilder) =>
  S.list()
    .title("GTek Content")
    .items([
      S.listItem()
        .id("shortcuts")
        .title("Shortcuts")
        .child(
          S.list()
            .id("shortcuts-list")
            .title("Shortcuts")
            .items([
              S.listItem()
                .id("shortcut-site-settings")
                .title("Edit Site Settings")
                .child(
                  S.document().schemaType("siteSettings").documentId("siteSettings").views(previewViews(S, "siteSettings"))
                ),
              S.listItem()
                .id("shortcut-home-page")
                .title("Edit Home Page")
                .child(S.document().schemaType("homePage").documentId("homePage").views(previewViews(S, "homePage"))),
            ]),
        ),
      S.listItem()
        .id("site-settings")
        .title("Site Settings")
        .child(S.document().schemaType("siteSettings").documentId("siteSettings").views(previewViews(S, "siteSettings"))),
      S.listItem()
        .id("home-page")
        .title("Home Page")
        .child(S.document().schemaType("homePage").documentId("homePage").views(previewViews(S, "homePage"))),
      S.listItem()
        .id("about-page")
        .title("About Page")
        .child(S.document().schemaType("aboutPage").documentId("aboutPage").views(previewViews(S, "aboutPage"))),
      S.divider(),
      // Do not call `.child()` on `documentTypeListItem` to add a document editor: that replaces
      // the default `documentTypeList` and breaks the list of documents. Nest `documentTypeList`
      // and pass the custom document pane as *its* child instead.
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
                .views(previewViews(S, "project"))
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
                .views(previewViews(S, "service"))
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
            .child((docId) =>
              S.document()
                .schemaType("author")
                .documentId(docId)
                .views(previewViews(S, "author"))
            )
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


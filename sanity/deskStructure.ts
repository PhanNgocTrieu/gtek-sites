import React from "react";
import { type StructureBuilder } from "sanity/desk";

// A simple Preview pane component that constructs the preview-enter URL
// and opens it in a new tab. It expects the hosting Next app to expose
// `NEXT_PUBLIC_SITE_URL` and (optionally) `NEXT_PUBLIC_SANITY_PREVIEW_SECRET`.
const PreviewPane = (props: any) => {
  const doc = props?.document?.displayed ?? {};
  const rawId: string | undefined = doc._id || props.documentId;
  if (!rawId) return React.createElement("div", null, "No document id available");

  const docId = rawId.startsWith("drafts.") ? rawId.replace("drafts.", "") : rawId;

  // Prefer the runtime origin when available so Studio uses the same host
  // (helps avoid mismatches when NEXT_PUBLIC_SITE_URL is set to a different host).
  const siteUrl = (typeof window !== "undefined" && window.location.origin)
    || (typeof process !== "undefined" && process.env.NEXT_PUBLIC_SITE_URL)
    || "http://localhost:3000";

  const secret = (typeof process !== "undefined" && process.env.NEXT_PUBLIC_SANITY_PREVIEW_SECRET) || "";

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

  const enterUrl = `${siteUrl.replace(/\/$/, "")}/api/preview/enter?secret=${encodeURIComponent(secret)}&id=${encodeURIComponent(docId)}&redirect=${encodeURIComponent(redirectPath || "/")}`;

  const openPreview = () => {
    if (!secret) {
      // Open a small modal-like window with instructions instead of blind-failing
      // but we'll still open the enter URL (which may fail server-side).
      // Prefer that users set `NEXT_PUBLIC_SANITY_PREVIEW_SECRET` in Studio env.
      // eslint-disable-next-line no-console
      console.warn("Preview secret not set. Set NEXT_PUBLIC_SANITY_PREVIEW_SECRET for one-click preview.");
    }
    window.open(enterUrl, "_blank");
  };

  const refreshPublished = async () => {
    // Secure token flow:
    // 1) Fetch short-lived token from the server token endpoint
    // 2) POST token + path to server revalidate endpoint
    try {
      const base = siteUrl.replace(/\/$/, "");
      const tokenRes = await fetch(`${base}/api/studio/revalidate/token`, { method: "GET", credentials: "include" });
      // defensive: ensure JSON before parsing
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
    React.createElement("p", null, React.createElement("strong", null, "Preview")),
    React.createElement(
      "p",
      null,
      "Opens the website in a new tab using the preview enter URL. Make sure your site has the preview API route and the preview secret is configured."
    ),
    React.createElement(
      "button",
      { onClick: openPreview, style: { padding: "8px 12px", cursor: "pointer", marginRight: 8 } },
      "Open Preview"
    ),
    React.createElement(
      "button",
      { onClick: refreshPublished, style: { padding: "8px 12px", cursor: "pointer" } },
      "Refresh Published"
    ),
    !secret &&
      React.createElement(
        "p",
        { style: { marginTop: 8, color: "#666", fontSize: 12 } },
        "Hint: set `NEXT_PUBLIC_SANITY_PREVIEW_SECRET` so the preview entry URL can be used directly from Studio."
      )
  );
};

const previewViews = (S: StructureBuilder, schemaType: string) => [
  S.view.form(),
  S.view.component(PreviewPane).title("Preview") as any,
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


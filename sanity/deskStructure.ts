import { type StructureBuilder } from "sanity/desk";

export const deskStructure = (S: StructureBuilder) =>
  S.list()
    .title("GTek Content")
    .items([
      S.listItem()
        .title("Site Settings")
        .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
      S.listItem().title("Home Page").child(S.document().schemaType("homePage").documentId("homePage")),
      S.listItem().title("About Page").child(S.document().schemaType("aboutPage").documentId("aboutPage")),
      S.divider(),
      S.documentTypeListItem("project").title("Projects"),
      S.documentTypeListItem("service").title("Service Groups"),
      S.documentTypeListItem("author").title("Author / Bio"),
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


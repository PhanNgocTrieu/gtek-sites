import { defineField, defineType } from "sanity";

export const aboutPage = defineType({
  name: "aboutPage",
  title: "About Page",
  type: "document",
  fields: [
    defineField({
      name: "narrative",
      title: "Company narrative (paragraphs)",
      type: "array",
      of: [{ type: "text" }],
      validation: (Rule) => Rule.max(6),
    }),
    defineField({
      name: "teamMembers",
      title: "Team members",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "name", title: "Name", type: "string", validation: (Rule: any) => Rule.required().max(80) },
            { name: "title", title: "Title", type: "string", validation: (Rule: any) => Rule.required().max(80) },
            { name: "credentials", title: "Credentials", type: "string", validation: (Rule: any) => Rule.max(80) },
            { name: "bio", title: "Bio line", type: "text", rows: 3, validation: (Rule: any) => Rule.required().max(300) },
            { name: "photo", title: "Photo", type: "image", options: { hotspot: true } },
          ],
        },
      ],
      validation: (Rule) => Rule.max(12),
    }),
    defineField({
      name: "affiliations",
      title: "Credentials & affiliations",
      type: "array",
      of: [{ type: "string" }],
      validation: (Rule) => Rule.max(12),
    }),
  ],
});


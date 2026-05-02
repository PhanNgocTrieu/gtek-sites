import { defineField, defineType } from "sanity";

export const author = defineType({
  name: "author",
  title: "Author",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: "roleTitle",
      title: "Role title",
      type: "string",
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: "bio",
      title: "Bio",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "headshot",
      title: "Headshot",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "licenses",
      title: "Licenses",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "memberships",
      title: "Memberships",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "awards",
      title: "Awards",
      type: "array",
      of: [{ type: "string" }],
    }),
  ],
});


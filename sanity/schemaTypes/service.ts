import { defineField, defineType } from "sanity";

export const service = defineType({
  name: "service",
  title: "Service Group",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: "items",
      title: "Items",
      type: "array",
      of: [{ type: "string" }],
      validation: (Rule) => Rule.required().min(1).max(50),
    }),
  ],
});


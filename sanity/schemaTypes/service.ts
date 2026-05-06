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
      name: "image",
      title: "Group image",
      type: "image",
      options: { hotspot: true },
      description: "Main image shown at the service group level (outside item list).",
    }),
    defineField({
      name: "items",
      title: "Items",
      type: "array",
      of: [
        {
          type: "object",
          name: "serviceItem",
          title: "Service item",
          fields: [
            { name: "title", title: "Title", type: "string", validation: (Rule: any) => Rule.required().max(140) },
            {
              name: "description",
              title: "Description",
              type: "text",
              rows: 3,
              validation: (Rule: any) => Rule.max(400),
              description: "Optional.",
            },
            {
              name: "image",
              title: "Legacy item image",
              type: "image",
              options: { hotspot: true },
              description: "Old format. Prefer Group image above.",
            },
          ],
          preview: {
            select: { title: "title", subtitle: "description", media: "image" },
          },
        },
      ],
      validation: (Rule) => Rule.required().min(1).max(50),
    }),
  ],
});


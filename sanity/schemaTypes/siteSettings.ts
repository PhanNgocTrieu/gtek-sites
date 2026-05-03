import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "companyName",
      title: "Company name",
      type: "string",
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: "generalEmail",
      title: "General inquiry email",
      type: "string",
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: "contactEmail",
      title: "Contact page email",
      type: "string",
      description: "Email used for contact form submissions (overrides environment fallback).",
      validation: (Rule) => Rule.email().max(160),
    }),
    defineField({
      name: "themeColors",
      title: "Theme colors",
      type: "object",
      fields: [
        { name: "primary", title: "Primary color", type: "string" },
        { name: "secondary", title: "Secondary color", type: "string" },
        { name: "accent", title: "Accent color", type: "string" },
      ],
      options: { collapsible: true, collapsed: false },
    }),
    defineField({
      name: "phone",
      title: "Phone",
      type: "string",
      validation: (Rule) => Rule.max(80),
    }),
    defineField({
      name: "officeHours",
      title: "Office hours",
      type: "string",
      validation: (Rule) => Rule.max(120),
    }),
    defineField({
      name: "addressLines",
      title: "Address lines",
      description: "One line per row. Example: street, city/province postal.",
      type: "array",
      of: [{ type: "string" }],
      validation: (Rule) => Rule.max(6),
    }),
    defineField({
      name: "sectors",
      title: "Sectors served",
      type: "array",
      of: [{ type: "string" }],
      validation: (Rule) => Rule.max(12),
    }),
  ],
});


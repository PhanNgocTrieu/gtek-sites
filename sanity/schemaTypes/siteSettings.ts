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


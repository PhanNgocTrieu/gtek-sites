import { defineField, defineType } from "sanity";

export const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Project Name",
      type: "string",
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: "sector",
      title: "Sector",
      type: "string",
      options: {
        list: [
          "Dam Safety",
          "Mining",
          "Foundations",
          "Slope Stability",
          "Other",
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "client",
      title: "Client",
      description: "Public reference if permitted; otherwise keep it generic (e.g., 'Confidential mining client').",
      type: "string",
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: "location",
      title: "Location",
      description: "City, Province (or region). Example: 'Manitoba, Canada' or 'Winnipeg, MB'.",
      type: "string",
      validation: (Rule) => Rule.max(120),
    }),
    defineField({
      name: "scope",
      title: "Scope summary",
      description: "1–2 sentences describing GTek’s role and the technical scope.",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.required().max(600),
    }),
    defineField({
      name: "attribution",
      title: "Role attribution (optional)",
      description:
        "Use for projects delivered at previous firms. Example: 'Wayne Wong served as Lead Geotechnical Engineer while at [Firm].'",
      type: "string",
      validation: (Rule) => Rule.max(240),
    }),
    defineField({
      name: "mainImage",
      title: "Project image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "legacyCategory",
      title: "Legacy category (deprecated)",
      description: "Older taxonomy kept for reference; new content should use Sector.",
      type: "string",
      options: {
        list: [
          "Resources/Mining",
          "Dam Safety",
          "Infrastructure",
          "Industrial",
          "Commercial",
          "Hydraulic",
          "Water/Wastewater",
          "First Nations",
          "Public/Land",
        ],
      },
    }),
  ],
});


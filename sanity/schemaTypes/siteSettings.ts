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
      name: "sectors",
      title: "Sectors served",
      type: "array",
      of: [{ type: "string" }],
      validation: (Rule) => Rule.max(12),
    }),
    defineField({
      name: "contactResponsibleName",
      title: "Responsible person name",
      type: "string",
      validation: (Rule) => Rule.max(120),
    }),
    defineField({
      name: "contactCertificate",
      title: "Certificate / Credentials",
      description: "Example: M.Eng., P.Eng.",
      type: "string",
      validation: (Rule) => Rule.max(80),
    }),
    defineField({
      name: "contactPosition",
      title: "Position",
      type: "string",
      validation: (Rule) => Rule.max(140),
    }),
    defineField({
      name: "websiteUrl",
      title: "Website URL",
      type: "url",
      validation: (Rule) => Rule.uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "contactLogo",
      title: "Contact logo",
      description: "Logo shown on the Contact Details card.",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "contactQrImage",
      title: "QR image",
      description: "QR code image shown on the Contact Details card.",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "servicesHeroBackground",
      title: "Services hero background",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "projectsHeroBackground",
      title: "Projects hero background",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "projectsDisplayMode",
      title: "Projects display mode",
      type: "string",
      description: "Choose whether project cards show images or text-only layout.",
      options: {
        list: [
          { title: "With images", value: "withImage" },
          { title: "Without images", value: "withoutImage" },
        ],
      },
      initialValue: "withImage",
    }),
    defineField({
      name: "contactHeroBackground",
      title: "Contact hero background",
      type: "image",
      options: { hotspot: true },
    }),
  ],
});


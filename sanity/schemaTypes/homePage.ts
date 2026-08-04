import { defineField, defineType } from "sanity";

export const homePage = defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "services", title: "Services" },
    { name: "why", title: "Why GTek" },
    { name: "closing", title: "Closing CTA" },
    { name: "background", title: "Background" },
  ],
  fields: [
    defineField({
      name: "heroHeadline",
      title: "Hero headline",
      type: "string",
      group: "hero",
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: "heroSubhead",
      title: "Hero subhead",
      type: "text",
      rows: 3,
      group: "hero",
      validation: (Rule) => Rule.required().max(300),
    }),
    defineField({
      name: "heroBackground",
      title: "Hero background image",
      type: "image",
      group: "hero",
      options: { hotspot: true },
    }),
    defineField({
      name: "heroCtaLabel",
      title: "Hero CTA label",
      type: "string",
      group: "hero",
      validation: (Rule) => Rule.required().max(40),
    }),
    defineField({
      name: "servicesIntro",
      title: "Services intro",
      type: "string",
      group: "services",
      validation: (Rule) => Rule.max(180),
    }),
    defineField({
      name: "serviceCards",
      title: "Service cards",
      type: "array",
      group: "services",
      of: [
        {
          type: "object",
          fields: [
            { name: "title", title: "Title", type: "string", validation: (Rule: any) => Rule.required().max(40) },
            { name: "description", title: "Description", type: "string", validation: (Rule: any) => Rule.required().max(200) },
            {
              name: "image",
              title: "Card image",
              type: "image",
              options: { hotspot: true },
            },
            {
              name: "showImage",
              title: "Show image",
              type: "boolean",
              description: "When enabled and an image is uploaded, the image appears on the card. Otherwise the default icon is shown.",
              initialValue: false,
            },
          ],
          preview: {
            select: { title: "title", subtitle: "description", media: "image" },
          },
        },
      ],
      validation: (Rule) => Rule.max(6),
    }),
    defineField({
      name: "whyIntro",
      title: "Why GTek intro",
      type: "string",
      group: "why",
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: "whyItems",
      title: "Why GTek items",
      type: "array",
      group: "why",
      of: [
        {
          type: "object",
          fields: [
            { name: "title", title: "Title", type: "string", validation: (Rule: any) => Rule.required().max(60) },
            { name: "body", title: "Body", type: "string", validation: (Rule: any) => Rule.required().max(240) },
          ],
          preview: {
            select: { title: "title", subtitle: "body" },
          },
        },
      ],
      validation: (Rule) => Rule.max(6),
    }),
    defineField({
      name: "closingHeadline",
      title: "Closing CTA headline",
      type: "string",
      group: "closing",
      validation: (Rule) => Rule.max(120),
    }),
    defineField({
      name: "closingSubhead",
      title: "Closing CTA subhead",
      type: "string",
      group: "closing",
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: "closingCtaLabel",
      title: "Closing CTA label",
      type: "string",
      group: "closing",
      validation: (Rule) => Rule.max(40),
    }),
    defineField({
      name: "pageBackgroundType",
      title: "Page background type",
      type: "string",
      group: "background",
      options: {
        list: [
          { title: "None", value: "none" },
          { title: "Color", value: "color" },
          { title: "Image", value: "image" },
        ],
        layout: "radio",
      },
      initialValue: "none",
    }),
    defineField({
      name: "pageBackgroundColor",
      title: "Page background color",
      type: "string",
      group: "background",
      description: "Hex or CSS color string used when background type is 'color'.",
      hidden: ({ parent }) => parent?.pageBackgroundType !== "color",
    }),
    defineField({
      name: "pageBackgroundImage",
      title: "Page background image",
      type: "image",
      group: "background",
      options: { hotspot: true },
      hidden: ({ parent }) => parent?.pageBackgroundType !== "image",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Home Page" };
    },
  },
});

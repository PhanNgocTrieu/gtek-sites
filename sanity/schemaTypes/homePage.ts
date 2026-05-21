import { defineField, defineType } from "sanity";

export const homePage = defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  fields: [
    defineField({
      name: "heroHeadline",
      title: "Hero headline",
      type: "string",
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: "heroSubhead",
      title: "Hero subhead",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required().max(300),
    }),
    defineField({
      name: "heroBackground",
      title: "Hero background image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "pageBackgroundType",
      title: "Page background type",
      type: "string",
      options: {
        list: [
          { title: "None", value: "none" },
          { title: "Color", value: "color" },
          { title: "Image", value: "image" },
        ],
      },
      initialValue: "none",
    }),
    defineField({
      name: "pageBackgroundColor",
      title: "Page background color",
      type: "string",
      description: "Hex or CSS color string used when background type is 'color'.",
    }),
    defineField({
      name: "pageBackgroundImage",
      title: "Page background image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "heroCtaLabel",
      title: "Hero CTA label",
      type: "string",
      validation: (Rule) => Rule.required().max(40),
    }),
    defineField({
      name: "servicesIntro",
      title: "Services intro",
      type: "string",
      validation: (Rule) => Rule.max(180),
    }),
    defineField({
      name: "serviceCards",
      title: "Service cards",
      type: "array",
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
        },
      ],
      validation: (Rule) => Rule.max(6),
    }),
    defineField({
      name: "whyIntro",
      title: "Why GTek intro",
      type: "string",
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: "whyItems",
      title: "Why GTek items",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "title", title: "Title", type: "string", validation: (Rule: any) => Rule.required().max(60) },
            { name: "body", title: "Body", type: "string", validation: (Rule: any) => Rule.required().max(240) },
          ],
        },
      ],
      validation: (Rule) => Rule.max(6),
    }),
    defineField({
      name: "closingHeadline",
      title: "Closing CTA headline",
      type: "string",
      validation: (Rule) => Rule.max(120),
    }),
    defineField({
      name: "closingSubhead",
      title: "Closing CTA subhead",
      type: "string",
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: "closingCtaLabel",
      title: "Closing CTA label",
      type: "string",
      validation: (Rule) => Rule.max(40),
    }),
  ],
});


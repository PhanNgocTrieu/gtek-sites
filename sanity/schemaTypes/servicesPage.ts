import { defineField, defineType } from "sanity";
import siteConfig from "../../config.js";
import { blankHint, imageHint } from "./hints";

const defaults = siteConfig.services;

export const servicesPage = defineType({
  name: "servicesPage",
  title: "Services Page",
  type: "document",
  groups: [
    { name: "seo", title: "SEO" },
    { name: "hero", title: "Hero", default: true },
  ],
  fields: [
    defineField({
      name: "seoTitle",
      title: "SEO title",
      type: "string",
      group: "seo",
      description: blankHint,
      initialValue: defaults.seo.title,
      validation: (Rule) => Rule.max(70),
    }),
    defineField({
      name: "seoDescription",
      title: "SEO description",
      type: "text",
      rows: 3,
      group: "seo",
      description: blankHint,
      initialValue: defaults.seo.description,
      validation: (Rule) => Rule.max(180),
    }),
    defineField({
      name: "badge",
      title: "Badge",
      type: "string",
      group: "hero",
      description: blankHint,
      initialValue: defaults.badge,
      validation: (Rule) => Rule.max(40),
    }),
    defineField({
      name: "heroTitle",
      title: "Hero title",
      type: "string",
      group: "hero",
      description: blankHint,
      initialValue: defaults.heroTitle,
      validation: (Rule) => Rule.max(120),
    }),
    defineField({
      name: "heroSubhead",
      title: "Hero subhead",
      type: "text",
      rows: 3,
      group: "hero",
      description: blankHint,
      initialValue: defaults.heroSubhead,
      validation: (Rule) => Rule.max(400),
    }),
    defineField({
      name: "heroBackground",
      title: "Hero background image",
      type: "image",
      group: "hero",
      description: imageHint,
      options: { hotspot: true },
    }),
  ],
  preview: {
    prepare() {
      return { title: "Services Page", subtitle: "Hero, SEO, and page text" };
    },
  },
});

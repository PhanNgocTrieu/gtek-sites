import { defineField, defineType } from "sanity";
import siteConfig from "../../config.js";
import { blankHint, imageHint } from "./hints";

const defaults = siteConfig.projects;

export const projectsPage = defineType({
  name: "projectsPage",
  title: "Projects Page",
  type: "document",
  groups: [
    { name: "seo", title: "SEO" },
    { name: "hero", title: "Hero", default: true },
    { name: "layout", title: "Layout" },
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
    defineField({
      name: "displayMode",
      title: "Card layout",
      type: "string",
      group: "layout",
      description: "Choose whether project cards show images or a text-only layout.",
      options: {
        list: [
          { title: "With images", value: "withImage" },
          { title: "Without images", value: "withoutImage" },
        ],
        layout: "radio",
      },
      initialValue: siteConfig.settings.projectsDisplayMode,
    }),
    defineField({
      name: "filterCategories",
      title: "Filter categories",
      type: "array",
      of: [{ type: "string" }],
      group: "layout",
      description: "Buttons shown above the project cards. Include “All” first to show every project.",
      initialValue: defaults.filterCategories,
      validation: (Rule) => Rule.max(12),
    }),
  ],
  preview: {
    prepare() {
      return { title: "Projects Page", subtitle: "Hero, layout, and SEO" };
    },
  },
});

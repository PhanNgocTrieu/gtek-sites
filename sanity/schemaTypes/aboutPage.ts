import { defineField, defineType } from "sanity";

export const aboutPage = defineType({
  name: "aboutPage",
  title: "About Page",
  type: "document",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "narrative", title: "Company story" },
    { name: "team", title: "Team" },
    { name: "affiliations", title: "Affiliations" },
  ],
  preview: {
    select: {
      narrativeItems: "narrativeItems",
      teamMembers: "teamMembers",
    },
    prepare({ narrativeItems, teamMembers }) {
      const sections = Array.isArray(narrativeItems) ? narrativeItems.filter(Boolean).length : 0;
      const members = Array.isArray(teamMembers) ? teamMembers.filter(Boolean).length : 0;
      return {
        title: "About Page",
        subtitle: `${sections} story section(s) • ${members} team member(s)`,
      };
    },
  },
  fields: [
    defineField({
      name: "heroBackgroundImage",
      title: "Hero background image",
      description: "Background image behind the About intro section.",
      type: "image",
      group: "hero",
      options: { hotspot: true },
    }),
    defineField({
      name: "narrativeItems",
      title: "Company narrative sections",
      type: "array",
      group: "narrative",
      of: [
        {
          type: "object",
          fields: [
            { name: "title", title: "Title", type: "string", validation: (Rule: any) => Rule.required().max(80) },
            { name: "subtitle", title: "Subtitle", type: "text", rows: 4, validation: (Rule: any) => Rule.required().max(600) },
          ],
          preview: {
            select: { title: "title", subtitle: "subtitle" },
          },
        },
      ],
      validation: (Rule) => Rule.max(12),
      description: "Blocks like 'Who we are' with a subtitle. Add as many sections as needed.",
    }),
    defineField({
      name: "narrative",
      title: "Legacy narrative (deprecated)",
      type: "array",
      of: [{ type: "text" }],
      group: "narrative",
      validation: (Rule) => Rule.max(6),
      description: "Old format — only visible if legacy data exists. Use Company narrative sections instead.",
      hidden: ({ document }) => {
        const legacy = document?.narrative;
        return !Array.isArray(legacy) || legacy.length === 0;
      },
    }),
    defineField({
      name: "teamMembers",
      title: "Team members",
      type: "array",
      group: "team",
      of: [
        {
          type: "object",
          fields: [
            { name: "name", title: "Name", type: "string", validation: (Rule: any) => Rule.required().max(80) },
            { name: "title", title: "Title", type: "string", validation: (Rule: any) => Rule.required().max(80) },
            { name: "credentials", title: "Credentials", type: "string", validation: (Rule: any) => Rule.max(80) },
            {
              name: "photo",
              title: "Photo",
              type: "image",
              options: { hotspot: true },
            },
            {
              name: "showPhoto",
              title: "Show photo",
              type: "boolean",
              description: "When enabled and a photo is uploaded, the photo appears on the team card.",
              initialValue: false,
            },
            {
              name: "bio",
              title: "Bio line",
              type: "text",
              rows: 6,
              validation: (Rule: any) => Rule.required().max(1200),
              description: "Supports long text. Keep it concise but can be up to 1200 characters.",
            },
          ],
          preview: {
            select: { title: "name", subtitle: "title", media: "photo" },
          },
        },
      ],
      validation: (Rule) => Rule.max(12),
    }),
    defineField({
      name: "affiliations",
      title: "Credentials & affiliations",
      type: "array",
      of: [{ type: "string" }],
      group: "affiliations",
      validation: (Rule) => Rule.max(12),
    }),
  ],
});

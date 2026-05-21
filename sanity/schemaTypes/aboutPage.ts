import { defineField, defineType } from "sanity";

export const aboutPage = defineType({
  name: "aboutPage",
  title: "About Page",
  type: "document",
  preview: {
    select: {
      narrativeItems: "narrativeItems",
      narrative: "narrative",
      teamMembers: "teamMembers",
    },
    prepare({ narrativeItems, narrative, teamMembers }) {
      const sections = Array.isArray(narrativeItems) ? narrativeItems.filter(Boolean).length : 0;
      const paragraphs = Array.isArray(narrative) ? narrative.filter(Boolean).length : 0;
      const members = Array.isArray(teamMembers) ? teamMembers.filter(Boolean).length : 0;
      return {
        title: "About Page",
        subtitle: `${sections || paragraphs} narrative section(s) • ${members} team member(s)`,
      };
    },
  },
  fields: [
    defineField({
      name: "heroBackgroundImage",
      title: "Hero background image",
      description: "Background image behind the About intro section.",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "narrativeItems",
      title: "Company narrative sections",
      type: "array",
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
      description: "Use this for blocks like 'Who we are' + subtitle. You can add as many sections as needed.",
    }),
    defineField({
      name: "narrative",
      title: "Legacy narrative (paragraphs)",
      type: "array",
      of: [{ type: "text" }],
      validation: (Rule) => Rule.max(6),
      description: "Old format. Keep empty if you use 'Company narrative sections' above.",
    }),
    defineField({
      name: "teamMembers",
      title: "Team members",
      type: "array",
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
        },
      ],
      validation: (Rule) => Rule.max(12),
    }),
    defineField({
      name: "affiliations",
      title: "Credentials & affiliations",
      type: "array",
      of: [{ type: "string" }],
      validation: (Rule) => Rule.max(12),
    }),
  ],
});


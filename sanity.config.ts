import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemaTypes";
import { deskStructure } from "./sanity/deskStructure";
import { gtekStudioTheme } from "./sanity/theme";
import StudioLogo from "./sanity/components/StudioLogo";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION?.trim() || "2024-01-01";

export default defineConfig({
  name: "default",
  title: "GTek Studio",
  basePath: "/studio",
  projectId: projectId ?? "missing-project-id",
  dataset: dataset ?? "missing-dataset",
  apiVersion,
  theme: gtekStudioTheme,
  studio: {
    components: {
      logo: StudioLogo,
    },
  },
  plugins: [deskTool({ structure: deskStructure }), visionTool()],
  schema: { types: schemaTypes },
});

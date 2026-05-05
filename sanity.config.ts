import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemaTypes";
import { deskStructure } from "./sanity/deskStructure";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2024-01-01";

export default defineConfig({
  name: "default",
  title: "GTek Website Studio",
  projectId: projectId ?? "missing-project-id",
  dataset: dataset ?? "missing-dataset",
  apiVersion,
  plugins: [deskTool({ structure: deskStructure }), visionTool()],
  schema: { types: schemaTypes },
});


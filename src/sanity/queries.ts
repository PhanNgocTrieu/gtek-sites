import { groq } from "next-sanity";

export const siteSettingsQuery = groq`*[_type == "siteSettings" && _id == "siteSettings"][0]{
  companyName,
  generalEmail,
  phone,
  officeHours,
  addressLines,
  sectors
}`;

export const homePageQuery = groq`*[_type == "homePage" && _id == "homePage"][0]{
  heroHeadline,
  heroSubhead,
  "heroBackground": heroBackground.asset->url,
  heroCtaLabel,
  servicesIntro,
  serviceCards[]{title, description},
  whyIntro,
  whyItems[]{title, body},
  closingHeadline,
  closingSubhead,
  closingCtaLabel
}`;

export const aboutPageQuery = groq`*[_type == "aboutPage" && _id == "aboutPage"][0]{
  narrative[],
  teamMembers[]{
    name,
    title,
    credentials,
    bio,
    "photo": photo.asset->url
  },
  affiliations[]
}`;

export const projectsQuery = groq`*[_type == "project"]|order(category asc, title asc){
  title,
  sector,
  client,
  location,
  scope,
  attribution,
  "image": mainImage.asset->url,
  legacyCategory
}`;

export const serviceGroupsQuery = groq`*[_type == "service"]|order(title asc){
  title,
  items
}`;


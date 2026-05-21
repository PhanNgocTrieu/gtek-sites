import { groq } from "next-sanity";

export const siteSettingsQuery = groq`*[_type == "siteSettings" && _id == "siteSettings"][0]{
  companyName,
  generalEmail,
  contactEmail,
  phone,
  sectors,
  contactResponsibleName,
  contactCertificate,
  contactPosition,
  websiteUrl,
  "contactLogo": contactLogo.asset->url,
  "contactQrImage": contactQrImage.asset->url,
  "servicesHeroBackground": servicesHeroBackground.asset->url,
  "projectsHeroBackground": projectsHeroBackground.asset->url,
  "contactHeroBackground": contactHeroBackground.asset->url,
  projectsDisplayMode
}`;

export const homePageQuery = groq`*[_type == "homePage" && _id == "homePage"][0]{
  heroHeadline,
  heroSubhead,
  "heroBackground": heroBackground.asset->url,
  heroCtaLabel,
  servicesIntro,
  serviceCards[]{
    title,
    description,
    showImage,
    "image": image.asset->url
  },
  whyIntro,
  whyItems[]{_key, title, body},
  closingHeadline,
  closingSubhead,
  closingCtaLabel
  ,
  pageBackgroundType,
  pageBackgroundColor,
  "pageBackgroundImage": pageBackgroundImage.asset->url
}`;

export const aboutPageQuery = groq`*[_type == "aboutPage" && _id == "aboutPage"][0]{
  "heroBackgroundImage": heroBackgroundImage.asset->url,
  narrativeItems[]{
    title,
    subtitle
  },
  narrative[],
  teamMembers[]{
    name,
    title,
    credentials,
    bio,
    showPhoto,
    "photo": photo.asset->url
  },
  affiliations[]
}`;

export const projectsQuery = groq`*[_type == "project"]|order(sector asc, title asc){
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
  "image": image.asset->url,
  items[]{
    title,
    description,
    "image": image.asset->url
  }
}`;


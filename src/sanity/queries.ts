import { groq } from "next-sanity";

export const siteSettingsQuery = groq`*[_type == "siteSettings" && _id == "siteSettings"][0]{
  companyName,
  tagline,
  generalEmail,
  contactEmail,
  phone,
  websiteUrl,
  addressLines,
  officeHours,
  sectors,
  themeColors,
  contactResponsibleName,
  contactCertificate,
  contactPosition,
  "contactLogo": contactLogo.asset->url,
  "contactQrImage": contactQrImage.asset->url,
  "servicesHeroBackground": servicesHeroBackground.asset->url,
  "projectsHeroBackground": projectsHeroBackground.asset->url,
  "contactHeroBackground": contactHeroBackground.asset->url,
  projectsDisplayMode,
  footerTagline,
  "footerLogo": footerLogo.asset->url,
  footerEmail,
  footerLicenses,
  footerCopyright
}`;

export const homePageQuery = groq`*[_type == "homePage" && _id == "homePage"][0]{
  seoTitle,
  seoDescription,
  heroHeadline,
  heroSubhead,
  "heroBackground": heroBackground.asset->url,
  heroCtaLabel,
  heroCtaHref,
  heroSecondaryCtaLabel,
  heroSecondaryCtaHref,
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
  closingCtaLabel,
  closingCtaHref,
  pageBackgroundType,
  pageBackgroundColor,
  "pageBackgroundImage": pageBackgroundImage.asset->url
}`;

export const aboutPageQuery = groq`*[_type == "aboutPage" && _id == "aboutPage"][0]{
  seoTitle,
  seoDescription,
  heroTitle,
  "heroBackgroundImage": heroBackgroundImage.asset->url,
  narrativeItems[]{
    title,
    subtitle
  },
  narrative[],
  teamIntro,
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

export const servicesPageQuery = groq`*[_type == "servicesPage" && _id == "servicesPage"][0]{
  seoTitle,
  seoDescription,
  badge,
  heroTitle,
  heroSubhead,
  "heroBackground": heroBackground.asset->url
}`;

export const projectsPageQuery = groq`*[_type == "projectsPage" && _id == "projectsPage"][0]{
  seoTitle,
  seoDescription,
  heroTitle,
  heroSubhead,
  "heroBackground": heroBackground.asset->url,
  displayMode,
  filterCategories
}`;

export const contactPageQuery = groq`*[_type == "contactPage" && _id == "contactPage"][0]{
  seoTitle,
  seoDescription,
  badge,
  heroTitle,
  heroSubhead,
  "heroBackground": heroBackground.asset->url,
  formTitle,
  formIntro,
  formSubjects,
  formFields,
  submitLabel,
  successMessage,
  detailsTitle,
  companyName,
  tagline,
  contactResponsibleName,
  contactCertificate,
  contactPosition,
  phone,
  displayEmail,
  websiteUrl,
  addressLines,
  officeHours,
  "contactLogo": contactLogo.asset->url,
  "contactQrImage": contactQrImage.asset->url,
  mapTitle,
  mapIntro,
  mapEmbedUrl
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

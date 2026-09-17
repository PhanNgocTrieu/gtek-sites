const config = {
  settings: {
    companyName: "GTek Engineering Inc.",
    tagline: "Engineered Ground Solutions",
    generalEmail: "wayne.wong@gtekeng.com",
    phone: "+1 (204) 792-8829",
    websiteUrl: "https://www.gtekeng.com",
    addressLines: ["Winnipeg, Manitoba, Canada"],
    officeHours: "Monday – Friday, 8:00 AM – 5:00 PM CT",
    sectors: [
      "Mining",
      "Hydroelectric & Dams",
      "Transportation",
      "Buildings & Foundations",
      "Industrial",
    ],
    themeColors: {
      primary: "#005EA4",
      secondary: "#0F4761",
      accent: "#295818",
    },
    nav: [
      { href: "/", label: "Home" },
      { href: "/about", label: "About" },
      { href: "/services", label: "Services" },
      { href: "/projects", label: "Projects" },
      { href: "/contact", label: "Contact" },
    ],
    seo: {
      siteName: "GTek Engineering Inc.",
      titleTemplate: "%s | GTek Engineering",
      defaultTitle: "GTek Engineering Inc.",
      description:
        "GTek Engineering Inc. provides geotechnical consulting, dam safety support, and materials testing services in Winnipeg, Manitoba.",
      canonical: "https://gtekengineering.ca",
    },
    contact: {
      contactEmail: "wayne.wong@gtekeng.com",
      contactResponsibleName: "Wayne (WK) Wong",
      contactCertificate: "M.Eng., P.Eng.",
      contactPosition: "Principal Geotechnical Engineer, President",
      contactLogo: "/images/gtek-logo.png",
      contactQrImage: "/images/contact/qr.jpg",
      contactHeroBackground: "",
    },
    footer: {
      footerTagline:
        "Senior-led geotechnical consulting for dam safety, mining, foundations, and slope stability projects across Canada.",
      footerLogo: "/images/gtek-logo.png",
      footerEmail: "wayne.wong@gtekeng.com",
      footerLicenses: [
        "M.Eng., P.Eng.",
        "Licensed in MB, SK, BC",
        "Canadian Geotechnical Society",
        "Canadian Dam Association",
      ],
      footerCopyright: "",
    },
    backgrounds: {
      servicesHeroBackground: "",
      projectsHeroBackground: "",
    },
    projectsDisplayMode: "withImage",
  },

  homepage: {
    seo: {
      title: "Geotechnical Engineering",
      description:
        "Geotechnical engineering grounded in experience. Winnipeg-based consultancy serving dam safety, mining, foundations, and slope stability across Canada.",
    },
    heroHeadline: "Geotechnical engineering grounded in experience.",
    heroSubhead:
      "GTek Engineering is a Winnipeg-based geotechnical consultancy serving the dam safety, mining, foundation, and slope stability sectors across Canada.",
    heroBackground: "/images/home-hero.jpg",
    heroCtaLabel: "Talk to our team",
    heroCtaHref: "/contact",
    heroSecondaryCtaLabel: "View services",
    heroSecondaryCtaHref: "/services",
    servicesIntro:
      "Clear scope, senior-led delivery, and practical recommendations you can build with.",
    serviceCards: [
      {
        title: "Dam Safety",
        description:
          "Inspection, instrumentation, and risk assessment for new and existing dams in accordance with CDA guidelines.",
        image: "",
        showImage: false,
      },
      {
        title: "Mining",
        description:
          "Geotechnical support for tailings facilities, open-pit slope design, and mine waste management.",
        image: "",
        showImage: false,
      },
      {
        title: "Foundations",
        description:
          "Site investigation, foundation design, and construction-phase geotechnical engineering for buildings and infrastructure.",
        image: "",
        showImage: false,
      },
      {
        title: "Slope Stability",
        description:
          "Stability analysis, remediation design, and monitoring for natural and engineered slopes.",
        image: "",
        showImage: false,
      },
    ],
    whyIntro: "",
    whyItems: [
      {
        title: "Senior-led delivery.",
        body: "Every project is led by a Principal Engineer with 25+ years of experience. There is no handoff to junior staff after the proposal stage.",
      },
      {
        title: "Direct access, fast response.",
        body: "As a small firm, GTek operates without the layers that slow larger consultancies. Clients deal with decision-makers from day one.",
      },
      {
        title: "Specialized technical depth.",
        body: "Our team brings combined expertise in dam engineering, mining geotechnics, and academic research, focused on the projects we choose to take on.",
      },
    ],
    closingHeadline: "Have a project? Let’s talk.",
    closingSubhead:
      "GTek welcomes inquiries on geotechnical projects of any scale across Canada.",
    closingCtaLabel: "Contact GTek",
    closingCtaHref: "/contact",
    pageBackgroundType: "none",
    pageBackgroundColor: null,
    pageBackgroundImage: null,
  },

  about: {
    seo: {
      title: "About",
      description:
        "Meet the team behind GTek Engineering Inc. A Winnipeg-based geotechnical consulting firm focused on dam safety, mining, foundations, and slope stability across Canada.",
    },
    heroTitle: "About GTek",
    heroBackgroundImage: "/images/about-hero.jpg",
    teamIntro:
      "Clients hire people, not logos. Meet the team leading GTek’s technical delivery.",
    narrativeItems: [
      {
        title: "Who we are",
        subtitle:
          "GTek Engineering Inc. is a geotechnical consulting firm founded in Winnipeg, Manitoba. We provide engineering services across dam safety, mining, foundations, and slope stability, drawing on more than 25 years of combined senior experience.",
      },
      {
        title: "How we work",
        subtitle:
          "We are deliberately small. Every project is led by a Principal and supported by a focused technical team. This structure lets us respond quickly, control quality at every stage, and build long-term working relationships with our clients.",
      },
      {
        title: "Where we work",
        subtitle:
          "GTek serves clients across Canada from our Winnipeg office, with active projects in Manitoba and surrounding provinces. We undertake assignments at any stage — from desktop study through construction monitoring and long-term performance review.",
      },
    ],
    teamMembers: [
      {
        name: "Wayne Wong, P.Eng.",
        title: "Principal Engineer",
        credentials: "P.Eng.",
        bio: "25+ years of geotechnical experience across dam safety, mining, and foundation engineering. Wayne leads GTek’s technical delivery and serves as Engineer of Record on all major projects.",
        photo: "",
        showPhoto: false,
      },
      {
        name: "Gamini MediWake",
        title: "Senior Engineer",
        credentials: "",
        bio: "Senior engineer supporting geotechnical design and construction-phase delivery across multiple sectors. Bio to be refined with Gamini’s input: years of experience, technical specialization, and sectors served.",
        photo: "",
        showPhoto: false,
      },
      {
        name: "Dr. Marolo Alfaro",
        title: "Senior Technical Advisor",
        credentials: "Ph.D.",
        bio: "Provides academic and research depth for technical reviews, analysis, and independent verification. Bio to be refined with Dr. Alfaro’s input: academic credentials, research focus, and contribution to GTek’s technical reviews.",
        photo: "",
        showPhoto: false,
      },
      {
        name: "Kevin Nguyen, EIT",
        title: "Geotechnical Engineer-in-Training",
        credentials: "EIT",
        bio: "Supports field programs, data interpretation, and reporting with a focus on practical site outcomes. Bio to be refined with Kevin’s input: educational background, current responsibilities, and areas of developing expertise.",
        photo: "",
        showPhoto: false,
      },
    ],
    affiliations: [
      "Engineers Geoscientists Manitoba",
      "Canadian Dam Association",
      "Canadian Geotechnical Society",
    ],
  },

  services: {
    seo: {
      title: "Services",
      description:
        "Geotechnical engineering, dam safety & instrumentation support, construction support, and materials testing services in Winnipeg, Manitoba.",
    },
    badge: "Services",
    heroTitle: "Practical, field-ready services",
    heroSubhead:
      "GTek supports owners, engineers, and contractors with geotechnical consulting, dam safety support, project administration, and materials testing.",
    groups: [
      {
        title: "Geotechnical Engineering",
        image: "",
        items: [
          { title: "Geotechnical investigations & reporting", description: "" },
          { title: "Subsurface exploration planning", description: "" },
          { title: "Soil and rock characterization", description: "" },
          { title: "Foundation recommendations (shallow & deep)", description: "" },
          { title: "Excavation support and shoring guidance", description: "" },
          { title: "Slope stability assessments", description: "" },
          { title: "Embankment and earthworks design support", description: "" },
          { title: "Pavement subgrade evaluation", description: "" },
          { title: "Ground improvement recommendations", description: "" },
          { title: "Seismic site considerations (where applicable)", description: "" },
          { title: "Construction-phase geotechnical review", description: "" },
          { title: "Peer review / third-party review support", description: "" },
        ],
      },
      {
        title: "Dam Safety, Instrumentation & Management",
        image: "",
        items: [
          { title: "Dam safety reviews and assessments", description: "" },
          { title: "Instrumentation selection and layout", description: "" },
          { title: "Piezometer and monitoring program support", description: "" },
          { title: "Data interpretation and performance trending", description: "" },
          { title: "Risk-informed recommendations and reporting", description: "" },
          { title: "Emergency preparedness support (EPP inputs)", description: "" },
          { title: "Operations, maintenance, and surveillance inputs", description: "" },
          { title: "Inspection support and field oversight", description: "" },
          { title: "Regulatory documentation support", description: "" },
        ],
      },
      {
        title: "Project Administration & Construction Support",
        image: "",
        items: [
          { title: "Field coordination and schedule alignment", description: "" },
          { title: "Contractor / stakeholder coordination", description: "" },
          { title: "RFI and technical clarification support", description: "" },
          { title: "Construction documentation and reporting", description: "" },
        ],
      },
      {
        title: "Material Testing",
        image: "",
        items: [
          { title: "Compaction testing and verification", description: "" },
          { title: "Concrete testing (as required)", description: "" },
          { title: "Aggregate sampling and testing support", description: "" },
          { title: "QA/QC documentation for compliance", description: "" },
        ],
      },
    ],
  },

  projects: {
    seo: {
      title: "Projects",
      description:
        "Explore GTek Engineering’s project experience across mining, dam safety, infrastructure, industrial, commercial, hydraulic, and public projects.",
    },
    heroTitle: "Project Experience",
    heroSubhead:
      "Representative examples that demonstrate capability through personnel experience—presented with clear role attribution where projects were delivered at previous firms.",
    filterCategories: [
      "All",
      "Dam Safety",
      "Mining",
      "Foundations",
      "Slope Stability",
      "Other",
    ],
    items: [
      {
        title: "Dam Safety Review (Representative)",
        sector: "Dam Safety",
        client: "Confidential hydroelectric utility",
        location: "Manitoba, Canada",
        scope:
          "GTek personnel led a dam safety review for an existing earthfill embankment, including review of instrumentation data, stability re-analysis under updated loading conditions, and preparation of recommendations for ongoing monitoring.",
        attribution:
          "Wayne Wong served as Lead Geotechnical Engineer while at a previous firm. Shown here to illustrate GTek’s capability; client naming subject to permission.",
        image: "",
      },
      {
        title: "Tailings Facility Instrumentation & Performance Review",
        sector: "Mining",
        client: "Confidential mining client",
        location: "Canada",
        scope:
          "Support for monitoring program interpretation, trend review, and practical recommendations aligned with operational constraints.",
        attribution: "",
        image: "",
      },
      {
        title: "Foundation Recommendations for Building / Infrastructure",
        sector: "Foundations",
        client: "Commercial owner",
        location: "Winnipeg, MB",
        scope:
          "Site investigation inputs and foundation options focusing on constructability, risk communication, and clear recommendations for design and construction.",
        attribution: "",
        image: "",
      },
      {
        title: "Slope Stability Assessment & Mitigation Concept",
        sector: "Slope Stability",
        client: "Infrastructure owner",
        location: "Canada",
        scope:
          "Stability screening and remediation concept development with monitoring considerations for natural and engineered slopes.",
        attribution: "",
        image: "",
      },
    ],
  },

  contact: {
    seo: {
      title: "Contact",
      description:
        "Contact GTek Engineering Inc. in Winnipeg, Manitoba for geotechnical consulting, dam safety support, and materials testing. Send an inquiry via our contact form.",
    },
    badge: "Contact",
    heroTitle: "Let’s talk about your project",
    heroSubhead:
      "Contact details, map, and a simple form—everything you need on one page.",
    formTitle: "Contact form",
    formIntro: "A short form to help us triage your inquiry.",
    formSubjects: ["General Inquiry", "Project Inquiry", "Career", "Other"],
    formFields: {
      name: { label: "Name", required: true, placeholder: "Your name" },
      company: { label: "Company", required: false, placeholder: "Company (optional)" },
      email: { label: "Email", required: true, placeholder: "you@company.com" },
      subject: { label: "Subject", required: true, placeholder: "Select a subject…" },
      message: {
        label: "Message",
        required: true,
        placeholder: "Tell us about your project, timeline, and any site constraints.",
      },
    },
    submitLabel: "Send Message",
    successMessage: "Message sent. We’ll get back to you shortly.",
    detailsTitle: "Contact details",
    mapTitle: "Map",
    mapIntro: "Google Maps embed showing the Winnipeg office location.",
    mapEmbedUrl: "https://www.google.com/maps?q=Winnipeg%2C%20MB&output=embed",
  },
};

export default config;

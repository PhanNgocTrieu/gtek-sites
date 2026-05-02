# SKILL - Prompts for Implementation Agents

Dựa trên bản phân tích hệ thống, dưới đây là tập hợp các prompts kỹ thuật chi tiết để hướng dẫn AI/Developer Agent thực hiện triển khai theo từng giai đoạn. Các prompts này được thiết kế dựa trên requirements trong `entrance.md`.

## Phase 1: Structure & Setup

**Prompt 1.1: Khởi tạo dự án Next.js & Tailwind**
```text
Act as an expert Next.js developer. Initialize a new Next.js application in the current directory with the App Router, TypeScript, and Tailwind CSS. Do not include ESLint if it asks, just use default options. After initialization, update `tailwind.config.ts` to include GTek's custom color palette: 'gtek-navy' (#0A192F) and 'gtek-amber' (#FFC107).
```

**Prompt 1.2: Xây dựng Layout & Navigation**
```text
In the Next.js project, modify the global layout (`app/layout.tsx`). Create a sticky, responsive Navigation Bar component (Header) that includes links to: Home, About, Services, Projects, and Contact. Create a Footer component that includes placeholders for contact info, office location (Winnipeg), and engineering licenses. Use the 'gtek-navy' background for the header and footer, with white and 'gtek-amber' text for accents.
```

**Prompt 1.3: Dựng trang chủ (Home Hero Section)**
```text
Update the Home page (`app/page.tsx`). Create a Hero section with a dark overlay over a background image placeholder. Include the main tagline: "Your Partner in Ground Truth and Solutions". Add a primary Call to Action (CTA) button saying "Get in Touch" styled with the 'gtek-amber' background color, linking to the Contact page. Ensure it's fully responsive.
```

## Phase 2: Content UI Development

**Prompt 2.1: Trang About Us**
```text
Create the About page (`app/about/page.tsx`). Build a layout with two main columns on desktop (stacking on mobile). One column for a professional headshot placeholder of Wayne Wong. The other column for his bio, credentials (M.Eng., P.Eng., licensed in MB/SK/BC), the 2018 ACEC award, and memberships in the Canadian Geotechnical Society and Canadian Dam Association. Use typography that conveys trust and expertise.
```

**Prompt 2.2: Trang Services (Accordion)**
```text
Create the Services page (`app/services/page.tsx`). Implement four collapsible accordion components for the following sections:
1. Geotechnical Engineering (12 items)
2. Dam Safety, Instrumentation & Management (9 items)
3. Project Administration & Construction Support (4 items)
4. Material Testing (4 items)
Use standard React state or Tailwind/HTML5 `<details>` tags for the accordion functionality. Ensure smooth transitions when expanding/collapsing.
```

**Prompt 2.3: Trang Projects (Filterable Grid)**
```text
Create the Projects page (`app/projects/page.tsx`). Build a grid layout of Project Cards. Above the grid, implement a filter mechanism (a row of clickable buttons or a dropdown on mobile) containing these categories: All, Resources/Mining, Dam Safety, Infrastructure, Industrial, Commercial, Hydraulic, Water/Wastewater, First Nations, Public/Land. Create mock data for at least 6 projects and ensure the filtering logic works correctly on the client side.
```

**Prompt 2.4: Trang Contact**
```text
Create the Contact page (`app/contact/page.tsx`). Build a contact form with fields for: Name, Company, Email, Message, and a checkbox/dropdown indicating their service interest. Beside the form, display text for the Winnipeg location and embed a placeholder for a Google Maps iframe. Ensure the form has basic HTML5 validation and is styled cleanly.
```

## Phase 3: Sanity CMS Integration

**Prompt 3.1: Setup Sanity & Schemas**
```text
Integrate Sanity CMS into this Next.js project. Set up the Sanity Studio inside the Next.js app (e.g., at `/studio`). Create Sanity document schemas for:
- 'project' (fields: title, category, description, mainImage)
- 'service' (fields: title, list of items)
- 'author' for Wayne's bio.
Make sure the studio is configured correctly using `next-sanity`.
```

**Prompt 3.2: Fetching Data from CMS**
```text
Update the Projects page and Services page to fetch data directly from Sanity using GROQ queries instead of using the hardcoded mock data. Ensure that the fetching leverages Next.js caching or ISR so the site remains fast but updates when data changes in Sanity.
```

## Phase 4: Polish & SEO

**Prompt 4.1: Cấu hình SEO (Metadata)**
```text
Update the `layout.tsx` and all page files to include Next.js Metadata. Add optimized page titles and meta descriptions for SEO. Focus the keywords on "geotechnical consulting", "materials testing", and "Winnipeg/Manitoba". Ensure Open Graph tags are set up for social sharing.
```

**Prompt 4.2: Tích hợp Email & Form Action**
```text
Implement a Server Action or API Route in Next.js to handle the Contact form submission. Use a service like Resend or Nodemailer to send the submitted form data to an email address. Add loading states and success/error toast notifications to the form UI to improve user experience.
```

# Phân Tích & Kế Hoạch Triển Khai Hệ Thống GTek Engineering

Dựa trên tài liệu yêu cầu `entrance.md`, dưới đây là bản phân tích, thiết kế hệ thống và kế hoạch triển khai chi tiết cho website GTek Engineering Inc.

## 1. Phân Tích & Đánh Giá Công Nghệ

### 1.1. Frontend Framework: Next.js vs Vite (React) vs Nuxt.js
- **Next.js (Được chọn):** Hỗ trợ Server-Side Rendering (SSR) và Static Site Generation (SSG), giúp tối ưu hóa SEO - yếu tố cốt lõi cho các trang web doanh nghiệp. Tích hợp sẵn routing mạnh mẽ (App Router).
- **Vite (React):** Tốc độ build cực nhanh, phù hợp cho Client-Side Rendering (CSR). Tuy nhiên, SEO mặc định kém hơn do nội dung chỉ được render sau khi tải JavaScript, không phù hợp cho trang landing/corporate.
- **Nuxt.js (Vue):** Cung cấp các tính năng tương tự Next.js nhưng dành cho hệ sinh thái Vue. Ít phổ biến hơn React trong cộng đồng nhân sự.
- **=> Kết luận:** Lựa chọn **Next.js** là quyết định hoàn toàn chính xác để đảm bảo hiệu suất (Performance) và khả năng tìm kiếm (SEO) tốt nhất cho GTek.

### 1.2. Styling: Tailwind CSS vs Vanilla CSS vs CSS-in-JS (Styled Components)
- **Tailwind CSS (Được chọn):** Framework Utility-first, giúp viết CSS trực tiếp vào HTML (className). Giảm thiểu kích thước file CSS, dễ dàng duy trì tính nhất quán của Design System (màu navy/slate và amber/gold).
- **Vanilla CSS:** Toàn quyền kiểm soát, không cần học cú pháp mới. Tuy nhiên, dễ dẫn đến mã CSS phình to, khó bảo trì khi dự án lớn hoặc có nhiều người tham gia.
- **CSS-in-JS:** Phù hợp cho component logic phức tạp, nhưng làm tăng thời gian xử lý runtime và khó kết hợp tối ưu với Server Components của Next.js (App Router).
- **=> Kết luận:** **Tailwind CSS** là lựa chọn tối ưu để tăng tốc độ phát triển giao diện và giữ cho mã nguồn dễ bảo trì, đặc biệt khi kết hợp với Next.js.

### 1.3. Hệ quản trị nội dung (CMS): Sanity CMS vs WordPress vs Strapi
- **Sanity CMS (Được chọn):** Headless CMS cung cấp "Sanity Studio" thời gian thực. Cấu trúc dữ liệu hoàn toàn do developer định nghĩa, nội dung trả về dưới dạng JSON sạch. Không yêu cầu quản lý server.
- **WordPress:** Monolithic CMS phổ biến nhất. Phải dùng REST API/GraphQL nếu muốn dùng như Headless CMS. Nặng nề, nhiều plugin không cần thiết, rủi ro bảo mật cao hơn nếu không cập nhật thường xuyên.
- **Strapi:** Headless CMS mã nguồn mở mạnh mẽ, nhưng cần phải tự thuê server (VPS) hoặc trả phí dịch vụ cloud để host backend và database, tăng chi phí và công sức bảo trì.
- **=> Kết luận:** **Sanity CMS** đáp ứng hoàn hảo yêu cầu "không cần code để chỉnh sửa" cho khách hàng, đồng thời kiến trúc Serverless giúp tiết kiệm chi phí và công sức vận hành.

### 1.4. Hosting & Deployment: Vercel vs Netlify
- **Vercel (Được chọn):** Công ty mẹ của Next.js, cấu hình zero-config cho Next.js app. Tự động CDN hóa nội dung, tối ưu hình ảnh và triển khai Edge Functions cực kỳ nhanh chóng.
- **Netlify:** Đối thủ trực tiếp, cũng rất mạnh về Jamstack. Nhưng với dự án Next.js, Vercel luôn có sự tương thích tính năng mới nhất (như App Router) một cách hoàn hảo nhất.
- **=> Kết luận:** Sử dụng **Vercel** làm nơi lưu trữ giúp tối ưu hóa chi phí (miễn phí) và quy trình CI/CD (tự động deploy khi push code).

---

## 2. Thiết Kế Hệ Thống Kiến Trúc (System Architecture)

### 2.1. Sơ đồ hệ thống

```mermaid
graph TD
    subgraph Client [Phía Người Dùng & Khách Hàng]
        Browser[Trình duyệt Web - Mobile/Desktop]
    end

    subgraph CDN & Hosting [Hạ tầng Phân Phối Vercel]
        VercelEdge[Vercel Edge Network / CDN]
        NextJS[Next.js Application SSR/SSG]
    end

    subgraph Content Management [Hệ Quản Trị Nội Dung Sanity]
        SanityAPI[Sanity Content API / GROQ]
        SanityStudio[Sanity Studio - Giao diện Admin]
    end
    
    subgraph External Services [Dịch vụ Bên Ngoài]
        EmailService[Resend/SendGrid - Gửi Mail]
        GoogleMaps[Google Maps API]
    end

    Browser -->|1. Truy cập & Xem web| VercelEdge
    VercelEdge -->|2. Phục vụ tĩnh/Định tuyến| NextJS
    NextJS -->|3. Lấy dữ liệu (Fetch)| SanityAPI
    NextJS -->|4. Submit form liên hệ| EmailService
    Browser -->|5. Render Bản đồ| GoogleMaps
    
    Admin((Wayne Wong)) -->|6. Chỉnh sửa nội dung| SanityStudio
    SanityStudio -->|7. Lưu trữ Data| SanityAPI
    SanityAPI -.->|8. Webhook (Tự động cập nhật)| NextJS
```

### 2.2. Giải thích sơ đồ chi tiết
- **[Client] Trình duyệt Web:** Nơi khách hàng truy cập `gtekengineering.ca`. Trang web sẽ thích ứng (Responsive) trên cả điện thoại, máy tính bảng và desktop.
- **=> Kết luận:** Giao diện cần chú trọng Mobile-first vì khách hàng kỹ thuật/xây dựng thường xuyên truy cập tại công trường.
- **[Vercel] Hạ tầng Hosting:** Toàn bộ code frontend Next.js được đẩy lên Vercel. Vercel tự động phân phối các trang tĩnh (SSG) lên các Edge Node toàn cầu giúp tải trang trong vài mili-giây.
- **=> Kết luận:** Vercel đóng vai trò "nhà phân phối" siêu tốc, đảm bảo trang web của GTek luôn online 24/7 với tốc độ tối đa.
- **[Sanity] CMS & Studio:** Tách biệt hoàn toàn với mã nguồn website. Admin sẽ truy cập một domain phụ (vd: `studio.gtekengineering.ca`) để sử dụng Sanity Studio - một trình soạn thảo trực quan. Dữ liệu sau khi lưu được xuất ra qua API.
- **=> Kết luận:** Sự tách biệt (Decoupled Architecture) giúp website bảo mật hơn (không có trang `/wp-admin` dễ bị tấn công) và linh hoạt hơn.
- **External Services:** Khi người dùng điền form "Contact", Next.js gọi API gửi email (Resend/Nodemailer) chuyển thẳng đến mail của GTek. Bản đồ dùng iframe/API từ Google.
- **=> Kết luận:** Việc sử dụng các dịch vụ API bên thứ ba chuyên biệt giúp hệ thống hoạt động ổn định và giảm thiểu code backend tự viết.

---

## 3. Kế Hoạch Implement Chi Tiết (Implementation Plan)

Dưới đây là kế hoạch chi tiết từng giai đoạn, kèm theo bảng theo dõi tiến độ (Tracking) để bạn dễ dàng quản lý quá trình thực thi.

### Giai đoạn 1: Khởi tạo & Cấu trúc Nền tảng (Structure) - Tuần 1-2

**Mục tiêu:** Dựng bộ khung website với các trang cơ bản, cấu hình màu sắc, layout.

**Phân tích kỹ thuật & Ví dụ:**
- **Kỹ thuật:** Sử dụng `npx create-next-app` kết hợp App Router của Next 14/15. Cấu hình file `tailwind.config.ts` để khai báo Design Tokens (màu navy, amber).
- **Ví dụ Minh họa:** 
  ```ts
  // tailwind.config.ts
  module.exports = {
    theme: {
      extend: {
        colors: {
          'gtek-navy': '#0A192F', // Màu chủ đạo, thể hiện sự chuyên nghiệp
          'gtek-amber': '#FFC107', // Màu nhấn, cảm giác mỏ địa chất
        }
      }
    }
  }
  ```

**Bảng Tracking Tiến Độ - Giai đoạn 1**

| ID | Nhiệm vụ (Task) | Phân công | Trạng thái | Deadline | Ghi chú / Output |
|---|---|---|---|---|---|
| 1.1 | Khởi tạo Next.js App, cài đặt Tailwind CSS | Dev | [ ] To Do | Tuần 1 | `package.json`, cấu hình cơ bản |
| 1.2 | Định nghĩa mã màu (Color Palette) trong Tailwind | Dev | [ ] To Do | Tuần 1 | `tailwind.config.ts` |
| 1.3 | Tạo Component Layout chung (Navbar, Footer) | Dev | [ ] To Do | Tuần 1 | `app/layout.tsx`, responsive nav |
| 1.4 | Tạo cấu trúc thư mục route (`/about`, `/services`...) | Dev | [ ] To Do | Tuần 2 | Các file `page.tsx` rỗng |
| 1.5 | Code UI Hero Section ở Trang Chủ | Dev | [ ] To Do | Tuần 2 | Banner ảnh, tagline, nút CTA |

- **=> Kết luận:** Thiết lập cấu trúc chuẩn ngay từ tuần đầu tiên sẽ giúp việc gắp code ở các giai đoạn sau vào đúng vị trí một cách có tổ chức, tránh rác code.

---

### Giai đoạn 2: Lắp ráp Nội dung & UI (Content) - Tuần 3-4

**Mục tiêu:** Lên giao diện tĩnh (Static UI) cho các trang con dựa trên nội dung đã có.

**Phân tích kỹ thuật & Ví dụ:**
- **Kỹ thuật:** Sử dụng kỹ thuật chia nhỏ Component (Atomic Design). Đối với trang Services, dùng state trong React (`useState`) hoặc `<details>` tag HTML5 thuần để tạo các Accordion thu gọn.
- **Ví dụ Minh họa:** Trang Projects yêu cầu "Filterable grid" (Lưới có thể lọc).
  ```tsx
  // Thành phần ProjectFilter.tsx
  const [activeCategory, setActiveCategory] = useState('All');
  // Lọc mảng projects theo category và render Grid
  const filteredProjects = projects.filter(p => p.category === activeCategory);
  ```

**Bảng Tracking Tiến Độ - Giai đoạn 2**

| ID | Nhiệm vụ (Task) | Phân công | Trạng thái | Deadline | Ghi chú / Output |
|---|---|---|---|---|---|
| 2.1 | UI Trang About Us (Bio, Image, Awards) | Dev | [ ] To Do | Tuần 3 | Layout 2 cột Desktop, 1 cột Mobile |
| 2.2 | UI Trang Services (4 khối Accordion) | Dev | [ ] To Do | Tuần 3 | `<Accordion>` component |
| 2.3 | UI Trang Projects (Filterable Grid & Card) | Dev | [ ] To Do | Tuần 4 | Lưới CSS Grid, Filter Buttons |
| 2.4 | UI Trang Contact (Form liên hệ, Google Maps) | Dev | [ ] To Do | Tuần 4 | Form validation cơ bản |

- **=> Kết luận:** Giai đoạn này website đã có hình hài hoàn chỉnh 90%, có thể demo cho khách hàng xem qua bản tĩnh để chốt giao diện.

---

### Giai đoạn 3: Tích hợp CMS (Sanity) - Tuần 5

**Mục tiêu:** Đưa dữ liệu động từ CMS vào code tĩnh đã làm ở Giai đoạn 2.

**Phân tích kỹ thuật & Ví dụ:**
- **Kỹ thuật:** Cài đặt package `sanity` và `next-sanity`. Định nghĩa "Schemas" trong thư mục `/sanity`. Sử dụng ngôn ngữ truy vấn GROQ để lấy dữ liệu.
- **Ví dụ Minh họa:** Schema cho Dự Án (Project)
  ```js
  export const project = {
    name: 'project',
    title: 'Project',
    type: 'document',
    fields: [
      { name: 'title', title: 'Project Name', type: 'string' },
      { name: 'category', title: 'Category', type: 'string', options: { list: ['Mining', 'Dam Safety', 'Infrastructure...'] } },
    ]
  }
  ```

**Bảng Tracking Tiến Độ - Giai đoạn 3**

| ID | Nhiệm vụ (Task) | Phân công | Trạng thái | Deadline | Ghi chú / Output |
|---|---|---|---|---|---|
| 3.1 | Khởi tạo Sanity Project, cài `next-sanity` | Dev | [ ] To Do | Tuần 5 | Sanity Project ID |
| 3.2 | Code Sanity Schemas (Project, Service, Bio) | Dev | [ ] To Do | Tuần 5 | Thư mục `/sanity/schemas` |
| 3.3 | Deploy Sanity Studio vào route `/studio` | Dev | [ ] To Do | Tuần 5 | Wayne có thể login |
| 3.4 | Dùng GROQ fetch dữ liệu thật đổ vào UI Giai đoạn 2 | Dev | [ ] To Do | Tuần 5 | Dữ liệu website trở thành Dynamic |

- **=> Kết luận:** Bước chuyển đổi từ trang web tĩnh sang trang web động hoàn toàn có thể quản lý bởi non-dev, tạo giá trị cốt lõi cho dự án.

---

### Giai đoạn 4: Hoàn thiện, SEO & Lên sóng (Polish) - Tuần 6

**Mục tiêu:** Tối ưu hiệu năng, SEO và bàn giao.

**Phân tích kỹ thuật & Ví dụ:**
- **Kỹ thuật:** Sử dụng API `generateMetadata` của Next.js cho từng trang. Nhúng mã GA4 vào thẻ `<head>`. Thiết lập logic gửi mail.
- **Ví dụ Minh họa:** 
  ```tsx
  export const metadata = {
    title: 'Geotechnical Engineering Services | GTek',
    description: 'Expert geotechnical consulting and material testing in Winnipeg.',
  }
  ```

**Bảng Tracking Tiến Độ - Giai đoạn 4**

| ID | Nhiệm vụ (Task) | Phân công | Trạng thái | Deadline | Ghi chú / Output |
|---|---|---|---|---|---|
| 4.1 | Cấu hình SEO (Metadata, Open Graph) | Dev | [ ] To Do | Tuần 6 | Code trong các file `layout.tsx`, `page.tsx` |
| 4.2 | Tích hợp Google Analytics 4 | Dev | [ ] To Do | Tuần 6 | Theo dõi lượt truy cập |
| 4.3 | Xử lý logic Form Contact gửi Email (Resend/API) | Dev | [ ] To Do | Tuần 6 | Cần cấu hình API Key |
| 4.4 | Kiểm tra Responsive và Cross-browser testing | Dev/QA | [ ] To Do | Tuần 6 | Mở trên nhiều thiết bị thực tế |
| 4.5 | Deploy lên Vercel và trỏ domain chính thức | Dev | [ ] To Do | Tuần 6 | `gtekengineering.ca` live |

- **=> Kết luận:** Những tiểu tiết ở khâu Polish quyết định sự chuyên nghiệp và thứ hạng của doanh nghiệp trên Google Search.

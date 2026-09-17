# Improvement Plan — GTek Website (Sanity-first, Secure Editing, Reliable Ops)

Tài liệu này phản hồi các yêu cầu trong `entry/implement-docs/update.md`. Mục tiêu là xây dựng một hệ thống **chỉnh chu, đáng tin cậy**, nơi **non‑tech** có thể cập nhật nội dung (text + ảnh) mà **không cần code**, đồng thời **kiểm soát quyền chỉnh sửa** và **đảm bảo contact form gửi thành công**.

---

## 0) Tóm tắt trạng thái hiện tại (điểm xuất phát)

- **Sanity CMS đã được tích hợp** cho:
  - Projects & Services (đang fetch từ Sanity nếu cấu hình env).
  - Home / About / Contact details đã định hướng “CMS-first” với các **singleton documents** (Home Page / About Page / Site Settings).
- `/studio` đang chạy trong Next.js và có thể bổ sung **Basic Auth** ở cấp website (ngoài Sanity login) để “company-only”.
- Contact form đã có backend gửi email (Resend), có **honeypot** chống spam cơ bản.

Từ đây, kế hoạch tập trung vào: **100% nội dung editable**, **security & access control**, **deploy/domain**, và **tính tin cậy của contact system**.

---

## 1) “Các page dùng Sanity hết” — Thiết kế mô hình nội dung (Content Model)

### 1.1 Nguyên tắc
- **Everything editable**: mọi text/ảnh quan trọng trên Home/About/Services/Projects/Contact có chỗ chỉnh trong Studio.
- **Singleton cho các trang “nội dung cố định”**: Home Page, About Page, Contact Page (hoặc Site Settings).
- **Collection cho dữ liệu lặp**: Projects, Service Groups, Team Members.
- **Fallback**: nếu Sanity thiếu dữ liệu, website vẫn render bằng nội dung mặc định để không “vỡ”.

### 1.2 Cấu trúc đề xuất (một hệ thống “đáng tin cậy” cho non‑tech)
- **Site Settings (singleton)**:
  - Company name, email nhận liên hệ, phone, office hours, address lines
  - Sectors served (để hiển thị strip trên Home)
  - (Tuỳ chọn) Social links, default OG image
- **Home Page (singleton)**:
  - Hero headline/subhead/CTA + hero background image
  - 4 service cards + intro
  - Why GTek (3 value props)
  - Closing CTA
- **About Page (singleton)**:
  - Company narrative (2–3 đoạn)
  - Team members (list)
  - Affiliations (list)
- **Services (collection)**:
  - Service Group: title + items
- **Projects (collection)**:
  - Sector tag, client, location, scope (1–2 câu), attribution (nếu dự án từ firm cũ)
  - Project image 16:9

**Lý do chọn mô hình này**: non‑tech sẽ luôn thấy “đúng chỗ cần sửa” trong Studio (Home/About/Settings nằm trên cùng), còn Projects/Services là danh sách để thêm/sửa theo kiểu “Create new → Publish”.

---

## 2) Chế độ chỉnh sửa Studio: “Chỉ người trong công ty”

### 2.1 Sanity có “ai cũng edit được” không?
Không. Sanity hoạt động theo mô hình:
- Bạn **mời (invite)** user vào project bằng email.
- Chỉ user được mời + login thành công mới vào Studio và chỉnh sửa.

### 2.2 Kế hoạch kiểm soát quyền chỉnh sửa
Tầng 1 (bắt buộc): **Sanity user access**
- Chỉ invite email công ty.
- Dùng roles (Editor / Admin) để giới hạn quyền publish (tuỳ plan).

Tầng 2 (khuyến nghị khi release public): **Bảo vệ đường dẫn Studio**
- Đặt Studio ở `studio.gtekengineering.ca` (hoặc vẫn dùng `/studio` nhưng ẩn).
- Bật **Basic Auth** (hoặc IP allowlist) để chỉ người trong công ty mở được trang login Studio.
- Lợi ích: giảm rủi ro lộ trang editor, giảm brute-force/phishing.

Tầng 3 (tuỳ chọn): SSO/Google Workspace (nếu cần enterprise-grade)
- Khi đội ngũ lớn, cân nhắc SSO (thường là add-on/enterprise).

---

## 3) Sanity trial 30 ngày: sau đó có phải trả phí không?

Theo thông tin từ trang pricing & docs của Sanity (2026):
- **Có gói Free $0 “forever”** (miễn phí lâu dài).
- Nhiều project được **trial Growth plan 30 ngày**; hết trial sẽ **downgrade về Free** nếu không nâng cấp.
- Growth plan thường tính theo **seat/tháng** (ví dụ: ~`$15/seat/month`), tùy thời điểm/region.

### Kế hoạch để “dùng liên tục không ảnh hưởng”
- Mục tiêu launch v1: cố gắng dùng **Free plan** nếu đủ tính năng.
- Nếu cần roles nâng cao, scheduled publishing, private datasets, v.v. thì cân nhắc Growth.
- Tối ưu chi phí: mời đúng số user cần thiết, phân quyền hợp lý.

Gợi ý: đọc thêm trên Sanity:
- `sanity.io/pricing`
- `sanity.io/docs/platform-management/growth-plan-trial`

---

## 4) Home page: đổi thứ tự 4 service cards

Yêu cầu:
1) Foundation  
2) Slope stability  
3) Mining  
4) Dam Safety  

Kế hoạch triển khai “CMS-first”:
- Trong **Home Page → serviceCards**, sắp xếp theo thứ tự trên.
- UI sẽ render theo thứ tự mảng từ Sanity, nên non‑tech có thể thay đổi thứ tự bằng kéo thả (hoặc reorder trong array).

---

## 5) Deploy + sử dụng domain đã đăng ký

### 5.1 Kiến trúc deploy đề xuất (Vercel + Cloudflare)
- **Frontend (Next.js)**: deploy Vercel (Production + Preview)
- **Sanity Content Lake (hosted)**: Sanity quản lý (không cần server)
- **Studio**: 2 lựa chọn
  - **Option A (khuyến nghị)**: Studio subdomain `studio.gtekengineering.ca`
  - **Option B**: Studio route `/studio` trên cùng domain (đã có Basic Auth)

### 5.2 Luồng DNS (Cloudflare)
- `gtekengineering.ca` → Vercel (A/AAAA hoặc CNAME tuỳ hướng dẫn Vercel)
- `www.gtekengineering.ca` → CNAME về Vercel
- `studio.gtekengineering.ca` → CNAME về Vercel (nếu host studio cùng Next app)

### 5.3 Checklist môi trường (env vars)
Vercel (Production):
- Sanity:
  - `NEXT_PUBLIC_SANITY_PROJECT_ID`
  - `NEXT_PUBLIC_SANITY_DATASET`
  - `NEXT_PUBLIC_SANITY_API_VERSION`
  - (Nếu dataset private / cần đọc token) `SANITY_API_READ_TOKEN`
- Contact email (Resend):
  - `RESEND_API_KEY`
  - `CONTACT_TO_EMAIL` (nên lấy từ Site Settings về lâu dài)
  - `CONTACT_FROM_EMAIL` (nên là domain đã verify)
  - `CONTACT_SEND_ACK` (true/false)
  - `CONTACT_ACK_FROM_EMAIL`
- Studio protection:
  - `STUDIO_BASIC_AUTH_USER`
  - `STUDIO_BASIC_AUTH_PASS`

---

## 6) Fix: Project image không hiển thị ngoài website

Triệu chứng: Trong Projects page vẫn hiện placeholder “Project image / 16:9 landscape” dù đã upload ảnh trong Studio.

### 6.1 Nguyên nhân phổ biến
- Document chưa **Publish** (đang Draft).
- Field image lưu không đúng field name (ví dụ schema đổi tên).
- GROQ query không dereference đúng asset (`mainImage.asset->url`).
- Dataset/private token: query trả về nhưng image URL null (ít gặp với ảnh).

### 6.2 Quy trình debug “đúng bài” (không đoán)
1) Vào Studio → **Vision** (GROQ) chạy:
   - Query lấy 1 project và xem `mainImage` có asset không.
2) Xác nhận project document đã **Published**.
3) Kiểm tra ngay trong Vision output:
   - `mainImage.asset` có tồn tại không
   - `asset->url` có trả về URL không
4) Nếu `asset->url` có URL nhưng web vẫn không hiển thị:
   - kiểm tra Network tab (CORS/blocked/mixed content)
   - kiểm tra URL có trả 200 không

Kết quả debug sẽ quyết định fix ở schema/query hay ở UI.

---

## 7) Contact message: đã gửi đi đâu? làm sao để non‑tech chỉnh và đảm bảo gửi thành công?

### 7.1 Trạng thái hiện tại
- Form Contact gửi `POST /api/contact`
- Backend dùng **Resend** để gửi tới:
  - `CONTACT_TO_EMAIL` (mặc định hiện đang là `contact@gtekengineering.ca` nếu không set)
- Có thể bật gửi email xác nhận (ack) cho người gửi bằng `CONTACT_SEND_ACK=true`

### 7.2 Vấn đề cần giải quyết để “chỉnh chu”
1) **Non‑tech thay đổi email nhận liên hệ** (không sửa env/code).
2) **Reliability**: đảm bảo gửi thành công, có quan sát được lỗi, giảm spam.
3) **Deliverability**: email không rơi vào spam/quarantine.

### 7.3 Kế hoạch hệ thống “đáng tin cậy”

#### (A) Non‑tech editing cho email nhận liên hệ
- Thêm vào **Site Settings**:
  - `contactInboxEmail` (primary)
  - `contactCcEmails` (optional)
  - `contactEnabled` (toggle)
- API route đọc các giá trị này từ Sanity (server-side) để gửi email.

#### (B) Đảm bảo gửi thành công
- Gửi email qua Resend với:
  - `from` dùng domain đã verify (VD: `no-reply@gtekengineering.ca`)
  - `reply-to` là email khách
- Logging:
  - Lưu log submission vào Sanity (hoặc một log store nhẹ) để audit khi cần.
- Monitoring:
  - Nếu gửi fail → trả message thân thiện + log lỗi.

#### (C) Anti-spam & abuse protection
- Tối thiểu: honeypot (đã có).
- Khuyến nghị launch: thêm **rate limit** theo IP và/or reCAPTCHA/hCaptcha nếu spam tăng.

---

## 8) Sơ đồ hệ thống (minh hoạ tương quan)

```mermaid
flowchart TD
  U[Visitor] -->|Browse| V[Vercel / Next.js]
  U -->|Submit contact form| V

  V -->|Fetch content (SSG/ISR)| S[Sanity Content Lake]
  E[Editors (Company)] -->|Login + Edit| ST[Sanity Studio]
  ST --> S

  V -->|Send email| R[Resend]
  R --> INBOX[Company inbox / forwarders]

  subgraph Security
    BA[Basic Auth gate /studio]
    SA[Sanity user invite + roles]
  end

  E --> BA --> ST
  E --> SA --> ST
```

---

## 9) Roadmap triển khai (theo ưu tiên)

### Sprint A — “Editable mọi thứ” (non‑tech ready)
- Hoàn tất Services page editable 100% từ Sanity (đảm bảo content đầy đủ).
- Hoàn tất Site Settings cho Contact inbox (đọc từ Sanity thay vì env).
- Chuẩn hoá Projects content: sector/client/location/scope/attribution + image.

### Sprint B — “Secure editing” (release-ready)
- Dùng subdomain `studio.gtekengineering.ca`.
- Bật Basic Auth + Sanity invites only.
- CORS origins đúng cho local + production.

### Sprint C — “Reliability” (vận hành)
- Rate limit contact endpoint.
- Logging submissions + monitoring (Sentry/Log drain).
- Deliverability: verify domain trên Resend + SPF/DKIM/DMARC.


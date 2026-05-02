# Vercel & Jamstack Architecture

## 1. Lý Thuyết Cơ Bản

**Jamstack** (JavaScript, APIs, and Markup) là một kiến trúc hiện đại dùng để xây dựng các trang web nhanh, bảo mật và dễ mở rộng.
Thay vì mỗi lần người dùng truy cập, server phải tốn thời gian chạy code, kết nối database để tạo ra trang HTML (như mô hình LAMP/WordPress cũ), Jamstack chủ trương tạo sẵn tất cả các trang HTML tĩnh (Markup) ngay từ lúc Build, và phân phối chúng qua mạng lưới CDN toàn cầu. Dữ liệu động sẽ được gọi thông qua APIs bằng JavaScript ở phía client.

**Vercel** là nền tảng Cloud sinh ra để phục vụ kiến trúc Jamstack này. Đây cũng là công ty đã tạo ra Next.js, nên việc host Next.js trên Vercel mang lại hiệu suất hoàn hảo nhất.

### Tại sao sử dụng Vercel?
1. **CI/CD Tự động:** Khi bạn đẩy code mới lên GitHub, Vercel sẽ tự động tải code về, chạy lệnh build (ví dụ sinh ra 5 trang tĩnh cho GTek) và đưa lên server của họ. Toàn bộ quá trình chỉ mất 1-2 phút và không cần can thiệp thủ công.
2. **Edge Network (CDN):** Trang web của bạn không nằm ở một máy chủ duy nhất (ví dụ ở Mỹ). Vercel copy các file HTML/CSS tĩnh của bạn ra hàng trăm server (Edge nodes) trên toàn thế giới. Khi một khách hàng ở Canada truy cập, họ sẽ tải trang web từ server tại Canada, giúp tốc độ tải gần như tức thì.
3. **Serverless Functions:** Khi cần xử lý backend (ví dụ: Gửi email từ form liên hệ), bạn không cần thuê máy chủ chạy Node.js 24/24. Vercel cho phép chạy "Serverless Functions" – các hàm backend chỉ chạy khi có request gọi tới và tự tắt đi sau đó. Tiết kiệm chi phí tuyệt đối (đa số dự án nhỏ đều nằm trong gói miễn phí).

## 2. Luồng Hoạt Động Của Hệ Thống Khi Có Sanity & Vercel

Vì dữ liệu của chúng ta nằm ở Sanity CMS, và website nằm ở Vercel (dạng tĩnh SSG), làm sao để website tự cập nhật khi bác Wayne sửa bài viết trên Sanity?

Đây là lúc khái niệm **Webhook** và **On-Demand Revalidation** xuất hiện.

### Ví dụ về Luồng Hoạt Động:

1. **Build lần đầu:** Code được đẩy lên GitHub -> Vercel tự động lấy code, gọi API sang Sanity lấy toàn bộ bài viết, tạo ra trang HTML tĩnh và lưu trên CDN. Người dùng truy cập tải web siêu nhanh.
2. **Khách hàng Edit:** Bác Wayne vào `studio.gtekengineering.ca` (Sanity Studio) sửa tên một Dự án từ "Dam A" thành "Dam B" và bấm "Publish".
3. **Webhook kích hoạt:** Sanity tự động bắn một tín hiệu HTTP (Webhook) sang Vercel báo hiệu: "Nội dung dự án đã đổi".
4. **Vercel Build Lại Ngầm (Revalidation):** Nhận được webhook, Vercel không build lại toàn bộ website (rất mất thời gian), nó chỉ âm thầm gọi lại API để lấy dữ liệu dự án mới, tạo lại duy nhất file HTML của trang Project đó trên nền (Background).
5. **Cập nhật Edge Network:** Trang HTML mới thay thế trang cũ trên CDN. Khách hàng truy cập ngay lúc đó sẽ thấy "Dam B" mà không hề có độ trễ nào từ phía frontend.

### Ví dụ Code: Cấu hình Revalidate trong Next.js (App Router)

Trong Next.js App Router, bạn có thể thiết lập thời gian tự động cập nhật lại nội dung (ISR).

```tsx
// app/projects/page.tsx

// Tùy chọn này bảo Next.js: "Dữ liệu ở trang này tĩnh, nhưng cứ sau 60 giây, 
// nếu có người truy cập, hãy âm thầm chạy lại server để check xem có data mới không".
export const revalidate = 60; 

import { getProjects } from '../../lib/sanity-client';

export default async function ProjectsPage() {
  const projects = await getProjects();
  return (
    // Render UI...
  );
}
```

*Kết luận:* Mô hình Jamstack với sự kết hợp của Next.js (Khung xương) + Tailwind (Lớp da) + Sanity (Bộ não dữ liệu) + Vercel (Nhà phân phối) là **tiêu chuẩn vàng** (gold standard) hiện nay cho các website doanh nghiệp như GTek Engineering. Nó giúp giải quyết triệt để 3 bài toán: Tốc độ tải trang, Điểm SEO, và Trải nghiệm quản trị nội dung.

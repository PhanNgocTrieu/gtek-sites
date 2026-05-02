# Next.js & App Router

## 1. Lý Thuyết Cơ Bản

**Next.js** là một React framework mạnh mẽ được phát triển bởi Vercel. Nó giải quyết được bài toán lớn nhất của React thuần (Create React App/Vite): đó là **SEO (Search Engine Optimization)** và **Hiệu suất tải trang đầu tiên (Initial Load Performance)**.

Trong khi React thuần chỉ tải một trang HTML trống và render mọi thứ ở phía client (Client-Side Rendering - CSR), Next.js cung cấp các cơ chế render ở phía server (Server-Side Rendering - SSR) hoặc render sẵn thành file tĩnh lúc build (Static Site Generation - SSG).

### App Router (Next.js 13+)
Bắt đầu từ phiên bản 13, Next.js giới thiệu mô hình `App Router`. Thay vì dùng thư mục `pages/` như trước, mọi thứ được đặt trong thư mục `app/`. 
- Mỗi folder trong `app/` đại diện cho một đường dẫn (route) trên URL.
- File tên `page.tsx` sẽ là giao diện hiển thị cho route đó.
- File `layout.tsx` sẽ là giao diện bọc ngoài (chứa Navbar, Footer) không bị render lại khi chuyển trang.

## 2. Các Cơ Chế Rendering

1. **CSR (Client-Side Rendering):** Trình duyệt tải JS và tự vẽ UI. (Chậm lúc đầu, mượt về sau, SEO kém).
2. **SSR (Server-Side Rendering):** Server chạy React, tạo ra HTML và gửi về trình duyệt. (Luôn có dữ liệu mới nhất, SEO tốt, nhưng tạo áp lực lên server).
3. **SSG (Static Site Generation):** HTML được tạo ra **1 lần duy nhất** lúc gõ lệnh `npm run build`. (Nhanh nhất, SEO cực tốt, rẻ tiền để host, nhưng dữ liệu có thể bị cũ nếu không build lại).
4. **ISR (Incremental Static Regeneration):** Giống SSG nhưng cho phép website tự build lại ngầm sau một khoảng thời gian nhất định (ví dụ: sau 60 giây).

Với trang web doanh nghiệp như GTek, chúng ta sẽ chủ yếu sử dụng **SSG** và **ISR**.

## 3. Giải Thích Chi Tiết & Ví Dụ Minh Họa

### Ví dụ 1: Cấu trúc thư mục App Router
Để tạo các trang `Home`, `About`, `Services`, cấu trúc thư mục của bạn sẽ trông như thế này:
```text
app/
 ├── layout.tsx         # Layout chung (Navbar, Footer)
 ├── page.tsx           # URL: / (Trang chủ)
 ├── about/
 │    └── page.tsx      # URL: /about
 └── services/
      └── page.tsx      # URL: /services
```

### Ví dụ 2: Layout Component (`app/layout.tsx`)
```tsx
import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export const metadata = {
  title: 'GTek Engineering',
  description: 'Your Partner in Ground Truth and Solutions',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```
*Giải thích:* Component `{children}` chính là phần nội dung của từng trang (`page.tsx`) sẽ được thay đổi. Header và Footer luôn giữ nguyên. API `metadata` giúp SEO trang web rất dễ dàng.

### Ví dụ 3: Server Components vs Client Components
Mặc định trong App Router, tất cả các file đều là **Server Components** (render trên server, không có JS gửi xuống client). Nếu bạn cần dùng `useState` hoặc `onClick`, bạn phải biến nó thành **Client Component** bằng cách thêm `"use client"` ở dòng đầu tiên.

```tsx
// app/services/Accordion.tsx
"use client" // BẮT BUỘC nếu muốn dùng State

import { useState } from 'react';

export default function Accordion({ title, content }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}>{title}</button>
      {isOpen && <div className="p-4">{content}</div>}
    </div>
  );
}
```
*Giải thích:* Chỉ những chỗ nào cần tương tác từ người dùng (click, gõ chữ) ta mới dùng Client Component. Điều này giúp website nhanh hơn rất nhiều vì giảm dung lượng JS phải tải.

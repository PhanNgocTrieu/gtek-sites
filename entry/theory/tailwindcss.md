# Tailwind CSS

## 1. Lý Thuyết Cơ Bản

**Tailwind CSS** là một framework CSS theo trường phái "Utility-first". Thay vì viết ra các file CSS riêng biệt với các class ngữ nghĩa như `.btn-primary`, `.card`, bạn sẽ sử dụng các class có sẵn cực nhỏ (utilities) để thiết kế trực tiếp trong HTML.

Ví dụ, để tạo một đoạn text màu đỏ, in đậm, căn giữa:
- **CSS Thường:** `<p class="title-text">Hello</p>` và viết CSS `.title-text { color: red; font-weight: bold; text-align: center; }`.
- **Tailwind CSS:** `<p class="text-red-500 font-bold text-center">Hello</p>`.

### Tại sao nên dùng Tailwind?
1. **Không phải đặt tên class:** Bạn không cần phải đau đầu nghĩ xem nút này gọi là `.nav-button` hay `.btn-nav`.
2. **Không file CSS khổng lồ:** Vì tái sử dụng các class tiện ích, dung lượng file CSS cuối cùng rất nhỏ (Tailwind tự động xóa các class không dùng khi build).
3. **Phát triển siêu tốc:** Thiết kế trực tiếp trong JSX/HTML.
4. **Hệ thống Design Token:** Dễ dàng định nghĩa bảng màu, font chữ của công ty tại một nơi và dùng khắp dự án.

## 2. Giải Thích Chi Tiết & Ví Dụ Minh Họa

### Cấu hình Design Tokens (`tailwind.config.ts`)
Đây là nơi bạn khai báo màu sắc thương hiệu của GTek Engineering.

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Khai báo màu tùy chỉnh cho GTek
        'gtek-navy': '#0A192F', // Deep navy
        'gtek-amber': '#FFC107', // Gold/Amber accent
      },
    },
  },
  plugins: [],
};
export default config;
```

### Ví dụ 1: Xây dựng Nút Bấm (Button)
```tsx
export default function Button({ text }) {
  return (
    <button className="bg-gtek-amber hover:bg-yellow-500 text-gtek-navy font-bold py-3 px-6 rounded-md transition-colors duration-300">
      {text}
    </button>
  );
}
```
*Giải thích:*
- `bg-gtek-amber`: Dùng màu nền tự định nghĩa.
- `hover:bg-yellow-500`: Đổi màu khi hover chuột.
- `py-3 px-6`: Padding dọc và ngang.
- `rounded-md`: Bo góc.
- `transition-colors duration-300`: Hiệu ứng chuyển màu mượt mà.

### Ví dụ 2: Layout Grid (Xây dựng Projects Grid)
Để hiển thị danh sách dự án thành lưới, Tailwind hỗ trợ CSS Grid rất đơn giản.

```tsx
export default function ProjectGrid({ projects }) {
  return (
    // Dàn lưới: 1 cột ở mobile, 2 cột ở tablet, 3 cột ở màn hình lớn
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {projects.map((proj) => (
        <div key={proj.id} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-lg">
          <img src={proj.image} alt={proj.title} className="w-full h-48 object-cover" />
          <div className="p-4 bg-white">
            <h3 className="text-xl font-bold text-gtek-navy">{proj.title}</h3>
            <p className="text-sm text-gtek-amber">{proj.category}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
```
*Giải thích:*
- Các prefix `md:` và `lg:` giúp dễ dàng làm giao diện responsive (thích ứng) mà không cần viết các câu lệnh `@media query` dài dòng trong CSS truyền thống.

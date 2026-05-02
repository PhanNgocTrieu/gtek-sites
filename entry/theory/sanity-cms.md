# Headless CMS & Sanity

## 1. Lý Thuyết Cơ Bản

**CMS** (Content Management System) là Hệ quản trị nội dung.

### Traditional CMS vs Headless CMS
- **Traditional CMS (như WordPress, Joomla):** Là một khối thống nhất (Monolithic). Code hiển thị (Frontend), database, và giao diện quản trị (Admin panel) bị dính chặt vào nhau. Nó sinh ra sẵn các trang HTML. Nếu bạn muốn đổi công nghệ frontend, bạn gần như phải làm lại toàn bộ.
- **Headless CMS (như Sanity, Strapi, Contentful):** Chỉ chứa **phần đầu (Admin panel)** và **database**. Nó KHÔNG quan tâm trang web của bạn hiển thị thế nào. Khi bạn nhập nội dung, nó chỉ lưu lại và cung cấp một **API** (chứa dữ liệu JSON). Bạn có thể dùng dữ liệu này hiển thị lên Website (Next.js), Ứng dụng điện thoại (iOS/Android) hoặc thậm chí là Đồng hồ thông minh.

### Tại sao chọn Sanity cho GTek?
Sanity là một Headless CMS kiểu mới, hoạt động theo cơ chế **Content as Data** (Nội dung là dữ liệu).
- **Sanity Studio:** Giao diện cho người dùng (bác Wayne) nhập nội dung. Cấu trúc form nhập liệu được code bằng React/JavaScript, cực kỳ dễ tùy chỉnh.
- **Sanity Content Lake:** Database đám mây của Sanity lưu trữ dữ liệu dạng tài liệu (Documents) liên kết với nhau.
- **GROQ:** (Graph-Relational Object Queries) - Ngôn ngữ truy vấn dữ liệu riêng của Sanity (tương tự GraphQL) dùng để lấy dữ liệu.

## 2. Giải Thích Chi Tiết & Ví Dụ Minh Họa

### Bước 1: Định nghĩa Schema (Cấu trúc dữ liệu)
Thay vì tạo bảng trong SQL, bạn dùng JavaScript objects để tạo form nhập liệu trong Sanity Studio.

```js
// sanity/schemas/project.js
export default {
  name: 'project',
  title: 'Project', // Tên hiển thị trên Sanity Studio
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Project Name',
      type: 'string',
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Mining', value: 'mining' },
          { title: 'Dam Safety', value: 'dam-safety' },
          { title: 'Infrastructure', value: 'infrastructure' }
        ]
      }
    },
    {
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: { hotspot: true } // Cho phép user crop ảnh trực tiếp
    }
  ]
}
```
*Giải thích:* Khi chạy Sanity Studio, đoạn code này sẽ tự động sinh ra một form nhập liệu có ô Text (tên dự án), ô Dropdown (chọn category) và nút Upload Ảnh. Bác Wayne chỉ cần điền vào form mà không cần biết code.

### Bước 2: Truy vấn dữ liệu (Query) bằng GROQ
Trong Next.js, chúng ta gọi API tới Sanity bằng GROQ để lấy dữ liệu về.

```ts
import { createClient } from "next-sanity";

// Cấu hình kết nối tới Sanity
const client = createClient({
  projectId: "your_project_id_here",
  dataset: "production",
  apiVersion: "2023-05-03",
  useCdn: false, // Dùng false để dữ liệu luôn mới nhất
});

export async function getProjects() {
  // Câu lệnh GROQ: 
  // Lấy tất cả document có _type là 'project'
  // Và chỉ trả về các trường _id, title, category, và URL của ảnh
  const query = `*[_type == "project"] {
    _id,
    title,
    category,
    "imageUrl": mainImage.asset->url
  }`;

  const projects = await client.fetch(query);
  return projects;
}
```

### Bước 3: Đưa dữ liệu lên UI (Next.js)
Vì Next.js Server Components cho phép dùng `async/await` trực tiếp trong Component, việc render data rất đơn giản.

```tsx
// app/projects/page.tsx
import { getProjects } from '../../lib/sanity-client';

export default async function ProjectsPage() {
  // Chạy trên server, gọi hàm ở bước 2
  const projects = await getProjects();

  return (
    <div className="grid grid-cols-3 gap-4">
      {projects.map((project) => (
        <div key={project._id} className="card">
          <img src={project.imageUrl} alt={project.title} />
          <h2>{project.title}</h2>
          <p>{project.category}</p>
        </div>
      ))}
    </div>
  );
}
```
*Kết luận:* Mô hình này đảm bảo tốc độ tối đa cho người xem web, và trải nghiệm quản lý nội dung dễ dàng nhất cho chủ website.

# Andrew.dev — Personal Portfolio

Một trang Web Portfolio tĩnh thiết kế theo phong cách tối giản (Minimalist Odysseus Theme) dành cho **Nguyễn Mạnh Quyền** — Backend Intern & Unity Game Developer.

Trang web giới thiệu thông tin cá nhân, kỹ năng, dự án tiêu biểu, và đi kèm một khu vực **Play Zone** tương tác độc đáo dành cho nhà tuyển dụng.

---

## 🎨 Điểm nhấn thiết kế (Design Aesthetics)

- **Odysseus Inspired Dark Theme**: Tông màu nền tối sâu thẳm kết hợp hiệu ứng viền kính mờ (Glassmorphism) cực kỳ cao cấp.
- **Color Accent**: Điểm xuyết đỏ Coral (`#f07c7c`) làm chủ đạo kết hợp xanh băng Cyan (`#9ee5e8`) tạo cảm giác hiện đại và công nghệ.
- **Generative Background Canvas**: 120 sợi tơ ánh sáng trắng uốn lượn ngẫu nhiên tạo chiều sâu không gian, được giới hạn hoạt ảnh chạy tinh tế ở phần Hero.
- **Typography**: Kết hợp font chữ hình học công nghệ **Space Grotesk** cho các tiêu đề/nút bấm và font **Plus Jakarta Sans** cho nội dung để tối ưu trải nghiệm đọc.
- **Code Brackets Branding**: Đồng bộ biểu tượng thương hiệu cá nhân dạng thẻ code `< />` từ Logo, Favicon cho đến các thành phần UI.

---

## 🚀 Tính năng nổi bật

1. **Giới thiệu & Học vấn**: Hiển thị đầy đủ thông tin liên hệ, học vấn tại Trường Đại học Xây dựng Hà Nội cùng liên kết tải trực tiếp CV bản đầy đủ.
2. **Kỹ năng chuyên môn**: Gom nhóm trực quan từ Ngôn ngữ (Java, C#, JS, PHP), Framework (Spring Boot, .NET Core, React), cho tới Kiến trúc hệ thống & Công cụ làm việc (SOLID, DDD, Docker, Git).
3. **Dự án tiêu biểu**: Chi tiết về dự án Full-stack E-commerce (Spring Boot + React + MongoDB) tích hợp AI Chatbot.
4. **Interactive Play Zone**:
   - **React Cyber Clicker**: Minigame clicker giả lập gõ code biên dịch phần mềm, nâng cấp AI Copilots tự động chạy LOC và thăng tiến cấp bậc từ Intern lên Architect có ghi log console thời gian thực.
   - **Unity WebGL Frame**: Khung Iframe sẵn sàng hiển thị trực tiếp các tựa game WebGL của tác giả.

---

## 💻 Hướng dẫn chạy cục bộ (Local Development)

### Yêu cầu hệ thống
- Đã cài đặt **Node.js** (Phiên bản v18 trở lên).

### Các bước thực hiện
1. Clone repository về máy:
   ```bash
   git clone https://github.com/AndrewQng/Andrew.dev.git
   cd Andrew.dev
   ```
2. Cài đặt các thư viện phụ thuộc:
   ```bash
   npm install
   ```
3. Chạy server phát triển (Development Server):
   ```bash
   npm run dev
   ```
   *Mở trình duyệt truy cập `http://localhost:5173` để xem.*

---

## 📦 Biên dịch & Deploy (Production Build)

Để đóng gói mã nguồn thành sản phẩm tĩnh tối ưu hóa (Static HTML/CSS/JS):
```bash
npm run build
```
Toàn bộ mã nguồn đóng gói sẽ nằm trong thư mục `/dist`. Bạn có thể dễ dàng deploy thư mục này lên các dịch vụ lưu trữ miễn phí như **GitHub Pages**, **Vercel**, **Netlify**, hoặc **Cloudflare Pages**.

---

## 🎮 Cách đăng tải Game Unity lên Play Zone

Để đưa game Unity WebGL của bạn hiển thị trực tiếp trên website mà không cần chỉnh sửa mã nguồn React:
1. Build game từ Unity Editor dưới định dạng **WebGL**.
2. Tạo thư mục `unity-games` nằm bên trong thư mục `public` của dự án:
   ```text
   public/
   └── unity-games/
       ├── index.html
       ├── Build/
       └── TemplateData/
   ```
3. Copy toàn bộ các file bản build WebGL của bạn vào thư mục `public/unity-games/` đó.
4. Khi chạy trang web, tab **Game Unity WebGL** sẽ tự động nhận diện và khởi chạy game của bạn qua Iframe.

---

## 📄 Bản quyền
Thiết kế và Phát triển bởi **Nguyễn Mạnh Quyền** © 2026.

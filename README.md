<div align="center">

  <h1>⚙️ Grocery Store POS - Core API Engine & Realtime Microservice</h1>
  <h3>Hệ thống Backend RESTful API & WebSockets Gateway Quản Lý Bán Hàng Tạp Hóa Thời Gian Thực</h3>

  <p>
    Lõi xử lý nghiệp vụ backend chuyên sâu, cung cấp RESTful API quản lý kho hàng & chuỗi quầy POS thu ngân, 
    đồng bộ WebSockets thời gian thực song công, xác thực phân quyền JWT Role-Based (Admin & Cashier), 
    trừ tồn kho nguyên tử, tự động thống kê báo cáo tài chính và cấp chữ ký số HMAC tải ảnh trực tiếp lên Cloudinary CDN.
  </p>

  <p>
    <img src="https://img.shields.io/badge/NestJS-11.0.1-E0234E?logo=nestjs" alt="NestJS">
    <img src="https://img.shields.io/badge/TypeScript-5.7.3-3178C6?logo=typescript" alt="TypeScript">
    <img src="https://img.shields.io/badge/MongoDB-Mongoose_9.6-47A248?logo=mongodb" alt="MongoDB">
    <img src="https://img.shields.io/badge/Socket.io-4.8.3-010101?logo=socketdotio" alt="Socket.io">
    <img src="https://img.shields.io/badge/Swagger-OpenAPI_3.0-85EA2D?logo=swagger" alt="Swagger">
    <img src="https://img.shields.io/badge/license-UNLICENSED-red" alt="License">
    <img src="https://img.shields.io/badge/status-Active_Development-success" alt="Status">
  </p>

</div>

<br />

# ⚙️ BACKEND API SERVICE & REALTIME POS CORE

Đây là Repository chứa mã nguồn **Backend** của hệ thống **Grocery Store POS**, đóng vai trò là hạt nhân điều phối nghiệp vụ chịu trách nhiệm lưu trữ dữ liệu, kiểm soát giao dịch bán lẻ, đồng bộ tồn kho thời gian thực và cung cấp dữ liệu báo cáo tài chính chuẩn mực.

---

## 📑 Mục lục

- [🛠️ Công nghệ & Phiên bản](#️-công-nghệ--phiên-bản)
- [🌟 Tính năng Nghiệp vụ & Thuật toán Cốt lõi](#-tính-năng-nghiệp-vụ--thuật-toán-cốt-lõi)
  - [1️⃣ Phân quyền Vai trò Bảo mật (RBAC & JWT Authentication)](#1️⃣-phân-quyền-vai-trò-bảo-mật-rbac--jwt-authentication)
  - [2️⃣ Cổng Giao tiếp Thời gian Thực Song công (Socket.io Events Gateway)](#2️⃣-cổng-giao-tiếp-thời-gian-thực-song-công-socketio-events-gateway)
  - [3️⃣ Quản lý Tồn kho & Cảnh báo Sắp hết hàng (`low-stock`)](#3️⃣-quản-lý-tồn-kho--cảnh-báo-sắp-hết-hàng-low-stock)
  - [4️⃣ Ký số Tải ảnh Đám mây Trực tiếp (Cloudinary HMAC Direct Signed Upload)](#4️⃣-ký-số-tải-ảnh-đám-mây-trực-tiếp-cloudinary-hmac-direct-signed-upload)
  - [5️⃣ Xử lý Giao dịch Hóa đơn & Trừ kho Nguyên tử (`sellerName`)](#5️⃣-xử-lý-giao-dịch-hóa-đơn--trừ-kho-nguyên-tử-sellername)
  - [6️⃣ Trung tâm Báo cáo Doanh thu & Thống kê Tài chính](#6️⃣-trung-tâm-báo-cáo-doanh-thu--thống-kê-tài-chính)
  - [7️⃣ Bộ Lọc Giới hạn Tần suất Yêu cầu (Throttler Rate Limit Guard)](#7️⃣-bộ-lọc-giới-hạn-tần-suất-yêu-cầu-throttler-rate-limit-guard)
  - [8️⃣ Tài liệu Hóa Tự động OpenAPI (Swagger UI Interactive Docs)](#8️⃣-tài-liệu-hóa-tự-động-openapi-swagger-ui-interactive-docs)
- [📚 Danh sách API Endpoints](#-danh-sách-api-endpoints)
  - [1. Xác thực & Tài khoản người dùng (`/api/auth`)](#1-xác-thực--tài-khoản-người-dùng-apiauth)
  - [2. Quản lý Sản phẩm & Kho hàng (`/api/products`)](#2-quản-lý-sản-phẩm--kho-hàng-apiproducts)
  - [3. Quản lý Danh mục Ngành hàng (`/api/categories`)](#3-quản-lý-danh-mục-ngành-hàng-apicategories)
  - [4. Quản lý Hóa đơn Bán lẻ (`/api/invoices`)](#4-quản-lý-hóa-đơn-bán-lẻ-apiinvoices)
  - [5. Báo cáo Doanh thu & Thống kê Dashboard (`/api/invoices/dashboard`)](#5-báo-cáo-doanh-thu--thống-kê-dashboard-apiinvoicesdashboard)
- [🚀 Cài đặt & Khởi chạy](#-cài-đặt--khởi-chạy)
- [📂 Cấu trúc Thư mục Dự án](#-cấu-trúc-thư-mục-dự-án)
- [🔗 Kết nối Mobile App POS](#-kết-nối-mobile-app-pos)
- [👨‍💻 Tác giả](#-tác-giả)

---

## 🛠️ Công nghệ & Phiên bản

Dựa trên cấu hình `package.json` của dự án:

### 🏗️ Core Stack

| Công nghệ | Phiên bản | Vai trò |
| :--- | :--- | :--- |
| **[NestJS](https://nestjs.com/)** | `^11.0.1` | Framework Node.js kiến trúc Modular, Dependency Injection mạnh mẽ |
| **[TypeScript](https://www.typescriptlang.org/)** | `^5.7.3` | Ngôn ngữ lập trình chính, hỗ trợ Type Safety và Decorators hiện đại |
| **[@nestjs/platform-express](https://expressjs.com/)** | `^11.0.1` | Adapter HTTP nền tảng Express hiệu năng cao cho NestJS |
| **[@nestjs/config](https://docs.nestjs.com/techniques/configuration)** | `^4.0.4` | Quản lý cấu hình biến môi trường (`.env`) an toàn và linh hoạt |
| **[MongoDB](https://www.mongodb.com/) & [@nestjs/mongoose](https://github.com/nestjs/mongoose)** | `^11.0.4` | Cơ sở dữ liệu NoSQL linh hoạt kết hợp Mongoose ODM (`v9.6.2`) |

---

### 🛡️ Authentication, Realtime & Storage

| Thư viện | Phiên bản | Vai trò |
| :--- | :--- | :--- |
| **[Passport & Passport-JWT](http://www.passportjs.org/)** | `^0.7.0` | Chiến lược giải mã và xác thực token JWT không trạng thái (Stateless) |
| **[@nestjs/jwt](https://github.com/nestjs/jwt)** | `^11.0.2` | Ký số và khởi tạo JSON Web Token (JWT) phiên làm việc |
| **[bcrypt](https://github.com/kelektiv/node.bcrypt.js)** | `^6.0.0` | Thuật toán băm mật khẩu một chiều chống tấn công từ điển |
| **[@nestjs/websockets & Socket.io](https://socket.io/)** | `^4.8.3` | Cổng kết nối WebSockets song công hai chiều thời gian thực |
| **[Cloudinary SDK](https://cloudinary.com/)** | `^2.10.0` | Thuật toán ký số HMAC SHA-1 tạo chữ ký cấp quyền tải ảnh trực tiếp lên CDN |
| **[@nestjs/throttler](https://github.com/nestjs/throttler)** | `^6.5.0` | Bộ phòng thủ Rate Limiting ngăn chặn tấn công từ chối dịch vụ (DDoS) và Brute-force |
| **[class-validator & class-transformer](https://github.com/typestack/class-validator)** | `^0.15.1` | Tự động xác thực dữ liệu đầu vào (DTO Validation Pipes) |

---

### 🧪 Chất lượng Mã nguồn & Kiểm thử (Testing)

| Thư viện | Phiên bản | Vai trò |
| :--- | :--- | :--- |
| **[Jest](https://jestjs.io/)** | `^30.0.0` | Framework chạy Unit Test và Integration Test |
| **[ts-jest](https://kulshekhar.github.io/ts-jest/)** | `^29.2.5` | TypeScript preprocessor cho Jest |
| **[ESLint](https://eslint.org/)** | `^9.18.0` | Phân tích tĩnh và phát hiện lỗi cú pháp |
| **[Prettier](https://prettier.io/)** | `^3.4.2` | Định dạng chuẩn hóa code nhất quán |
| **[@nestjs/swagger & Swagger UI](https://swagger.io/)** | `^11.4.4` | Tự động sinh giao diện tài liệu tương tác OpenAPI trực tiếp tại `/api/docs` |

---

## 🌟 Tính năng Nghiệp vụ & Thuật toán Cốt lõi

### 1️⃣ Phân quyền Vai trò Bảo mật (RBAC & JWT Authentication)
* **2 Cấp bậc vai trò rõ ràng:**
  - `ADMIN`: Quản lý toàn quyền hệ thống (Xem báo cáo tài chính, sửa giá sản phẩm tại quầy, xóa sản phẩm, xóa hóa đơn).
  - `CASHIER`: Thu ngân bán hàng tại quầy (Bán hàng, xem kho nhưng bị ẩn hoàn toàn giá vốn, không có quyền xóa dữ liệu và bị chặn truy cập màn hình báo cáo).
* **Bảo vệ qua Guard:** Toàn bộ API nghiệp vụ được bảo vệ bởi `@UseGuards(AuthGuard('jwt'))`. Client gửi kèm `Authorization: Bearer <token>` trên mỗi request.

### 2️⃣ Cổng Giao tiếp Thời gian Thực Song công (Socket.io Events Gateway)
Module [`events.gateway.ts`](src/events/events.gateway.ts) lắng nghe kết nối từ chuỗi thiết bị POS và tự động phát sóng (broadcast) các sự kiện:
* `product_changed`: Kích hoạt khi có sản phẩm được thêm mới, cập nhật giá/tồn kho hoặc xóa bỏ.
* `category_changed`: Kích hoạt khi danh mục ngành hàng có sự thay đổi.
* `invoice_created`: Kích hoạt ngay khi một hóa đơn mới được thanh toán thành công, giúp các thiết bị khác tự động cập nhật doanh thu và trừ tồn kho trực tiếp.

### 3️⃣ Quản lý Tồn kho & Cảnh báo Sắp hết hàng (`low-stock`)
* **Quản lý đa trường dữ liệu:** Tên sản phẩm, Mã vạch SKU, Giá bán lẻ, Giá vốn nhập, Đơn vị tính (Lon, Chai, Hộp, Kg...), Tồn kho ban đầu, Danh mục tham chiếu và URL ảnh Cloudinary.
* **Cảnh báo hàng sắp hết (`low-stock`):** Endpoint chuyên biệt tự động lọc các sản phẩm có số lượng tồn kho nhỏ hơn ngưỡng quy định (`stock < LOW_STOCK_THRESHOLD`).
* **Xóa mềm (Soft Delete):** Đánh dấu trạng thái `isDeleted: true` để bảo toàn lịch sử hóa đơn cũ mà không làm mất tính toàn vẹn dữ liệu.

### 4️⃣ Ký số Tải ảnh Đám mây Trực tiếp (Cloudinary HMAC Direct Signed Upload)
* Thay vì để máy chủ backend nhận stream file ảnh nhị phân gây nghẽn RAM và băng thông, backend chỉ cung cấp endpoint `GET /api/products/upload-signature`.
* Endpoint tạo ra chữ ký mã hóa bằng thuật toán `HMAC-SHA1` kết hợp cùng `timestamp` và `CLOUDINARY_API_SECRET`. Ứng dụng di động nhận chữ ký và tải ảnh thẳng lên máy chủ Cloudinary CDN.

### 5️⃣ Xử lý Giao dịch Hóa đơn & Trừ kho Nguyên tử (`sellerName`)
* **Tự động sinh mã hóa đơn:** Khởi tạo mã phiếu giao dịch độc nhất (ví dụ: `HD-1741678901234`).
* **Trừ tồn kho nguyên tử (Atomic Inventory Deduction):** Sử dụng các toán tử MongoDB để trừ chính xác số lượng tồn kho theo từng món hàng trong đơn.
* **Minh bạch danh tính người bán:** Mỗi hóa đơn lưu trữ trường `sellerName` phản ánh chính xác tài khoản thu ngân lập đơn, ngăn chặn tuyệt đối tình trạng gán cứng "admin" cho mọi giao dịch.

### 6️⃣ Trung tâm Báo cáo Doanh thu & Thống kê Tài chính
* **Endpoint `/api/invoices/dashboard/analytics`:**
  - Tổng doanh thu theo hôm nay, tuần này và tháng này.
  - Lợi nhuận gộp ước tính (`Doanh thu - Tổng giá vốn các mặt hàng đã bán`).
  - Tổng số lượng đơn hàng đã giao dịch.
  - Bảng thống kê doanh thu theo từng ngày phục vụ vẽ biểu đồ đường (Line Chart).
  - Xếp hạng Top 5 mặt hàng bán chạy nhất cửa hàng.

### 7️⃣ Bộ Lọc Giới hạn Tần suất Yêu cầu (Throttler Rate Limit Guard)
* **Bảo vệ Throttler:** Giới hạn mỗi địa chỉ IP chỉ được phép gửi tối đa 100 requests trong vòng 60 giây (cấu hình linh hoạt qua `THROTTLE_TTL` và `THROTTLE_LIMIT`), chặn đứng các cuộc tấn công DDoS và brute-force vào hệ thống bán lẻ.

### 8️⃣ Tài liệu Hóa Tự động OpenAPI (Swagger UI Interactive Docs)
* **Tài liệu Swagger OpenAPI:** Tự động tạo tài liệu kiểm thử tương tác tại `http://localhost:3001/api/docs` với đầy đủ schemas DTO, Bearer Auth và mô tả chi tiết từng endpoint.

---

## 📚 Danh sách API Endpoints

Tất cả các route được quản trị theo tiền tố `/api`:

### 1. Xác thực & Tài khoản người dùng (`/api/auth`)
* **Đăng ký tài khoản:** `POST /api/auth/register` (Public)
  - **Body (JSON):**
    ```json
    {
      "username": "cashier1",
      "password": "Password123!",
      "role": "CASHIER"
    }
    ```
* **Đăng nhập hệ thống:** `POST /api/auth/login` (Public)
  - **Body (JSON):**
    ```json
    {
      "username": "cashier1",
      "password": "Password123!"
    }
    ```
  - **Response (JSON):**
    ```json
    {
      "access_token": "eyJhbGciOiJIUzI1Ni...",
      "user": {
        "id": "65f123...",
        "username": "cashier1",
        "role": "CASHIER"
      }
    }
    ```
* **Lấy thông tin cá nhân:** `GET /api/auth/profile` (Bearer Auth)

---

### 2. Quản lý Sản phẩm & Kho hàng (`/api/products`)
* **Lấy danh sách sản phẩm:** `GET /api/products` (Bearer Auth)
  - **Query parameters:** `page=1`, `limit=20`, `search=pepsi`, `categoryId=65f...`
* **Lọc hàng sắp hết kho:** `GET /api/products/low-stock` (Bearer Auth)
* **Cấp chữ ký số Cloudinary:** `GET /api/products/upload-signature` (Bearer Auth)
  - **Response (JSON):**
    ```json
    {
      "timestamp": 1741678900,
      "signature": "a1b2c3d4e5f6...",
      "apiKey": "123456789012345",
      "cloudName": "your_cloud_name"
    }
    ```
* **Thêm sản phẩm mới:** `POST /api/products` (Bearer Auth)
* **Cập nhật sản phẩm:** `PATCH /api/products/:id` (Bearer Auth)
* **Xóa mềm sản phẩm:** `DELETE /api/products/:id` (Bearer Auth)

---

### 3. Quản lý Danh mục Ngành hàng (`/api/categories`)
* **Lấy tất cả danh mục:** `GET /api/categories` (Bearer Auth)
* **Thêm danh mục mới:** `POST /api/categories` (Bearer Auth)
  - **Body (JSON):** `{ "name": "Bánh kẹo & Snack" }`
* **Cập nhật danh mục:** `PATCH /api/categories/:id` (Bearer Auth)
* **Xóa danh mục:** `DELETE /api/categories/:id` (Bearer Auth)

---

### 4. Quản lý Hóa đơn Bán lẻ (`/api/invoices`)
* **Lấy lịch sử hóa đơn:** `GET /api/invoices` (Bearer Auth)
* **Xem chi tiết hóa đơn:** `GET /api/invoices/:id` (Bearer Auth)
* **Tạo hóa đơn bán hàng:** `POST /api/invoices` (Bearer Auth)
  - **Body (JSON):**
    ```json
    {
      "items": [
        {
          "productId": "65f123...",
          "name": "Nước tăng lực Redbull 250ml",
          "price": 12000,
          "costPrice": 9500,
          "quantity": 2,
          "unit": "Lon",
          "total": 24000
        }
      ],
      "totalAmount": 24000,
      "customerCash": 50000,
      "changeAmount": 26000,
      "paymentMethod": "CASH",
      "sellerName": "Nguyễn Văn A"
    }
    ```
* **Xóa hóa đơn:** `DELETE /api/invoices/:id` (Admin Only)

---

### 5. Báo cáo Doanh thu & Thống kê Dashboard (`/api/invoices/dashboard`)
* **Lấy số liệu tài chính tổng hợp:** `GET /api/invoices/dashboard/analytics` (Admin Only)
  - **Response (JSON):**
    ```json
    {
      "todayRevenue": 1520000,
      "weekRevenue": 8450000,
      "monthRevenue": 32600000,
      "grossProfit": 7200000,
      "totalInvoices": 142,
      "dailyStats": [
        { "date": "10/03", "revenue": 1200000 },
        { "date": "11/03", "revenue": 1520000 }
      ],
      "topSellingProducts": [
        { "name": "Mì Hảo Hảo Tôm Chua Cay", "totalQty": 85, "revenue": 382500 }
      ]
    }
    ```

---

## 🚀 Cài đặt & Khởi chạy

### 1️⃣ Yêu cầu hệ thống (Prerequisites)

* **Node.js:** `>= 20.0.0` (Khuyến nghị **Node.js 20.x** hoặc **22.x LTS**)
* **Package Manager:** `npm` (>= 9), `yarn`, `pnpm` hoặc `bun`
* **Cơ sở dữ liệu:** Cụm **MongoDB Atlas** hoặc cài đặt **MongoDB Community Server** cục bộ.

### 2️⃣ Clone Repository & Cài đặt Dependencies

```bash
git clone https://github.com/hvt299/Grocery-Store-Backend.git
cd Grocery-Store-Backend
npm install
```

### 3️⃣ Cấu hình biến môi trường (.env)

Tạo file `.env` tại thư mục gốc của dự án `Grocery-Store-Backend/`:

```env
# Cổng chạy ứng dụng Backend
PORT=3001

# Chuỗi kết nối Cơ sở dữ liệu MongoDB Atlas (hoặc mongodb://localhost:27017/grocery_store)
MONGO_URI=mongodb+srv://<USERNAME>:<PASSWORD>@cluster0.koczy0a.mongodb.net/grocery_store?appName=Cluster0

# Khóa bí mật ký số JWT & Thời hạn phiên làm việc
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRATION=1d

# Cấu hình tài khoản Cloudinary (Ký số HMAC upload ảnh trực tiếp)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Giới hạn tần suất truy vấn (Throttler Rate Limit)
THROTTLE_TTL=60000
THROTTLE_LIMIT=100

# Ngưỡng cảnh báo sản phẩm sắp hết hàng (Low-stock threshold)
LOW_STOCK_THRESHOLD=5

# Cấu hình CORS cho phép truy cập
CORS_ORIGIN=*
```

### 4️⃣ Các lệnh thực thi (NPM Scripts)

```bash
# Khởi chạy môi trường phát triển (Hot-reload / Watch Mode)
npm run start:dev

# Biên dịch dự án ra mã JavaScript thuần (dist/)
npm run build

# Khởi chạy bản production sau khi build
npm run start:prod

# Kiểm tra cú pháp và định dạng mã nguồn (ESLint & Prettier)
npm run lint
npm run format
```

Sau khi khởi chạy thành công, truy cập tài liệu giao diện tương tác **Swagger OpenAPI** tại:
```text
http://localhost:3001/api/docs
```

### 5️⃣ Chạy Kiểm thử Tự động (Testing)

```bash
# Chạy bộ Unit Tests
npm run test

# Chạy kiểm thử theo dõi liên tục
npm run test:watch

# Xuất báo cáo độ bao phủ mã nguồn (Coverage Report)
npm run test:cov
```

---

## 📂 Cấu trúc Thư mục Dự án

```text
Grocery-Store-Backend/
├── src/
│   ├── auth/                      # Module xác thực người dùng & phân quyền JWT
│   │   ├── auth.controller.ts     # Tiếp nhận các yêu cầu Đăng ký, Đăng nhập, Profile
│   │   ├── auth.module.ts         # Đăng ký JwtModule và PassportModule
│   │   ├── auth.service.ts        # Kiểm tra mật khẩu (Bcrypt) và sinh JWT Token
│   │   ├── dto/                   # Data Transfer Objects (LoginDto, RegisterDto)
│   │   └── strategies/            # Passport JWT Strategy trích xuất Bearer Token
│   ├── categories/                # Module quản lý danh mục ngành hàng
│   │   ├── categories.controller.ts
│   │   ├── categories.module.ts
│   │   ├── categories.service.ts
│   │   └── schemas/category.schema.ts # Định nghĩa cấu trúc Schema Category
│   ├── events/                    # Module WebSockets Gateway Realtime
│   │   ├── events.gateway.ts      # Khởi tạo Socket.io Gateway, phát sóng dữ liệu
│   │   └── events.module.ts
│   ├── invoices/                  # Module quản lý hóa đơn bán lẻ & Dashboard Analytics
│   │   ├── invoices.controller.ts # API xử lý đơn hàng và tính toán báo cáo
│   │   ├── invoices.module.ts
│   │   ├── invoices.service.ts    # Nghiệp vụ trừ kho, tính doanh thu & lợi nhuận
│   │   ├── dto/                   # CreateInvoiceDto (kèm sellerName)
│   │   └── schemas/invoice.schema.ts  # Cấu trúc Schema Invoice
│   ├── products/                  # Module quản lý sản phẩm, tồn kho & Cloudinary
│   │   ├── products.controller.ts # CRUD sản phẩm, cảnh báo low-stock, upload-signature
│   │   ├── products.module.ts
│   │   ├── products.service.ts    # Logic nghiệp vụ sản phẩm, ký số HMAC Cloudinary
│   │   ├── dto/                   # CreateProductDto, UpdateProductDto
│   │   └── schemas/product.schema.ts  # Cấu trúc Schema Product
│   ├── users/                     # Module người dùng nội bộ
│   │   ├── users.module.ts
│   │   ├── users.service.ts       # Tìm kiếm và khởi tạo tài khoản quản lý / thu ngân
│   │   └── schemas/user.schema.ts # Cấu trúc Schema User (roles: ADMIN, CASHIER)
│   ├── app.controller.ts          # Root controller kiểm tra tình trạng server
│   ├── app.module.ts              # Root Module cấu hình Config, Mongoose & Throttler
│   ├── app.service.ts
│   └── main.ts                    # Điểm khởi động: Cấu hình CORS, Swagger UI & Port 3001
├── test/                          # Cấu hình kiểm thử tự động End-to-End
├── .env                           # File cấu hình biến môi trường
├── package.json                   # Danh mục thư viện phụ thuộc và scripts
└── tsconfig.json                  # Cấu hình trình biên dịch TypeScript
```

---

## 🔗 Kết nối Mobile App POS

Dịch vụ Backend này được thiết kế để phục vụ trực tiếp cho ứng dụng **Grocery Store POS Mobile App** (React Native / Expo):
* Cấu hình CORS đã được mở mặc định trong `src/main.ts` (`app.enableCors()`).
* Đảm bảo cấu hình biến môi trường trên Mobile App trỏ về đúng IP máy chủ: `EXPO_PUBLIC_API_URL=http://<IP_MAY_TINH>:3001`.

---

## 👨‍💻 Tác giả

Phát triển bởi **Mr.T (hvt299)**  
GitHub: [https://github.com/hvt299](https://github.com/hvt299)

## Cấu trúc Thư mục và Hướng dẫn Chạy Trang Web

### Thư mục và Vai Trò:
- **public/**: Chứa các file tĩnh như CSS, JavaScript, hình ảnh.
- **views/**: Chứa các file EJS để render giao diện người dùng.
- **models/**: Chứa các file model để tương tác với cơ sở dữ liệu.
- **config/**: Chứa các file cấu hình, bao gồm cấu hình cơ sở dữ liệu.
- **routes/**: Chứa các file định tuyến cho ứng dụng.

### Yêu Cầu:
- Node.js
- npm
- Cơ sở dữ liệu PostgreSQL

### Hướng dẫn Thiết lập:
1. **Clone repository từ GitHub**:
   ```bash
   git clone https://github.com/hotelmanageweproject/Hotel_Manager_Web.git
   ```
2. **Cài đặt Node.js và npm**:
   - Tải và cài đặt từ [Node.js](https://nodejs.org/).

3. **Di chuyển vào thư mục root của dự án**:
   ```bash
   cd Hotel_Manager_Web 
   ```

4. **Cài đặt dependencies**:
   ```bash
   npm i
   ```

5. **Cấu hình cơ sở dữ liệu**:
   - Tạo cơ sở dữ liệu PostgreSQL và cập nhật thông tin kết nối trong `config/db.js`.
   - Chạy các file SQL trong thư mục `Database design` để tạo các bảng và chức năng cần thiết.

6. **Chạy ứng dụng**:
   ```bash
   node app.js
   ```

7. **Truy cập trang web**:
   - Mở trình duyệt và vào địa chỉ `http://localhost:3000`.

### Cấu hình Cơ sở Dữ liệu:
- Tạo cơ sở dữ liệu PostgreSQL:
   ```sql
   CREATE DATABASE your_database_name;
   ```
- Cập nhật thông tin kết nối trong `config/db.js`:
   ```javascript
   module.exports = {
     user: 'your_db_user',
     host: 'your_db_host',
     database: 'your_database_name',
     password: 'your_db_password',
     port: 5432,
   };
   ```
   Data gen for Database: [Google Drive](https://drive.google.com/drive/folders/1_U9xc79UQ5C7Sfb7EuXeyTOlTEvR6tFX).
### Lưu ý:
- Đảm bảo rằng bạn đã cập nhật đúng thông tin kết nối cơ sở dữ liệu trong `config/db.js`.
- Kiểm tra và đảm bảo rằng các bảng trong cơ sở dữ liệu đã được tạo đúng theo các truy vấn trong các file model.

# Sistem Manajemen Karyawan - Backend Microservices

## 1. Gambaran Umum

Proyek ini adalah sistem backend untuk aplikasi Manajemen Karyawan yang dibangun dengan arsitektur microservices menggunakan Node.js, Express, dan Prisma. Sistem ini terdiri dari sebuah API Gateway sebagai pintu masuk tunggal dan beberapa layanan (services) yang memiliki tugas spesifik.

## 2. Arsitektur

Arsitektur sistem ini dirancang untuk memisahkan setiap fungsi utama ke dalam layanan mandiri, yang berkomunikasi melalui API Gateway.

```
+------------------+      +-------------------------+
|      Client      |----->|   API Gateway (3000)    |
+------------------+      +-------------------------+
                             |      |      |
                             |      |      |
+----------------------------+      |      +-----------------------------+
|                                   |                                    |
v                                   v                                    v
+-------------------------+   +-------------------------+   +----------------------------+
|   Auth Service (3001)   |   | Employee Service (3002) |   |  Attendance Service (3003) |
+-------------------------+   +-------------------------+   +----------------------------+
| - Registrasi & Login    |   | - CRUD Profil Karyawan  |   | - CRUD Absensi             |
| - Manajemen Token (JWT) |   | - Data Pribadi          |   | - Upload Foto Absensi      |
+-------------------------+   +-------------------------+   +----------------------------+

```

### Deskripsi Layanan:
- **API Gateway**: Pintu masuk utama untuk semua permintaan dari klien. Bertanggung jawab untuk otentikasi, otorisasi, rate limiting, dan routing ke layanan yang sesuai.
- **Auth Service**: Mengelola semua logika terkait otentikasi, termasuk registrasi pengguna, login, dan pembuatan token JWT.
- **Employee Service**: Mengelola data master karyawan, seperti profil, data pribadi, dan informasi pekerjaan.
- **Attendance Service**: Mengelola data absensi karyawan, termasuk check-in, check-out, dan riwayat absensi.

## 3. Prasyarat

Sebelum memulai, pastikan Anda telah menginstal perangkat lunak berikut:
- [Node.js](https://nodejs.org/) (v18 atau lebih baru)
- [NPM](https://www.npmjs.com/) (biasanya terinstal bersama Node.js)
- [MySQL](https://www.mysql.com/) atau database lain yang didukung Prisma.

## 4. Instalasi & Konfigurasi

Ikuti langkah-langkah berikut untuk menjalankan proyek ini secara lokal.

### a. Clone Repository
```bash
git clone https://github.com/MuhLibri/BE-Test-Dexa.git
cd BE-Test-Dexa
```

### b. Konfigurasi Setiap Layanan
Anda perlu melakukan instalasi dependensi dan konfigurasi environment untuk setiap layanan (`api-gateway`, `auth-service`, `employee-service`, `attendance-service`).

**Ulangi langkah-langkah berikut untuk setiap folder layanan:**

1.  **Masuk ke direktori layanan:**
    ```bash
    cd <nama-layanan> 
    # Contoh: cd api-gateway
    ```

2.  **Instal dependensi:**
    ```bash
    npm install
    ```

3.  **Buat file `.env`:**
    Buat file baru bernama `.env` dan salin konten dari template di bawah sesuai dengan layanan yang sedang dikonfigurasi.

4.  **Setup Database (untuk `auth-service`, `employee-service`, `attendance-service`):**
    Jalankan migrasi Prisma untuk membuat skema database.
    ```bash
    npx prisma migrate dev --name init
    ```
    Jika layanan memiliki seeder, jalankan perintah berikut:
    ```bash
    npx prisma db seed
    ```

5.  **Kembali ke direktori root:**
    ```bash
    cd ..
    ```

---

### c. Template File `.env`

#### `api-gateway/.env`
```env
PORT=5000
FRONTEND_URL=http://localhost:3000
AUTH_SERVICE_URL=http://localhost:3001
EMPLOYEE_SERVICE_URL=http://localhost:3002
ATTENDANCE_SERVICE_URL=http://localhost:3003

# Kunci rahasia untuk komunikasi antar service
GATEWAY_SECRET_KEY=your-strong-gateway-secret
# Kunci rahasia untuk JWT
JWT_SECRET=your-strong-jwt-secret
```

#### `auth-service/.env`
```env
PORT=3001
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE_AUTH?schema=public"
GATEWAY_SECRET_KEY=your-strong-gateway-secret
JWT_SECRET=your-strong-jwt-secret
```

#### `employee-service/.env`
```env
PORT=3002
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE_EMPLOYEE?schema=public"
GATEWAY_SECRET_KEY=your-strong-gateway-secret
```

#### `attendance-service/.env`
```env
PORT=3003
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE_ATTENDANCE?schema=public"
GATEWAY_SECRET_KEY=your-strong-gateway-secret
```

---

## 5. Menjalankan Aplikasi

Untuk menjalankan seluruh sistem, Anda perlu membuka terminal terpisah untuk setiap layanan.

1.  Buka 4 terminal.
2.  Di setiap terminal, navigasikan ke folder layanan yang berbeda (`api-gateway`, `auth-service`, `employee-service`, `attendance-service`).
3.  Di setiap terminal, jalankan perintah:
    ```bash
    npm start
    ```

Setelah semua layanan berjalan, API Gateway akan dapat diakses di `http://localhost:5000`.

## 6. Dokumentasi API

Semua permintaan harus ditujukan ke API Gateway.

### Otentikasi
| Method | Endpoint               | Deskripsi                                       | Akses      |
|--------|------------------------|-------------------------------------------------|------------|
| `POST` | `/auth/login`          | Login untuk mendapatkan token (disimpan di cookie). | Publik     |
| `POST` | `/auth/logout`         | Menghapus token sesi dari cookie.               | Terotentikasi |
| `GET`  | `/auth/check-session`  | Memverifikasi apakah sesi login masih valid.    | Terotentikasi |

**Body untuk `/auth/login`:**
```json
{
  "email": "hr@example.com",
  "password": "password123"
}
```

### Karyawan (Employee)
| Method | Endpoint                  | Deskripsi                                       | Akses      |
|--------|---------------------------|-------------------------------------------------|------------|
| `POST` | `/employees`              | Menambah karyawan baru (aggregator endpoint).   | HR         |
| `GET`  | `/employees`              | Mendapatkan daftar semua karyawan.              | HR         |
| `GET`  | `/employees/:id`          | Mendapatkan detail satu karyawan berdasarkan ID.| HR         |
| `PUT`  | `/employees/:id`          | Memperbarui data karyawan.                      | HR         |
| `DELETE`| `/employees/:id`          | Menghapus data karyawan.                        | HR         |

**Body untuk `POST /employees`:**
```json
{
    "employeeId": "EMP003",
    "email": "jane.doe@example.com",
    "password": "password123",
    "fullName": "Jane Doe",
    "role": "EMPLOYEE", // Opsional, default 'EMPLOYEE'
    "identityNumber": "3201234567890003",
    "gender": "FEMALE",
    "position": "Software Engineer",
    "division": "IT",
    "phone": "081234567892",
    "dateOfBirth": "1995-05-15T00:00:00.000Z",
    "placeOfBirth": "Bandung",
    "address": "Jl. Merdeka No. 10",
    "status": "ACTIVE" // Opsional, default 'ACTIVE'
}
```

### Absensi (Attendance)
| Method | Endpoint                  | Deskripsi                                       | Akses      |
|--------|---------------------------|-------------------------------------------------|------------|
| `POST` | `/attendances`            | Karyawan melakukan absensi (check-in/check-out).| Karyawan   |
| `GET`  | `/attendances`            | Mendapatkan riwayat absensi diri sendiri.       | Karyawan   |
| `GET`  | `/attendances/all`        | Mendapatkan riwayat absensi semua karyawan.     | HR         |
| `GET`  | `/attendances/uploads/:filename` | Mengakses file gambar absensi.           | HR         |

**Body untuk `/attendances` (check-in):**
```json
{
  "type": "IN",
  "latitude": -6.200000,
  "longitude": 106.816666
}
```
*   Untuk `check-in`, sertakan `photo` sebagai `multipart/form-data`.
*   Untuk `check-out`, cukup kirim `type: "OUT"`.
```json
{
  "type": "OUT"
}
```

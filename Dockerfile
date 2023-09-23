# Gunakan image Ubuntu sebagai dasar
FROM ubuntu

# Install dependencies yang dibutuhkan
RUN apt-get update && apt-get install -y \
    curl \
    nodejs \
    npm

# Buat direktori untuk aplikasi Anda
WORKDIR /app

# Salin aplikasi Node.js Express Anda ke dalam container
COPY . .

# Install modul Node.js
RUN npm install

# Ekspor port yang akan digunakan oleh aplikasi Anda (ganti sesuai dengan port aplikasi Anda)
EXPOSE 8080

USER 1001

# Jalankan aplikasi Anda
CMD ["npm", "start"]

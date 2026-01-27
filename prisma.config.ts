import { defineConfig } from "prisma/config";

// DATABASE_URL が設定されていない場合はダミーURLを使用（ビルド時のみ）
const databaseUrl = process.env["DATABASE_URL"] || "postgresql://placeholder:placeholder@localhost:5432/placeholder";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: databaseUrl,
  },
});

# thesislib

论文期刊库（MVP）：登录认证、PDF 上传/下载、管理员审核、状态追踪、热门论文、分类检索。

## Local Dev

```bash
pnpm install
cp .env.example .env
pnpm prisma migrate dev
pnpm dev
```

Open: http://localhost:3000

## Docker (recommended for deployment testing)

```bash
cp .env.example .env
docker compose up -d --build
```

- App: http://localhost:3000
- Data persistence:
  - `./data` → SQLite db
  - `./uploads` → uploaded PDFs

## Notes

- `ADMIN_EMAIL`：用该邮箱注册的账号会自动成为管理员（`isAdmin=true`）。
- 公共列表只展示 `APPROVED` 的论文；作者/管理员可以在“我的论文”里看到自己的状态。

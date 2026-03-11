"use client";

export default function UploadPaperForm({
  categories,
}: {
  categories: { id: string; name: string; slug: string }[];
}) {
  return (
    <form className="space-y-3 rounded border border-zinc-200 bg-white p-4">
      <div className="text-sm text-zinc-600">上传后可在“我的论文”查看状态。</div>

      <input className="w-full rounded border p-2" name="title" placeholder="论文标题" />

      <div className="space-y-1">
        <div className="text-sm text-zinc-600">选择分类（可选）</div>
        <select className="w-full rounded border p-2" name="categorySelect" defaultValue="">
          <option value="">（不选）</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.name} ({c.slug})
            </option>
          ))}
        </select>
        <input className="w-full rounded border p-2" name="category" placeholder="或手动输入分类名（会自动创建）" />
      </div>

      <input className="w-full" name="file" type="file" accept="application/pdf" />

      <button
        className="rounded bg-black px-4 py-2 text-white"
        type="button"
        onClick={async () => {
          const form = document.querySelector("form") as HTMLFormElement | null;
          if (!form) return;
          const fd = new FormData(form);
          const res = await fetch("/api/papers/upload", { method: "POST", body: fd });
          const json = await res.json().catch(() => ({}));
          if (res.ok && json.paperId) window.location.href = `/app/papers?mine=1`;
          else {
            const err = String(json.error || res.status);
            const map: Record<string, string> = {
              missing_title: "请填写标题",
              missing_file: "请选择 PDF 文件",
              only_pdf: "只支持 PDF",
              unauthorized: "请先登录",
            };
            const msg = map[err] || (err.startsWith("file_too_large") ? "文件太大" : err);
            alert(`上传失败：${msg}`);
          }
        }}
      >
        提交上传
      </button>
    </form>
  );
}

"use client";
import { useTranslations } from "next-intl";

export default function UploadPaperForm({
  categories,
}: {
  categories: { id: string; name: string; slug: string }[];
}) {
  const t = useTranslations("Upload");
  return (
    <form
      className="space-y-3 rounded border border-zinc-200 bg-white p-4"
      onSubmit={async (e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const res = await fetch("/api/papers/upload", { method: "POST", body: fd });
        const json = await res.json().catch(() => ({}));
        if (res.ok && json.paperId) window.location.href = `/app/papers?mine=1`;
        else {
          const err = String(json.error || res.status);
          const map: Record<string, string> = {
            missing_title: t("Please enter a title"),
            missing_file: t("Please select a PDF file"),
            only_pdf: t("Only PDF is supported"),
            unauthorized: t("Please login first"),
          };
          const msg = map[err] || (err.startsWith("file_too_large") ? t("File is too large") : err);
          alert(`${t("Upload failed:")} ${msg}`);
        }
      }}
    >
      <div className="text-sm text-zinc-600">{t("You can check the status in 'My Papers' after uploading.")}</div>

      <input className="w-full rounded border border-slate-300 p-2" name="title" placeholder={t("Paper Title")} required />

      <div className="space-y-1">
        <div className="text-sm text-zinc-600">{t("Select Category (Optional)")}</div>
        <select className="w-full rounded border border-slate-300 p-2" name="categorySelect" defaultValue="">
          <option value="">{t("(None)")}</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.name} ({c.slug})
            </option>
          ))}
        </select>
        <input className="w-full rounded border border-slate-300 p-2" name="category" placeholder={t("Or type category name (auto-created)")} />
      </div>

      <input className="w-full" name="file" type="file" accept="application/pdf" required />

      <button
        className="bg-blue-900 text-white hover:bg-blue-800 px-6 py-2 rounded-md font-medium transition-colors w-full"
        type="submit"
      >
        {t("Submit Paper")}
      </button>
    </form>
  );
}

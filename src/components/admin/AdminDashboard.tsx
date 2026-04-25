"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Plus, Upload, Trash2, Save, LogOut, Heart, Sparkles } from "lucide-react";
import type { Product, SiteContent, CategoryDisplayOption } from "@/lib/cms";

function normalizeCategoryId(value: string) {
  return value
    .trim()
    .replace(/\s+/g, "-")
    .toLocaleLowerCase("tr-TR")
    .replace(/[^\p{L}\p{N}-]/gu, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function blankProduct(): Product {
  return {
    id: crypto.randomUUID(),
    slug: "",
    name: "",
    category: "buket",
    price: 0,
    description: "",
    images: [],
    inStock: true,
  };
}

export default function AdminDashboard({
  initialProducts,
  initialContent,
}: {
  initialProducts: Product[];
  initialContent: SiteContent;
}) {
  const firstProduct = initialProducts[0] ?? null;
  const initialHomeHeroImage = initialContent.home.heroImage ?? "";
  const [products, setProducts] = useState(initialProducts);
  const [selectedId, setSelectedId] = useState(firstProduct?.id ?? "new");
  const [draft, setDraft] = useState<Product>(firstProduct ? { ...firstProduct, images: [...firstProduct.images] } : blankProduct());
  const [contentDraft, setContentDraft] = useState(initialContent);
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const [savingCategories, setSavingCategories] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [pendingPreviewUrl, setPendingPreviewUrl] = useState<string | null>(null);

  async function fetchJsonWithTimeout<T>(input: RequestInfo | URL, init?: RequestInit, timeoutMs = 15000): Promise<{ response: Response; data: T | null }> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(input, { ...init, signal: controller.signal });
      let data: T | null = null;
      try {
        data = (await response.json()) as T;
      } catch {
        data = null;
      }
      return { response, data };
    } finally {
      clearTimeout(timeout);
    }
  }

  function selectProduct(nextId: string, list = products) {
    setSelectedId(nextId);
    if (nextId === "new") {
      setDraft(blankProduct());
      return;
    }
    const selected = list.find((product) => product.id === nextId);
    setDraft(selected ? { ...selected, images: [...selected.images] } : blankProduct());
  }

  function syncAfterListChange(nextList: Product[], preferredId: string) {
    setProducts(nextList);
    selectProduct(preferredId, nextList);
  }

  const selectedProduct = useMemo(
    () => (selectedId === "new" ? null : products.find((product) => product.id === selectedId) ?? null),
    [products, selectedId],
  );

  async function saveProduct() {
    setSaving(true);
    setStatus("Ürün kaydediliyor...");
    try {
      const { response, data } = await fetchJsonWithTimeout<{ message?: string; products?: Product[] }>("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "save", product: draft }),
      });

      if (!response.ok) {
        setStatus(data?.message ?? "Ürün kaydedilemedi.");
        return;
      }

      syncAfterListChange((data?.products ?? []) as Product[], draft.id);
      setStatus("Ürün kaydedildi.");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        setStatus("Kaydetme isteği zaman aşımına uğradı. Lütfen tekrar deneyin.");
        return;
      }
      setStatus("Bağlantı hatası nedeniyle ürün kaydedilemedi.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteCurrentProduct() {
    if (!selectedProduct) {
      return;
    }

    setSaving(true);
    setStatus("Ürün siliniyor...");
    try {
      const { response, data } = await fetchJsonWithTimeout<{ message?: string; products?: Product[] }>("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", productId: selectedProduct.id }),
      });

      if (!response.ok) {
        setStatus(data?.message ?? "Ürün silinemedi.");
        return;
      }

      const nextProducts = data?.products ?? [];
      syncAfterListChange(nextProducts, nextProducts[0]?.id ?? "new");
      setStatus("Ürün silindi.");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        setStatus("Silme isteği zaman aşımına uğradı. Lütfen tekrar deneyin.");
        return;
      }
      setStatus("Bağlantı hatası nedeniyle ürün silinemedi.");
    } finally {
      setSaving(false);
    }
  }

  async function uploadImage(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const { response, data } = await fetchJsonWithTimeout<{ message?: string; url?: string }>(
        "/api/admin/upload",
        {
          method: "POST",
          body: formData,
        },
        20000,
      );

      if (!response.ok) {
        setStatus(data?.message ?? "Görsel yüklenemedi.");
        return;
      }

      if (!data?.url) {
        setStatus("Görsel yanıtı alınamadı.");
        return;
      }

      setDraft((current) => ({ ...current, images: [...current.images, data.url as string] }));
      setStatus("Görsel eklendi.");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        setStatus("Görsel yükleme zaman aşımına uğradı. Lütfen tekrar deneyin.");
        return;
      }
      setStatus("Bağlantı hatası nedeniyle görsel yüklenemedi.");
    }
  }

  function selectPendingFile(file: File | null) {
    if (pendingPreviewUrl) {
      URL.revokeObjectURL(pendingPreviewUrl);
    }
    if (!file) {
      setPendingFile(null);
      setPendingPreviewUrl(null);
      return;
    }
    setPendingFile(file);
    setPendingPreviewUrl(URL.createObjectURL(file));
  }

  async function uploadPendingFile() {
    if (!pendingFile) {
      return;
    }
    await uploadImage(pendingFile);
    selectPendingFile(null);
  }

  async function saveContent() {
    setSaving(true);
    setStatus("İçerik kaydediliyor...");
    try {
      const { response, data } = await fetchJsonWithTimeout<{ message?: string; content?: SiteContent }>("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: contentDraft }),
      });

      if (!response.ok) {
        setStatus(data?.message ?? "İçerik kaydedilemedi.");
        return;
      }

      if (data?.content) {
        setContentDraft(data.content);
      }
      setStatus("İçerik kaydedildi.");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        setStatus("Kaydetme isteği zaman aşımına uğradı. Lütfen tekrar deneyin.");
        return;
      }
      setStatus("Bağlantı hatası nedeniyle içerik kaydedilemedi.");
    } finally {
      setSaving(false);
    }
  }

  async function saveCategoriesOnly() {
    setSavingCategories(true);
    setStatus("Kategoriler kaydediliyor...");
    try {
      const { response: currentResponse, data: currentData } = await fetchJsonWithTimeout<{ message?: string; content?: SiteContent }>(
        "/api/admin/content",
      );

      if (!currentResponse.ok || !currentData?.content) {
        setStatus(currentData?.message ?? "Kategoriler kaydedilemedi.");
        return;
      }

      const mergedContent = {
        ...currentData.content,
        home: {
          ...currentData.content.home,
          catalogFilters: contentDraft.home.catalogFilters,
          showcaseCategories: contentDraft.home.showcaseCategories,
        },
      };

      const { response: saveResponse, data: saveData } = await fetchJsonWithTimeout<{ message?: string; content?: SiteContent }>(
        "/api/admin/content",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: mergedContent }),
        },
      );

      if (!saveResponse.ok) {
        setStatus(saveData?.message ?? "Kategoriler kaydedilemedi.");
        return;
      }

      if (saveData?.content) {
        setContentDraft(saveData.content);
      }
      setStatus("Kategoriler kaydedildi.");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        setStatus("Kategori kaydı zaman aşımına uğradı. Lütfen tekrar deneyin.");
        return;
      }
      setStatus("Bağlantı hatası nedeniyle kategoriler kaydedilemedi.");
    } finally {
      setSavingCategories(false);
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/giris";
  }

  function updateDisplayOption(
    key: "catalogFilters" | "showcaseCategories",
    index: number,
    next: Partial<CategoryDisplayOption>,
  ) {
    setContentDraft((current) => {
      const list = [...current.home[key]];
      const target = list[index];
      if (!target) {
        return current;
      }
      list[index] = { ...target, ...next };
      return { ...current, home: { ...current.home, [key]: list } };
    });
  }

  function addDisplayOption(key: "catalogFilters" | "showcaseCategories") {
    setContentDraft((current) => ({
      ...current,
      home: {
        ...current.home,
        [key]: [...current.home[key], { id: "yeni-kategori", label: "Yeni Kategori" }],
      },
    }));
  }

  function removeDisplayOption(key: "catalogFilters" | "showcaseCategories", index: number) {
    setContentDraft((current) => ({
      ...current,
      home: {
        ...current.home,
        [key]: current.home[key].filter((_, i) => i !== index),
      },
    }));
  }

  return (
    <div className="paper-stage min-h-screen">
      <Heart className="absolute left-[6%] top-[12%] hidden xl:block w-12 h-12 text-rose-200/35 animate-float-slow" />
      <Heart className="absolute right-[8%] top-[20%] hidden xl:block w-10 h-10 text-rose-200/30 animate-float-slower" />
      <Sparkles className="absolute left-[10%] bottom-[14%] hidden xl:block w-8 h-8 text-cream-50/35 animate-float-slow" />

      <div className="max-w-7xl mx-auto px-4 py-10 md:py-14 space-y-8 relative z-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 rounded-3xl paper-surface p-6 md:p-8">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-cream-50/70">Yönetim Paneli</p>
          <h1 className="text-4xl md:text-5xl font-bold text-cream-50 mt-2 tracking-tight" style={{ fontFamily: "var(--font-brand)" }}>
            {contentDraft.brand.name} Admin
          </h1>
          <p className="text-cream-50/75 mt-2">Ürünleri, görselleri ve site metinlerini buradan yönetebilirsin.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-sm text-cream-50/70 hidden md:block">{status}</div>
          <button onClick={logout} className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-cream-50 hover:bg-white/10">
            <LogOut className="w-4 h-4" /> Çıkış
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[320px_minmax(0,1fr)] gap-6 items-start">
        <aside className="rounded-3xl bg-white dark:bg-slate-900 p-5 md:p-6 border border-sage-100 dark:border-slate-800 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-2xl text-sage-800 dark:text-cream-50">Ürünler</h2>
            <button
              onClick={() => {
                selectProduct("new");
              }}
              className="inline-flex items-center gap-2 rounded-full bg-sage-800 text-cream-50 px-3 py-2 text-sm"
            >
              <Plus className="w-4 h-4" /> Yeni
            </button>
          </div>
          <div className="space-y-2 max-h-[65vh] overflow-auto pr-1">
            {products.map((product) => (
              <button
                key={product.id}
                onClick={() => selectProduct(product.id)}
                className={`w-full text-left rounded-2xl border px-4 py-3 transition-colors ${
                  selectedId === product.id
                    ? "border-sage-500 bg-sage-50 dark:bg-slate-800"
                    : "border-sage-100 dark:border-slate-800 hover:bg-sage-50 dark:hover:bg-slate-800"
                }`}
              >
                <div className="font-medium text-sage-800 dark:text-cream-50 truncate" title={product.name}>
                  {product.name}
                </div>
                <div className="text-sm text-sage-500 dark:text-sage-300 truncate" title={`${product.price} ₺ · ${product.category}`}>
                  {product.price} ₺ · {product.category}
                </div>
              </button>
            ))}
          </div>
        </aside>

        <section className="space-y-6">
          <div className="rounded-3xl bg-white dark:bg-slate-900 p-6 md:p-8 border border-sage-100 dark:border-slate-800 shadow-lg">
            <div className="flex items-center justify-between gap-3 mb-6">
              <h2 className="font-serif text-3xl text-sage-800 dark:text-cream-50">Ürün Düzenle</h2>
              <div className="flex items-center gap-2">
                <label className="inline-flex items-center gap-2 rounded-full border border-sage-200 dark:border-slate-700 px-4 py-2 text-sm cursor-pointer text-sage-700 dark:text-sage-200">
                  <Upload className="w-4 h-4" /> Dosya Seç
                  <input type="file" accept="image/*" className="hidden" onChange={(event) => selectPendingFile(event.target.files?.[0] ?? null)} />
                </label>
                {selectedProduct && (
                  <button onClick={deleteCurrentProduct} className="inline-flex items-center gap-2 rounded-full border border-rose-200 px-4 py-2 text-sm text-rose-500 hover:bg-rose-50">
                    <Trash2 className="w-4 h-4" /> Sil
                  </button>
                )}
              </div>
            </div>

            {pendingPreviewUrl && (
              <div className="mb-6 rounded-2xl border border-sage-200 dark:border-slate-700 bg-sage-50/60 dark:bg-slate-950 p-4">
                <p className="text-sm font-medium text-sage-800 dark:text-cream-50 mb-3">Yükleme Önizlemesi</p>
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  <div className="relative w-32 h-32 rounded-2xl overflow-hidden border border-sage-200 dark:border-slate-700">
                    <Image src={pendingPreviewUrl} alt="Seçilen görsel" fill sizes="128px" className="object-cover" unoptimized />
                  </div>
                  <div className="space-y-2 text-sm text-sage-600 dark:text-sage-300">
                    <p><span className="font-medium">Dosya:</span> {pendingFile?.name}</p>
                    <p><span className="font-medium">Boyut:</span> {pendingFile ? `${Math.round(pendingFile.size / 1024)} KB` : "-"}</p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      <button onClick={uploadPendingFile} className="inline-flex items-center gap-2 rounded-full bg-sage-800 text-cream-50 px-4 py-2 text-sm hover:bg-sage-900">
                        <Upload className="w-4 h-4" /> Bu Görseli Ekle
                      </button>
                      <button onClick={() => selectPendingFile(null)} className="inline-flex items-center gap-2 rounded-full border border-rose-200 text-rose-500 px-4 py-2 text-sm hover:bg-rose-50 dark:hover:bg-rose-950/30">
                        Vazgeç
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              <Input label="Ürün Adı" helper="Örn: Pastel Rüyası Buketi" value={draft.name} onChange={(value) => setDraft((current) => ({ ...current, name: value }))} />
              <Input label="Link Kısa Adı (Slug)" helper="Ürün linkinde görünür. Sadece küçük harf, sayı ve tire kullan: pastel-ruyasi-buket" value={draft.slug} onChange={(value) => setDraft((current) => ({ ...current, slug: value }))} />
              <Input
                label="Kategori ID"
                helper="Bu alan panelde yönettiğiniz kategori kimliğidir. Türkçe karakter kullanabilirsiniz (örn: saksı-çiçekleri)."
                value={draft.category}
                onChange={(value) => setDraft((current) => ({ ...current, category: normalizeCategoryId(value) }))}
              />
              <Input label="Fiyat (TL)" helper="Sadece sayı girin. Örn: 1250" type="number" value={String(draft.price)} onChange={(value) => setDraft((current) => ({ ...current, price: Number(value) }))} />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-sage-700 dark:text-sage-200 mb-2">Açıklama</label>
              <textarea
                value={draft.description}
                onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))}
                className="w-full min-h-36 rounded-2xl border border-sage-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-3 text-sage-800 dark:text-cream-50 outline-none focus:border-sage-500"
              />
            </div>

            <div className="mt-4 flex items-center gap-3">
              <label className="flex items-center gap-3 text-sage-700 dark:text-sage-200">
                <input type="checkbox" checked={draft.inStock} onChange={(event) => setDraft((current) => ({ ...current, inStock: event.target.checked }))} />
                Stokta
              </label>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-medium text-sage-800 dark:text-cream-50">Görseller</h3>
                  <p className="text-xs text-sage-500 dark:text-sage-300 mt-1">&quot;Görsel alanı ekle&quot; ile internetten bir görsel URL&apos;i yapıştırabilirsin. Her alanın sağındaki Sil ile kaldırabilirsin.</p>
                </div>
                <button onClick={() => setDraft((current) => ({ ...current, images: [...current.images, ""] }))} className="text-sm text-rose-500">
                  Görsel alanı ekle
                </button>
              </div>
              <div className="space-y-3">
                {draft.images.map((image, index) => (
                  <div key={`${index}-${image}`} className="rounded-2xl border border-sage-200 dark:border-slate-700 p-3 bg-sage-50/40 dark:bg-slate-950/70">
                    <div className="flex items-center gap-2">
                      <input
                        value={image}
                        onChange={(event) =>
                          setDraft((current) => {
                            const nextImages = [...current.images];
                            nextImages[index] = event.target.value;
                            return { ...current, images: nextImages };
                          })
                        }
                        placeholder="https://..."
                        className="w-full rounded-2xl border border-sage-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-3 text-sage-800 dark:text-cream-50 outline-none focus:border-sage-500"
                      />
                      <button
                        onClick={() =>
                          setDraft((current) => {
                            const nextImages = current.images.filter((_, i) => i !== index);
                            return { ...current, images: nextImages };
                          })
                        }
                        className="inline-flex items-center justify-center rounded-xl border border-rose-200 px-3 py-3 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                        aria-label="Görsel alanını sil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    {image && (
                      <div className="relative mt-3 w-20 h-20 rounded-xl overflow-hidden border border-sage-200 dark:border-slate-700">
                        <Image src={image} alt={`Görsel ${index + 1}`} fill sizes="80px" className="object-cover" unoptimized />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <button onClick={saveProduct} disabled={saving} className="mt-6 inline-flex items-center gap-2 rounded-full bg-sage-800 px-5 py-3 text-cream-50 font-medium hover:bg-sage-900 disabled:opacity-70">
              <Save className="w-4 h-4" /> {saving ? "Kaydediliyor..." : "Ürünü Kaydet"}
            </button>
          </div>

          <div className="rounded-3xl bg-white dark:bg-slate-900 p-6 md:p-8 border border-sage-100 dark:border-slate-800 shadow-lg space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-3xl text-sage-800 dark:text-cream-50">Kategoriler</h2>
              <p className="text-sm text-sage-500 dark:text-sage-300">Katalog ve vitrin kartlarını yönet</p>
            </div>
            <div className="grid xl:grid-cols-2 gap-5">
              <div className="rounded-2xl border border-sage-200 dark:border-slate-700 p-4 bg-sage-50/60 dark:bg-slate-950/70 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-semibold text-sage-800 dark:text-cream-50">Katalog Filtreleri</h4>
                  <button type="button" onClick={() => addDisplayOption("catalogFilters")} className="text-sm text-rose-500 font-medium">
                    + Ekle
                  </button>
                </div>
                <div className="space-y-2">
                  {contentDraft.home.catalogFilters.map((row, index) => (
                    <div key={`catalog-${index}`} className="grid grid-cols-1 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.25fr)_44px] gap-2">
                      <input
                        value={row.id}
                        onChange={(event) => updateDisplayOption("catalogFilters", index, { id: normalizeCategoryId(event.target.value) })}
                        placeholder="kategori-id"
                        className="min-w-0 rounded-xl border border-sage-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-sage-800 dark:text-cream-50"
                        autoComplete="off"
                      />
                      <input
                        value={row.label}
                        onChange={(event) => updateDisplayOption("catalogFilters", index, { label: event.target.value })}
                        placeholder="Görünen başlık"
                        className="min-w-0 rounded-xl border border-sage-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-sage-800 dark:text-cream-50"
                      />
                      <button
                        type="button"
                        onClick={() => removeDisplayOption("catalogFilters", index)}
                        className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-rose-200 p-0 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-sage-200 dark:border-slate-700 p-4 bg-sage-50/60 dark:bg-slate-950/70 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-semibold text-sage-800 dark:text-cream-50">Ana Sayfa Kategori Vitrini</h4>
                  <button type="button" onClick={() => addDisplayOption("showcaseCategories")} className="text-sm text-rose-500 font-medium">
                    + Ekle
                  </button>
                </div>
                <div className="space-y-2">
                  {contentDraft.home.showcaseCategories.map((row, index) => (
                    <div key={`showcase-${index}`} className="grid grid-cols-1 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.25fr)_44px] gap-2">
                      <input
                        value={row.id}
                        onChange={(event) => updateDisplayOption("showcaseCategories", index, { id: normalizeCategoryId(event.target.value) })}
                        placeholder="kategori-id"
                        className="min-w-0 rounded-xl border border-sage-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-sage-800 dark:text-cream-50"
                        autoComplete="off"
                      />
                      <input
                        value={row.label}
                        onChange={(event) => updateDisplayOption("showcaseCategories", index, { label: event.target.value })}
                        placeholder="Görünen başlık"
                        className="min-w-0 rounded-xl border border-sage-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-sage-800 dark:text-cream-50"
                      />
                      <button
                        type="button"
                        onClick={() => removeDisplayOption("showcaseCategories", index)}
                        className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-rose-200 p-0 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={saveCategoriesOnly}
                disabled={savingCategories}
                className="inline-flex items-center gap-2 rounded-full bg-sage-800 px-5 py-3 text-cream-50 font-medium hover:bg-sage-900 disabled:opacity-70"
              >
                <Save className="w-4 h-4" /> {savingCategories ? "Kaydediliyor..." : "Kategorileri Kaydet"}
              </button>
            </div>
          </div>

          <div className="rounded-3xl bg-white dark:bg-slate-900 p-6 md:p-8 border border-sage-100 dark:border-slate-800 shadow-lg space-y-6">
            <h2 className="font-serif text-3xl text-sage-800 dark:text-cream-50">Site Metinleri</h2>

            <div className="grid md:grid-cols-2 gap-4">
              <Input label="Marka Adı" value={contentDraft.brand.name} onChange={(value) => setContentDraft((current) => ({ ...current, brand: { ...current.brand, name: value } }))} />
              <Input label="Marka Sloganı" value={contentDraft.brand.tagline} onChange={(value) => setContentDraft((current) => ({ ...current, brand: { ...current.brand, tagline: value } }))} />
              <Input label="Hero Rozeti" value={contentDraft.home.heroBadge} onChange={(value) => setContentDraft((current) => ({ ...current, home: { ...current.home, heroBadge: value } }))} />
              <Input label="Hero Başlığı" value={contentDraft.home.heroTitle} onChange={(value) => setContentDraft((current) => ({ ...current, home: { ...current.home, heroTitle: value } }))} />
              <Input label="Hero Açıklaması" value={contentDraft.home.heroSubtitle} onChange={(value) => setContentDraft((current) => ({ ...current, home: { ...current.home, heroSubtitle: value } }))} />
              <Input label="Hero Birincil Buton" value={contentDraft.home.heroPrimaryCta} onChange={(value) => setContentDraft((current) => ({ ...current, home: { ...current.home, heroPrimaryCta: value } }))} />
              <Input label="Hero İkincil Buton" value={contentDraft.home.heroSecondaryCta} onChange={(value) => setContentDraft((current) => ({ ...current, home: { ...current.home, heroSecondaryCta: value } }))} />
              <Input label="Öne Çıkan Başlık" value={contentDraft.home.featuredTitle} onChange={(value) => setContentDraft((current) => ({ ...current, home: { ...current.home, featuredTitle: value } }))} />
              <Input label="Öne Çıkan Alt Metin" value={contentDraft.home.featuredSubtitle} onChange={(value) => setContentDraft((current) => ({ ...current, home: { ...current.home, featuredSubtitle: value } }))} />
              <Input label="Hakkımızda Etiketi" value={contentDraft.home.aboutKicker} onChange={(value) => setContentDraft((current) => ({ ...current, home: { ...current.home, aboutKicker: value } }))} />
              <Input label="Hakkımızda Blok Başlığı" value={contentDraft.home.aboutTitle} onChange={(value) => setContentDraft((current) => ({ ...current, home: { ...current.home, aboutTitle: value } }))} />
              <Input label="Hakkımızda Blok Açıklaması" value={contentDraft.home.aboutDescription} onChange={(value) => setContentDraft((current) => ({ ...current, home: { ...current.home, aboutDescription: value } }))} />
              <Input label="Hakkımızda Link Metni" value={contentDraft.home.aboutLink} onChange={(value) => setContentDraft((current) => ({ ...current, home: { ...current.home, aboutLink: value } }))} />
              <Input label="Hakkımızda Başlığı" value={contentDraft.about.title} onChange={(value) => setContentDraft((current) => ({ ...current, about: { ...current.about, title: value } }))} />
              <Input label="Hakkımızda Alt Metin" value={contentDraft.about.subtitle} onChange={(value) => setContentDraft((current) => ({ ...current, about: { ...current.about, subtitle: value } }))} />
              <Input label="Hakkımızda Giriş Metni" value={contentDraft.about.intro} onChange={(value) => setContentDraft((current) => ({ ...current, about: { ...current.about, intro: value } }))} />
              <Input label="Hakkımızda Kapak Görseli" value={contentDraft.about.heroImage} onChange={(value) => setContentDraft((current) => ({ ...current, about: { ...current.about, heroImage: value } }))} />
              <Input label="İletişim Başlığı" value={contentDraft.contact.title} onChange={(value) => setContentDraft((current) => ({ ...current, contact: { ...current.contact, title: value } }))} />
              <Input label="İletişim Alt Metin" value={contentDraft.contact.subtitle} onChange={(value) => setContentDraft((current) => ({ ...current, contact: { ...current.contact, subtitle: value } }))} />
              <Input label="Adres Başlığı" value={contentDraft.contact.addressLabel} onChange={(value) => setContentDraft((current) => ({ ...current, contact: { ...current.contact, addressLabel: value } }))} />
              <Input label="Adres" value={contentDraft.contact.address} onChange={(value) => setContentDraft((current) => ({ ...current, contact: { ...current.contact, address: value } }))} />
              <Input label="Instagram Başlığı" value={contentDraft.contact.instagramLabel} onChange={(value) => setContentDraft((current) => ({ ...current, contact: { ...current.contact, instagramLabel: value } }))} />
              <Input label="Instagram Kullanıcı Adı" value={contentDraft.contact.instagram} onChange={(value) => setContentDraft((current) => ({ ...current, contact: { ...current.contact, instagram: value } }))} />
              <Input label="E-Posta Başlığı" value={contentDraft.contact.emailLabel} onChange={(value) => setContentDraft((current) => ({ ...current, contact: { ...current.contact, emailLabel: value } }))} />
              <Input label="E-Posta" value={contentDraft.contact.email} onChange={(value) => setContentDraft((current) => ({ ...current, contact: { ...current.contact, email: value } }))} />
              <Input label="Harita Embed URL" value={contentDraft.contact.mapEmbed} onChange={(value) => setContentDraft((current) => ({ ...current, contact: { ...current.contact, mapEmbed: value } }))} />
              <Input label="Footer Metni" value={contentDraft.footer.description} onChange={(value) => setContentDraft((current) => ({ ...current, footer: { ...current.footer, description: value } }))} />
            </div>

            <div className="rounded-2xl border border-sage-200 dark:border-slate-700 p-4 md:p-5 bg-sage-50/50 dark:bg-slate-950/70 space-y-4">
              <div>
                <h3 className="font-serif text-2xl text-sage-800 dark:text-cream-50">Ana Ekran Arka Plan Görseli</h3>
                <p className="text-sm text-sage-500 dark:text-sage-300 mt-1">
                  Buradaki görsel ana sayfadaki üst bölümde ve Öne Çıkarılanlar&apos;a kadar kullanılan arka plandır.
                </p>
              </div>

              <Input
                label="Görsel URL"
                helper="URL'i değiştirince aşağıda önizleme anında güncellenir."
                value={contentDraft.home.heroImage}
                onChange={(value) => setContentDraft((current) => ({ ...current, home: { ...current.home, heroImage: value } }))}
              />

              <div className="relative w-full aspect-[16/7] rounded-2xl overflow-hidden border border-sage-200 dark:border-slate-700">
                <Image
                  src={contentDraft.home.heroImage || "/placeholder-flower.svg"}
                  alt="Ana ekran görsel önizleme"
                  fill
                  sizes="(max-width: 1024px) 100vw, 900px"
                  className="object-cover"
                  unoptimized
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setContentDraft((current) => ({
                      ...current,
                      home: { ...current.home, heroImage: initialHomeHeroImage },
                    }))
                  }
                  className="inline-flex items-center gap-2 rounded-full border border-sage-300 dark:border-slate-600 px-4 py-2 text-sm text-sage-700 dark:text-sage-200 hover:bg-sage-100 dark:hover:bg-slate-800"
                >
                  Eski Haline Çevir
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {contentDraft.about.paragraphs.map((paragraph, index) => (
                <div key={index}>
                  <label className="block text-sm font-medium text-sage-700 dark:text-sage-200 mb-2">Hakkımızda Paragraf {index + 1}</label>
                  <textarea
                    value={paragraph}
                    onChange={(event) =>
                      setContentDraft((current) => {
                        const nextParagraphs = [...current.about.paragraphs];
                        nextParagraphs[index] = event.target.value;
                        return { ...current, about: { ...current.about, paragraphs: nextParagraphs } };
                      })
                    }
                    className="w-full min-h-40 rounded-2xl border border-sage-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-3 text-sage-800 dark:text-cream-50 outline-none focus:border-sage-500"
                  />
                </div>
              ))}
            </div>

            <button onClick={saveContent} disabled={saving} className="inline-flex items-center gap-2 rounded-full bg-rose-500 px-5 py-3 text-white font-medium hover:bg-rose-600 disabled:opacity-70">
              <Save className="w-4 h-4" /> {saving ? "Kaydediliyor..." : "Metinleri Kaydet"}
            </button>
          </div>
        </section>
      </div>
      </div>
    </div>
  );
}

function Input({
  label,
  helper,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  helper?: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-sage-700 dark:text-sage-200 mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete="off"
        className="w-full rounded-2xl border border-sage-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-3 text-sage-800 dark:text-cream-50 outline-none focus:border-sage-500"
      />
      {helper ? <p className="text-xs text-sage-500 dark:text-sage-300 mt-1">{helper}</p> : null}
    </div>
  );
}

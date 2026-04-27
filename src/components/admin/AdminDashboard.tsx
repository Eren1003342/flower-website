"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { LogOut, Plus, Save, Trash2, Upload } from "lucide-react";
import type { Product, SiteContent } from "@/lib/cms";

type SaveTone = "idle" | "success" | "error";

function normalizeCategoryId(value: string) {
  return value
    .trim()
    .replace(/\s+/g, "-")
    .toLocaleLowerCase("tr-TR")
    .replace(/[^a-z0-9çğıöşü-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeCategoryLabel(value: string) {
  return value.trim().replace(/\s{2,}/g, " ");
}

function slugifyProductName(value: string) {
  return value
    .toLocaleLowerCase("tr-TR")
    .replace(/[ç]/g, "c")
    .replace(/[ğ]/g, "g")
    .replace(/[ı]/g, "i")
    .replace(/[ö]/g, "o")
    .replace(/[ş]/g, "s")
    .replace(/[ü]/g, "u")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildUniqueSlug(base: string, taken: Set<string>) {
  const normalizedBase = base || "urun";
  let candidate = normalizedBase;
  let index = 2;
  while (taken.has(candidate)) {
    candidate = `${normalizedBase}-${index}`;
    index += 1;
  }
  taken.add(candidate);
  return candidate;
}

function sanitizeProductImageList(images: string[]) {
  return images.map((image) => image.trim()).filter(Boolean);
}

function cloneProduct(product: Product): Product {
  return { ...product, images: [...product.images] };
}

function getInitialCategoryLabels(content: SiteContent) {
  const fromFilters = content.home.catalogFilters.map((item) => item.label);
  const fromShowcase = content.home.showcaseCategories.map((item) => item.label);
  const combined = [...fromFilters, ...fromShowcase].map(normalizeCategoryLabel).filter(Boolean);
  return Array.from(new Set(combined));
}

function statusClasses(tone: SaveTone) {
  if (tone === "success") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/70 dark:bg-emerald-950/40 dark:text-emerald-300";
  }
  if (tone === "error") {
    return "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/70 dark:bg-rose-950/40 dark:text-rose-300";
  }
  return "border-sage-200 bg-sage-50 text-sage-700 dark:border-slate-700 dark:bg-slate-900 dark:text-sage-200";
}

export default function AdminDashboard({
  initialProducts,
  initialContent,
}: {
  initialProducts: Product[];
  initialContent: SiteContent;
}) {
  const [productsDraft, setProductsDraft] = useState<Product[]>(initialProducts.map(cloneProduct));
  const [selectedProductId, setSelectedProductId] = useState(initialProducts[0]?.id ?? "");
  const [contentDraft, setContentDraft] = useState<SiteContent>(initialContent);
  const [categoryLabels, setCategoryLabels] = useState<string[]>(getInitialCategoryLabels(initialContent));

  const [status, setStatus] = useState("Hazır.");
  const [statusTone, setStatusTone] = useState<SaveTone>("idle");
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);

  const [pendingProductFile, setPendingProductFile] = useState<File | null>(null);
  const [pendingProductPreviewUrl, setPendingProductPreviewUrl] = useState<string | null>(null);
  const [pendingHeroFile, setPendingHeroFile] = useState<File | null>(null);
  const [pendingHeroPreviewUrl, setPendingHeroPreviewUrl] = useState<string | null>(null);

  const selectedProduct = useMemo(
    () => productsDraft.find((product) => product.id === selectedProductId) ?? null,
    [productsDraft, selectedProductId],
  );

  const categoryOptions = useMemo(() => {
    const labels = categoryLabels.map(normalizeCategoryLabel).filter(Boolean);
    const uniqueLabels = Array.from(new Set(labels));
    return uniqueLabels
      .map((label) => {
        const id = normalizeCategoryId(label);
        return id ? { id, label } : null;
      })
      .filter((item): item is { id: string; label: string } => Boolean(item));
  }, [categoryLabels]);

  function markDirty(successMessage = "Değişiklik yapıldı. Kaydetmeyi unutmayın.") {
    setHasChanges(true);
    setStatus(successMessage);
    setStatusTone("idle");
  }

  async function fetchJsonWithTimeout<T>(input: RequestInfo | URL, init?: RequestInit, timeoutMs = 15000) {
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

  function updateSelectedProduct(next: Partial<Product>) {
    if (!selectedProductId) {
      return;
    }
    setProductsDraft((current) =>
      current.map((product) => (product.id === selectedProductId ? { ...product, ...next } : product)),
    );
    markDirty();
  }

  function updateSelectedProductImages(nextImages: string[]) {
    updateSelectedProduct({ images: nextImages });
  }

  function addNewProduct() {
    const firstCategoryId = categoryOptions[0]?.id ?? "buket";
    const newProduct: Product = {
      id: crypto.randomUUID(),
      slug: "",
      name: "",
      category: firstCategoryId,
      price: 0,
      description: "",
      images: [],
      inStock: true,
    };
    setProductsDraft((current) => [newProduct, ...current]);
    setSelectedProductId(newProduct.id);
    markDirty("Yeni ürün eklendi. Bilgileri doldurun.");
  }

  function deleteSelectedProduct() {
    if (!selectedProduct) {
      return;
    }
    const approved = window.confirm(`"${selectedProduct.name || "Bu ürün"}" silinsin mi?`);
    if (!approved) {
      return;
    }
    setProductsDraft((current) => current.filter((product) => product.id !== selectedProduct.id));
    setSelectedProductId((current) => {
      if (current !== selectedProduct.id) {
        return current;
      }
      const firstRemaining = productsDraft.find((item) => item.id !== selectedProduct.id);
      return firstRemaining?.id ?? "";
    });
    markDirty("Ürün listeden kaldırıldı. Kalıcı olması için kaydedin.");
  }

  async function uploadFile(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    return fetchJsonWithTimeout<{ message?: string; url?: string }>(
      "/api/admin/upload",
      { method: "POST", body: formData },
      20000,
    );
  }

  function clearPendingProductFile() {
    if (pendingProductPreviewUrl) {
      URL.revokeObjectURL(pendingProductPreviewUrl);
    }
    setPendingProductFile(null);
    setPendingProductPreviewUrl(null);
  }

  function clearPendingHeroFile() {
    if (pendingHeroPreviewUrl) {
      URL.revokeObjectURL(pendingHeroPreviewUrl);
    }
    setPendingHeroFile(null);
    setPendingHeroPreviewUrl(null);
  }

  function selectPendingProductFile(file: File | null) {
    clearPendingProductFile();
    if (!file) {
      return;
    }
    setPendingProductFile(file);
    setPendingProductPreviewUrl(URL.createObjectURL(file));
  }

  function selectPendingHeroFile(file: File | null) {
    clearPendingHeroFile();
    if (!file) {
      return;
    }
    setPendingHeroFile(file);
    setPendingHeroPreviewUrl(URL.createObjectURL(file));
  }

  async function uploadProductImage() {
    if (!selectedProduct || !pendingProductFile) {
      setStatus("Önce bir ürün ve görsel seçin.");
      setStatusTone("error");
      return;
    }
    setStatus("Ürün görseli yükleniyor...");
    setStatusTone("idle");
    try {
      const { response, data } = await uploadFile(pendingProductFile);
      if (!response.ok || !data?.url) {
        setStatus(data?.message ?? "Görsel yüklenemedi.");
        setStatusTone("error");
        return;
      }
      updateSelectedProductImages([...(selectedProduct.images ?? []), data.url]);
      clearPendingProductFile();
      setStatus("Ürün görseli eklendi. Kaydetmeyi unutmayın.");
      setStatusTone("success");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        setStatus("Görsel yükleme zaman aşımına uğradı.");
      } else {
        setStatus("Görsel yüklenirken bağlantı hatası oluştu.");
      }
      setStatusTone("error");
    }
  }

  async function uploadHeroImage() {
    if (!pendingHeroFile) {
      setStatus("Önce ana ekran arka plan görselini seçin.");
      setStatusTone("error");
      return;
    }
    setStatus("Ana ekran görseli yükleniyor...");
    setStatusTone("idle");
    try {
      const { response, data } = await uploadFile(pendingHeroFile);
      if (!response.ok || !data?.url) {
        setStatus(data?.message ?? "Ana ekran görseli yüklenemedi.");
        setStatusTone("error");
        return;
      }
      setContentDraft((current) => ({ ...current, home: { ...current.home, heroImage: data.url as string } }));
      clearPendingHeroFile();
      markDirty("Ana ekran görseli güncellendi.");
      setStatusTone("success");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        setStatus("Ana ekran görsel yükleme zaman aşımına uğradı.");
      } else {
        setStatus("Ana ekran görseli yüklenirken hata oluştu.");
      }
      setStatusTone("error");
    }
  }

  function updateCategoryLabel(index: number, nextLabel: string) {
    setCategoryLabels((current) => current.map((label, i) => (i === index ? nextLabel : label)));
    markDirty();
  }

  function addCategory() {
    setCategoryLabels((current) => [...current, "Yeni Kategori"]);
    markDirty();
  }

  function removeCategory(index: number) {
    setCategoryLabels((current) => current.filter((_, i) => i !== index));
    markDirty();
  }

  function buildPreparedProducts() {
    if (productsDraft.length === 0) {
      return { ok: false as const, message: "En az bir ürün ekleyin." };
    }
    const availableCategoryIds = new Set(categoryOptions.map((item) => item.id));
    if (availableCategoryIds.size === 0) {
      return { ok: false as const, message: "En az bir geçerli kategori adı girin." };
    }

    const usedSlugs = new Set<string>();
    const prepared = productsDraft.map((product) => {
      const name = product.name.trim();
      const description = product.description.trim();
      const images = sanitizeProductImageList(product.images);
      const slug = buildUniqueSlug(slugifyProductName(name), usedSlugs);
      const category =
        product.category && availableCategoryIds.has(product.category)
          ? product.category
          : categoryOptions[0].id;
      return {
        ...product,
        id: product.id || crypto.randomUUID(),
        slug,
        name,
        description,
        category,
        price: Number.isFinite(product.price) ? Math.max(0, Math.round(product.price)) : 0,
        images,
        inStock: Boolean(product.inStock),
      };
    });

    const invalidIndex = prepared.findIndex(
      (product) => !product.name || !product.description || product.images.length === 0,
    );
    if (invalidIndex >= 0) {
      return {
        ok: false as const,
        message: `${invalidIndex + 1}. üründe ad, açıklama veya görsel eksik.`,
      };
    }

    return { ok: true as const, products: prepared };
  }

  async function saveAllChanges() {
    setSaving(true);
    setStatus("Tüm değişiklikler kaydediliyor...");
    setStatusTone("idle");

    const preparedProducts = buildPreparedProducts();
    if (!preparedProducts.ok) {
      setStatus(preparedProducts.message);
      setStatusTone("error");
      setSaving(false);
      return;
    }

    const nextContent: SiteContent = {
      ...contentDraft,
      home: {
        ...contentDraft.home,
        catalogFilters: categoryOptions,
        showcaseCategories: categoryOptions,
      },
    };

    try {
      const productsResult = await fetchJsonWithTimeout<{ message?: string; products?: Product[] }>(
        "/api/admin/products",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "replace-all", products: preparedProducts.products }),
        },
      );

      if (!productsResult.response.ok) {
        setStatus(productsResult.data?.message ?? "Ürünler kaydedilemedi.");
        setStatusTone("error");
        return;
      }

      const contentResult = await fetchJsonWithTimeout<{ message?: string; content?: SiteContent }>(
        "/api/admin/content",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: nextContent }),
        },
      );

      if (!contentResult.response.ok) {
        setStatus(contentResult.data?.message ?? "Site ayarları kaydedilemedi.");
        setStatusTone("error");
        return;
      }

      if (productsResult.data?.products) {
        setProductsDraft(productsResult.data.products.map(cloneProduct));
        if (!selectedProductId && productsResult.data.products[0]?.id) {
          setSelectedProductId(productsResult.data.products[0].id);
        }
      }
      if (contentResult.data?.content) {
        setContentDraft(contentResult.data.content);
      }

      setStatus("Her şey kaydedildi.");
      setStatusTone("success");
      setHasChanges(false);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        setStatus("Kaydetme isteği zaman aşımına uğradı.");
      } else {
        setStatus("Kaydetme sırasında bağlantı hatası oluştu.");
      }
      setStatusTone("error");
    } finally {
      setSaving(false);
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/giris";
  }

  return (
    <div className="paper-stage min-h-screen pb-28 md:pb-8">
      <div className="max-w-6xl mx-auto px-4 py-6 md:py-10 space-y-6">
        <div className="rounded-3xl paper-surface p-5 md:p-7 flex flex-col gap-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-cream-50/70">Kolay Yönetim Paneli</p>
              <h1 className="text-3xl md:text-4xl font-bold text-cream-50 mt-2" style={{ fontFamily: "var(--font-brand)" }}>
                {contentDraft.brand.name}
              </h1>
              <p className="text-cream-50/80 mt-2 text-sm md:text-base">
                Ürünleri ve ana sayfa metinlerini buradan kolayca güncelleyebilirsiniz.
              </p>
            </div>
            <button
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-cream-50 hover:bg-white/10"
            >
              <LogOut className="w-4 h-4" /> Çıkış
            </button>
          </div>

          <div className={`rounded-2xl border px-4 py-3 text-sm font-medium ${statusClasses(statusTone)}`}>
            {status} {hasChanges ? "• Kaydedilmemiş değişiklik var." : ""}
          </div>

          <button
            onClick={saveAllChanges}
            disabled={saving}
            className="hidden md:inline-flex self-start items-center gap-2 rounded-full bg-rose-500 px-5 py-3 text-white font-semibold hover:bg-rose-600 disabled:opacity-70"
          >
            <Save className="w-4 h-4" /> {saving ? "Kaydediliyor..." : "Tüm Değişiklikleri Kaydet"}
          </button>
        </div>

        <div className="grid lg:grid-cols-[300px_minmax(0,1fr)] gap-6">
          <aside className="rounded-3xl bg-white dark:bg-slate-900 border border-sage-100 dark:border-slate-800 p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-2xl text-sage-800 dark:text-cream-50">Ürünler</h2>
              <button
                type="button"
                onClick={addNewProduct}
                className="inline-flex items-center gap-1 rounded-full bg-sage-800 px-3 py-2 text-sm text-cream-50"
              >
                <Plus className="w-4 h-4" /> Yeni
              </button>
            </div>
            <div className="space-y-2 max-h-[58vh] overflow-auto pr-1">
              {productsDraft.map((product) => (
                <button
                  key={product.id}
                  onClick={() => setSelectedProductId(product.id)}
                  className={`w-full text-left rounded-xl border px-3 py-3 ${
                    selectedProductId === product.id
                      ? "border-sage-500 bg-sage-50 dark:bg-slate-800"
                      : "border-sage-100 dark:border-slate-800 hover:bg-sage-50 dark:hover:bg-slate-800"
                  }`}
                >
                  <p className="font-medium text-sage-800 dark:text-cream-50 truncate">{product.name || "Yeni Ürün"}</p>
                  <p className="text-xs text-sage-500 dark:text-sage-300 mt-1">{product.price || 0} ₺</p>
                </button>
              ))}
            </div>
          </aside>

          <section className="space-y-6">
            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-sage-100 dark:border-slate-800 p-5 md:p-7 shadow-lg space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <h2 className="font-serif text-2xl md:text-3xl text-sage-800 dark:text-cream-50">Seçili Ürün</h2>
                {selectedProduct ? (
                  <button
                    type="button"
                    onClick={deleteSelectedProduct}
                    className="inline-flex items-center gap-2 rounded-full border border-rose-200 px-4 py-2 text-sm text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                  >
                    <Trash2 className="w-4 h-4" /> Ürünü Sil
                  </button>
                ) : null}
              </div>

              {selectedProduct ? (
                <>
                  <Input
                    label="Ürün Adı"
                    value={selectedProduct.name}
                    onChange={(value) => updateSelectedProduct({ name: value })}
                  />
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      label="Fiyat (TL)"
                      type="number"
                      value={String(selectedProduct.price)}
                      onChange={(value) => updateSelectedProduct({ price: Number(value) })}
                    />
                    <div>
                      <label className="block text-sm font-medium text-sage-700 dark:text-sage-200 mb-2">Kategori</label>
                      <select
                        value={selectedProduct.category}
                        onChange={(event) => updateSelectedProduct({ category: event.target.value })}
                        className="w-full rounded-2xl border border-sage-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-3 text-sage-800 dark:text-cream-50"
                      >
                        {categoryOptions.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-sage-700 dark:text-sage-200 mb-2">Açıklama</label>
                    <textarea
                      value={selectedProduct.description}
                      onChange={(event) => updateSelectedProduct({ description: event.target.value })}
                      className="w-full min-h-28 rounded-2xl border border-sage-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-3 text-sage-800 dark:text-cream-50"
                    />
                  </div>
                  <label className="flex items-center gap-2 text-sage-700 dark:text-sage-200">
                    <input
                      type="checkbox"
                      checked={selectedProduct.inStock}
                      onChange={(event) => updateSelectedProduct({ inStock: event.target.checked })}
                    />
                    Ürün stokta
                  </label>

                  <div className="rounded-2xl border border-sage-200 dark:border-slate-700 p-4 bg-sage-50/40 dark:bg-slate-950/60 space-y-3">
                    <p className="font-medium text-sage-800 dark:text-cream-50">Ürün Görselleri</p>
                    <div className="flex flex-wrap gap-2">
                      <label className="inline-flex items-center gap-2 rounded-full border border-sage-200 dark:border-slate-700 px-4 py-2 text-sm cursor-pointer">
                        <Upload className="w-4 h-4" /> Dosya Seç
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(event) => selectPendingProductFile(event.target.files?.[0] ?? null)}
                        />
                      </label>
                      <button
                        type="button"
                        onClick={uploadProductImage}
                        disabled={!pendingProductFile}
                        className="inline-flex items-center gap-2 rounded-full bg-sage-800 px-4 py-2 text-sm text-cream-50 hover:bg-sage-900 disabled:opacity-60"
                      >
                        <Upload className="w-4 h-4" /> Görseli Ekle
                      </button>
                    </div>
                    {pendingProductPreviewUrl ? (
                      <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-sage-200 dark:border-slate-700">
                        <Image src={pendingProductPreviewUrl} alt="Yüklenecek görsel" fill sizes="96px" className="object-cover" unoptimized />
                      </div>
                    ) : null}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {selectedProduct.images.map((image, index) => (
                        <div key={`${image}-${index}`} className="relative rounded-xl overflow-hidden border border-sage-200 dark:border-slate-700">
                          <div className="relative h-24">
                            <Image src={image} alt={`Ürün görseli ${index + 1}`} fill sizes="160px" className="object-cover" unoptimized />
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              updateSelectedProductImages(selectedProduct.images.filter((_, imageIndex) => imageIndex !== index))
                            }
                            className="w-full text-xs py-1.5 text-rose-600 bg-white/90 dark:bg-slate-900/90"
                          >
                            Kaldır
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-sage-600 dark:text-sage-300">Soldan bir ürün seçin veya yeni ürün ekleyin.</p>
              )}
            </div>

            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-sage-100 dark:border-slate-800 p-5 md:p-7 shadow-lg space-y-4">
              <h2 className="font-serif text-2xl md:text-3xl text-sage-800 dark:text-cream-50">Kategoriler</h2>
              <p className="text-sm text-sage-500 dark:text-sage-300">
                Buraya yazdığınız kategori isimleri hem katalogda hem ana sayfada otomatik kullanılır.
              </p>
              <div className="space-y-2">
                {categoryLabels.map((label, index) => (
                  <div key={`${index}-${label}`} className="flex gap-2">
                    <input
                      value={label}
                      onChange={(event) => updateCategoryLabel(index, event.target.value)}
                      className="w-full rounded-2xl border border-sage-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-3 text-sage-800 dark:text-cream-50"
                      placeholder="Kategori adı"
                    />
                    <button
                      type="button"
                      onClick={() => removeCategory(index)}
                      className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-rose-200 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addCategory}
                className="inline-flex items-center gap-2 rounded-full border border-sage-200 dark:border-slate-700 px-4 py-2 text-sage-700 dark:text-sage-200"
              >
                <Plus className="w-4 h-4" /> Kategori Ekle
              </button>
            </div>

            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-sage-100 dark:border-slate-800 p-5 md:p-7 shadow-lg space-y-4">
              <h2 className="font-serif text-2xl md:text-3xl text-sage-800 dark:text-cream-50">Ana Sayfa İçeriği</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="Marka Adı"
                  value={contentDraft.brand.name}
                  onChange={(value) => {
                    setContentDraft((current) => ({ ...current, brand: { ...current.brand, name: value } }));
                    markDirty();
                  }}
                />
                <Input
                  label="Marka Sloganı"
                  value={contentDraft.brand.tagline}
                  onChange={(value) => {
                    setContentDraft((current) => ({ ...current, brand: { ...current.brand, tagline: value } }));
                    markDirty();
                  }}
                />
                <Input
                  label="Ana Başlık"
                  value={contentDraft.home.heroTitle}
                  onChange={(value) => {
                    setContentDraft((current) => ({ ...current, home: { ...current.home, heroTitle: value } }));
                    markDirty();
                  }}
                />
                <Input
                  label="Ana Açıklama"
                  value={contentDraft.home.heroSubtitle}
                  onChange={(value) => {
                    setContentDraft((current) => ({ ...current, home: { ...current.home, heroSubtitle: value } }));
                    markDirty();
                  }}
                />
                <Input
                  label="Öne Çıkanlar Başlığı"
                  value={contentDraft.home.featuredTitle}
                  onChange={(value) => {
                    setContentDraft((current) => ({ ...current, home: { ...current.home, featuredTitle: value } }));
                    markDirty();
                  }}
                />
                <Input
                  label="Öne Çıkanlar Alt Metni"
                  value={contentDraft.home.featuredSubtitle}
                  onChange={(value) => {
                    setContentDraft((current) => ({ ...current, home: { ...current.home, featuredSubtitle: value } }));
                    markDirty();
                  }}
                />
                <Input
                  label="Instagram Kullanıcı Adı"
                  value={contentDraft.contact.instagram}
                  onChange={(value) => {
                    setContentDraft((current) => ({ ...current, contact: { ...current.contact, instagram: value } }));
                    markDirty();
                  }}
                />
                <Input
                  label="E-Posta"
                  value={contentDraft.contact.email}
                  onChange={(value) => {
                    setContentDraft((current) => ({ ...current, contact: { ...current.contact, email: value } }));
                    markDirty();
                  }}
                />
              </div>

              <div className="rounded-2xl border border-sage-200 dark:border-slate-700 p-4 bg-sage-50/40 dark:bg-slate-950/60 space-y-3">
                <p className="font-medium text-sage-800 dark:text-cream-50">Ana Sayfa Arka Plan Görseli</p>
                <div className="flex flex-wrap gap-2">
                  <label className="inline-flex items-center gap-2 rounded-full border border-sage-200 dark:border-slate-700 px-4 py-2 text-sm cursor-pointer">
                    <Upload className="w-4 h-4" /> Dosya Seç
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(event) => selectPendingHeroFile(event.target.files?.[0] ?? null)}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={uploadHeroImage}
                    disabled={!pendingHeroFile}
                    className="inline-flex items-center gap-2 rounded-full bg-sage-800 px-4 py-2 text-sm text-cream-50 hover:bg-sage-900 disabled:opacity-60"
                  >
                    <Upload className="w-4 h-4" /> Arka Planı Yükle
                  </button>
                </div>
                <div className="relative w-full aspect-[16/7] rounded-xl overflow-hidden border border-sage-200 dark:border-slate-700">
                  <Image
                    src={pendingHeroPreviewUrl || contentDraft.home.heroImage || "/placeholder-flower.svg"}
                    alt="Ana ekran önizleme"
                    fill
                    sizes="(max-width: 1024px) 100vw, 900px"
                    className="object-cover"
                    unoptimized
                  />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 md:hidden p-3 bg-white/95 dark:bg-slate-950/95 border-t border-sage-200 dark:border-slate-800 z-40">
        <button
          onClick={saveAllChanges}
          disabled={saving}
          className="w-full inline-flex justify-center items-center gap-2 rounded-full bg-rose-500 px-5 py-3 text-white font-semibold hover:bg-rose-600 disabled:opacity-70"
        >
          <Save className="w-4 h-4" /> {saving ? "Kaydediliyor..." : "Tüm Değişiklikleri Kaydet"}
        </button>
      </div>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
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
    </div>
  );
}

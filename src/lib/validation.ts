import type { Category, Product, SiteContent } from "@/lib/cms";

const MAX_TEXT = 4000;

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }
  return value as Record<string, unknown>;
}

function sanitizeText(value: unknown, maxLength = MAX_TEXT): string | null {
  if (typeof value !== "string") {
    return null;
  }
  const next = value.trim().replace(/\s{3,}/g, " ");
  if (!next) {
    return null;
  }
  if (next.length > maxLength) {
    return next.slice(0, maxLength);
  }
  return next;
}

function sanitizeMultiline(value: unknown, maxLength = MAX_TEXT): string | null {
  if (typeof value !== "string") {
    return null;
  }
  const next = value.trim().replace(/\r\n/g, "\n");
  if (!next) {
    return null;
  }
  if (next.length > maxLength) {
    return next.slice(0, maxLength);
  }
  return next;
}

function sanitizeCategoryId(value: unknown, maxLength = 60): Category | null {
  const id = sanitizeText(value, maxLength)?.toLocaleLowerCase("tr-TR");
  if (!id) {
    return null;
  }
  if (!/^[a-z0-9çğıöşü]+(?:-[a-z0-9çğıöşü]+)*$/.test(id)) {
    return null;
  }
  return id;
}

function sanitizeCategoryOptions(input: unknown, maxItems = 8): { id: Category; label: string }[] | null {
  if (!Array.isArray(input) || input.length === 0 || input.length > maxItems) {
    return null;
  }
  const output: { id: Category; label: string }[] = [];
  for (const item of input) {
    const row = asRecord(item);
    const id = row ? sanitizeCategoryId(row.id) : null;
    if (!row || !id) {
      return null;
    }
    const label = sanitizeText(row.label, 60);
    if (!label) {
      return null;
    }
    output.push({ id, label });
  }
  return output;
}

export function validateCategoryOptionsInput(
  input: unknown,
  fieldLabel: "Katalog filtreleri" | "Vitrin kategorileri",
  maxItems = 100,
):
  | { ok: true; options: { id: Category; label: string }[] }
  | { ok: false; message: string } {
  const options = sanitizeCategoryOptions(input, maxItems);
  if (!options) {
    return {
      ok: false,
      message: `${fieldLabel} geçersiz. ID alanında harf (Türkçe dahil), sayı ve tire kullanın.`,
    };
  }
  return { ok: true, options };
}

function sanitizeUrl(value: unknown): string | null {
  const raw = sanitizeText(value, 1024);
  if (!raw) {
    return null;
  }
  if (raw.startsWith("/")) {
    return raw;
  }
  try {
    const parsed = new URL(raw);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      return null;
    }
    return parsed.toString();
  } catch {
    return null;
  }
}

export function validateProductInput(input: unknown):
  | { ok: true; product: Product }
  | { ok: false; message: string } {
  const record = asRecord(input);
  if (!record) {
    return { ok: false, message: "Geçersiz ürün verisi." };
  }

  const id = sanitizeText(record.id, 128);
  const slug = sanitizeText(record.slug, 128)?.toLowerCase();
  const name = sanitizeText(record.name, 160);
  const description = sanitizeMultiline(record.description, 2000);

  if (!id || !slug || !name || !description) {
    return { ok: false, message: "Ürün alanları eksik veya hatalı." };
  }

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return { ok: false, message: "Slug sadece küçük harf, sayı ve tire içerebilir." };
  }

  const category = sanitizeCategoryId(record.category);
  if (!category) {
    return { ok: false, message: "Geçersiz ürün kategorisi." };
  }

  const priceNumber = typeof record.price === "number" ? record.price : Number(record.price);
  if (!Number.isFinite(priceNumber) || priceNumber < 0 || priceNumber > 1_000_000) {
    return { ok: false, message: "Geçersiz fiyat değeri." };
  }

  const imagesRaw = Array.isArray(record.images) ? record.images : [];
  if (imagesRaw.length > 12) {
    return { ok: false, message: "Bir ürün için en fazla 12 görsel kullanılabilir." };
  }

  const images = imagesRaw
    .map((item) => sanitizeUrl(item))
    .filter((item): item is string => Boolean(item));

  if (images.length === 0) {
    return { ok: false, message: "En az bir geçerli görsel URL'i gerekli." };
  }

  let inStock = true;
  if (typeof record.inStock === "boolean") {
    inStock = record.inStock;
  } else if (typeof record.inStock === "string") {
    const normalized = record.inStock.trim().toLowerCase();
    if (normalized === "true") {
      inStock = true;
    } else if (normalized === "false") {
      inStock = false;
    } else {
      return { ok: false, message: "Stok bilgisi geçersiz." };
    }
  } else if (typeof record.inStock === "number") {
    inStock = record.inStock > 0;
  }

  return {
    ok: true,
    product: {
      id,
      slug,
      name,
      category,
      price: Math.round(priceNumber),
      description,
      images,
      inStock,
    },
  };
}

export function validateProductId(input: unknown): string | null {
  return sanitizeText(input, 128);
}

function sanitizeStringList(input: unknown, maxItems = 12, itemMax = 1200): string[] | null {
  if (!Array.isArray(input)) {
    return null;
  }
  if (input.length === 0 || input.length > maxItems) {
    return null;
  }

  const list = input
    .map((item) => sanitizeMultiline(item, itemMax))
    .filter((item): item is string => Boolean(item));

  return list.length > 0 ? list : null;
}

export function validateSiteContentInput(input: unknown):
  | { ok: true; content: SiteContent }
  | { ok: false; message: string } {
  const root = asRecord(input);
  if (!root) {
    return { ok: false, message: "Geçersiz içerik verisi." };
  }

  const brand = asRecord(root.brand);
  const home = asRecord(root.home);
  const about = asRecord(root.about);
  const contact = asRecord(root.contact);
  const footer = asRecord(root.footer);

  if (!brand || !home || !about || !contact || !footer) {
    return { ok: false, message: "İçerik yapısı eksik veya hatalı." };
  }

  const paragraphs = sanitizeStringList(about.paragraphs, 8, 1600);
  const catalogFilters = sanitizeCategoryOptions(home.catalogFilters, 100);
  const showcaseCategories = sanitizeCategoryOptions(home.showcaseCategories, 100);

  if (!catalogFilters || !showcaseCategories) {
    return {
      ok: false,
      message: "Kategori ID geçersiz. Sadece harf (Türkçe dahil), sayı ve tire kullanın (örn: saksı-çiçekleri).",
    };
  }

  const nextContent: SiteContent = {
    brand: {
      name: sanitizeText(brand.name, 80) ?? "",
      tagline: sanitizeText(brand.tagline, 140) ?? "",
    },
    home: {
      heroImage: sanitizeUrl(home.heroImage) ?? "",
      catalogFilters,
      showcaseCategories,
      heroBadge: sanitizeText(home.heroBadge, 120) ?? "",
      heroTitle: sanitizeMultiline(home.heroTitle, 200) ?? "",
      heroSubtitle: sanitizeMultiline(home.heroSubtitle, 1200) ?? "",
      heroPrimaryCta: sanitizeText(home.heroPrimaryCta, 60) ?? "",
      heroSecondaryCta: sanitizeText(home.heroSecondaryCta, 60) ?? "",
      featuredTitle: sanitizeText(home.featuredTitle, 120) ?? "",
      featuredSubtitle: sanitizeMultiline(home.featuredSubtitle, 240) ?? "",
      aboutKicker: sanitizeText(home.aboutKicker, 80) ?? "",
      aboutTitle: sanitizeMultiline(home.aboutTitle, 200) ?? "",
      aboutDescription: sanitizeMultiline(home.aboutDescription, 1200) ?? "",
      aboutLink: sanitizeText(home.aboutLink, 80) ?? "",
    },
    about: {
      title: sanitizeText(about.title, 120) ?? "",
      subtitle: sanitizeMultiline(about.subtitle, 320) ?? "",
      heroImage: sanitizeUrl(about.heroImage) ?? "",
      intro: sanitizeMultiline(about.intro, 300) ?? "",
      paragraphs: paragraphs ?? [],
    },
    contact: {
      title: sanitizeText(contact.title, 120) ?? "",
      subtitle: sanitizeMultiline(contact.subtitle, 320) ?? "",
      addressLabel: sanitizeText(contact.addressLabel, 60) ?? "",
      address: sanitizeMultiline(contact.address, 300) ?? "",
      instagramLabel: sanitizeText(contact.instagramLabel, 60) ?? "",
      instagram: sanitizeText(contact.instagram, 120) ?? "",
      emailLabel: sanitizeText(contact.emailLabel, 60) ?? "",
      email: sanitizeText(contact.email, 160) ?? "",
      mapEmbed: sanitizeUrl(contact.mapEmbed) ?? "",
    },
    footer: {
      description: sanitizeMultiline(footer.description, 320) ?? "",
    },
  };

  const requiredStrings = [
    nextContent.brand.name,
    nextContent.brand.tagline,
    nextContent.home.heroBadge,
    nextContent.home.heroImage,
    ...nextContent.home.catalogFilters.map((row) => row.label),
    ...nextContent.home.showcaseCategories.map((row) => row.label),
    nextContent.home.heroTitle,
    nextContent.home.heroSubtitle,
    nextContent.home.heroPrimaryCta,
    nextContent.home.heroSecondaryCta,
    nextContent.home.featuredTitle,
    nextContent.home.featuredSubtitle,
    nextContent.home.aboutKicker,
    nextContent.home.aboutTitle,
    nextContent.home.aboutDescription,
    nextContent.home.aboutLink,
    nextContent.about.title,
    nextContent.about.subtitle,
    nextContent.about.heroImage,
    nextContent.about.intro,
    nextContent.contact.title,
    nextContent.contact.subtitle,
    nextContent.contact.addressLabel,
    nextContent.contact.address,
    nextContent.contact.instagramLabel,
    nextContent.contact.instagram,
    nextContent.contact.emailLabel,
    nextContent.contact.email,
    nextContent.contact.mapEmbed,
    nextContent.footer.description,
  ];

  if (
    requiredStrings.some((value) => !value) ||
    nextContent.about.paragraphs.length === 0 ||
    nextContent.home.catalogFilters.length === 0 ||
    nextContent.home.showcaseCategories.length === 0
  ) {
    return { ok: false, message: "İçerik alanlarının bir kısmı boş veya geçersiz." };
  }

  return { ok: true, content: nextContent };
}

import { promises as fs } from "fs";
import path from "path";
import { getSupabaseAdminClient, isSupabaseConfigured } from "@/lib/supabase-admin";
import { validateSiteContentInput } from "@/lib/validation";
import productsSeedData from "../../data/products.json";
import siteContentSeedData from "../../data/site-content.json";

export type Category = string;
export interface CategoryDisplayOption {
  id: Category;
  label: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: Category;
  price: number;
  description: string;
  images: string[];
  inStock: boolean;
}

export interface SiteContent {
  brand: {
    name: string;
    tagline: string;
  };
  home: {
    heroImage: string;
    catalogFilters: CategoryDisplayOption[];
    showcaseCategories: CategoryDisplayOption[];
    heroBadge: string;
    heroTitle: string;
    heroSubtitle: string;
    heroPrimaryCta: string;
    heroSecondaryCta: string;
    featuredTitle: string;
    featuredSubtitle: string;
    aboutKicker: string;
    aboutTitle: string;
    aboutDescription: string;
    aboutLink: string;
  };
  about: {
    title: string;
    subtitle: string;
    heroImage: string;
    intro: string;
    paragraphs: string[];
  };
  contact: {
    title: string;
    subtitle: string;
    addressLabel: string;
    address: string;
    instagramLabel: string;
    instagram: string;
    emailLabel: string;
    email: string;
    mapEmbed: string;
  };
  footer: {
    description: string;
  };
}

const dataDir = path.join(process.cwd(), "data");
const productsFile = path.join(dataDir, "products.json");
const contentFile = path.join(dataDir, "site-content.json");

const DEFAULT_SITE_CONTENT: SiteContent = {
  brand: {
    name: "Eleanor Çiçek",
    tagline: "El yapımı çiçek atölyesi",
  },
  home: {
    heroImage: "https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?q=80&w=2600&auto=format&fit=crop",
    catalogFilters: [
      { id: "buket", label: "Buketler" },
      { id: "saksi", label: "Saksı Çiçekleri" },
      { id: "kuru-cicek", label: "Kuru Çiçek" },
      { id: "ozel-gun", label: "Özel Günler" },
    ],
    showcaseCategories: [
      { id: "buket", label: "Buketler" },
      { id: "saksi", label: "Saksı Çiçekleri" },
      { id: "kuru-cicek", label: "Kuru Çiçekler" },
      { id: "ozel-gun", label: "Özel Gün Tasarımları" },
    ],
    heroBadge: "Eleanor Çiçek Atelier",
    heroTitle: "Sevdiklerinizi\nMutlu Etmenin Yolu",
    heroSubtitle:
      "El yapımı çiçeklerle, her anı kalıcı bir tasarıma dönüştürüyoruz. Solmayan, özgün ve ilk bakışta fark edilen buketler burada.",
    heroPrimaryCta: "Koleksiyonu Keşfet",
    heroSecondaryCta: "Özel Tasarım İste",
    featuredTitle: "Öne Çıkanlar",
    featuredSubtitle: "Atölyemizin en sevilen el yapımı buketleri",
    aboutKicker: "Hikayemiz",
    aboutTitle: "Her çiçek bir duygu\nHer yaprak bir anı taşır.",
    aboutDescription:
      "Yılların verdiği tecrübe ve tasarıma olan sevgimizle, sizlere tamamen el yapımı çiçek koleksiyonları sunuyoruz. Atölyemizde tasarladığımız her bir buket, uzun ömürlü bir hatıra ve güçlü bir estetik etki bırakmak için özenle hazırlanır.",
    aboutLink: "Hakkımızda Daha Fazlası",
  },
  about: {
    title: "Hikayemiz",
    subtitle: "El yapımı çiçeklerle özel anları kalıcı bir tasarıma dönüştürüyoruz.",
    heroImage: "https://images.unsplash.com/photo-1496739660309-8650a3cc18ab?q=80&w=2000&auto=format&fit=crop",
    intro: "Her buket, kağıdın sanatla buluştuğu bir tasarım objesi.",
    paragraphs: [
      "Eleanor Çiçek, tamamen el yapımı çiçeklerden oluşan butik bir tasarım atölyesidir. Her parçayı kesimden boyamaya, katlamadan düzenlemeye kadar titizlikle elle üretiyoruz.",
      "Doğum günü, yıldönümü, isteme, söz ve özel davetler için kişiye özel renk paletleriyle uzun ömürlü buketler hazırlıyoruz. Ürünlerimiz solmaz, formunu korur ve dekoratif bir anı olarak kalır.",
      "Amacımız sadece hediye vermek değil; hissi, emeği ve estetiği tek bir tasarımda birleştirerek unutulmaz bir deneyim sunmaktır.",
    ],
  },
  contact: {
    title: "Bize Ulaşın",
    subtitle: "Özel ölçü, renk ve konseptte el yapımı çiçek siparişleriniz için bize yazın.",
    addressLabel: "Adres",
    address: "Yıldırım, Bursa",
    instagramLabel: "Instagram",
    instagram: "@eleanor_cicek",
    emailLabel: "E-Posta",
    email: "merhaba@eleanorcicek.com",
    mapEmbed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12213.89389348613!2d29.0863906!3d40.1958926!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14ca0e5e2e2e2e2b%3A0x7e7e7e7e7e7e7e7e!2sYıldırım%2C%20Bursa!5e0!3m2!1str!2str!4v1714080164843!5m2!1str!2str",
  },
  footer: {
    description: "El yapımı çiçeklerle özel anlarınıza kalıcı bir estetik katıyoruz.",
  },
};

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  description: string;
  images: unknown;
  in_stock: boolean;
  updated_at?: string;
};

type SiteContentRow = {
  id: string;
  content: unknown;
  updated_at?: string;
};

async function readJson<T>(filePath: string, fallback: T): Promise<T> {
  try {
    const file = await fs.readFile(filePath, "utf8");
    return JSON.parse(file) as T;
  } catch {
    return fallback;
  }
}

async function writeJson(filePath: string, value: unknown) {
  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(value, null, 2), "utf8");
}

async function getLocalProductsSeed() {
  const importedSeed = Array.isArray(productsSeedData) ? (productsSeedData as Product[]) : [];
  if (importedSeed.length > 0) {
    return importedSeed;
  }
  return readJson<Product[]>(productsFile, []);
}

async function getLocalSiteContentSeed() {
  if (siteContentSeedData && typeof siteContentSeedData === "object") {
    const validated = validateSiteContentInput(siteContentSeedData);
    if (validated.ok) {
      return validated.content;
    }
  }
  return readJson<SiteContent>(contentFile, DEFAULT_SITE_CONTENT);
}

function mapRowToProduct(row: ProductRow): Product {
  const images = Array.isArray(row.images) ? row.images.filter((item): item is string => typeof item === "string") : [];
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category,
    price: row.price,
    description: row.description,
    images,
    inStock: row.in_stock,
  };
}

function mapProductToRow(product: Product): ProductRow {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    category: product.category,
    price: product.price,
    description: product.description,
    images: product.images,
    in_stock: product.inStock,
  };
}

export async function getProducts(): Promise<Product[]> {
  if (isSupabaseConfigured()) {
    const client = getSupabaseAdminClient();
    const { data, error } = await client
      .from("products")
      .select("*")
      .order("updated_at", { ascending: false })
      .order("id", { ascending: false });

    if (error) {
      throw new Error(`Ürünler Supabase'den okunamadı: ${error.message}`);
    }

    const rows = (data as ProductRow[]) ?? [];
    if (rows.length === 0) {
      const localSeed = await getLocalProductsSeed();
      if (localSeed.length > 0) {
        const { error: seedError } = await client
          .from("products")
          .upsert(localSeed.map(mapProductToRow), { onConflict: "id" });
        if (seedError) {
          throw new Error(`Ürün seed verisi Supabase'e yazılamadı: ${seedError.message}`);
        }
        return localSeed;
      }
    }

    return rows.map(mapRowToProduct);
  }

  return readJson<Product[]>(productsFile, []);
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const products = await getProducts();
  return products.find((product) => product.slug === slug);
}

export async function saveProducts(products: Product[]) {
  if (isSupabaseConfigured()) {
    const client = getSupabaseAdminClient();
    const rows = products.map(mapProductToRow);
    const { data: existingRows, error: existingError } = await client.from("products").select("id");
    if (existingError) {
      throw new Error(`Mevcut ürünler alınamadı: ${existingError.message}`);
    }

    const incomingIds = new Set(rows.map((row) => row.id));
    const staleIds = ((existingRows as Array<{ id: string }> | null) ?? [])
      .map((row) => row.id)
      .filter((id) => !incomingIds.has(id));

    if (staleIds.length > 0) {
      const { error: deleteError } = await client.from("products").delete().in("id", staleIds);
      if (deleteError) {
        throw new Error(`Silinen ürünler temizlenemedi: ${deleteError.message}`);
      }
    }

    if (rows.length > 0) {
      const { error } = await client.from("products").upsert(rows, { onConflict: "id" });
      if (error) {
        throw new Error(`Ürünler Supabase'e yazılamadı: ${error.message}`);
      }
    }
    return products;
  }

  await writeJson(productsFile, products);
  return products;
}

export async function upsertProduct(product: Product): Promise<Product[]> {
  if (isSupabaseConfigured()) {
    const client = getSupabaseAdminClient();
    const { error } = await client.from("products").upsert(mapProductToRow(product), { onConflict: "id" });
    if (error) {
      throw new Error(`Ürün kaydı Supabase'e yazılamadı: ${error.message}`);
    }
    return getProducts();
  }

  const products = await getProducts();
  const index = products.findIndex((item) => item.id === product.id);

  if (index >= 0) {
    products[index] = product;
  } else {
    products.unshift(product);
  }

  await saveProducts(products);
  return products;
}

export async function deleteProduct(productId: string): Promise<Product[]> {
  if (isSupabaseConfigured()) {
    const client = getSupabaseAdminClient();
    const { error } = await client.from("products").delete().eq("id", productId);
    if (error) {
      throw new Error(`Ürün silinemedi: ${error.message}`);
    }
    return getProducts();
  }

  const products = await getProducts();
  const nextProducts = products.filter((product) => product.id !== productId);
  await saveProducts(nextProducts);
  return nextProducts;
}

export async function getSiteContent(): Promise<SiteContent> {
  if (isSupabaseConfigured()) {
    const client = getSupabaseAdminClient();
    const { data, error } = await client.from("site_content").select("content").eq("id", "default").maybeSingle();

    if (error) {
      throw new Error(`Site içeriği Supabase'den okunamadı: ${error.message}`);
    }

    if (!data?.content || typeof data.content !== "object") {
      const localSeed = await getLocalSiteContentSeed();
      const { error: insertError } = await client.from("site_content").upsert(
        {
          id: "default",
          content: localSeed,
        } as SiteContentRow,
        { onConflict: "id" },
      );

      if (insertError) {
        throw new Error(`Varsayılan içerik Supabase'e yazılamadı: ${insertError.message}`);
      }

      return localSeed;
    }

    const validated = validateSiteContentInput(data.content);
    if (!validated.ok) {
      const localSeed = await getLocalSiteContentSeed();
      const { error: repairError } = await client.from("site_content").upsert(
        {
          id: "default",
          content: localSeed,
        } as SiteContentRow,
        { onConflict: "id" },
      );

      if (repairError) {
        throw new Error(`Geçersiz site içeriği düzeltilemedi: ${repairError.message}`);
      }

      return localSeed;
    }

    return validated.content;
  }

  return readJson<SiteContent>(contentFile, DEFAULT_SITE_CONTENT);
}

export async function saveSiteContent(content: SiteContent) {
  if (isSupabaseConfigured()) {
    const client = getSupabaseAdminClient();
    const { error } = await client
      .from("site_content")
      .upsert(({ id: "default", content } as SiteContentRow), { onConflict: "id" });

    if (error) {
      throw new Error(`Site içeriği Supabase'e yazılamadı: ${error.message}`);
    }

    return content;
  }

  await writeJson(contentFile, content);
  return content;
}

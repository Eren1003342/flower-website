import { NextResponse } from "next/server";
import { deleteProduct, getProducts, saveProducts, upsertProduct } from "@/lib/cms";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { revalidatePath } from "next/cache";
import { validateProductId, validateProductInput } from "@/lib/validation";
import { randomUUID } from "crypto";

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

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ message: "Oturum süresi doldu. Lütfen tekrar giriş yapın." }, { status: 401 });
  }

  try {
    return NextResponse.json({ products: await getProducts() });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Ürünler alınamadı." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ message: "Oturum süresi doldu. Lütfen tekrar giriş yapın." }, { status: 401 });
  }

  try {
    const body = await request.json();

    if (body.action === "save") {
      const validated = validateProductInput(body.product);
      if (!validated.ok) {
        return NextResponse.json({ message: validated.message }, { status: 400 });
      }

      const products = await upsertProduct(validated.product);
      revalidatePath("/");
      revalidatePath("/katalog");
      revalidatePath("/urun/[slug]", "page");
      return NextResponse.json({ products });
    }

    if (body.action === "delete") {
      const productId = validateProductId(body.productId);
      if (!productId) {
        return NextResponse.json({ message: "Geçersiz ürün kimliği." }, { status: 400 });
      }

      const products = await deleteProduct(productId);
      revalidatePath("/");
      revalidatePath("/katalog");
      revalidatePath("/urun/[slug]", "page");
      return NextResponse.json({ products });
    }

    if (body.action === "replace-all") {
      if (!Array.isArray(body.products) || body.products.length === 0) {
        return NextResponse.json({ message: "Kaydedilecek ürün listesi bulunamadı." }, { status: 400 });
      }

      const validatedProducts = [];
      for (let index = 0; index < body.products.length; index += 1) {
        const candidate = body.products[index] as Record<string, unknown>;
        const hydrated = {
          ...candidate,
          id: typeof candidate?.id === "string" && candidate.id ? candidate.id : randomUUID(),
          slug:
            typeof candidate?.slug === "string" && candidate.slug
              ? candidate.slug
              : slugifyProductName(typeof candidate?.name === "string" ? candidate.name : ""),
        };
        const validated = validateProductInput(hydrated);
        if (!validated.ok) {
          return NextResponse.json(
            { message: `${index + 1}. üründe hata: ${validated.message}` },
            { status: 400 },
          );
        }
        validatedProducts.push(validated.product);
      }

      const products = await saveProducts(validatedProducts);
      revalidatePath("/");
      revalidatePath("/katalog");
      revalidatePath("/urun/[slug]", "page");
      return NextResponse.json({ products });
    }

    return NextResponse.json({ message: "Geçersiz işlem. Lütfen sayfayı yenileyip tekrar deneyin." }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Ürün işlemi başarısız oldu." }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { deleteProduct, getProducts, upsertProduct } from "@/lib/cms";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { revalidatePath } from "next/cache";
import { validateProductId, validateProductInput } from "@/lib/validation";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    return NextResponse.json({ products: await getProducts() });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Ürünler alınamadı." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
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

    return NextResponse.json({ message: "Geçersiz işlem" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Ürün işlemi başarısız oldu." }, { status: 500 });
  }
}

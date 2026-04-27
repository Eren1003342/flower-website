import { NextResponse } from "next/server";
import { getSiteContent, saveSiteContent } from "@/lib/cms";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { revalidatePath } from "next/cache";
import { validateCategoryOptionsInput, validateSiteContentInput } from "@/lib/validation";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ message: "Oturum süresi doldu. Lütfen tekrar giriş yapın." }, { status: 401 });
  }

  try {
    return NextResponse.json({ content: await getSiteContent() });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "İçerik okunamadı." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ message: "Oturum süresi doldu. Lütfen tekrar giriş yapın." }, { status: 401 });
  }

  try {
    const body = (await request.json()) as {
      action?: string;
      content?: unknown;
      catalogFilters?: unknown;
      showcaseCategories?: unknown;
    };

    if (body.action === "save-categories") {
      const catalogValidation = validateCategoryOptionsInput(body.catalogFilters, "Katalog filtreleri", 100);
      if (!catalogValidation.ok) {
        return NextResponse.json({ message: catalogValidation.message }, { status: 400 });
      }

      const showcaseValidation = validateCategoryOptionsInput(body.showcaseCategories, "Vitrin kategorileri", 100);
      if (!showcaseValidation.ok) {
        return NextResponse.json({ message: showcaseValidation.message }, { status: 400 });
      }

      const current = await getSiteContent();
      const nextContent = await saveSiteContent({
        ...current,
        home: {
          ...current.home,
          catalogFilters: catalogValidation.options,
          showcaseCategories: showcaseValidation.options,
        },
      });

      revalidatePath("/");
      revalidatePath("/katalog");

      return NextResponse.json({ content: nextContent });
    }

    if (!body.content) {
      return NextResponse.json({ message: "Kaydedilecek içerik bulunamadı." }, { status: 400 });
    }

    const validated = validateSiteContentInput(body.content);
    if (!validated.ok) {
      return NextResponse.json({ message: validated.message }, { status: 400 });
    }

    const nextContent = await saveSiteContent(validated.content);
    revalidatePath("/");
    revalidatePath("/hakkimizda");
    revalidatePath("/iletisim");

    return NextResponse.json({ content: nextContent });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "İçerik kaydedilemedi." }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { getSiteContent, saveSiteContent } from "@/lib/cms";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { revalidatePath } from "next/cache";
import { validateSiteContentInput } from "@/lib/validation";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ content: await getSiteContent() });
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { content: unknown };
  const validated = validateSiteContentInput(body.content);
  if (!validated.ok) {
    return NextResponse.json({ message: validated.message }, { status: 400 });
  }

  const nextContent = await saveSiteContent(validated.content);
  revalidatePath("/");
  revalidatePath("/hakkimizda");
  revalidatePath("/iletisim");

  return NextResponse.json({ content: nextContent });
}

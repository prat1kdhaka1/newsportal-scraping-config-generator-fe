"use server";

import { revalidateTag } from "next/cache";

export async function revalidateCategoryList() {
  await revalidateTag("category-list");
}

export async function revalidateCategory(id: string) {
  await revalidateTag(`category-${id}`);
}

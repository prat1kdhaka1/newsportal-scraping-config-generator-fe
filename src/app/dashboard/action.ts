"use server";

import { revalidateTag } from "next/cache";

export async function revalidateWebsiteList() {
  await revalidateTag("website-list");
}

export async function revalidateWebsite(id: string) {
  await revalidateTag(`website-${id}`);
}

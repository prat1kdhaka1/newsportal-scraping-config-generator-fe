"use server";

import { revalidateTag } from "next/cache";

export async function revalidateWebsiteList() {
  await revalidateTag("website-list");
}

"use server";

import { revalidateTag } from "next/cache";

export async function revalidateArticleLinkList() {
  await revalidateTag("article-link-list");
}

export async function revalidateArticleLink(id: string) {
  await revalidateTag(`article-link-${id}`);
}

"use server";

import { revalidateTag } from "next/cache";

export async function revalidateScheduleList() {
  await revalidateTag("schedule-list");
}

export async function revalidateSchedule(id: string) {
  await revalidateTag(`schedule-${id}`);
}

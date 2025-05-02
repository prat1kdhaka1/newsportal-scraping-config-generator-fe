"use server";

export async function authHeader(jsonType = true) {
  const contentType = jsonType ? { "Content-Type": "application/json" } : null;

  return { ...contentType };
}

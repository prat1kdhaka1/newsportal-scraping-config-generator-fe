import { API_ROUTES } from "@/constants/routeConstants";

const { CATEGORY_TEMP_API } = API_ROUTES;

export const getTempCategoryListAPI = async (website_id?: string) => {
  const response = await fetch(
    `${CATEGORY_TEMP_API}?skip=0&limit=100&website_id=${website_id ?? ""}`,
    {
      next: { tags: ["category-temp-list"] },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }

  return response.json();
};

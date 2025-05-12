import { API_ROUTES } from "@/constants/routeConstants";

const { ARTICLE_LINKS_TEMP_API } = API_ROUTES;

export const getArticleLinkTempListAPI = async (
  category_id: string,
  skip: number,
  limit: number
) => {
  const response = await fetch(
    `${ARTICLE_LINKS_TEMP_API}?skip=${skip}&limit=${limit}&category_id=${
      category_id ?? ""
    }`,
    {
      next: { tags: ["article-link-temp-list"] },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch temporary article links");
  }

  return response.json();
};

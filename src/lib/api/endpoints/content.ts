import { API_ROUTES } from "@/constants/routeConstants";

const { CONTENT_API } = API_ROUTES;



export const getContentListAPI = async (category_id: string, skip: number, limit: number) => {
  const response = await fetch(`${CONTENT_API}?category_id=${category_id}&skip=${skip}&limit=${limit}`, {
    next: { tags: ["content-list"] },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch content");
  }

  return response.json();
};

export const getContentByIdAPI = async (id: string) => {
  const response = await fetch(`${CONTENT_API}/${id}`, {
    next: { tags: [`content-${id}`] },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch content");
  }

  return response.json();
};

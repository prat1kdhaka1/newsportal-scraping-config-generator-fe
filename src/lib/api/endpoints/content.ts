import { API_ROUTES } from "@/constants/routeConstants";

const { CONTENT_API } = API_ROUTES;



export const getContetntListAPI = async () => {
  const response = await fetch(`${CONTENT_API}`, {
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

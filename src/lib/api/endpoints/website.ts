import { API_ROUTES } from "@/constants/routeConstants";

const { WEBSITE_API } = API_ROUTES;

export const createWebsiteAPI = async (payload: {
  name: string;
  url: string;
}) => {
  const formattedPayload = {
    name: payload.name,
    url: payload.url,
  };

  const response = await fetch(WEBSITE_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formattedPayload),
  });

  if (!response.ok) {
    console.log(response);
    throw new Error("Failed to create website");
  }

  return response.json();
};

export const getWebsiteListAPI = async () => {
  const response = await fetch(`${WEBSITE_API}?skip=0&limit=100`, {
    next: { tags: ["website-list"] },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch websites");
  }

  return response.json();
};

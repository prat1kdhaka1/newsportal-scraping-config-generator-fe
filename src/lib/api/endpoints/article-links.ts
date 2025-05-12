import { API_ROUTES } from "@/constants/routeConstants";

const { ARTICLE_LINKS_API } = API_ROUTES;

export const createArticleLinkAPI = async (payload: {
  category_id: string;
  url: string;
}) => {
  const formattedPayload = {
    category_id: payload.category_id,
    url: payload.url,
  };

  const response = await fetch(ARTICLE_LINKS_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formattedPayload),
  });

  if (!response.ok) {
    throw new Error("Failed to create article links");
  }

  return response.json();
};

export const getArticleLinkListAPI = async (category_id?: string) => {
  const response = await fetch(
    `${ARTICLE_LINKS_API}?skip=0&limit=100&category_id=${category_id ?? ""}`,
    {
      next: { tags: ["article-link-list"] },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch article links");
  }

  return response.json();
};

export const getArticleLinkByIdAPI = async (id: string) => {
  const response = await fetch(`${ARTICLE_LINKS_API}/${id}`, {
    next: { tags: [`article-link-${id}`] },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch article link");
  }

  return response.json();
};

export const updateArticleLinkAPI = async (
  id: string,
  category_id: string,
  payload: {
    url: string;
  }
) => {
  const formattedPayload = {
    url: payload.url,
    category_id: category_id,
  };

  await fetch(`${ARTICLE_LINKS_API}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formattedPayload),
  });
};

export const deleteArticleLinkAPI = async (id: string) => {
  await fetch(`${ARTICLE_LINKS_API}/${id}`, {
    method: "DELETE",
  });
};

export const bulkCreateArticleLinksAPI = async (payload: {
  category_id: string;
  urls: string[];
}) => {
  const formattedPayload = {
    category_id: payload.category_id,
    urls: payload.urls,
  };
  const response = await fetch(`${ARTICLE_LINKS_API}/bulk`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formattedPayload),
  });

  if (!response.ok) {
    throw new Error("Failed to create article links");
  }

  return response.json();
};

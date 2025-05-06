import { API_ROUTES } from "@/constants/routeConstants";

const { CATEGORY_API } = API_ROUTES;

export const createCategoryAPI = async (payload: {
  website_id: string;
  url: string;
}) => {
  const formattedPayload = {
    website_id: payload.website_id,
    url: payload.url,
  };

  const response = await fetch(CATEGORY_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formattedPayload),
  });

  if (!response.ok) {
    console.log(response);
    throw new Error("Failed to create category");
  }

  return response.json();
};

export const getCategoryListAPI = async (website_id?: string) => {
  const response = await fetch(
    `${CATEGORY_API}?skip=0&limit=100&website_id=${website_id ?? ""}`,
    {
      next: { tags: ["category-list"] },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }

  return response.json();
};

export const getCategoryByIdAPI = async (id: string) => {
  const response = await fetch(`${CATEGORY_API}/${id}`, {
    next: { tags: [`category-${id}`] },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch category");
  }

  return response.json();
};

export const updateCategoryAPI = async (
  id: string,
  website_id: string,
  payload: {
    url: string;
    is_active: boolean;
  }
) => {
  const formattedPayload = {
    url: payload.url,
    is_active: payload.is_active,
    website_id: website_id,
  };

  await fetch(`${CATEGORY_API}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formattedPayload),
  });
};

export const deleteCategoryAPI = async (id: string) => {
  await fetch(`${CATEGORY_API}/${id}`, {
    method: "DELETE",
  });
};

export const bulkCreateCategoryAPI = async (payload: {
  website_id: string;
  urls: string[];
}) => {
  const formattedPayload = {
    website_id: payload.website_id,
    urls: payload.urls,
  };

  const response = await fetch(`${CATEGORY_API}/bulk-create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formattedPayload),
  });

  if (!response.ok) {
    throw new Error("Failed to create categories");
  }

  return response.json();
};

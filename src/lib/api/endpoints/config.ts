import { API_ROUTES } from "@/constants/routeConstants";

const { CONFIG_API, WEBSITE_API } = API_ROUTES;

export const createConfigAPI = async (payload: {
  category_id: string;
  url: string;
}) => {
  const formattedPayload = {
    category_id: payload.category_id,
    url: payload.url,
  };

  const response = await fetch(CONFIG_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formattedPayload),
  });

  if (!response.ok) {
    console.log(response);
    throw new Error("Failed to create config");
  }

  return response.json();
};

export const getConfigListAPI = async (category_id?: string) => {
  const response = await fetch(
    `${CONFIG_API}?skip=0&limit=100&category_id=${category_id ?? ""}`,
    {
      next: { tags: ["config-list"] },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch configs");
  }

  return response.json();
};

export const getConfigByIdAPI = async (id: string) => {
  const response = await fetch(`${CONFIG_API}/${id}`, {
    next: { tags: [`config-${id}`] },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch config");
  }

  return response.json();
};

export const updateConfigAPI = async (
  id: string,
  category_id: string,
  payload: {
    regexp: string;
  }
) => {
  const formattedPayload = {
    regexp: payload.regexp,
    category_id: category_id,
  };

  await fetch(`${CONFIG_API}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formattedPayload),
  });
};

export const deleteConfigAPI = async (id: string) => {
  await fetch(`${CONFIG_API}/${id}`, {
    method: "DELETE",
  });
};


export const downloadConfigAPI = async (id: string) => {
  const response = await fetch(`${WEBSITE_API}/download-config/${id}`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to download config");
  }

  return response.json();
};
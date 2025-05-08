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

export const getWebsiteByIdAPI = async (id: string) => {
  const response = await fetch(`${WEBSITE_API}/${id}`, {
    next: { tags: [`website-${id}`] },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch website");
  }

  return response.json();
};

export const updateWebsiteAPI = async (
  id: string,
  payload: {
    name: string;
    url: string;
    is_active: boolean;
  }
) => {
  const formattedPayload = {
    name: payload.name,
    url: payload.url,
    is_active: payload.is_active,
  };

  await fetch(`${WEBSITE_API}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formattedPayload),
  });
};

export const deleteWebsiteAPI = async (id: string) => {
  await fetch(`${WEBSITE_API}/${id}`, {
    method: "DELETE",
  });
};

// export const extractCategoriesAPI = (
//   websiteId: string,
//   onMessage: (msg: string) => void,
//   onError?: (err: any) => void
// ) => {
//   const url = `${WEBSITE_API}/extract-categories/${websiteId}`;
//   const eventSource = new EventSource(url);

//   eventSource.onmessage = (event) => {
//     onMessage(event.data); // handle each message received
//   };

//   eventSource.onerror = (err) => {
//     if (onError) {
//       onError(err);
//     }
//     eventSource.close();
//   };

//   return eventSource; // in case you want to close it manually
// };

export const startExtractionAPI = async (websiteId: string) => {
  const url = `${WEBSITE_API}/extract-categories/${websiteId}`;

  try {
    const response = await fetch(url, {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error("Failed to start extraction process");
    }

    return response.json(); // You can return some result if needed, e.g., a success message
  } catch (error) {
    console.error("Error starting extraction:", error);
    throw error;
  }
};

// Function to check the status of the extraction process (GET request with SSE)
export const checkExtractionStatusAPI = (
  onMessage: (msg: string) => void,
  onError?: (err: any) => void
) => {
  const url = `${WEBSITE_API}/extract-categories/status`;
  const eventSource = new EventSource(url);

  eventSource.onmessage = (event) => {
    onMessage(event.data); // Handle each message received
  };

  eventSource.onerror = (err) => {
    if (onError) {
      onError(err);
    }
    eventSource.close();
  };

  return eventSource; // Return eventSource if you want to close it manually
};

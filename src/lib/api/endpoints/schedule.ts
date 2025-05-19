import { API_ROUTES } from "@/constants/routeConstants";

const { SCHEDULE_API } = API_ROUTES;

export const getScheduleListAPI = async () => {
    const response = await fetch(`${SCHEDULE_API}?skip=0&limit=100`, {
      next: { tags: ["schedule-list"] },
    });
  
    if (!response.ok) {
      throw new Error("Failed to fetch schedules");
    }
  
    return response.json();
  };


export const getSchedulePageDataAPI = async () => {
  const response = await fetch(`${SCHEDULE_API}/page-data`)

  if (!response.ok) {
    throw new Error("Failed to fetch page data");
  }

  return response.json();
}

export const createScheduleAPI = async (payload:{
  website_id: string;
  interval_ms: number;
}) => {
  const formattedPayload = {
    website_id: payload.website_id,
    interval_ms: payload.interval_ms,
  };
  const response = await fetch(`${SCHEDULE_API}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formattedPayload),
  })
  if (!response.ok) {
    // Try to parse the error body as JSON
    let errorMessage = `Request failed with status ${response.status}`;
    try {
      const errorData = await response.json();
      if (errorData.message) {
        errorMessage = errorData.message;
      }
    } catch (e) {
      // Could not parse JSON (e.g., server returned HTML or plain text)
      const fallbackText = await response.text();
      errorMessage = fallbackText || errorMessage;
    }
  
    throw new Error(errorMessage);
  }

  return response.json();
}


export const updateScheduleAPI = async (id: string,payload: {
  website_id:string;
  interval_ms:number;
  is_active:boolean;
}) => {
  const formattedPayload = {
    website_id: payload.website_id,
    interval_ms: payload.interval_ms,
    is_active:payload.is_active
  };
  const response = await fetch(`${SCHEDULE_API}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formattedPayload),
  })
  if (!response.ok) {
    console.log(response);
    throw new Error("Failed to update schedule");
  }

  return response.json();
}

export const deleteScheduleAPI = async (id: string) => {
  await fetch(`${SCHEDULE_API}/${id}`, {
    method: "DELETE",
  });
};
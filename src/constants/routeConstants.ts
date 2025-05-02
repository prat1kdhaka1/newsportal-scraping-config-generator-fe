const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const routes = Object.freeze({
  WEBSITE: "/website",
});

export const API_ROUTES = Object.freeze({
  WEBSITE_API: `${API_URL}/website`,
  CATEGORY_API: `${API_URL}/category`,
});

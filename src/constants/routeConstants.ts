const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const routes = Object.freeze({
  WEBSITE: "/website",
});

export const API_ROUTES = Object.freeze({
  WEBSITE_API: `${API_URL}/website`,
  CATEGORY_API: `${API_URL}/category`,
  ARTICLE_LINKS_API: `${API_URL}/article-links`,
  ARTICLE_LINKS_TEMP_API: `${API_URL}/article-link-temp`,
  CATEGORY_TEMP_API: `${API_URL}/category-temp`,
  CONFIG_API: `${API_URL}/config`,
  CONTENT_API: `${API_URL}/content`,
  SCHEDULE_API: `${API_URL}/schedule`,  
});
